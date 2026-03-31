import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon-purple">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary to-accent opacity-30 blur-md -z-10" />
      </div>
      <span className="text-2xl font-semibold tracking-tight text-foreground">
        Proxy
      </span>
    </div>
  );
}
