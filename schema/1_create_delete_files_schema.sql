CREATE SCHEMA IF NOT EXISTS delete_files_schema;

DROP TABLE IF EXISTS delete_files_schema.system_values;
CREATE TABLE IF NOT EXISTS delete_files_schema.system_values (
    name TEXT PRIMARY KEY,
    value TEXT
);

INSERT INTO delete_files_schema.system_values (name, value) VALUES
    ('files_per_cron', 40),
    ('service_role_key',''),
    ('instance_url',''),
    ('http_enabled',false),
    ('pg_net_enabled',false);

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
UPDATE delete_files_schema.system_values SET VALUE = TRUE WHERE name = 'http_enabled';

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
UPDATE delete_files_schema.system_values SET VALUE = TRUE WHERE name = 'pg_net_enabled';

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.clean_files()
    RETURNS void AS $$
        DECLARE
            service_role_key TEXT;
            instance_url TEXT;
            files_per_cron INT := 10;
            http_enabled BOOLEAN;
            pg_net_enabled BOOLEAN;
            delete_status TEXT;
            bucket TEXT;
            paths TEXT[];
            file_body TEXT;
            path TEXT;
        BEGIN
            SELECT VALUE INTO service_role_key FROM delete_files_schema.system_values WHERE name = 'service_role_key';
            SELECT VALUE INTO instance_url FROM delete_files_schema.system_values WHERE name = 'instance_url';
            SELECT VALUE INTO files_per_cron FROM delete_files_schema.system_values WHERE name = 'files_per_cron';
            SELECT VALUE INTO http_enabled FROM delete_files_schema.system_values WHERE name = 'http_enabled';
            SELECT VALUE INTO pg_net_enabled FROM delete_files_schema.system_values WHERE name = 'pg_net_enabled';

            RAISE LOG 'CFILE clean_files';

            FOR bucket, paths IN
                SELECT bucket_id, array_agg(name) FROM (
                SELECT bucket_id, name FROM storage.objects
                WHERE owner IS NULL AND created_at = to_timestamp(0)
                ORDER BY bucket_id
                LIMIT files_per_cron) AS names
                GROUP BY bucket_id
                LOOP
                    path = paths[1];
                    file_body = '{"prefixes":' || array_to_json(paths) || '}';
                    RAISE LOG 'key= %, bucket = %, file_body = %, path = %, length = %', service_role_key, bucket, file_body, path, array_length(paths,1);

                    /*  http extension only case */
                    IF (http_enabled AND NOT pg_net_enabled) THEN
                        SELECT status FROM
                        http((
                            'DELETE',
                            instance_url || '/storage/v1/object/' || bucket,
                            ARRAY[http_header('authorization','Bearer ' || service_role_key)],
                            'application/json',
                            file_body
                            )::http_request) INTO delete_status;  --not sure delete status is useful from storage-API in this case
                    END IF;

                    /*   pg_net extension only case (without delete body) */
                    IF (pg_net_enabled AND NOT http_enabled) THEN
                        FOREACH path IN array paths
                            LOOP
                                perform net.http_delete(
                                    url:=instance_url || '/storage/v1/object/' || bucket || '/' || path,
                                    headers:= ('{"authorization": "Bearer ' || service_role_key || '"}')::jsonb
                                );
                                RAISE LOG 'pg_net loop path = %', path;
                            END LOOP;
                    END IF;

                    /* http and pg_net together */
                    /* note >2 can be tweaked for using pg_net in a loop for more files.  The tradeoff is number API calls versus time for synch response from http */
                    IF (http_enabled AND pg_net_enabled) THEN
                        IF (array_length(paths,1) > 2) THEN
                            SELECT status FROM
                                http((
                                    'DELETE',
                                    instance_url || '/storage/v1/object/' || bucket,
                                    ARRAY[http_header('authorization','Bearer ' || service_role_key)],
                                    'application/json',
                                    file_body
                                )::http_request) INTO delete_status;  --not sure delete status is useful from storage-API in this case
                            RAISE LOG 'both extensions-- http  paths = %', paths;
                        ELSE
                            perform net.http_delete(
                                url:=instance_url || '/storage/v1/object/' || bucket || '/' || path,
                                headers:= ('{"authorization": "Bearer ' || service_role_key || '"}')::jsonb
                            );
                            RAISE LOG 'both extensions-- pg_net path = %', path;
                        END IF;
                    END IF;

                    /* if pg_net adds a body to delete all you need is this (not tested)*/
                    /*
                    perform net.pg_net_http_delete_body(
                        url := instance_url || '/storage/v1/object/' || bucket,
                        headers:= ('{"authorization": "Bearer ' || service_role_key || '", "content-type":"application/json"}')::jsonb,
                        body := file_body::jsonb
                    );
                    */
                END LOOP;
                RAISE LOG 'finished';
        END
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = extensions, storage, pg_temp;

/* run this code to setup the cron task */
SELECT cron.schedule(
    'invoke-file_clean',
    '*/10 * * * *', -- every 10 minutes
    $$
        SELECT clean_files();
    $$
);

/* This function should be called from an trigger on auth.users delete.  */
/* It marks all the user's files to be deleted by setting created_at to a fake time and marks owner as null */
/* If you want to preserve some files from being deleted then you need to only mark the owner to null */
/* Optionally metadata is set to null to prevent reading the file as it will be flagged as corrupted.*/

CREATE OR REPLACE FUNCTION public.mark_all_users_files_for_delete()
    RETURNS TRIGGER AS $$
        BEGIN
            UPDATE storage.objects SET
                owner = NULL,
                created_at = to_timestamp(0),
                metadata = NULL
            WHERE owner = old.id;
            DELETE FROM public.profiles WHERE id = old.id;
            DELETE FROM public.files WHERE user_id = old.id;
            RETURN old;
        END;
    $$ LANGUAGE PLPGSQL SECURITY DEFINER
    SET search_path = storage, pg_temp;

CREATE OR REPLACE TRIGGER before_delete_user BEFORE DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.mark_all_users_files_for_delete();

/* This function can be called by an authenticated user to delete only from approved buckets */
CREATE OR REPLACE FUNCTION public.mark_file_for_delete(bucket TEXT, filepath TEXT)
    RETURNS void AS $$
        DECLARE bucket_list TEXT[] := '{"test","testp"}';
        BEGIN
            UPDATE storage.objects SET
                owner = NULL,
                created_at = to_timestamp(0),
                metadata = NULL
            WHERE bucket_id = any(bucket_list) AND bucket_id = bucket AND owner = auth.uid() AND auth.uid() IS NOT NULL AND name = filepath;
        END;
    $$ LANGUAGE PLPGSQL SECURITY DEFINER SET search_path = storage, pg_temp;