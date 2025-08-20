"use client";

import { useAuth } from "@/context/AuthContext";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signInWithGoogle, error } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[92vw] max-w-[420px] rounded-2xl shadow-2xl border border-[--border] bg-[--surface] text-[--text]">
        <div className="px-5 py-4 border-b border-[--border] text-center font-semibold">Sign up or log in</div>
        <div className="p-5 space-y-3">
          <button
            className="w-full h-11 rounded-lg font-medium bg-[--primary] text-[--bg] hover:brightness-110 transition"
            onClick={async () => { await signInWithGoogle(); onClose(); }}
          >
            Continue with Google
          </button>

          <div className="text-[13px] text-[--muted] text-center pt-2">
            By continuing, you confirm you are at least 16 and agree to our terms & conditions.
          </div>

          {error ? <div className="text-sm text-red-400 text-center">{error}</div> : null}
          {!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
            <div className="text-xs text-yellow-300/90 text-center">
              Missing Firebase keys. Add NEXT_PUBLIC_FIREBASE_* to .env.local
            </div>
          )}
        </div>
        <div className="px-5 pb-5 flex justify-center">
          <button onClick={onClose} className="text-sm text-[--muted] hover:text-[--text]">Close</button>
        </div>
      </div>
    </div>
  );
}