export function SetDetailsSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 p-4">
          <div className="w-full aspect-square bg-gray-200 rounded-lg" />
        </div>
        <div className="p-5 flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-20" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-32" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PricingSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-3 text-center">
            <div className="h-3 bg-gray-200 rounded w-12 mx-auto mb-2" />
            <div className="h-6 bg-gray-200 rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  );
}
