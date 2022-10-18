import { USER_LOGIN } from "../constants/userConstants";

const initialState = {
    isAuth: false,
    userRes: {}
}

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
      case USER_LOGIN:
        return {
          ...state,
          isAuth: true,
          userRes: action.payload
        };
        default:
      return state;
  }
};