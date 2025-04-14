"use client";
import { useContext } from "react";
import { GlobalLoadingContext } from "./global-loading-context";

function useGlobalLoadingState() {
  return useContext(GlobalLoadingContext);
}

export default useGlobalLoadingState;
