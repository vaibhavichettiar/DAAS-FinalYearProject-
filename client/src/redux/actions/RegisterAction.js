import { REGISTER_LOGIN } from "../constants/userConstants";

import Axios from 'axios';
import { ipAddress } from "../../config";

export const userRegister = (data) => (dispatch) =>{
    Axios.post(ipAddress+"/api/register", data)
    .then((response) => {
        dispatch({
            type: REGISTER_LOGIN,
            payload: response.data
        })
    })
}