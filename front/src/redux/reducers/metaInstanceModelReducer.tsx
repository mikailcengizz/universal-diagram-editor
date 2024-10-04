import {
  UPDATE_INSTANCE_MODEL,
  UPDATE_INSTANCE_OBJECT,
} from "../actions/objectInstanceModelActions";

// Load the model from localStorage if available
const storedMetaInstanceModel = JSON.parse(
  localStorage.getItem("metaInstanceModel")!
) || {
  name: "",
  type: "meta-instance",
  ePackages: [],
};

const initialState = {
  model: storedMetaInstanceModel,
};

const metaInstanceModelReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_INSTANCE_MODEL:
      const updatedModel = action.payload;
      // Save the entire model to localStorage
      localStorage.setItem("metaInstanceModel", JSON.stringify(updatedModel));
      return { ...state, model: updatedModel };

    case UPDATE_INSTANCE_OBJECT:
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
        "metaInstanceModel",
        JSON.stringify(updatedModelWithClass)
      );
      return { ...state, model: updatedModelWithClass };

    default:
      return state;
  }
};

export default metaInstanceModelReducer;
