import { createContext } from "react";
import { InputMode } from "./types";

interface IAppContext {
  ready: boolean;
  inputMode: InputMode | undefined;
  setInputMode: (inputMode: InputMode | undefined) => void;
  ports: string[];
}

export const AppContext = createContext<IAppContext>({} as IAppContext);
