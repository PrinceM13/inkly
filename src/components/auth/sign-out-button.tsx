"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = "/login";
            },
            onError: () => setPending(false),
          },
        });
      }}
      className="border-foreground/15 text-foreground/70 hover:border-foreground/30 hover:text-foreground focus-visible:outline-foreground rounded-md border px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
