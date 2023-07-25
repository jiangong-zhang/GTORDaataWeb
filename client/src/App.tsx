import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext";
import { Home } from "./components/Home";
import { NavBar } from "./components/NavBar";
import { ClientMessage, InputMode, ServerMessage } from "./types";

function App() {
  const [ready, setReady] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>();
  const [ports, setPorts] = useState<string[]>([]);
  const [statusCode, setStatusCode] = useState(0);

  const ws = useMemo(() => new WebSocket("ws://localhost:3001"), []);

  useEffect(() => {
    ws.onclose = () => {
      setReady(false);
    };
  }, [ws]);

  useEffect(() => {
    ws.onmessage = (e) => {
      const data: ServerMessage = JSON.parse(e.data);
      if (data.init) {
        setInputMode(data.inputMode);
        setReady(true);
      }

      if (ports.toString() !== data.ports.toString()) {
        setPorts(data.ports);
      }

      setStatusCode(data.statusCode);

      const msg: ClientMessage = { inputMode };
      ws.send(JSON.stringify(msg));
    };
  }, [inputMode, ports, ws]);

  return (
    <AppContext.Provider
      value={{
        ready,
        inputMode,
        setInputMode,
        ports,
        statusCode,
      }}
    >
      <Stack height="100vh">
        <NavBar />
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          {ready ? (
            <Home />
          ) : (
            <Stack
              height="100%"
              alignItems="center"
              justifyContent="center"
              spacing={4}
            >
              <CircularProgress />
              <p>Connecting to server...</p>
            </Stack>
          )}
        </div>
      </Stack>
    </AppContext.Provider>
  );
}

export default App;
