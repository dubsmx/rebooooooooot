"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { app } from "@/lib/firebaseClient";

type Ctx = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  error: string | null;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = getAuth(app);
      return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    } catch (e: any) {
      // Si faltan keys de Firebase, evitamos crashear
      setError("Firebase is not configured. Add your NEXT_PUBLIC_FIREBASE_* keys.");
      setLoading(false);
      return () => {};
    }
  }, []);

  const actions = useMemo(() => ({
    async signInWithGoogle() {
      setError(null);
      try {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e: any) {
        setError(e?.message || "Sign-in failed");
      }
    },
    async signOutUser() {
      try {
        const auth = getAuth(app);
        await signOut(auth);
      } catch (e: any) {
        setError(e?.message || "Sign-out failed");
      }
    }
  }), []);

  return (
    <AuthCtx.Provider value={{ user, loading, error, ...actions }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}