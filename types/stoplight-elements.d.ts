declare module "@stoplight/elements" {
  import { ComponentType } from "react";
  export const API: ComponentType<any>;
  export const Docs: ComponentType<any>;
}
// tell TS this path is valid
declare module "@stoplight/elements/web-components.min.js";

// teach JSX about <elements‑api>
declare namespace JSX {
  interface IntrinsicElements {
    "elements-api": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      apiDescriptionUrl?: string;
      router?: string;
      layout?: string;
      hideTryIt?: string;
      // …and any other string‐based attributes you use
    };
  }
}
