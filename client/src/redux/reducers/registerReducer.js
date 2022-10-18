import { REGISTER_LOGIN } from "../constants/userConstants";

const initialState = {
    isRegistered: false
}

export const registerReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_LOGIN:
        return {
          ...state,
          isRegistered: true
        };
        default:
      return state;
  }
};