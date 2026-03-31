import { PropsWithChildren } from "react";
import clsx from "clsx";

type CardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  className?: string;
}>;

export function Card({ title, subtitle, className, children }: CardProps) {
  return (
    <section
      className={clsx(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

