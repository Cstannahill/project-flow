// "use client";

// import { InputHTMLAttributes, useRef } from "react";
// import clsx from "clsx";
// //es-lint-disable-next-line
// interface ToggleProps
//   extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
//   name: string;
//   label?: string;
//   checked: boolean;
//   onChange: (checked: boolean) => void;
//   description?: string;
//   className?: string;
// }

// /**
//  * Toggle
//  * ---------------------
//  * A styled switch component for toggling states on/off.
//  *
//  * ✅ Use for:
//  * - Settings (e.g. notifications, preferences)
//  * - Public/private toggles
//  * - Feature switches in dashboards or control panels
//  *
//  * 🧠 Design Notes:
//  * - Uses a native input for accessibility + keyboard support
//  * - Styled using Tailwind for smooth transition and focus ring
//  * - Optional label/description next to switch
//  *
//  * 🛠️ Props:
//  * - name: string — form field name
//  * - label?: string — visible label text
//  * - checked: boolean — controlled toggle state
//  * - onChange: function — receives new value
//  * - description?: string — optional sublabel
//  * - className?: string — wrapper styling
//  *
//  * 🚀 Example Usage:
//  * <Toggle name="notifications" label="Enable alerts" checked={enabled} onChange={setEnabled} />
//  * <Toggle
//   name="themeMode"
//   label="Dark Mode"
//   checked={isDark}
//   onChange={setIsDark}
//   description="Enable for better night visibility"
//   className="text-white"
// />

//  */

// export default function Toggle({
//   name,
//   label,
//   checked,
//   onChange,
//   description,
//   className,
//   ...rest
// }: ToggleProps) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleChange = () => {
//     onChange(!checked);
//   };

//   return (
//     <div className={clsx("flex items-center gap-4", className)}>
//       <div className="relative">
//         <input
//           ref={inputRef}
//           id={name}
//           name={name}
//           type="checkbox"
//           checked={checked}
//           onChange={handleChange}
//           className="sr-only"
//           {...rest}
//         />
//         <div
//           onClick={handleChange}
//           className={clsx(
//             "w-10 h-6 rounded-full cursor-pointer transition-colors",
//             checked ? "bg-brand" : "bg-white/20"
//           )}
//         >
//           <div
//             className={clsx(
//               "h-5 w-5 bg-white rounded-full shadow-md transform transition-transform",
//               checked ? "translate-x-4" : "translate-x-1"
//             )}
//           />
//         </div>
//       </div>

//       {(label || description) && (
//         <div className="flex flex-col text-sm">
//           {label && (
//             <label htmlFor={name} className="font-medium">
//               {label}
//             </label>
//           )}
//           {description && <span className="opacity-70">{description}</span>}
//         </div>
//       )}
//     </div>
//   );
// }
