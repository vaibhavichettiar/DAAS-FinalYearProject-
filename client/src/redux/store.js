import { applyMiddleware, combineReducers, createStore, compose } from "redux";
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
  export const store = createStore(
    appReducer,
    initialState,
    createComposer(applyMiddleware(thunk))
  );
  