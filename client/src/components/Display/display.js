import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DataUpload from './Upload/dataUpload';
import Tables from './Tables/tables';
import Profile from './Profile/profile';
import Analytics from './Analytics/analytics';
import Prediction from './Prediction/prediction';

function Display(props) {
    console.log("props : ", props);
    return (
        <Container>
            <Row>
                <Col xs={12}> 
                 {props.data.upload == true && <DataUpload />}
                 {props.data.tables == true && <Tables />}
                 {props.data.profile == true && <Profile />}
                 {props.data.analytics == true && <Analytics />}
                 {props.data.prediction == true && <Prediction />}
                 </Col>
            </Row>
        </Container>
        );
}

export default Display;