"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isAPIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import {
  loginSchema,
  registerSchema,
  type AuthActionState,
} from "@/lib/validations/auth";

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      formError: null,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  let formError: string | null = null;
  try {
    await auth.api.signInEmail({ body: parsed.data });
  } catch (err) {
    formError = isAPIError(err)
      ? (err.message ?? "Invalid email or password.")
      : "Something went wrong. Please try again.";
  }
  if (formError) {
    return { formError, fieldErrors: {} };
  }

  redirect("/notes");
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      formError: null,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  let formError: string | null = null;
  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
  } catch (err) {
    formError = isAPIError(err)
      ? (err.message ?? "Could not create your account.")
      : "Something went wrong. Please try again.";
  }
  if (formError) {
    return { formError, fieldErrors: {} };
  }

  redirect("/notes");
}
