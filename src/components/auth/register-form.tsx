"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/server/actions/auth";
import { initialAuthActionState } from "@/lib/validations/auth";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
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
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="border-foreground/15 rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        {state.fieldErrors.name?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
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
          autoComplete="new-password"
          required
          className="border-foreground/15 rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        {state.fieldErrors.password?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="border-foreground/15 rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        {state.fieldErrors.confirmPassword?.map((message) => (
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
        {pending ? "Creating account…" : "Sign up"}
      </button>
      <div className="text-foreground/60 flex items-center gap-2 text-xs">
        <span className="border-foreground/15 h-px flex-1 border-t" />
        or
        <span className="border-foreground/15 h-px flex-1 border-t" />
      </div>
      <GoogleSignInButton />
      <p className="text-foreground/60 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
