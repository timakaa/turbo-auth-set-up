import { getClientSession, Session } from "@/lib/session";
import { useState, useEffect } from "react";
// Add new types and functions for client-side session management
type SessionState = {
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
};

export function useSession(): SessionState {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const session = await getClientSession();
        setSession(session);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Failed to fetch session"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, isLoading, error };
}
