import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";
import { AppContext } from "../AppContext";

export function NavBar() {
  const { ready, inputMode, setInputMode, ports } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function selectFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setInputMode({ name: "BIN", data: new Uint8Array() });
    }
    setAnchorEl(null);
  }

  function fakeInputMode() {
    setInputMode({ name: "FAKE" });
    setAnchorEl(null);
  }

  function comInputMode(name: string) {
    setInputMode({ name });
    setAnchorEl(null);
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" marginRight={3}>
          GTOR Daata
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        {ready && (
          <>
            <Typography variant="button" marginRight={0.5}>
              Input:
            </Typography>
            <Button
              color="inherit"
              sx={{ minWidth: 0 }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {inputMode?.name ?? "None"}
            </Button>
          </>
        )}
      </Toolbar>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={fakeInputMode}>Fake Data</MenuItem>
        <label>
          <MenuItem>
            Select File
            <input type="file" hidden onChange={selectFile} />
          </MenuItem>
        </label>
        {ports.map((port) => (
          <MenuItem onClick={() => comInputMode(port)}>{port}</MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
