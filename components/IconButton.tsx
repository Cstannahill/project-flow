// components/IconButton.tsx
import Image from "next/image";

interface IconButtonProps {
  label?: string;
  onClick: () => void;
  iconSrc: string;
  alt?: string;
  btnClass?: string;
  imgClass?: string;
}

export default function IconButton({
  label,
  onClick,
  btnClass,
  imgClass,
  iconSrc,
  alt = "icon",
}: IconButtonProps) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className={
        "w-25 mx-auto gap-2 px-0 py-2 text-white rounded-lg hover:bg-blue-700" +
        (btnClass ? ` ${btnClass}` : "")
      }
    >
      <Image
        suppressHydrationWarning
        src={iconSrc}
        alt={alt}
        width={25}
        height={25}
        className="w-5 h-5 mx-auto"
      />
      {label && <span>{label}</span>}
    </button>
  );
}
