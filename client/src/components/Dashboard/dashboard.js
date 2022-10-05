import React, { useState } from "react";
import { Content } from "./content";
import "./style.scss";
import { Toolbar } from "./toolbar";

export function Dashboard() {
    return (
        <div className="dashboard">
            <Toolbar></Toolbar>
            <div className="mainPage">
                
                <Content></Content>
            </div>
        </div>
    )
}