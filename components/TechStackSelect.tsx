import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

export function TechSelect({ label, value, options, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="border p-2 rounded w-full text-left">
            {value ? (
              <div className="flex items-center gap-2">
                <Image
                  src={
                    options.find((o: any) => o.tool === value)?.icon ||
                    "/icons/placeholder.svg"
                  }
                  alt={value}
                  width={20}
                  height={20}
                />
                {value}
              </div>
            ) : (
              "Select..."
            )}
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 bg-gray-200  w-full shadow-lg z-10 rounded border">
            {options.map((opt: any) => (
              <ListboxOption key={opt.tool} value={opt.tool} as={Fragment}>
                {({ active, selected }) => (
                  <li
                    className={`flex text-black items-center gap-2 px-3 py-2 cursor-pointer ${
                      active ? "bg-blue-300" : ""
                    }`}
                  >
                    <Image
                      src={opt.icon}
                      alt={opt.tool}
                      width={20}
                      height={20}
                    />
                    <span>{opt.tool}</span>
                  </li>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
