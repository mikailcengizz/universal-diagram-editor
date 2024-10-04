import { InstanceModel } from "../../types/types";
import {
  UPDATE_INSTANCE_MODEL,
  UPDATE_INSTANCE_OBJECT,
} from "../actions/objectInstanceModelActions";

// Load the model from localStorage if available
const fallbackMetaInstanceModel: InstanceModel = {
  package: {
    uri: "",
    objects: [],
  },
};

const storedMetaInstanceModel: InstanceModel =
  JSON.parse(localStorage.getItem("metaInstanceModel")!) ||
  fallbackMetaInstanceModel;

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
      const updatedObjects = state.model.package.objects.map((cls: any) =>
        cls.name === action.payload.name ? action.payload : cls
      );
      const updatedModelWithObject: InstanceModel = {
        ...state.model,
        package: { ...state.model.package, objects: updatedObjects },
      };
      localStorage.setItem(
        "metaInstanceModel",
        JSON.stringify(updatedModelWithObject)
      );
      return { ...state, model: updatedModelWithObject };

    default:
      return state;
  }
};

export default metaInstanceModelReducer;
