import React from "react";
import { Link } from "react-router-dom";

import loginImg from "../../login.svg";

export function Login()
{
        return (
        <div className="base-container">
            <div className="header">LOGIN</div>
            <div className="content">
                <div className="image">
                    <img src={loginImg}/>
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <label type="text" name = "username" placeholder="username"/>
                        <input type="text" name="username" placeholder="username"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <label type="text" name = "password" placeholder="password"/>
                        <input type="text" name ="password" placeholder="password"/>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn">Login</button>
            </div>
            <div className="footer">
                <Link to="/register" className="btn">New User? Register Here</Link>
            </div>
        </div>
        );
}
