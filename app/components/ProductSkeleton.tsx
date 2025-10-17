export function ProductSkeleton() {
  return (
    <div className="animate-pulse flex flex-col justify-start bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gray-200"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* AKCIÓ Badge skeleton */}
        <div className="absolute top-3 right-3 bg-gray-300 px-3 py-1 rounded-full w-16 h-6"></div>

        {/* Product Image/Logo skeleton */}
        <div className="relative h-full">
          <div className="w-full h-full bg-gray-100">
            <div className="absolute inset-0 bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* White Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Title skeleton */}
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>

          {/* Description skeleton */}
          <div className="h-10 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        {/* Pricing and Button Row skeleton */}
        <div className="flex items-end justify-between">
          {/* Left side - Pricing skeleton */}
          <div className="flex flex-col">
            <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
          </div>

          {/* Right side - Add to Cart Button skeleton */}
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonRow({count = 4}: {count?: number}) {
  return (
    <div className="max-w-7xl mx-auto pt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
      {Array.from({length: count}, (_, index) => (
        <ProductSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
