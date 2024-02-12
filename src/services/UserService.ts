import supabase from "./db";
import { toast } from "react-toastify";

const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    toast.error("Failed to fetch user data.");
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const UserService = {
  getProfile,
};
