export type InputMode = {
  name: string;
  data?: string | Uint8Array;
};

export type ServerMessage = {
  init?: boolean;
  inputMode?: InputMode;
  ports: string[];
  statusCode: number;
};

export type ClientMessage = {
  inputMode?: InputMode;
  graphs: number[];
};
