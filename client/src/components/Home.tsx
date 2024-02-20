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
import { useContext, useEffect, useState } from "react"; // Make sure useState is imported
import { AppContext } from "../AppContext";
import config from "../../../config.json";

type SensorType = keyof typeof config.types;

const paperSx: SxProps = {
  height: "100%",
  borderRadius: 3,
  padding: 2,
  overflowY: "auto",
};

export function Home() {
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

  const SensorGraphComponent = ({ sensorName, datatype }) => {
    return (
      <div>
        <h3>{sensorName}</h3>
        <p>Datatype: {datatype}</p>
        {/*idk actual stuff goes here*/}
      </div>
    );
  };
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
              <Button variant="text"
              >{sensor.name}</Button>
            </Stack>
          ))}
        </Paper>
      </Grid>


      <Grid item xs={6}>
        <Paper sx={paperSx}>
        <Typography variant="h6" marginBottom={1.5}>
          Data
        </Typography>
        {graphs.map((idx) => (
          <div>
          <SensorGraphComponent
            key={idx}
            sensorName={sensorValues[idx].name}
            datatype={sensorValues[idx].datatype}
          />
              <Checkbox
                size="small"
                sx={{ padding: 0.5 }}
                //checked={graphs.includes(i)}
                onChange={(e) => {selectSensor(idx, e.target.checked);}}
              />
              </div>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
}
