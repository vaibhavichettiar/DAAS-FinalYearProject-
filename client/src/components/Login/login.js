import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import loginImg from "../../login.svg";
import { userLogin } from "../../redux/actions/loginAction";
import { useDispatch, useSelector } from "react-redux";



export function Login()
{
    const navigate = useNavigate();
    let {isAuth} = useSelector(state => state.lg);
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)

    }
    const handleSubmit = async (e) => {
        const data = {
            username: username,
            password: password
        }
        await dispatch(userLogin(data));
    }
        return (
        <div className="base-container">
            {isAuth == true && navigate('/dashboard') }
            <div className="header">LOGIN</div>
            <div className="content">
                <div className="image">
                    <img src={loginImg}/>
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <label type="text" name = "username" placeholder="username"/>
                        <input type="text" name="username" placeholder="username" onChange={handleUsername} ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <label type="text" name = "password" placeholder="password"/>
                        <input type="password" name ="password" placeholder="password" onChange={handlePassword} />
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn" onClick={handleSubmit} >Login</button>
            </div>
            <div className="footer">
                <Link to="/register" className="btn">New User? Register Here</Link>
            </div>
        </div>
        );
}
