export type InputMode = {
  name: string;
  data?: string | Uint8Array;
};

export type GraphData = {
  x: number[];
  y: number[][];
};

export type ServerMessage = {
  init?: boolean;
  inputMode?: InputMode;
  ports: string[];
  statusCode: number;
  graphData?: GraphData;
};

export type ClientMessage = {
  inputMode?: InputMode;
  graphs: number[];
};
