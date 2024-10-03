import { InstanceModel, InstanceObject } from "../../types/types";

export const UPDATE_INSTANCE_MODEL = "UPDATE_INSTANCE_MODEL";
export const UPDATE_INSTANCE_OBJECT = "UPDATE_INSTANCE_OBJECT";

// Action to update the whole model
export const updateInstanceModel = (model: InstanceModel) => ({
  type: UPDATE_INSTANCE_MODEL,
  payload: model,
});

// Action to update a class
export const updateInstanceObject = (classData: InstanceObject) => ({
  type: UPDATE_INSTANCE_OBJECT,
  payload: classData,
});