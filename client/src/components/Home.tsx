import {
  Checkbox,
  Chip,
  Grid,
  Paper,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { useState } from "react";

const paperSx: SxProps = {
  height: "100%",
  borderRadius: 3,
  padding: 2,
  overflowY: "auto",
};

const sensors: { id: number; name: string; connected: boolean }[] = [];
for (let i = 0; i < 100; ++i) {
  sensors.push({
    id: i,
    name: `random_sensor_name`,
    connected: Math.random() > 0.5,
  });
}

export function Home() {
  const [checked, setChecked] = useState<number[]>([]);

  function selectSensor(id: number, on: boolean) {
    if (on) {
      if (!checked.includes(id) && checked.length < 4) {
        setChecked([...checked, id].sort((a, b) => a - b));
      }
    } else {
      setChecked(checked.filter((c) => c !== id));
    }
  }

  return (
    <Grid
      container
      spacing={3}
      paddingTop={3}
      paddingX={3}
      height="100%"
      boxSizing="border-box"
    >
      <Grid item xs={4} height="100%">
        <Paper sx={paperSx}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={1.5}
          >
            <Typography variant="h6">Status</Typography>
            <Chip label="Connected" color="success" />
          </Stack>
          <Typography variant="h6" marginBottom={1.5}>
            Sensors
          </Typography>
          {sensors.map((sensor) => (
            <Stack
              direction="row"
              alignItems="center"
              marginLeft={-0.5}
              key={sensor.id}
            >
              <Checkbox
                size="small"
                sx={{ padding: 0.5 }}
                checked={checked.includes(sensor.id)}
                onChange={(e) => selectSensor(sensor.id, e.target.checked)}
              />
              <Typography variant="body2" marginLeft={0.5}>
                {sensor.id}: {sensor.name}
              </Typography>
            </Stack>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper sx={paperSx}>
          <Typography variant="h6" marginBottom={1.5}>
            Data
          </Typography>
          {checked.map((id) => (
            <p>{id}</p> // temporary placeholder for graphs
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
}
