import { cn } from "@/lib/utils";

function ProgressIndicator({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex size-5 text-primary", className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-full animate-spin motion-reduce:animate-none"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-20"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="42 57"
        />
      </svg>
    </div>
  );
}

export { ProgressIndicator };
