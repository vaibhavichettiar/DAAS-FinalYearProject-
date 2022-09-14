import { REGISTER_LOGIN } from "../constants/userConstants";

const initialState = {
    isAuth: false
}

export const registerReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_LOGIN:
        return {
          ...state,
        };
        default:
      return state;
  }
};