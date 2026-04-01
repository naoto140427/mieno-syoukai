import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white/5 border border-white/10 animate-pulse backdrop-blur-md rounded-xl",
        className
      )}
      {...props}
    />
  );
}
