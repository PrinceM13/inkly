import { requireSession } from "@/lib/session";

export default async function TrashPage() {
  const session = await requireSession();
  return <p>Trash — signed in as {session.user.email}</p>;
}
