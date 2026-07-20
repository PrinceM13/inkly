import Link from "next/link";

export function Header() {
  return (
    <header className="border-foreground/15 bg-background sticky top-0 z-10 border-b">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/notes"
          className="focus-visible:outline-foreground rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Inkly
        </Link>
        <Link
          href="/notes/new"
          className="bg-foreground text-background focus-visible:outline-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          New Note
        </Link>
      </nav>
    </header>
  );
}
