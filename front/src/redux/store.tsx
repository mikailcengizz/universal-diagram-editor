import { createStore, combineReducers } from "redux";
import instanceModelReducer from "./reducers/instanceModelReducer";
import representationInstanceModelStore from "./reducers/representationInstanceModelReducer";
import selectedConfigReducer from "./reducers/selectedConfigReducer";

const rootReducer = combineReducers({
  instanceModelStore: instanceModelReducer,
  representationInstanceModelStore: representationInstanceModelStore,
  selectedConfigStore: selectedConfigReducer,
});

const store = createStore(rootReducer);

export default store;
