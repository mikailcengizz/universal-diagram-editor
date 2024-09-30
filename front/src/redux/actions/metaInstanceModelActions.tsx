import {
  AttributeInstance,
  ClassifierInstance,
  Operation,
  Reference,
  MetaInstanceModelFile,
} from "../../types/types";

export const UPDATE_META_INSTANCE_MODEL = "UPDATE_META_INSTANCE_MODEL";
export const UPDATE_META_INSTANCE_CLASS = "UPDATE_META_INSTANCE_CLASS";
export const UPDATE_META_INSTANCE_ATTRIBUTE = "UPDATE_META_INSTANCE_ATTRIBUTE";
export const UPDATE_META_INSTANCE_OPERATION = "UPDATE_META_INSTANCE_OPERATION";
export const UPDATE_META_INSTANCE_REFERENCE = "UPDATE_META_INSTANCE_REFERENCE";

// Action to update the whole model
export const updateMetaInstanceModel = (model: MetaInstanceModelFile) => ({
  type: UPDATE_META_INSTANCE_MODEL,
  payload: model,
});

// Action to update a class
export const updateMetaInstanceClass = (classData: EClassInstance) => ({
  type: UPDATE_META_INSTANCE_CLASS,
  payload: classData,
});

// Action to update attributes
export const updateMetaInstanceAttribute = (
  nodeId: string,
  attribute: EAttributeInstance
) => ({
  type: UPDATE_META_INSTANCE_ATTRIBUTE,
  payload: {
    nodeId,
    attribute,
  },
});

// Action to update an operation
export const updateMetaInstanceOperation = (
  classifierName: string,
  operation: EOperation
) => ({
  type: UPDATE_META_INSTANCE_OPERATION,
  payload: { classifierName, operation },
});

// Action to update a reference
export const updateMetaInstanceReference = (
  classifierName: string,
  reference: EReference
) => ({
  type: UPDATE_META_INSTANCE_REFERENCE,
  payload: { classifierName, reference },
});
