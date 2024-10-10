import {
  Class,
  InstanceObject,
  Representation,
  RepresentationInstanceModel,
  RepresentationInstanceObject,
  RepresentationMetaModel,
} from "../../types/types";
import ReferenceHelper from "./ReferenceHelper";

class ModelHelperFunctions {
  static findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
    instanceObject: InstanceObject,
    representationInstanceModel: RepresentationInstanceModel
  ): RepresentationInstanceObject | null {
    const representationRef = instanceObject.representation?.$ref!;

    if (!representationRef) {
      console.error(
        "No representation found for instance object",
        instanceObject
      );
      return null;
    }

    const [modelUri, jsonPointer] = representationRef.split("#");

    // Ensure we're dealing with the correct model URI
    if (modelUri !== representationInstanceModel.package.uri) {
      //console.error("Model URI does not match the selected meta model");
      return null;
    }

    const representationInstanceObject: RepresentationInstanceObject =
      ReferenceHelper.resolveRef(
        representationInstanceModel.package,
        jsonPointer
      )!;

    return representationInstanceObject;
  }
  static findRepresentationFromClassInRepresentationMetaModel(
    notationElement: Class,
    representationMetaModel: RepresentationMetaModel
  ): Representation | null {
    const metaRepresentationRef = notationElement.representation?.$ref!;

    if (!metaRepresentationRef) {
      console.error("No representation found for class", notationElement);
      return null;
    }

    const [modelUri, jsonPointer] = metaRepresentationRef.split("#");

    // Ensure we're dealing with the correct model URI
    if (modelUri !== representationMetaModel.package.uri) {
      /* console.error("Model URI does not match the selected meta model");
      console.error("Model URI:", modelUri);
      console.error(
        "Selected meta model URI:",
        representationMetaModel.package.uri
      ); */
      return null;
    }

    const notationElementRepresentation: Representation =
      ReferenceHelper.resolveRef(representationMetaModel.package, jsonPointer)!;

    return notationElementRepresentation;
  }
  static findRepresentationInstanceFromInstanceObjectInLocalStorage(
    instanceObject: InstanceObject
  ): RepresentationInstanceObject | null {
    const representationRef = instanceObject.representation?.$ref!;
    const [modelUri, jsonPointer] = representationRef.split("#");
    const representationInstanceModelJSON = localStorage.getItem(
      "representationInstanceModel"
    );
    if (!representationInstanceModelJSON) {
      console.error("Representation instance model not found in localStorage");
      return null;
    }

    const representationInstanceModel: RepresentationInstanceModel = JSON.parse(
      representationInstanceModelJSON
    );

    // Ensure we're dealing with the correct model URI
    if (modelUri !== representationInstanceModel.package.uri) {
      //console.error("Model URI does not match the selected meta model");
      return null;
    }

    const representationInstanceObject: RepresentationInstanceObject =
      ReferenceHelper.resolveRef(
        representationInstanceModel.package,
        jsonPointer
      )!;

    return representationInstanceObject;
  }
}

export default ModelHelperFunctions;
