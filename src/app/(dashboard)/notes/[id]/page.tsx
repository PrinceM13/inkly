import { requireSession } from "@/lib/session";

export default async function NoteEditorPage() {
  const session = await requireSession();
  return <p>Note editor — signed in as {session.user.email}</p>;
}
