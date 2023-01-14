import React, { useEffect, useState } from "react";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import AreaChart from "./areaChart";
import { useSelector } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import Axios from "axios";
import {ipAddress} from '../../../config'


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
      let data = {
        userid: userid,
        datasetid: datasetid,
      };
      const response = await Axios.get(
        ipAddress+"/api/tables",
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
      if (parsedCsvData.length > 0) {
        setMap();
      }
    }
    generateMap();
  }, [parsedCsvData]);

  useEffect(() => {
    function generateFilter() {
      if (years.size > 0) {
        setFilter();
      }
    }
    generateFilter();
  }, [years]);

  useEffect(() => {
    function generateChart() {
      if (yearList.length > 0) {
        changeLineChart(yearList);
        changeAreaChart(yearList);
      }
    }
    generateChart();
  }, [yearList]);

  function setFilter() {
    if (years.size > 0) {
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
    let obj = {
      labels: newArray.map((data) => data.date.split(" ")[0]),
      datasets: [
        {
          label: "Sales",
          data: newArray.map((data) => data.target),
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
    let obj = {
      labels: newArray.map((data) => data.date.split(" ")[0]),
      datasets: [
        {
          fill: true,
          label: "Sales",
          data: newArray.map((data) => data.target),
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
