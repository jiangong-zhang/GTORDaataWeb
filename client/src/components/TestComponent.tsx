// TestComponent.tsx
import React, { useContext } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { AppContext } from "../AppContext"; // Adjust the import path as necessary

const TestComponent: React.FC = () => {
  const { graphData, inputMode } = useContext(AppContext);

  if (!graphData) {
    return <div>No data available.</div>;
  }

  // Assuming we have a dataset to display and focusing on the first dataset for simplicity
  const data = {
    labels: graphData.x.map(x => x.toString()), // Assuming x is numeric and needs to be converted to string
    datasets: [
      {
        label: inputMode?.name || "Sensor Data",
        data: graphData.y[0], // Assuming we're visualizing the first dataset
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default TestComponent;
