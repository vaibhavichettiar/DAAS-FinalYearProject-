import { REGISTER_LOGIN } from "../constants/userConstants";

import Axios from 'axios';

export const userRegister = (data) => (dispatch) =>{
    Axios.post("http://localhost:5001/api/register", data)
    .then((response) => {
        dispatch({
            type: REGISTER_LOGIN,
            payload: response.data
        })
    })
}