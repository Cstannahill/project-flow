import { useTheme } from "next-themes";
import Image from "next/image";
import IconButton from "./IconButton";

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  return isDarkMode ? (
    <IconButton
      btnClass="bg-gradient-glow"
      iconSrc="/icons/other/sun.svg"
      onClick={() => setTheme("light")}
    />
  ) : (
    <IconButton
      btnClass="bg-linear-to-r from-gray-300 via-gray-500 to-gray-700"
      iconSrc="/icons/other/moon.svg"
      onClick={() => setTheme("dark")}
    />
  );
};
