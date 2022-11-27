import React from "react";
import { Content } from "./content";
import { Toolbar } from "./toolbar";

function Dashboard() {
    return (
        <div className="dashboard">
            <Toolbar></Toolbar>
            <div className="mainPage">
                <Content></Content>
            </div>
        </div>
    )
}

export default Dashboard;