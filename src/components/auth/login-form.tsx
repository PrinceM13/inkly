"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/server/actions/auth";
import { initialAuthActionState } from "@/lib/validations/auth";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      {state.formError && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {state.formError}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border-foreground/15 rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        {state.fieldErrors.email?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border-foreground/15 rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        {state.fieldErrors.password?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <div className="text-foreground/60 flex items-center gap-2 text-xs">
        <span className="border-foreground/15 h-px flex-1 border-t" />
        or
        <span className="border-foreground/15 h-px flex-1 border-t" />
      </div>
      <GoogleSignInButton />
      <p className="text-foreground/60 text-center text-sm">
        No account?{" "}
        <Link href="/register" className="text-foreground underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
