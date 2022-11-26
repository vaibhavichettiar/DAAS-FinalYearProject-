import React, { useEffect, useState } from "react";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import AreaChart from "./areaChart";
import { useSelector } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import Axios from "axios";

function Analytics() {
  let { userid } = useSelector((state) => state.dashboard.userDetails);
  let { datasetid } = useSelector((state) => state.dashboard.selectedDataset);
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const charts = ["Line", "Bar", "Area"];
  const [lineChartShow, setLineChartShow] = useState(false);
  const [barChartShow, setBarChartShow] = useState(false);
  const [areaChartShow, setAreaChartShow] = useState(false);

  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const [areaSalesData, setAreaSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const [years, setYears] = useState(new Map());
  const [yearList, setYearList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      console.log("did = ", datasetid);
      let data = {
        userid: userid,
        datasetid: datasetid,
      };
      console.log("data = ", data);
      const response = await Axios.get(
        "http://localhost:5001/api/tables",
        {
          params: data,
        },
        (err, res) => {
          if (err) {
            return null;
          }
          return res.data;
        }
      );
      setParsedCsvData(response.data);
    }
    fetchData();
  }, [datasetid]);

  useEffect(() => {
    function generateMap() {
      console.log("In the generateMap function");
      if (parsedCsvData.length > 0) {
        console.log("res = ", parsedCsvData);
        setMap();
      }
    }
    generateMap();
  }, [parsedCsvData]);

  useEffect(() => {
    function generateFilter() {
      console.log("In the generateFilter function");
      if (years.size > 0) {
        console.log("logs years : ", years);
        setFilter();
      }
    }
    generateFilter();
  }, [years]);

  useEffect(() => {
    function generateChart() {
      console.log("In the generateChart function");
      if (yearList.length > 0) {
        console.log("logs filter : ", yearList);
        changeLineChart(yearList);
        changeAreaChart(yearList);
      }
    }
    generateChart();
  }, [yearList]);

  function setFilter() {
    if (years.size > 0) {
      console.log("Updated Sales Data", years);
      let logs = [];
      years.forEach((values, keys) => {
        logs.push(keys);
      });
      setYearList(logs);
    }
  }

  function setMap() {
    if (parsedCsvData.length > 0) {
      const map = new Map();
      //const obj = {};
      for (const data of parsedCsvData) {
        let yearString = data.date.split(" ")[0].split("-")[0];
        let year = parseInt(yearString, 10);
        if (!(year in map)) {
          map.set(year, false);
        }
      }
      setYears(map);
    }
  }

  function changeLineChart(filter) {
    var newArray = parsedCsvData.filter(function (row) {
      let yearString = row.date.split(" ")[0].split("-")[0];
      let year = parseInt(yearString, 10);
      if (filter.includes(year)) {
        return true;
      }
    });
    console.log("New data:", Object.keys(newArray).length);
    let obj = {
      labels: newArray.map((data) => data.date.split(" ")[0]),
      datasets: [
        {
          label: "Sales",
          data: newArray.map((data) => data.sales),
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };
    setSalesData(obj);
  }

  function changeAreaChart(filter) {
    var newArray = parsedCsvData.filter(function (row) {
      let yearString = row.date.split(" ")[0].split("-")[0];
      let year = parseInt(yearString, 10);
      if (filter.includes(year)) {
        return true;
      }
    });
    console.log("New data:", Object.keys(newArray).length);
    let obj = {
      labels: newArray.map((data) => data.date.split(" ")[0]),
      datasets: [
        {
          fill: true,
          label: "Sales",
          data: newArray.map((data) => data.sales),
          backgroundColor: ["rgba(53,162,235,0.5)"],
          borderColor: "rgb(53,162,235)",
          borderWidth: 2,
        },
      ],
    };
    setAreaSalesData(obj);
  }

  function onCheckChanged(selectedList, selectedItem) {
    let map = years;
    map.set(selectedItem, !map.get(selectedItem));
    setYears(map);
    console.log("years", years);
    let filter = [];
    years.forEach((values, keys) => {
      if (years.get(keys) === true) {
        filter.push(keys);
      }
    });
    changeLineChart(filter);
    changeAreaChart(filter);
  }

  function onChartChanged(selectedList, selectedItem) {
    console.log("sel item = ", selectedItem);
    if (selectedItem == "Line") {
      setLineChartShow(!lineChartShow);
    }
    if (selectedItem == "Area") {
      setAreaChartShow(!areaChartShow);
    }
    if (selectedItem == "Bar") {
      setBarChartShow(!barChartShow);
    }
  }

  return (
    <>
      <div>
        <div
          style={{
            width: "40%",
            float: "left",
            justifyContent: "left",
            display: "flex",
          }}
        >
          <Multiselect
            placeholder="Select Charts"
            options={charts}
            isObject={false}
            onSelect={onChartChanged}
            onRemove={onChartChanged}
            showCheckbox={true}
          />
        </div>
        <div
          style={{
            width: "50%",
            float: "right",
            justifyContent: "left",
            display: "flex",
          }}
        >
          <Multiselect
          placeholder="Select Year"
            options={yearList}
            isObject={false}
            onSelect={onCheckChanged}
            onRemove={onCheckChanged}
            showCheckbox={true}
          />
        </div>

        <div style={{ width: 700 }}>
          {lineChartShow && <LineChart chartData={salesData} />}
          <br></br>
          {barChartShow && <BarChart chartData={salesData} />}
          <br></br>
          {areaChartShow && <AreaChart chartData={areaSalesData} />}
        </div>
      </div>
    </>
  );
}

export default Analytics;
