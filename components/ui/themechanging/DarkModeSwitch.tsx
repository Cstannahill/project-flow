'use client";';
import { Switch } from "../switch";
import { useTheme } from "next-themes";
export const DarkModeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <Switch
      id="darkModeSwitch"
      onCheckedChange={handleCheckedChange}
      defaultChecked={theme === "dark"}
      className="bg-surface"
    />
  );
};
