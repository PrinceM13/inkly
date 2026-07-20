"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

type NoteEditorProps = {
  onChangeJSON: (doc: object) => void;
};

export function NoteEditor({ onChangeJSON }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-64 rounded-md border border-foreground/15 bg-transparent px-3 py-2 text-sm focus:outline-none",
        "aria-label": "Note content",
      },
    },
    onUpdate: ({ editor }) => {
      onChangeJSON(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor) onChangeJSON(editor.getJSON());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

type ToolbarButton = {
  label: string;
  ariaLabel: string;
  isActive?: () => boolean;
  onClick: () => void;
};

function Toolbar({ editor }: { editor: Editor }) {
  const buttons: ToolbarButton[] = [
    {
      label: "P",
      ariaLabel: "Paragraph",
      isActive: () => editor.isActive("paragraph"),
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "H1",
      ariaLabel: "Heading 1",
      isActive: () => editor.isActive("heading", { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "H2",
      ariaLabel: "Heading 2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      ariaLabel: "Heading 3",
      isActive: () => editor.isActive("heading", { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "B",
      ariaLabel: "Bold",
      isActive: () => editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "I",
      ariaLabel: "Italic",
      isActive: () => editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "</>",
      ariaLabel: "Inline code",
      isActive: () => editor.isActive("code"),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    {
      label: "{ }",
      ariaLabel: "Code block",
      isActive: () => editor.isActive("codeBlock"),
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "•",
      ariaLabel: "Bullet list",
      isActive: () => editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "—",
      ariaLabel: "Horizontal rule",
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="border-foreground/15 flex flex-wrap gap-1 rounded-md border p-1"
    >
      {buttons.map((btn) => (
        <button
          key={btn.ariaLabel}
          type="button"
          aria-label={btn.ariaLabel}
          aria-pressed={btn.isActive?.()}
          onClick={btn.onClick}
          className="text-foreground/70 aria-pressed:bg-foreground aria-pressed:text-background rounded px-2 py-1 text-xs font-medium hover:opacity-80"
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
