import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

// Chart.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
//   );

// function LineChart({ chartData, options }) {
//   return <Line data={chartData} options={options}/>;
// }

function LineChart({ chartData }) {
  return <Line data={chartData} />;
}

export default LineChart;