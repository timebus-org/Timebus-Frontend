import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/router";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        router.replace("/dashboard");
      }
    });
  }, []);

  return <p className="text-center mt-5">Logging you in...</p>;
}
