import React, { useState } from "react";
import { userRegister } from "../../redux/actions/RegisterAction";
import { useDispatch, useSelector } from "react-redux";
import loginImg from "../../login.svg"

export function Register()
    {
    const dispatch = useDispatch();
    let {isAuth} = useSelector(state => state.login);
    const [username, setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    const handleUsername = (e) => {
        setUsername(e.target.value);
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)

    }
    const handleSubmit = async (e) => {
        console.log(username,password,email);
        const data = {
            username: username,
            email:email,
            password: password
        }
        await dispatch(userRegister(data));
    }
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
                        <input type="text" name="username" placeholder="username" onChange={handleUsername}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <label type="text" name = "email" placeholder="email"/>
                        <input type="text" name="email" placeholder="email" onChange={handleEmail}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <label type="text" name = "password" placeholder="password"/>
                        <input type="password" name="password" placeholder="password" onChange={handlePassword}></input>

                    </div>
                    
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn" onClick={handleSubmit}>Register</button>
            </div>
        </div>
        );
    }