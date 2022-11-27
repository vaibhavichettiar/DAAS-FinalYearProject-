import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";


export const options = {
  Response: true,
  plugins:{
      legend: {
          position:'top',
      },
      title: {
          display: true,
          text: 'Bar Chart of Sales',
      },
  },
};


function BarChart({ chartData }) {
    return <Bar options={options} data={chartData} />;
  }
  
  export default BarChart;
