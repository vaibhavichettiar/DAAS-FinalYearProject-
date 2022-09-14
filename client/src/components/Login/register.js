import React from "react";
import loginImg from "../../login.svg"

export function Register()
    {
        return (
        <div className="base-container">
            <div className="header">REGISTER</div>
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
                        <label htmlFor="email">Email</label>
                        <label type="text" name = "email" placeholder="email"/>
                        <input type="text" name="email" placeholder="email"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <label type="text" name = "password" placeholder="password"/>
                        <input type="text" name="password" placeholder="password"></input>

                    </div>
                    
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn">Register</button>
            </div>
        </div>
        );
    }