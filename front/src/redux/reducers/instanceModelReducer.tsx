// reducers/modelReducer.js

import {
  UPDATE_MODEL,
  UPDATE_CLASS,
  UPDATE_ATTRIBUTE,
  UPDATE_OPERATION,
  UPDATE_REFERENCE,
} from "../actions/instanceModelActions";

// Load the model from localStorage if available
const storedModel = JSON.parse(localStorage.getItem("instanceModel")!) || {
  name: "",
  type: "instance",
  ePackages: [],
};

const initialState = {
  model: storedModel,
};

const modelReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_MODEL:
      const updatedModel = action.payload;
      // Save the entire model to localStorage
      localStorage.setItem("instanceModel", JSON.stringify(updatedModel));
      return { ...state, model: updatedModel };

    case UPDATE_CLASS:
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
        "instanceModel",
        JSON.stringify(updatedModelWithClass)
      );
      return { ...state, model: updatedModelWithClass };

    case UPDATE_ATTRIBUTE:
      // use the nodeId to find the class and use the attribute id to update an existing attribute or add a new one
      const classWithUpdatedAttributes =
        state.model.ePackages[0].eClassifiers.map((cls: any) => {
          if (cls.id === action.payload.nodeId) {
            const updatedAttributes = cls.eAttributes.map((attr: any) =>
              attr.id === action.payload.attribute.id
                ? action.payload.attribute
                : attr
            );
            const attributeExists = cls.eAttributes.some(
              (attr: any) => attr.id === action.payload.attribute.id
            );
            return {
              ...cls,
              eAttributes: attributeExists
                ? updatedAttributes
                : [...cls.eAttributes, action.payload.attribute],
            };
          }
          return cls;
        });

      const updatedModelWithAttributes = {
        ...state.model,
        ePackages: [
          {
            ...state.model.ePackages[0],
            eClassifiers: classWithUpdatedAttributes,
          },
        ],
      };

      localStorage.setItem(
        "instanceModel",
        JSON.stringify(updatedModelWithAttributes)
      );
      return { ...state, model: updatedModelWithAttributes };

    case UPDATE_OPERATION:
      const classWithUpdatedOperation =
        state.model.ePackages[0].eClassifiers.map((cls: any) => {
          if (cls.name === action.payload.className) {
            return {
              ...cls,
              eOperations: [...cls.eOperations, action.payload.operation],
            };
          }
          return cls;
        });
      const updatedModelWithOperation = {
        ...state.model,
        ePackages: [
          {
            ...state.model.ePackages[0],
            eClassifiers: classWithUpdatedOperation,
          },
        ],
      };
      localStorage.setItem(
        "instanceModel",
        JSON.stringify(updatedModelWithOperation)
      );
      return { ...state, model: updatedModelWithOperation };

    case UPDATE_REFERENCE:
      const classWithUpdatedReference =
        state.model.ePackages[0].eClassifiers.map((cls: any) => {
          if (cls.name === action.payload.className) {
            return {
              ...cls,
              eReferences: [...cls.eReferences, action.payload.reference],
            };
          }
          return cls;
        });
      const updatedModelWithReference = {
        ...state.model,
        ePackages: [
          {
            ...state.model.ePackages[0],
            eClassifiers: classWithUpdatedReference,
          },
        ],
      };
      localStorage.setItem(
        "instanceModel",
        JSON.stringify(updatedModelWithReference)
      );
      return { ...state, model: updatedModelWithReference };

    default:
      return state;
  }
};

export default modelReducer;
