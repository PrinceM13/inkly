export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="border-foreground/15 text-foreground/60 rounded-full border px-4 py-1 text-xs font-medium tracking-widest uppercase">
        Coming Soon
      </span>

      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-8xl">
        Inkly
      </h1>

      <p className="text-foreground/80 text-lg font-medium sm:text-xl">
        A note taking app
      </p>

      <p className="text-foreground/60 max-w-md text-balance">
        Capture your thoughts, organize your ideas. We&apos;re building
        something great — stay tuned.
      </p>
    </main>
  );
}
