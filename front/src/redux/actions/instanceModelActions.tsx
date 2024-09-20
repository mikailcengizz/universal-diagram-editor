import {
  EAttribute,
  EAttributeInstance,
  EClass,
  EClassInstance,
  EOperation,
  EReference,
  InstanceModelFile,
} from "../../types/types";

// actions/instanceModelActions.js
export const UPDATE_MODEL = "UPDATE_MODEL";
export const UPDATE_CLASS = "UPDATE_CLASS";
export const UPDATE_ATTRIBUTE = "UPDATE_ATTRIBUTE";
export const UPDATE_OPERATION = "UPDATE_OPERATION";
export const UPDATE_REFERENCE = "UPDATE_REFERENCE";

// Action to update the whole model
export const updateModel = (model: InstanceModelFile) => ({
  type: UPDATE_MODEL,
  payload: model,
});

// Action to update a class
export const updateClass = (classData: EClassInstance) => ({
  type: UPDATE_CLASS,
  payload: classData,
});

// Action to update attributes
export const updateAttribute = (
  nodeId: string,
  attribute: EAttributeInstance
) => ({
  type: UPDATE_ATTRIBUTE,
  payload: {
    nodeId,
    attribute,
  },
});

// Action to update an operation
export const updateOperation = (
  classifierName: string,
  operation: EOperation
) => ({
  type: UPDATE_OPERATION,
  payload: { classifierName, operation },
});

// Action to update a reference
export const updateReference = (
  classifierName: string,
  reference: EReference
) => ({
  type: UPDATE_REFERENCE,
  payload: { classifierName, reference },
});
