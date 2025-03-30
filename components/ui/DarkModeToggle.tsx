// components/DarkModeToggle.tsx
"use client";
import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

// export default function DarkModeToggle() {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     // Check if dark mode was previously enabled
//     const isDark = localStorage.getItem("theme") === "dark";
//     document.documentElement.classList.toggle("dark", isDark);
//   }, []);

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", newMode);
//   };

//   return (
//     <button
//       onClick={toggleDarkMode}
//       className="p-2 rounded btn border text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
//     >
//       {darkMode ? "☀️" : "🌙"}
//     </button>
//   );
