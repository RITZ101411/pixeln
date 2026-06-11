import "react";
import type { BoxProps, PixelProps } from "@pixeln/core";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      box: BoxProps & { children?: React.ReactNode };
      pixel: PixelProps & { children?: React.ReactNode };
    }
  }
}
