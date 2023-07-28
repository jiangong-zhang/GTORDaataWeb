import { createContext } from "react";
import { InputMode } from "./types";

interface IAppContext {
  ready: boolean;
  inputMode: InputMode | undefined;
  setInputMode: (inputMode: InputMode | undefined) => void;
  ports: string[];
  statusCode: number;
  graphs: number[];
  setGraphs: (graphs: number[]) => void;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);
