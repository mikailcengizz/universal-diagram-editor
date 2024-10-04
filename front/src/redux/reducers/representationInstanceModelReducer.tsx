import {
  UPDATE_REPRESENTATION_INSTANCE_MODEL,
  UPDATE_REPRESENTATION_INSTANCE_OBJECT,
} from "../actions/representationInstanceModelActions";

// Load the model from localStorage if available
const storedRepresentationInstanceModel = JSON.parse(
  localStorage.getItem("representationInstanceModel")!
) || {
  name: "",
  type: "representation-instance",
  ePackages: [],
};

const initialState = {
  model: storedRepresentationInstanceModel,
};

const representationInstanceModelReducer = (
  state = initialState,
  action: any
) => {
  switch (action.type) {
    case UPDATE_REPRESENTATION_INSTANCE_MODEL:
      const updatedModel = action.payload;
      // Save the entire model to localStorage
      localStorage.setItem(
        "representationInstanceModel",
        JSON.stringify(updatedModel)
      );
      return { ...state, model: updatedModel };

    case UPDATE_REPRESENTATION_INSTANCE_OBJECT:
      const updatedClasses = state.model.ePackages[0].eClassifiers.map(
        (cls: any) => (cls.name === action.payload.name ? action.payload : cls)
      );
      const updatedModelWithClass = {
        ...state.model,
        ePackages: [
          { ...state.model.ePackages[0], eClassifiers: updatedClasses },
        ],
      };
      localStorage.setItem(
        "representationInstanceModel",
        JSON.stringify(updatedModelWithClass)
      );
      return { ...state, model: updatedModelWithClass };

    default:
      return state;
  }
};

export default representationInstanceModelReducer;
