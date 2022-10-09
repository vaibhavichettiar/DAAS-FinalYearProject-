import { UPLOAD_DATASET } from "../constants/userConstants";

const initialState = {
}

export const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_DATASET:
        return state;
        default:
      return state;
  }
};