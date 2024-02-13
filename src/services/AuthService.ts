import supabase from "./db";

type SessionType = any;

const initSession = async (setSession: (session: SessionType) => void) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  setSession(session);
};

const onAuthStateChange = (setSession: (session: SessionType) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });
  return () => subscription.unsubscribe();
};

const signOut = async () => await supabase.auth.signOut();

export const AuthService = {
  initSession,
  onAuthStateChange,
  signOut
};
