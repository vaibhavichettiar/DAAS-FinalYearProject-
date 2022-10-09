import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { loginReducer } from "./reducers/loginReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";

const appReducer = combineReducers({
  login: loginReducer,
  dashboard: dashboardReducer
});

const initialState = {
  };
  const createComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  export const store = createStore(
    appReducer,
    initialState,
    createComposer(applyMiddleware(thunk))
  );
  