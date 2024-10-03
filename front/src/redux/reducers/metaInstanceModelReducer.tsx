import {
  UPDATE_META_INSTANCE_MODEL,
  UPDATE_META_INSTANCE_CLASS,
  UPDATE_META_INSTANCE_ATTRIBUTE,
  UPDATE_META_INSTANCE_OPERATION,
  UPDATE_META_INSTANCE_REFERENCE,
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
    case UPDATE_META_INSTANCE_MODEL:
      const updatedModel = action.payload;
      // Save the entire model to localStorage
      localStorage.setItem("metaInstanceModel", JSON.stringify(updatedModel));
      return { ...state, model: updatedModel };

    case UPDATE_META_INSTANCE_CLASS:
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

    case UPDATE_META_INSTANCE_ATTRIBUTE:
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
        "metaInstanceModel",
        JSON.stringify(updatedModelWithAttributes)
      );
      return { ...state, model: updatedModelWithAttributes };

    case UPDATE_META_INSTANCE_OPERATION:
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
        "metaInstanceModel",
        JSON.stringify(updatedModelWithOperation)
      );
      return { ...state, model: updatedModelWithOperation };

    case UPDATE_META_INSTANCE_REFERENCE:
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
        "metaInstanceModel",
        JSON.stringify(updatedModelWithReference)
      );
      return { ...state, model: updatedModelWithReference };

    default:
      return state;
  }
};

export default metaInstanceModelReducer;
