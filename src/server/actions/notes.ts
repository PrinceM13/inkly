"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { notes } from "@/db/schema/notes";
import { requireSession } from "@/lib/session";
import { extractPlainText, buildExcerpt } from "@/lib/tiptap/content";
import {
  createNoteSchema,
  type NoteActionState,
} from "@/lib/validations/notes";

export async function createNoteAction(
  _prevState: NoteActionState,
  formData: FormData,
): Promise<NoteActionState> {
  const session = await requireSession();

  const parsed = createNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      formError: null,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { title, content } = parsed.data;
  const plainText = extractPlainText(content);
  const now = new Date();
  const id = randomUUID();

  let formError: string | null = null;
  try {
    db.transaction((tx) => {
      tx.insert(notes)
        .values({
          id,
          userId: session.user.id,
          title,
          content,
          excerpt: buildExcerpt(plainText),
          searchContent: plainText,
          createdAt: now,
          updatedAt: now,
        })
        .run();

      tx.run(
        sql`INSERT INTO notes_fts (note_id, title, content) VALUES (${id}, ${title}, ${plainText})`,
      );
    });
  } catch {
    formError = "Something went wrong. Please try again.";
  }
  if (formError) {
    return { formError, fieldErrors: {} };
  }

  redirect(`/notes/${id}`);
}
