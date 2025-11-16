import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[3/4] w-full" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-2 h-3 w-1/2" />
        <Skeleton className="mb-3 h-5 w-1/3" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  )
}
