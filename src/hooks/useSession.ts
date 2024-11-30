import { UserSession } from "@/lib/interface";
import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data: UserSession = await res.json();
        setSession(data.authenticated ? data : null);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { session, loading };
}
