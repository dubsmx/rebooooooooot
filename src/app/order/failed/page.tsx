import Link from "next/link";

export default async function OrderFailed({ searchParams }: { searchParams: Promise<{ reason?: string; status_detail?: string }> }) {
  const { reason, status_detail } = await searchParams;
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-4">
      <div className="rounded-2xl p-4 border border-red-500/30 bg-red-500/10">
        <h1 className="text-xl font-semibold text-red-300">Payment failed</h1>
        <p className="text-sm text-red-200 mt-1">
          {reason || status_detail || "Your card could not be charged. Please try again with another method."}
        </p>
      </div>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </main>
  );
}