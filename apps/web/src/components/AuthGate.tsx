"use client";

import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { AppShell } from "@/components/AppShell";
import { auth, firebaseConfigured, googleProvider } from "@/lib/firebase";

const demoModeEnabled = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function AuthGate() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedDemo = window.localStorage.getItem("execution-os-demo") === "true";
    setDemoMode(storedDemo && demoModeEnabled);

    if (!auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
  }, []);

  const getToken = useCallback(async () => {
    if (demoMode) return null;
    return auth?.currentUser?.getIdToken() ?? null;
  }, [demoMode]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError("Firebase web config is missing.");
      return;
    }

    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Google login failed.");
    }
  };

  const handleDemo = () => {
    window.localStorage.setItem("execution-os-demo", "true");
    setDemoMode(true);
  };

  const handleSignOut = async () => {
    window.localStorage.removeItem("execution-os-demo");
    setDemoMode(false);
    if (auth) await signOut(auth);
  };

  if (loading) {
    return (
      <main className="screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-action" />
      </main>
    );
  }

  if (firebaseUser || demoMode) {
    return (
      <AppShell
        displayName={firebaseUser?.displayName ?? "Demo Leader"}
        getToken={getToken}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <main className="screen flex flex-col justify-between">
      <section className="pt-16">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-action text-slate-950">
          <ShieldCheck className="h-9 w-9 text-slate-950" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-action">Execution OS</p>
        <h1 className="mt-4 text-5xl font-black leading-none text-textMain">Move first.</h1>
        <p className="mt-4 text-lg leading-7 text-textSoft">Three priorities. One decision. Daily proof.</p>
      </section>

      <section className="space-y-3 pb-4">
        {error ? <div className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm">{error}</div> : null}

        <button
          className="big-button w-full bg-action text-slate-950 hover:bg-actionDark"
          onClick={handleGoogleLogin}
          disabled={!firebaseConfigured}
        >
          <LogIn className="h-5 w-5" />
          Google Login
        </button>

        {demoModeEnabled ? (
          <button className="big-button w-full border border-line bg-panelSoft text-textMain" onClick={handleDemo}>
            Try Dummy Data
          </button>
        ) : null}
      </section>
    </main>
  );
}
