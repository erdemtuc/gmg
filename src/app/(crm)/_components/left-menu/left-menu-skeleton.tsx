export default function LeftMenuSkeleton() {
  const items = Array.from({ length: 4 });

  return (
    <nav className="bg-brand-primary-600 group h-full w-full px-6 pt-2.5 pb-6">
      <div className="inline-flex h-8 w-full items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-white/20" />
        <div className="h-5 w-5 animate-pulse rounded bg-white/30" />
      </div>
      <ul className="mt-2 flex w-full flex-col items-start justify-start gap-1">
        {items.map((_, idx) => (
          <li key={idx} className="h-11 w-full rounded-md bg-white/10">
            <div className="inline-flex h-full w-full items-center gap-3 px-3 py-1">
              <div className="size-5 shrink-0 animate-pulse rounded bg-white/30" />
              <span className="h-3 w-32 animate-pulse rounded bg-white/20" />
            </div>
          </li>
        ))}
        <div className="h-px bg-white/20 group-data-[collapsed=false]:w-full group-data-[collapsed=true]:w-11" />
        <li className="h-11 w-full rounded-md bg-white/10">
          <div className="flex h-full w-full items-center justify-between px-2 pt-1">
            <span className="h-3 w-24 animate-pulse rounded bg-white/20" />
            <div className="size-5 animate-pulse rounded bg-white/30" />
          </div>
        </li>
      </ul>
    </nav>
  );
}
