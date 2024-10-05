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

const storedInstanceModel: InstanceModel =
  JSON.parse(localStorage.getItem("instanceModel")!) ||
  fallbackMetaInstanceModel;

localStorage.setItem("instanceModel", JSON.stringify(storedInstanceModel));

const initialState = {
  model: storedInstanceModel,
};

const metaInstanceModelReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_INSTANCE_MODEL:
      const updatedModel = action.payload;
      // Save the entire model to localStorage
      localStorage.setItem("instanceModel", JSON.stringify(updatedModel));
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
        "instanceModel",
        JSON.stringify(updatedModelWithObject)
      );
      return { ...state, model: updatedModelWithObject };

    default:
      return state;
  }
};

export default metaInstanceModelReducer;
