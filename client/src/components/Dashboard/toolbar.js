import React, { useState } from "react";
import "./style-toolbar.css";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


export function Toolbar() {
    return (
        <div className="toolbar">
            <div style={{textAlign:"center"}}>
                <h3 style={{fontWeight:'bold'}}>DAAS</h3>
                <DropdownButton id="dropdown-item-button" title="Select the dataset" variant="secondary" menuVariant="dark">
                    <Dropdown.Item as="button">dataset1</Dropdown.Item>
                    <Dropdown.Item as="button">dataset2</Dropdown.Item>
                    <Dropdown.Item as="button">dataset3</Dropdown.Item>
                </DropdownButton>
                < hr/>
            </div>
        </div>
    )
}