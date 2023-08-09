import { createContext } from "react";
import { GraphData, InputMode } from "./types";

interface IAppContext {
  ready: boolean;
  inputMode?: InputMode;
  setInputMode: (inputMode: InputMode | undefined) => void;
  ports: string[];
  statusCode: number;
  graphs: number[];
  setGraphs: (graphs: number[]) => void;
  graphData?: GraphData;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);
