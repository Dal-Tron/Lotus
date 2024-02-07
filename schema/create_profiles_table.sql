drop table if exists profiles;
create table profiles (
  id uuid references auth.users not null primary key,
  email varchar unique,
  username varchar unique,
  full_name varchar,
  role varchar,
  avatar_url varchar,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

insert into profiles (id, email, role, username) values ('563c96cd-fd1d-4dc7-bce5-3bd0df5369d9', 'hurricanehunter0702@gmail.com', 'admin', 'hunter');

create or replace function public.handle_new_user()
  returns trigger as $$
    begin
      insert into public.profiles (id, email, username, full_name, avatar_url, role)
      values (new.id, new.email, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'role');
      return new;
    end;
  $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

delete from storage.objects where bucket_id = 'avatars';
delete from storage.buckets where name = 'avatars';
insert into storage.buckets (id, name) values ('avatars', 'avatars');

drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Anyone can update their own avatar." on storage.objects;

create policy "Avatar images are publicly accessible." on storage.objects for select using (bucket_id = 'avatars');
create policy "Anyone can upload an avatar." on storage.objects for insert with check (bucket_id = 'avatars');
create policy "Anyone can update their own avatar." on storage.objects for update using (auth.uid() = owner) with check (bucket_id = 'avatars');

------------------------------------------------------------------------------------------------------------------

create or replace function delete_storage_object(bucket text, object text, out status int, out content text)
  returns record
  language 'plpgsql'
  security definer as $$
    declare
      project_url text := 'https://<project_id>.supabase.co';
      service_role_key text := '';
      url text := project_url||'/storage/v1/object/'||bucket||'/'||object;
    begin
      select into status, content result.status::int, result.content::text FROM extensions.http(('DELETE', url, ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)], NULL, NULL)::extensions.http_request) as result;
    end;
  $$;

create or replace function delete_avatar(avatar_url text, out status int, out content text)
  returns record
  language 'plpgsql'
  security definer as $$
    begin
      select into status, content result.status, result.content from public.delete_storage_object('avatars', avatar_url) as result;
    end;
  $$;

------------------------------------------------------------------------------------------------------------------

create or replace function delete_old_avatar()
  returns trigger
  language 'plpgsql'
  security definer as $$
    declare
      status int;
      content text;
      avatar_name text;
    begin
      if coalesce(old.avatar_url, '') <> '' and (tg_op = 'DELETE' or (old.avatar_url <> coalesce(new.avatar_url, ''))) then
        avatar_name := old.avatar_url;
        select into status, content result.status, result.content from public.delete_avatar(avatar_name) as result;
        if status <> 200 then
          raise warning 'Could not delete avatar: % %', status, content;
        end if;
      end if;
      if tg_op = 'DELETE' then
        return old;
      end if;
      return new;
    end;
  $$;

create or replace trigger before_profile_changes before update of avatar_url or delete on public.profiles for each row execute function public.delete_old_avatar();

------------------------------------------------------------------------------------------------------------------

create or replace function delete_old_profile()
  returns trigger
  language 'plpgsql'
  security definer as $$
    begin
      delete from public.profiles where id = old.id;
      return old;
    end;
  $$;

create or replace trigger before_delete_user before delete on auth.users for each row execute function public.delete_old_profile();
