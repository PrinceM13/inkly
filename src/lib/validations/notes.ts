import { z } from "zod";

const MAX_CONTENT_BYTES = 1_000_000; // 1 MB, SPEC §13

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or fewer."),
  content: z
    .string()
    .refine(
      (raw) => new TextEncoder().encode(raw).length <= MAX_CONTENT_BYTES,
      "Note content is too large.",
    )
    .transform((raw, ctx) => {
      try {
        return JSON.parse(raw) as { type: "doc"; content: unknown[] };
      } catch {
        ctx.addIssue({ code: "custom", message: "Note content is invalid." });
        return z.NEVER;
      }
    }),
});

export type NoteFieldName = "title" | "content";

export type NoteActionState = {
  formError: string | null;
  fieldErrors: Partial<Record<NoteFieldName, string[]>>;
};

export const initialNoteActionState: NoteActionState = {
  formError: null,
  fieldErrors: {},
};
