CREATE OR REPLACE FUNCTION f_random_text(length INTEGER)
  RETURNS TEXT AS
  $body$
    WITH chars AS (SELECT unnest(string_to_array('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9', ' ')) AS _char),
          charlist AS (SELECT _char FROM chars ORDER BY random() LIMIT $1)
    SELECT string_agg(_char, '') FROM charlist;
  $body$
  LANGUAGE SQL;

DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY ON DELETE CASCADE,
  username VARCHAR UINQUE DEFAULT f_random_text(12),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  role VARCHAR DEFAULT 'normal',
  avatar_url VARCHAR,
  updated_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name, avatar_url)
      VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
      RETURN new;
    END;
  $$ LANGUAGE PLPGSQL SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

DELETE FROM storage.objects WHERE bucket_id = 'avatars';
DELETE FROM storage.buckets WHERE name = 'avatars';
INSERT INTO storage.buckets (id, name) VALUES ('avatars', 'avatars');

DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own avatar." ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects for SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects for INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update their own avatar." ON storage.objects for UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION delete_storage_object(bucket text, object text, out status int, out content text)
  RETURNS record
  LANGUAGE 'plpgsql'
  SECURITY DEFINER AS $$
    DECLARE
      project_url TEXT := 'https://<project_id>.supabase.co';
      service_role_key TEXT := '';
      url TEXT := project_url||'/storage/v1/object/'||bucket||'/'||object;
    BEGIN
      SELECT INTO STATUS, content result.status::int, result.content::text FROM extensions.http(('DELETE', url, ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)], NULL, NULL)::extensions.http_request) as result;
    END;
  $$;

CREATE OR REPLACE FUNCTION delete_avatar(avatar_url text, out status int, out content text)
  RETURNS record
  LANGUAGE 'plpgsql'
  SECURITY DEFINER AS $$
    BEGIN
      SELECT INTO STATUS, content result.status, result.content FROM public.delete_storage_object('avatars', avatar_url) AS result;
    END;
  $$;

------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION delete_old_avatar()
  RETURNS trigger
  LANGUAGE 'plpgsql'
  SECURITY DEFINER AS $$
    DECLARE
      status INT;
      content TEXT;
      avatar_name TEXT;
    BEGIN
      IF coalesce(old.avatar_url, '') <> '' AND (tg_op = 'DELETE' OR (old.avatar_url <> coalesce(new.avatar_url, ''))) THEN
        avatar_name := old.avatar_url;
        SELECT INTO status, content result.status, result.content FROM public.delete_avatar(avatar_name) AS result;
        IF status <> 200 THEN
          raise warning 'Could not delete avatar: % %', status, content;
        END IF;
      END IF;
      IF tg_op = 'DELETE' THEN
        RETURN old;
      END IF;
      RETURN new;
    END;
  $$;

CREATE OR REPLACE TRIGGER before_profile_changes BEFORE UPDATE OF avatar_url OR DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.delete_old_avatar();

------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION delete_old_profile()
  RETURNS trigger
  LANGUAGE 'plpgsql'
  SECURITY DEFINER AS $$
    BEGIN
      DELETE FROM public.profiles WHERE id = old.id;
      RETURN old;
    END;
  $$;

CREATE OR REPLACE TRIGGER before_delete_user BEFORE DELETE ON auth.users for each ROW EXECUTE FUNCTION public.delete_old_profile();
