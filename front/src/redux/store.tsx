// redux/store.js
import { createStore, combineReducers } from "redux";
import instanceModelReducer from "./reducers/instanceModelReducer";

const rootReducer = combineReducers({
  instanceModelStore: instanceModelReducer,
});

const store = createStore(rootReducer);

export default store;
