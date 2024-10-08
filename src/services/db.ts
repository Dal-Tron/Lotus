import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_PROJECT_URL || "",
  process.env.REACT_APP_SUPABASE_API_KEY || ""
);

export const supabaseAdmin = createClient(
  process.env.REACT_APP_SUPABASE_PROJECT_URL || "",
  process.env.REACT_APP_SUPABASE_ROLE_KEY || ""
);

export default supabase;
