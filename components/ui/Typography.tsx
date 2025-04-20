import clsx from "clsx";

/* ------------------------------------------------------------------ */
/* Headings                                                            */
/* ------------------------------------------------------------------ */

export const H1 = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <h1
    className={clsx(
      "text-brand scroll-m-20 text-4xl font-bold tracking-tight",
      className,
    )}
  >
    {children}
  </h1>
);

export const H2 = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <h2
    className={clsx(
      "text-brand scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
  >
    {children}
  </h2>
);

export const H3 = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <h3
    className={clsx(
      "text-brand scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
  >
    {children}
  </h3>
);

export const H4 = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <h4
    className={clsx(
      "text-brand-mono scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
  >
    {children}
  </h4>
);

export const H5 = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <h5
    className={clsx(
      "text-brand-mono scroll-m-20 text-lg font-semibold tracking-tight",
      className,
    )}
  >
    {children}
  </h5>
);

/* ------------------------------------------------------------------ */
/* Paragraph & small text                                              */
/* ------------------------------------------------------------------ */

interface ParagraphProps extends React.PropsWithChildren {
  className?: string;
  muted?: boolean;
}

export const P = ({ children, muted = false, className }: ParagraphProps) => (
  <p
    className={clsx(
      "leading-7",
      muted ? "text-brand-muted" : "text-brand",
      className,
    )}
  >
    {children}
  </p>
);

export const Small = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <small
    className={clsx(
      "text-brand-muted text-xs font-medium tracking-wide uppercase",
      className,
    )}
  >
    {children}
  </small>
);
