"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void authClient.signIn.social(
          {
            provider: "google",
            callbackURL: "/notes",
            newUserCallbackURL: "/notes",
          },
          {
            onError: () => setPending(false),
          },
        );
      }}
      className="border-foreground/15 hover:bg-foreground/5 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
    >
      {pending ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}
