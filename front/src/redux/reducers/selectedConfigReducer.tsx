import { UPDATE_SELECTED_CONFIG } from "../actions/selectedConfigActions";

// Load the model from localStorage if available
const storedSelectedConfig = localStorage.getItem("selectedConfig") || null;
const initialState = storedSelectedConfig;

const selectedConfigReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_SELECTED_CONFIG:
      localStorage.setItem("selectedConfig", action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default selectedConfigReducer;
