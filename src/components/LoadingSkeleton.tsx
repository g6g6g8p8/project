export function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="aspect-[21/9] w-full bg-gray-100 dark:bg-white/5 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 bg-gray-100 dark:bg-white/5 rounded-lg" />
        <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg" />
        <div className="h-4 w-5/6 bg-gray-100 dark:bg-white/5 rounded-lg" />
      </div>
    </div>
  );
} 