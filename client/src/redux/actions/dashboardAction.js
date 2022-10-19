import { UPLOAD_DATASET, USER_DETAILS, TABLE_DATA, SELECTED_DATA } from "../constants/userConstants";

import Axios from 'axios';
import { ipAddress } from "../../config";

export const uploadAction = (data) => (dispatch) =>{
    Axios.post(ipAddress+"/api/fileUpload", data)
    .then((response) => {
        dispatch({
            type: UPLOAD_DATASET,
            payload: response.data
        })
    })
}

export const getUserDetails = (data) => (dispatch) =>{
    Axios.get(ipAddress+"/api/userProfile", {
        params: data
    })
    .then((response) => {
        dispatch({
            type: USER_DETAILS,
            payload: response.data
        })
    })
}

export const getTableData = (data) => (dispatch) =>{
    Axios.get(ipAddress+"/api/tables", {
        params: data
    })
    .then((response) => {
        dispatch({
            type: TABLE_DATA,
            payload: response.data
        })
    })
}

export const getSelectedDataset = (data) => (dispatch) =>{
    dispatch({
        type: SELECTED_DATA,
        payload: data
    })
}