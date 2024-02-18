CREATE OR REPLACE FUNCTION f_random_text(length INTEGER)
  RETURNS TEXT AS
    $body$
      WITH chars AS (SELECT unnest(string_to_array('a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9', ' ')) AS _char),
            charlist AS (SELECT _char FROM chars ORDER BY random() LIMIT $1)
      SELECT string_agg(_char, '') FROM charlist;
    $body$
  LANGUAGE SQL;

DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username VARCHAR(256) DEFAULT 'user-' || f_random_text(12),
  email VARCHAR(256) UNIQUE NOT NULL,
  full_name VARCHAR(256),
  role VARCHAR(256) DEFAULT 'normal',
  avatar_url VARCHAR(256),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE OR REPLACE TRIGGER handle_update_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

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

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update their own avatar." ON storage.objects FOR UPDATE USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatars');

CREATE OR REPLACE FUNCTION delete_storage_object(bucket TEXT, object TEXT, out status INT, out content TEXT)
  RETURNS RECORD
  LANGUAGE PLPGSQL
  SECURITY DEFINER AS $$
    DECLARE
      project_url TEXT;
      service_role_key TEXT;
      url TEXT;
    BEGIN
      SELECT VALUE INTO project_url FROM delete_files_schema.system_values WHERE name = 'instance_url';
      SELECT VALUE INTO service_role_key FROM delete_files_schema.system_values WHERE name = 'service_role_key';

      SELECT INTO status, content result.status::INT, result.content::TEXT FROM extensions.http((
        'DELETE',
        project_url||'/storage/v1/object/'||bucket||'/'||object,
        ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
        NULL,
        NULL)::extensions.http_request) as result;
    END;
  $$;

CREATE OR REPLACE FUNCTION delete_avatar(avatar_url TEXT, out status INT, out content TEXT)
  RETURNS RECORD
  LANGUAGE PLPGSQL
  SECURITY DEFINER AS $$
    BEGIN
      SELECT INTO status, content result.status, result.content FROM public.delete_storage_object('avatars', avatar_url) AS result;
    END;
  $$;

CREATE OR REPLACE FUNCTION delete_old_avatar()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  SECURITY DEFINER AS $$
    DECLARE
      status INT;
      content TEXT;
      avatar_name TEXT;
    BEGIN
      IF COALESCE(old.avatar_url, '') <> '' AND (tg_op = 'DELETE' OR (old.avatar_url <> coalesce(new.avatar_url, ''))) then
        avatar_name := old.avatar_url;
        SELECT INTO status, content result.status, result.content FROM public.delete_avatar(avatar_name) AS result;
        IF status <> 200 THEN
          RAISE WARNING 'Could not delete avatar: % %', status, content;
        END IF;
      END IF;
      IF tg_op = 'DELETE' THEN
        RETURN old;
      END IF;
      RETURN new;
    END;
  $$;

CREATE OR REPLACE TRIGGER before_profile_changes BEFORE UPDATE OF avatar_url OR DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.delete_old_avatar();