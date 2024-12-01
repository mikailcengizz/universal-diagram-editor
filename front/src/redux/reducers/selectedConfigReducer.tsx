import { UPDATE_SELECTED_META_MODEL } from "../actions/selectedConfigActions";

// load model from localStorage if available
const storedSelectedConfig = localStorage.getItem("selectedConfig") || null;
const initialState = storedSelectedConfig;

const selectedConfigReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_SELECTED_META_MODEL:
      localStorage.setItem("selectedMetaModel", action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default selectedConfigReducer;
