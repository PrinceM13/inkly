type TiptapNode = {
  type?: string;
  text?: string;
  content?: TiptapNode[];
};

/** Walks a Tiptap/ProseMirror JSON doc, collecting all `text` node values,
 * separated by spaces, for FTS mirroring / excerpt generation. */
export function extractPlainText(doc: unknown): string {
  const parts: string[] = [];

  function walk(node: unknown): void {
    if (!node || typeof node !== "object") return;
    const n = node as TiptapNode;
    if (typeof n.text === "string") parts.push(n.text);
    if (Array.isArray(n.content)) n.content.forEach(walk);
  }

  walk(doc);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

const EXCERPT_MAX_LENGTH = 200;

/** Short plain-text preview for the notes list. */
export function buildExcerpt(plainText: string): string {
  if (plainText.length <= EXCERPT_MAX_LENGTH) return plainText;
  return plainText.slice(0, EXCERPT_MAX_LENGTH).trimEnd() + "…";
}
