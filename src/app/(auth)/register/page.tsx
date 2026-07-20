import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/notes");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-bold">Create your Inkly account</h1>
      <RegisterForm />
    </main>
  );
}
