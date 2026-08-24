import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium text-teal-700 dark:text-teal-400">For families in Tamil Nadu</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
        After a loss, know exactly what to do next.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Legal heir certificate, property records, bank claims, pension, electricity,
        gas, vehicle transfer — losing someone means facing a maze of paperwork
        with no map. Answer a few questions and get a clear, personal, ordered
        checklist for Tamil Nadu — free, no account needed.
      </p>
      <div className="mt-8">
        <Link
          href="/intake"
          className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-6 py-3 text-base font-medium text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
        >
          Start my checklist
        </Link>
      </div>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Takes about 2 minutes. Nothing you enter is stored on a server — your
        checklist link is yours to save or share with family.
      </p>
    </main>
  );
}
