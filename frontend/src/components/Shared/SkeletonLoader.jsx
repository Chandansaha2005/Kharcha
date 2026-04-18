export default function SkeletonLoader({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-2xl bg-[linear-gradient(110deg,#151515,45%,#222222,55%,#151515)] bg-[length:200%_100%] ${className}`}
    />
  );
}
