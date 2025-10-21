import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-8 h-48"></div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-3 bg-white/60 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-white/80 rounded w-1/2"></div>
                  </div>
                  <div className="w-12 h-12 bg-white/40 rounded-xl"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

