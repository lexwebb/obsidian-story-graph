import { App } from "obsidian";
import { createContext, useContext } from "react";

export const AppContext = createContext<App>(null as unknown as App);

export const useApp = (): App => {
  return useContext(AppContext);
};
