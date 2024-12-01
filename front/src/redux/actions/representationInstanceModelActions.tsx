import {
  RepresentationInstanceModel,
  RepresentationInstanceObject,
} from "../../types/types";

export const UPDATE_REPRESENTATION_INSTANCE_MODEL =
  "UPDATE_REPRESENTATION_INSTANCE_MODEL";
export const UPDATE_REPRESENTATION_INSTANCE_OBJECT =
  "UPDATE_REPRESENTATION_INSTANCE_OBJECT";

// action to update the whole model
export const updateRepresentationInstanceModel = (
  model: RepresentationInstanceModel
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_MODEL,
  payload: model,
});

// action to update a object
export const updateRepresentationInstanceObject = (
  classData: RepresentationInstanceObject
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_OBJECT,
  payload: classData,
});
