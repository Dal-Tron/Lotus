DROP TABLE IF EXISTS files;

CREATE TABLE files (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name VARCHAR(256),
  unique_name VARCHAR(256) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP WITH TIME ZONE
);

------------------------------------------------------------------------------------------------------------------

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own file." ON files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can get their own files." ON files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own files." ON files FOR UPDATE USING (auth.uid() = user_id);

------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_file()
  RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.files (user_id, unique_name)
      VALUES (new.owner, new.name);
      RETURN new;
    END;
  $$ LANGUAGE PLPGSQL SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_file_created ON storage.objects;
CREATE TRIGGER on_file_created AFTER INSERT ON storage.objects FOR EACH ROW EXECUTE PROCEDURE public.handle_new_file();

-- bucket
DELETE FROM storage.objects WHERE bucket_id = 'files';
DELETE FROM storage.buckets WHERE name = 'files';
INSERT INTO storage.buckets (id, name) VALUES ('files', 'files');

DROP POLICY IF EXISTS "Anyone can upload a file." ON storage.objects;
CREATE POLICY "Anyone can upload a file." ON storage.objects for INSERT WITH CHECK (bucket_id = 'files');

------------------------------------------------------------------------------------------------------------------
