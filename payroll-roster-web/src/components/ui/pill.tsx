import { PropsWithChildren } from "react";
import clsx from "clsx";

type PillProps = PropsWithChildren<{
  tone?: "neutral" | "primary" | "success" | "warning";
  className?: string;
}>;

const toneClassMap: Record<NonNullable<PillProps["tone"]>, string> = {
  neutral: "bg-slate-100 text-slate-700",
  primary: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

export function Pill({ tone = "neutral", className, children }: PillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        toneClassMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
