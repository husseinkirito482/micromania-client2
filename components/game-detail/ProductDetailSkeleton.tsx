export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#020617] pb-24 pt-5 text-white sm:pt-6">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-white/8" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:gap-6">
          <div className="space-y-4">
            <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-[#0f172a]" />
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-20 w-20 animate-pulse rounded-xl border border-white/10 bg-[#0f172a]" />
              ))}
            </div>
            <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-[#0f172a]" />
          </div>

          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-[#0f172a]" />
            <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-[#0f172a]" />
            <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-[#0f172a]" />
          </div>
        </div>
      </div>
    </main>
  );
}