// types/custom-elements.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    "rapi-doc": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      "spec-url"?: string;
      "render-style"?: "read" | "view" | "focused";
      theme?: string;
      // add more props as needed
    };
  }
}
