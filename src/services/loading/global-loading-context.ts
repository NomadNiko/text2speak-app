"use client";
import { createContext } from "react";

export type GlobalLoadingContextType = {
  isLoading: boolean;
};

export type GlobalLoadingActionsContextType = {
  setLoading: (isLoading: boolean) => void;
};

export const GlobalLoadingContext = createContext<GlobalLoadingContextType>({
  isLoading: false,
});

export const GlobalLoadingActionsContext =
  createContext<GlobalLoadingActionsContextType>({
    setLoading: () => {},
  });
