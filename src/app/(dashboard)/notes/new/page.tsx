import { requireSession } from "@/lib/session";
import { NewNoteForm } from "@/components/notes/new-note-form";

export default async function NewNotePage() {
  await requireSession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">New note</h1>
      <NewNoteForm />
    </div>
  );
}
