import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TabularData from './tabularData';
import './style.css';
import Axios from 'axios';
import {ipAddress} from '../../../config'

function Tables() {
    let { userid } = useSelector(state => state.dashboard.userDetails);
    let { datasetid } = useSelector(state => state.dashboard.selectedDataset);
    const [parsedCsvData, setParsedCsvData] = useState([]);


    useEffect(() => {
        async function fetchData() {
          console.log("did = ", datasetid);
            let data = {
                "userid": userid,
                "datasetid": datasetid
            }
            console.log("data = ", data);
            const response = await Axios.get(ipAddress+"/api/tables",  {
                params: data
            }, (err, res) => {
                if (err) {
                    return null;
                }
                return res.data;
            });
            console.log("res = ", response.data);
            setParsedCsvData(response.data);
        }
        fetchData();
    }, []);

    let memoHeaders = [];
    if (parsedCsvData.length > 0) {
        let firstRow = parsedCsvData[0];
        console.log("first row = ", firstRow);
        let colHeaders = Object.keys(firstRow);
        console.log("col headers = ", colHeaders);
        console.log(memoHeaders);
        for (let i = 0; i < colHeaders.length; i++) {
            memoHeaders.push({Header : colHeaders[i], accessor : colHeaders[i].toLowerCase()})
        }
        console.log("memo headers = ",memoHeaders);
    }
    const columns = useMemo(() => memoHeaders, []);

    return ( 
      <>
      <h1>Tabular Data</h1>
      <div className='info'>
        <TabularData columns={memoHeaders} data={parsedCsvData} />
      </div>
    </>
     );
}

export default Tables;