import {} from "../../types/types";

export const UPDATE_REPRESENTATION_INSTANCE_MODEL =
  "UPDATE_REPRESENTATION_INSTANCE_MODEL";
export const UPDATE_REPRESENTATION_INSTANCE_CLASS =
  "UPDATE_REPRESENTATION_INSTANCE_CLASS";
export const UPDATE_REPRESENTATION_INSTANCE_ATTRIBUTE =
  "UPDATE_REPRESENTATION_INSTANCE_ATTRIBUTE";
export const UPDATE_REPRESENTATION_INSTANCE_OPERATION =
  "UPDATE_REPRESENTATION_INSTANCE_OPERATION";
export const UPDATE_REPRESENTATION_INSTANCE_REFERENCE =
  "UPDATE_REPRESENTATION_INSTANCE_REFERENCE";

// Action to update the whole model
export const updateRepresentationInstanceModel = (
  model: RepresentationInstanceModelFile
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_MODEL,
  payload: model,
});

// Action to update a class
export const updateRepresentationInstanceClass = (
  classData: EClassRepresentationInstance
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_CLASS,
  payload: classData,
});

// Action to update attributes
export const updateRepresentationInstanceAttribute = (
  nodeId: string,
  attribute: EAttributeRepresentationInstance
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_ATTRIBUTE,
  payload: {
    nodeId,
    attribute,
  },
});

// Action to update an operation
export const updateRepresentationInstanceOperation = (
  classifierName: string,
  operation: EOperationRepresentationInstance
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_OPERATION,
  payload: { classifierName, operation },
});

// Action to update a reference
export const updateRepresentationInstanceReference = (
  classifierName: string,
  reference: EReferenceRepresentationInstance
) => ({
  type: UPDATE_REPRESENTATION_INSTANCE_REFERENCE,
  payload: { classifierName, reference },
});
