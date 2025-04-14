"use client";
import { useContext } from "react";
import { GlobalLoadingActionsContext } from "./global-loading-context";

function useGlobalLoading() {
  return useContext(GlobalLoadingActionsContext);
}

export default useGlobalLoading;
