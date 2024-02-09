CREATE OR REPLACE FUNCTION f_random_text(
    length integer
)
RETURNS text AS
$body$
WITH chars AS (
    SELECT unnest(string_to_array('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9', ' ')) AS _char
),
charlist AS
(
    SELECT _char FROM chars ORDER BY random() LIMIT $1
)
SELECT string_agg(_char, '')
FROM charlist
;
$body$
LANGUAGE sql;

DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  username VARCHAR default f_random_text(12),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  role VARCHAR DEFAULT 'normal',
  avatar_url VARCHAR,
  updated_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR update USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
  returns trigger as $$
    begin
      insert into public.profiles (id, email, full_name, avatar_url)
      values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
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
