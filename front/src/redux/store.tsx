// redux/store.js
import { createStore, combineReducers } from "redux";
import metaInstanceModelReducer from "./reducers/metaInstanceModelReducer";
import metaRepresentationInstanceModelStore from "./reducers/metaRepresentationInstanceModelReducer";
import selectedConfigReducer from "./reducers/selectedConfigReducer";

const rootReducer = combineReducers({
  metaInstanceModelStore: metaInstanceModelReducer,
  metaRepresentationInstanceModelStore: metaRepresentationInstanceModelStore,
  selectedConfigStore: selectedConfigReducer,
});

const store = createStore(rootReducer);

export default store;
