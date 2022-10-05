import React, { useState } from "react";
import "./style-content.scss";
import ListGroup from 'react-bootstrap/ListGroup';


export function Content() {
    const [isUploadShown,setIsUploadShown] = useState(false);
    const [isAnalyseShown,setIsAnalyseShown] = useState(false);


    const showUpload = event => {
        console.log("event:",event)
        setIsAnalyseShown(current => false)
        setIsUploadShown(cur => true)
    }

    const showAnalyse = event => {
        console.log("event:",event)
        setIsUploadShown(current => false)
        setIsAnalyseShown(current => true)
    }

    return ( 
        <div className="content">
            <ListGroup className="sidebar">
                <ListGroup.Item onClick={showUpload}>Upload dData</ListGroup.Item>
                <ListGroup.Item onClick={showAnalyse}>Analyse</ListGroup.Item>
                <ListGroup.Item>Soemthign</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            </ListGroup>
            <div className="information">
                {isUploadShown && (<div> 
                    Upload shown
                </div>)}
                {isAnalyseShown && (<div> analyse shown lol</div>)}
            </div>
            
        </div>
    )
}