import { UPLOAD_DATASET, USER_DETAILS, TABLE_DATA, SELECTED_DATA } from "../constants/userConstants";

const initialState = {
  userDetails: {},
  tableData: {},
  selectedDataset: {}
}

export const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_DATASET:
        return state;

      case USER_DETAILS:
        return {
          ...state,
          userDetails: action.payload
        }

      case TABLE_DATA:
        return {
          ...state,
          tableData: action.payload
        }
      
      case SELECTED_DATA:
        return {
          ...state,
          selectedDataset: action.payload
        }

      default:
        return state;
  }
};