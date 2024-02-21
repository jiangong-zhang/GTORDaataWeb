import {
  Checkbox,
  Chip,
  Grid,
  Paper,
  Stack,
  SxProps,
  Typography,
  Button,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import config from "../../../config.json";
import TestComponent from "./TestComponent";

type SensorType = keyof typeof config.types;

const paperSx: SxProps = { 
  height: "100%",
  borderRadius: 3,
  padding: 2,
  overflowY: "auto",
};

export function Home() {

  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(true);
  };

  const { inputMode, statusCode, graphs, setGraphs, graphData } =
    useContext(AppContext);

  function selectSensor(idx: number, on: boolean) {
    if (on) {
      if (!graphs.includes(idx) && graphs.length < 4) {
        setGraphs([...graphs, idx].sort((a, b) => a - b));
      }
    } else {
      setGraphs(graphs.filter((c) => c !== idx));
    }
  }

  const sensorValues = config.sensors.flatMap((sensor) => {
    return config.types[sensor.type as SensorType].datatypes.map((d) => ({
      name: sensor.name,
      datatype: d,
    }));
  });

  useEffect(() => {
    setGraphs([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  console.log(graphData);

  const statusChips = [
    <Chip label="Disconnected" color="error" />,
    <Chip label="Connecting" color="warning" />,
    <Chip label="Connected" color="success" />,
  ];

  return (
    <Grid
      container
      spacing={3}
      paddingTop={3}
      paddingX={3}
      height="100%"
      boxSizing="border-box"
    >
      <Grid item xs={3} height="100%">
        <Paper sx={paperSx}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={1.5}
          >
            <Typography variant="h6">Status</Typography>
            {statusChips[statusCode]}
          </Stack>
          <Typography variant="h6" marginBottom={1.5}>
            Sensors
          </Typography>
          {sensorValues.map((sensor, i) => (
            <Stack
              direction="row"
              alignItems="center"
              marginLeft={-0.5}
              key={i}
            >
              <Checkbox
                size="small"
                sx={{ padding: 0.5 }}
                //checked={graphs.includes(i)}
                onChange={(e) => {selectSensor(i, e.target.checked);}}
              />
              <Typography variant="body2" marginLeft={0.5}>
                {sensor.name}
              </Typography>
            </Stack>
          ))}
        </Paper>  
      </Grid>


      <Grid item xs={3}>
        <Paper sx={paperSx}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={1.5}
          >
            <Typography variant="h6">Buttons ! ! ! ! ! ! </Typography>
          </Stack>
          <Typography variant="h6" marginBottom={1.5}>
            Sensors with buttons ! ! ! ! ! 
          </Typography>
          {sensorValues.map((sensor, i) => (
            <Stack
              direction="row"
              alignItems="center"
              marginLeft={-0.5}
              key={i}
            >
              <Button onClick={handleClick}>Load TestComponent</Button>
            </Stack>
          ))}
        </Paper>
      </Grid>


      <Grid item xs={6}>
        <Paper sx={paperSx}>
        <Typography variant="h6" marginBottom={1.5}>
          Data
        </Typography>
        {graphs.map((idx, i) => (
            <p key={i}>{sensorValues[idx].name}</p> // temporary placeholder for graphs
          ))}
                  <div>
          {showComponent && <TestComponent/> }
          {/* You can add more components here to fill the grid if needed */}
        </div>
        </Paper>
      </Grid>
    </Grid>
  );
}
