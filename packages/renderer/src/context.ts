import { createContext, useContext } from "react";

const PixelContext = createContext<{ scale: number }>({ scale: 1 });

export const usePixel = () => useContext(PixelContext);
export const PixelProvider = PixelContext.Provider;
