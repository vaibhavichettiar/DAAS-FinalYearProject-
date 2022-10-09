import React, { useState } from "react";
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

export function Content() {
    const [clickedLink, setclickedLink] = useState({upload: true, tables: false, profile: false, analytics: false});

    const handleUpload = () => {
        let copyObj = {...clickedLink}
        copyObj.upload = true;
        copyObj.tables = false;
        copyObj.profile = false;
        copyObj.analytics = false;
        setclickedLink(copyObj);
    }

    const handleTable = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = true;
      copyObj.profile = false;
      copyObj.analytics = false;
      setclickedLink(copyObj);
    }

    const handleProfile = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = false;
      copyObj.profile = true;
      copyObj.analytics = false;
      setclickedLink(copyObj);
    }

    const handleAnalytics = () => {
      let copyObj = {...clickedLink}
      copyObj.upload = false;
      copyObj.tables = false;
      copyObj.profile = false;
      copyObj.analytics = true;
      setclickedLink(copyObj);
    }

    return ( 
        <Container>
      <Row>
        <Col xs={3}>
        <div style={{ display: 'flex', height: '80vh', overflow: 'scroll initial', paddingBottom:'20px' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <p style={{ color: 'inherit' }}>
            Menu
          </p>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <button onClick={handleUpload} style={{color:"white", backgroundColor:"#333", border:"none"}}>
              <CDBSidebarMenuItem icon="columns">Upload Dataset</CDBSidebarMenuItem>
            </button>
            <button onClick={handleTable} style={{color:"white", backgroundColor:"#333", border:"none"}}>
              <CDBSidebarMenuItem icon="table">Tabular View</CDBSidebarMenuItem>
            </button>
            <button onClick={handleProfile} style={{color:"white", backgroundColor:"#333", border:"none"}}>
              <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
            </button>
            <button onClick={handleAnalytics} style={{color:"white", backgroundColor:"#333", border:"none"}}>
              <CDBSidebarMenuItem icon="chart-line">Analytics</CDBSidebarMenuItem>
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
            </Col>
      </Row>
    </Container>
    )
}