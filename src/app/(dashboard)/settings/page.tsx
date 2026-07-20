import { requireSession } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireSession();
  return <p>Settings — signed in as {session.user.email}</p>;
}
