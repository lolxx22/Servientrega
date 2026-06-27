export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-[10px] text-neutral-400 ml-1.5 font-medium">escribiendo</span>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export const Skeleton = ({ className = '', variant = 'text' }: SkeletonProps) => {
  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className={`${variants[variant]} bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 bg-[length:200%_100%] animate-shimmer ${className}`}
      />
    </div>
  );
};

export const SkeletonCard = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="rounded" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
};
