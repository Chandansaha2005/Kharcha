export default function LoadingSpinner({ className = "h-10 w-10", label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      <div
        className={`${className} rounded-full border-4 border-border border-t-income animate-spin`}
        aria-hidden="true"
      />
      {label ? <p className="text-sm text-muted">{label}</p> : null}
    </div>
  );
}
