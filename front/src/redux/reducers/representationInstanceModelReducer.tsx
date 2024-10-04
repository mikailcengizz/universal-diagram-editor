import { RepresentationInstanceModel } from "../../types/types";
import {
  UPDATE_REPRESENTATION_INSTANCE_MODEL,
  UPDATE_REPRESENTATION_INSTANCE_OBJECT,
} from "../actions/representationInstanceModelActions";

const fallbackRepresentationInstanceModel: RepresentationInstanceModel = {
  package: {
    uri: "",
    objects: [],
  },
};

// Load the model from localStorage if available
const storedRepresentationInstanceModel: RepresentationInstanceModel =
  JSON.parse(localStorage.getItem("representationInstanceModel")!) ||
  fallbackRepresentationInstanceModel;

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
      const updatedObjects = state.model.package.objects.map((obj: any) =>
        obj.name === action.payload.name ? action.payload : obj
      );
      const updatedModelWithObject: RepresentationInstanceModel = {
        ...state.model,
        package: { ...state.model.package, objects: updatedObjects },
      };
      localStorage.setItem(
        "representationInstanceModel",
        JSON.stringify(updatedModelWithObject)
      );
      return { ...state, model: updatedModelWithObject };

    default:
      return state;
  }
};

export default representationInstanceModelReducer;
