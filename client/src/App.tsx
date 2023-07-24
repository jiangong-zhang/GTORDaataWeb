import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { Home } from "./components/Home";
import { NavBar } from "./components/NavBar";
import { ClientMessage, InputMode, ServerMessage } from "./types";

function App() {
  const [ready, setReady] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>();
  const [ports, setPorts] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (e) => {
      const data: ServerMessage = JSON.parse(e.data);
      if (data.init) {
        setInputMode(data.inputMode);
        setReady(true);
      }

      setPorts((ports) => {
        if (ports.toString() !== data.ports.toString()) {
          return data.ports;
        }
        return ports;
      });

      const msg: ClientMessage = { inputMode };
      ws.send(JSON.stringify(msg));
    };

    ws.onclose = () => {
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        ready,
        inputMode,
        setInputMode,
        ports,
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
