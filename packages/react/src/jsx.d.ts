import "react";
import type { BoxProps, PixelProps, CircleProps, TextProps } from "@pixeln/core";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      box: BoxProps & { children?: React.ReactNode };
      pixel: PixelProps & { children?: React.ReactNode };
      pcircle: CircleProps & { children?: React.ReactNode };
      ptext: TextProps & { children?: React.ReactNode };
    }
  }
}
