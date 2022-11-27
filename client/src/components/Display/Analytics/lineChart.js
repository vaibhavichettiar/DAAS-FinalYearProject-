import React from "react";
import { Line } from "react-chartjs-2";
import { Chart} from "chart.js/auto";


export const options = {
  Response: true,
  plugins:{
      legend: {
          position:'top',
      },
      title: {
          display: true,
          text: 'Line Chart of Sales',
      },
  },
};

function LineChart({ chartData }) {
  return <Line options={options} data={chartData} />;
}

export default LineChart;