"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/dashboard"); // Redirect after confirming email
      }
    });
  }, [router, supabase]);

  return <p>Redirecting after confirmation...</p>;
}
