// redux/store.js
import { createStore, combineReducers } from "redux";
import metaInstanceModelReducer from "./reducers/metaInstanceModelReducer";
import representationInstanceModelReducer from "./reducers/representationInstanceModelReducer";
import selectedConfigReducer from "./reducers/selectedConfigReducer";

const rootReducer = combineReducers({
  metaInstanceModelStore: metaInstanceModelReducer,
  representationInstanceModelStore: representationInstanceModelReducer,
  selectedConfigStore: selectedConfigReducer,
});

const store = createStore(rootReducer);

export default store;
