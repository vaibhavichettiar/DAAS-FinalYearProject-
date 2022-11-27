import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col } from 'react-bootstrap';
import {ipAddress} from '../../../config';
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Histogram from 'react-chart-histogram';
import { ChartData, ChartArea } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Chart } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
  );

function Prediction() {
    let { userid } = useSelector(state => state.dashboard.userDetails);
    let { datasetid } = useSelector(state => state.dashboard.selectedDataset);
    const [display, setDisplay] = useState(false);
    const [category, setCategory] = useState("");
    const [dateCol, setDateCol] = useState("");
    const [dateFormat, setDateFormat] = useState("");
    const [targetCol, setTargetCol] = useState("");
    const [productId, setProductId] = useState("");
    const [showTrain, setShowTrain] = useState(false);
    const [showPredict, setShowPredict] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [chartData, setChartData] = useState({});

    const handleTrainClose = () => setShowTrain(false);
    const handleTrain = () => setShowTrain(true);

    const handlePredictClose = () => setShowPredict(false);
    const handlePredict = () => setShowPredict(true);

    const handleTrainAPI = () => {
        async function fetchData() {
            let data = {
                "userId": userid,
                "datasetId": datasetid,
                "timeColumn": dateCol,
                "targetColumn": targetCol,
                "categoryColumn": category,
                "dateFormat": dateFormat
            }
              const response = await Axios.post(ipAddress+"/api/dataPrep", data, (err, res) => {
                  if (err) {
                      return null;
                  }
                  return res.data;
              });
              console.log("res = ", response.data);
              setShowTrain(false);
              setDisplay(true);
          }
        fetchData();
    }

    const handlePredictAPI = () => {
        async function fetchData() {
            let newStartDate = startDate.toISOString().slice(0,10);
            let newEndDate = endDate.toISOString().slice(0,10);
            let data = {
                "startDate": newStartDate,
                "endDate": newEndDate,
                "productId": parseInt(productId),
                "userId": userid,
                "datasetId": "ce196496-e014-488b-b218-4c7c6d8f4a45"
            }
              const response = await Axios.get(ipAddress+"/api/predict", {
                params: data
            }, (err, res) => {
                  if (err) {
                      return null;
                  }
                  return res.data;
              });
              let labels = [];
              let sales = [];
              for (let i = 0; i < response.data.length; i++) {
                labels.push(response.data[i]["date"]);
                sales.push(parseInt(response.data[i]["predicted sales"]));
              }
              const dd = {
                labels,
                datasets: [
                    {
                        label: "sales data",
                        data: sales
                    }
                ]
            }
            console.log("dd = ", dd);
            setChartData(dd);
            setShowPredict(false);

          }
        fetchData();
    }

    const handleCategory = (e) => {
        setCategory(e.target.value);
    }

    const handleDate = (e) => {
        setDateCol(e.target.value);
    }

    const handleDateFormat = (e) => {
        setDateFormat(e.target.value);
    }

    const handleTarget = (e) => {
        setTargetCol(e.target.value);
    }

    const handleProductId = (e) => {
        setProductId(e.target.value);
    }

    return ( <>
    <Container>
            <Row style={{marginTop:"60px"}}>
                <Button style={{width:'50%',background:'#52ab98'}} onClick={handleTrain}>Prepare the Dataset</Button>
                <Modal show={showTrain} onHide={handleTrainClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Prepare the Dataset</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="columnName">
                        <Form.Label>Provide the category attribute</Form.Label>
                        <Form.Control
                            type="text"
                            autoFocus
                            onChange={handleCategory}
                        />
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="dateColumn"
                        >
                        <Form.Label>Provide the name of the date column</Form.Label>
                        <Form.Control type="text" onChange={handleDate} />
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="dateFormat"
                        >
                        <Form.Label>Provide the date format</Form.Label>
                        <Form.Control type="text" onChange={handleDateFormat} />
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="targetColumn"
                        >
                        <Form.Label>Provide the target column</Form.Label>
                        <Form.Control type="text" onChange={handleTarget} />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleTrainClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleTrainAPI}>
                        Train
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Row style={{marginTop:"40px"}}>
                    <Col xs={4}>
                    <div>{display && <h6 style={{color:"purple"}}>The dataset is trained successfully</h6>}</div>
                    </Col>
                </Row>
            </Row>
            <Row style={{marginTop:"90px"}}>
            <Button variant="success" style={{width:'50%',background:'#52ab98'}} onClick={handlePredict}>Predict</Button>
            <Modal show={showPredict} onHide={handlePredictClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Prediction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="startDate">
                        <Form.Label>Provide the start date</Form.Label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="dateColumn"
                        >
                        <Form.Label>Provide the end date</Form.Label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}/>
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="productId"
                        >
                        <Form.Label>Provide the product ID</Form.Label>
                        <Form.Control type="text" onChange={handleProductId} />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handlePredictClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePredictAPI}>
                        Predict
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
            <Row style={{marginTop:"90px"}}>
      { Object.keys(chartData).length != 0 && <Chart type='line' data={chartData} />}
            </Row>
    </Container>
    </> );
}

export default Prediction;
