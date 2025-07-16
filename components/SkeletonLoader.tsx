"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-2 bg-gray-800" />
        <Skeleton className="h-6 w-96 mx-auto bg-gray-800" />
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Skeleton className="h-10 w-full sm:w-1/2 lg:w-1/3 bg-gray-800" />
        <Skeleton className="h-10 w-full sm:w-1/4 lg:w-1/6 bg-gray-800" />
        <Skeleton className="h-10 w-full sm:w-1/4 lg:w-1/6 bg-gray-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <Skeleton className="w-full h-48 bg-gray-700" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-6 w-20 bg-gray-700" />
                <Skeleton className="h-6 w-16 bg-gray-700" />
              </div>
              <Skeleton className="h-4 w-full mt-4 bg-gray-700" />
              <Skeleton className="h-4 w-5/6 mt-2 bg-gray-700" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-10 w-28 bg-gray-700" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
