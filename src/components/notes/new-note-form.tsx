"use client";

import { useActionState, useState } from "react";
import { createNoteAction } from "@/server/actions/notes";
import { initialNoteActionState } from "@/lib/validations/notes";
import { NoteEditor } from "@/components/editor/note-editor";

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(
    createNoteAction,
    initialNoteActionState,
  );
  const [contentJSON, setContentJSON] = useState<object>({
    type: "doc",
    content: [],
  });

  return (
    <form action={formAction} className="flex w-full max-w-2xl flex-col gap-4">
      {state.formError && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {state.formError}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={200}
          required
          autoFocus
          className="border-foreground/15 rounded-md border bg-transparent px-3 py-2 text-sm"
        />
        {state.fieldErrors.title?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Content</span>
        <NoteEditor onChangeJSON={setContentJSON} />
        <input
          type="hidden"
          name="content"
          value={JSON.stringify(contentJSON)}
        />
        {state.fieldErrors.content?.map((message) => (
          <p key={message} className="text-xs text-red-600">
            {message}
          </p>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="bg-foreground text-background self-start rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create note"}
      </button>
    </form>
  );
}
