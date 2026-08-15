import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-6 bg-surface2 rounded-md" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-md overflow-hidden bg-surface border border-line">
            <Skeleton className="aspect-2/3 w-full bg-surface2" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-4/5 bg-surface2" />
              <Skeleton className="h-3 w-1/3 bg-surface2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}