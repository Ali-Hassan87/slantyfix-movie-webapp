import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-8 w-24 mb-6 bg-surface2 rounded-md" />

      <div className="flex gap-6 flex-wrap">
        <Skeleton className="w-55 aspect-2/3 bg-surface2 rounded-md shrink-0" />
        <div className="flex-1 min-w-60 space-y-3">
          <Skeleton className="h-10 w-3/4 bg-surface2" />
          <Skeleton className="h-4 w-1/4 bg-surface2" />
          <Skeleton className="h-4 w-full bg-surface2" />
          <Skeleton className="h-4 w-full bg-surface2" />
          <Skeleton className="h-4 w-2/3 bg-surface2" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-5 w-32 mb-3 bg-surface2" />
        <Skeleton className="aspect-video w-full max-w-200 bg-surface2 rounded-md" />
      </div>

      <div className="mt-10">
        <Skeleton className="h-5 w-32 mb-3 bg-surface2" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video bg-surface2 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}