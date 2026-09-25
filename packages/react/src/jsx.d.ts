import "react";
import type { BoxProps, PixelProps, CircleProps, TextProps } from "@pixeln/core";

interface PixelnHTMLProps {
  font?: string;
  color?: string | number;
  bg?: string | number;
  border?: string | number;
  radius?: number;
  padding?: number;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      box: BoxProps & { children?: React.ReactNode };
      pixel: PixelProps & { children?: React.ReactNode };
      pcircle: CircleProps & { children?: React.ReactNode };
      ptext: TextProps & { children?: React.ReactNode };
    }
  }
  interface HTMLAttributes<T> extends PixelnHTMLProps {}
}
