import { USER_LOGIN, USER_LOGOUT } from "../constants/userConstants";

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
      case USER_LOGOUT:
        return {
          ...state,
          isAuth: false
        }
      default:
        return state;
  }
};