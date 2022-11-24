import { USER_LOGIN } from "../constants/userConstants";

import Axios from 'axios';
import { ipAddress } from "../../config";

export const userLogin = (data) => (dispatch) =>{
    Axios.post(ipAddress+"/api/login", data)
    .then((response) => {
        dispatch({
            type: USER_LOGIN,
            payload: response.data
        })
    })
}