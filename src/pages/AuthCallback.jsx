import { useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!data) navigate("/register");
      else navigate("/");
    };

    checkProfile();
  }, []);

  return <p>Signing you in…</p>;
}
