import React, { useEffect, useState } from "react";
import "./style-content.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
  } from 'cdbreact';
import Display from "../Display/display";
import { useSelector } from "react-redux";

export function Content() {
    const [clickedLink, setclickedLink] = useState({upload: true, tables: false, profile: false, analytics: false, prediction: false});

    let {userid} = useSelector(state => state.lg.userRes);

    const [hover, setHover] = useState(false)

    const sectionStyle = {
      background: hover ? '#c8d8e4' : '#2b6777',
      // padding: hover ? Metrics.spacing.inside : undefined,
    };

    const handleUpload = () => {
        let copyObj = {...clickedLink}
        copyObj.upload = true;
        copyObj.tables = false;
        copyObj.profile = false;
        copyObj.analytics = false;
        copyObj.prediction = false;
        setclickedLink(copyObj);
    }

    const handleTable = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = true;
      copyObj.profile = false;
      copyObj.analytics = false;
      copyObj.prediction = false;
      setclickedLink(copyObj);
    }

    const handleProfile = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = false;
      copyObj.profile = true;
      copyObj.analytics = false;
      copyObj.prediction = false;
      setclickedLink(copyObj);
    }

    const handleAnalytics = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = false;
      copyObj.profile = false;
      copyObj.analytics = true;
      copyObj.prediction = false;
      setclickedLink(copyObj);
    }

    const handlePrediction = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = false;
      copyObj.profile = false;
      copyObj.analytics = false;
      copyObj.prediction = true;
      setclickedLink(copyObj);
    }



    return ( 
        <Container>
      <Row>
        <Col xs={3}>
    <div className="sidebarDiv">
      <CDBSidebar textColor="#fff" className="sidebar" backgroundColor="#2b6777"  color="#2b6777">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <p style={{  color: "white" }}>
            Menu
          </p>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <button onClick={handleUpload} style={sectionStyle} className="sideBarMenuItem" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
              <CDBSidebarMenuItem icon="columns">Upload Dataset</CDBSidebarMenuItem>
            </button>
            <button onClick={handleTable} className="sideBarMenuItem">
              <CDBSidebarMenuItem icon="table">Tabular View</CDBSidebarMenuItem>
            </button>
            <button onClick={handleProfile} className="sideBarMenuItem">
              <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
            </button>
            <button onClick={handleAnalytics} className="sideBarMenuItem">
              <CDBSidebarMenuItem icon="chart-line">Analytics</CDBSidebarMenuItem>
            </button>
            <button onClick={handlePrediction} className="sideBarMenuItem">
              <CDBSidebarMenuItem icon="book">Prediction</CDBSidebarMenuItem>
            </button>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
        </Col>
        <Col xs={9}>
            { clickedLink.upload == true && <Display data={clickedLink}/>}
            { clickedLink.tables == true && <Display data={clickedLink}/>}
            { clickedLink.profile == true && <Display data={clickedLink}/>}
            { clickedLink.analytics == true && <Display data={clickedLink}/>}
            { clickedLink.prediction == true && <Display data={clickedLink}/>}
            </Col>
      </Row>
    </Container>
    )
}