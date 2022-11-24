import React, { useEffect, useState } from 'react';
import LineChart from './lineChart';
import { useSelector } from 'react-redux';
import { Multiselect } from "multiselect-react-dropdown";
import Axios from 'axios';

function Analytics() {
    let { userid } = useSelector(state => state.dashboard.userDetails);
    let { datasetid } = useSelector(state => state.dashboard.selectedDataset);
    const [parsedCsvData, setParsedCsvData] = useState([]);
    const [salesData, setSalesData] = useState({
            labels: [],
            datasets: [],
    });
    const [years, setYears] = useState(new Map());
    const [yearList, setYearList] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
          console.log("did = ", datasetid);
            let data = {
                "userid": userid,
                "datasetid": datasetid
            }
            console.log("data = ", data);
            const response = await Axios.get("http://localhost:5001/api/tables",  {
                params: data
            }, (err, res) => {
                if (err) {
                    return null;
                }
                return res.data;
            });
            setParsedCsvData(response.data);
        }
        fetchData();
    }, [datasetid]);

    useEffect(() => {
        function generateMap(){
            console.log("In the generateMap function");
            if(parsedCsvData.length > 0){
                console.log("res = ", parsedCsvData);
                setMap();
            }
        }
        generateMap();
    }, [parsedCsvData]);

    useEffect(() => {
        function generateFilter(){
            console.log("In the generateFilter function");
            if(years.size > 0){
                console.log("logs years : ", years);
                setFilter();
            }
        }
        generateFilter();
    }, [years]);

    useEffect(() => {
        function generateChart(){
            console.log("In the generateChart function");
            if(yearList.length > 0){
                console.log("logs filter : ", yearList);
                changeLineChart(yearList);
            }
        }
        generateChart();
    }, [yearList]);

    function setFilter(){
        if(years.size > 0){
          console.log("Updated Sales Data", years);
          let logs = [];
           years.forEach((values, keys) => {
            logs.push(keys);
           });
           setYearList(logs);
        }
    }

    function setMap(){
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
                "#2a71d0"
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        };
        setSalesData(obj);
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
    }


   
    return ( <>
    <h5>Select Years</h5>
      <div style={{ width: "90%", justifyContent: "center", display: "flex" }}>
        <Multiselect
          options={yearList}
          isObject={false}
          onSelect={onCheckChanged}
          onRemove={onCheckChanged}
          showCheckbox={true}
        />
      </div>
      <div style={{ width: 700 }}>
        <LineChart chartData={salesData} />
      </div>
    </> );
}

export default Analytics;