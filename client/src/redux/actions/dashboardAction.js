import { UPLOAD_DATASET } from "../constants/userConstants";

import Axios from 'axios';

export const uploadAction = (data) => (dispatch) =>{
    Axios.post("http://localhost:5001/api/fileUpload", data)
    .then((response) => {
        dispatch({
            type: UPLOAD_DATASET,
            payload: response.data
        })
    })
}