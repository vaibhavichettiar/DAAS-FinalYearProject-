import { USER_LOGIN } from "../constants/userConstants";

import Axios from 'axios';

export const userLogin = (data) => (dispatch) =>{
    Axios.post("http://localhost:5001/auth/login", data)
    .then((response) => {
        dispatch({
            type: USER_LOGIN,
            payload: response.data
        })
    })
}