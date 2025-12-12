import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-semibold mb-4">Japan Trip</h1>
      <p className="text-sm text-slate-300 mb-8 text-center max-w-md">
        Montage of the trip and a tiny shared expense tracker.
      </p>
      <div className="flex gap-4">
        <Link
          href="/montage"
          className="rounded-lg px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm"
        >
          View montage
        </Link>
        <Link
          href="/expenses"
          className="rounded-lg px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-sm"
        >
          Expenses
        </Link>
      </div>
    </main>
  );
}
