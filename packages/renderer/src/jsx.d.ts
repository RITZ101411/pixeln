import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      box: { x?: number; y?: number; w?: number; h?: number; bg?: string | number; children?: React.ReactNode };
      pixel: { x?: number; y?: number; bg?: string | number };
    }
  }
}
