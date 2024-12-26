import supabase from "../config/supabaseClient";

export const isEmailWhitelisted = async (email) => {
  let { data, error } = await supabase.from("whitelist").select("email");

  console.log(data);

  if (error) {
    console.error("Could not get whitelisted emails.");
    return false;
  }

  return data.filter((obj) => obj.email === email).length === 1;
}