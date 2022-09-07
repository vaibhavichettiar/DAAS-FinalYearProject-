import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunk from "redux-thunk";

const appReducer = combineReducers({});

const initialState = {
  };
  const createComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  export const store = createStore(
    appReducer,
    initialState,
    createComposer(applyMiddleware(thunk))
  );
  