import { requireSession } from "@/lib/session";

export default async function NotesPage() {
  const session = await requireSession();
  return <p>Notes list — signed in as {session.user.email}</p>;
}
