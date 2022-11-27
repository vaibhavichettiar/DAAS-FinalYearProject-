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
            text: 'Area Chart of Sales',
        },
    },
};


function AreaChart({ chartData }) {
    console.log("\n\n YOOOOO Area\n\n")
    return <Line options={options} data={chartData} />;
  }
  
  export default AreaChart;