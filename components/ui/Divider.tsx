"use client";
type DividerProps = {
  className?: string;
  spacing?: number;
  color?: string;
};

export function Divider({
  className = "",
  spacing = 2,
  color = "white",
}: DividerProps) {
  switch (spacing) {
    case 1:
      return (
        <>
          <hr className={`border border-${color}  ${className}`} />
        </>
      );

      break;
    case 2:
      return (
        <>
          <br />
          <hr className={`border border-${color}  ${className}`} />
          <br />
        </>
      );
      break;
    case 3:
      return (
        <>
          <br />
          <br />
          <hr className={`border border-${color}  ${className}`} />
          <br />
          <br />
        </>
      );
      break;
    case 4:
      return (
        <>
          <br />
          <br />
          <br />
          <hr className={`border border-${color}  ${className}`} />
          <br />
          <br />
          <br />
        </>
      );
      break;
    default:
      return (
        <>
          <br />
          <hr className={`border border-${color}  ${className}`} />
          <br />
        </>
      );
  }
}
