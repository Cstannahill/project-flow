"use client";

import { InputHTMLAttributes, useState, useRef, ChangeEvent } from "react";
import clsx from "clsx";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  dataType?: string;
  className?: string;
  inputClassName?: string;
  onValueChange?: (name: string, value: string) => void;
}

/**
 * TextInput
 * ---------------------
 * A universal base input field for forms, onboarding, filters, etc.
 *
 * ✅ Use for:
 * - Name, username, API key, general text fields
 * - Flexible form rows or cards
 *
 * 🧠 Design Notes:
 * - Extracted event handlers for reusability and stability
 * - Full support for `autocomplete`, `name`, `data-type`
 * - Extendable via className overrides
 *
 * 🛠️ Props:
 * - label?: string — optional field label
 * - name?: string — form name (default: 'textField')
 * - required?: boolean — mark field as required
 * - autoComplete?: string — browser autofill hint
 * - dataType?: string — internal label or metadata
 * - className?: string — outer container
 * - inputClassName?: string — input field override
 * - ...rest: All other <input> props
 *
 * 🚀 Example Usage:
 * <TextInput label="First Name" name="firstName" />
 *
 * <TextInput
 *   label="API Key"
 *   required
 *   name="apiKey"
 *   dataType="integration"
 *   autoComplete="off"
 *   className="max-w-md"
 *   inputClassName="bg-brand-dark text-white border-white/20"
 * />
 */

export default function TextInput({
  label,
  required = false,
  name = "textField",
  autoComplete = "on",
  dataType,
  className,
  inputClassName,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const field = e.target.name;
    rest.onValueChange?.(field, value);
  };

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium opacity-80">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        id={name}
        name={name}
        type="text"
        required={required}
        autoComplete={autoComplete}
        data-type={dataType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={clsx(
          "rounded-md px-4 py-2 bg-white/10 text-white placeholder-white/50 border border-white/10 transition",
          focused && "ring-2 ring-brand",
          inputClassName
        )}
        {...rest}
      />
    </div>
  );
}
