"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(true);

  // Set localLoading to false once session is resolved
  useEffect(() => {
    if (status !== 'loading') {
      setLocalLoading(false);
    }
  }, [status]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      router.push("/dashboard");
      return true;
    } catch (err) {
      setError("Falha ao fazer login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Falha ao registrar");
        return false;
      }

      // Login automaticamente após registro
      return login(email, password);
    } catch (err) {
      setError("Falha ao registrar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user: session?.user || null,
    loading: loading || status === 'loading' || localLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!session?.user,
  };
} 