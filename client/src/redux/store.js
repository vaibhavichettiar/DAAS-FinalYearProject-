import { applyMiddleware, combineReducers, compose } from "redux";
import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { registerReducer } from "./reducers/registerReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";
import { loginReducer } from "./reducers/loginReducer";

const appReducer = combineReducers({
  lg: loginReducer,
  register: registerReducer,
  dashboard: dashboardReducer
});

const initialState = {
  };
  const createComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  export const store = configureStore(
    {reducer:appReducer},
    initialState,
    createComposer(applyMiddleware(thunk))
  );
  