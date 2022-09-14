import { USER_LOGIN } from "../constants/userConstants";

const initialState = {
    isAuth: false
}

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_LOGIN:
        return {
          ...state,
          isAuth: true
        };
        default:
      return state;
  }
};