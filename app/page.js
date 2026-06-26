export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-300">
          GESAB
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Ny Next.js-grund med pinnade paketversioner.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-neutral-300">
          Projektet kör React, Next.js och Tailwind med versioner från senast
          16 juni 2026.
        </p>
      </section>
    </main>
  );
}
