import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  return isDarkMode ? (
    <Button
      color="success"
      suppressHydrationWarning
      onClick={() => setTheme("light")}
    >
      <Sun suppressHydrationWarning className="mx-4" size={20} color={"gold"} />
    </Button>
  ) : (
    <Button
      color="secondary"
      suppressHydrationWarning
      onClick={() => setTheme("dark")}
    >
      <Moon
        className="mx-4"
        suppressHydrationWarning
        size={20}
        color="silver"
      />
    </Button>
  );
};
