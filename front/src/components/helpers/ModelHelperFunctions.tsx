import { useDispatch } from "react-redux";
import { updateRepresentationInstanceModel } from "../../redux/actions/representationInstanceModelActions";
import {
  Class,
  InstanceModel,
  InstanceObject,
  MetaModel,
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
    console.log("instanceObject", instanceObject);
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
  static findClassFromInstanceObjectMetaModel(
    instanceObject: InstanceObject,
    metaModel: MetaModel
  ): Class | null {
    const classRef = instanceObject.type.$ref;
    const [modelUri, jsonPointer] = classRef.split("#");

    // Ensure we're dealing with the correct model URI
    if (modelUri !== metaModel.package.uri) {
      //console.error("Model URI does not match the selected meta model");
      return null;
    }

    const classObject: Class = ReferenceHelper.resolveRef(
      metaModel.package,
      jsonPointer
    )!;

    return classObject;
  }
  static removeEdgesWithNode(
    instanceModel: InstanceModel,
    representationInstanceModel: RepresentationInstanceModel,
    nodeName: string,
    nodeIndexInstanceObjectRemoved: number,
    dispatch: any
  ): {
    updatedInstanceModel: InstanceModel;
    updatedRepresentationInstanceModel: RepresentationInstanceModel;
  } {
    // Create a copy of representationInstanceModel to ensure immutability
    let updatedRepresentationInstanceModel: RepresentationInstanceModel = {
      package: {
        ...representationInstanceModel.package,
        objects: [...representationInstanceModel.package.objects],
      },
    };

    const updatedInstanceModel: InstanceModel = {
      package: {
        ...instanceModel.package,
        objects: instanceModel.package.objects
          .map((element) => {
            const representationInstance =
              this.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
                element,
                representationInstanceModel
              );
            // check all edge instances
            if (representationInstance?.type === "ClassEdge") {
              // if the edge is referencing the node, remove it
              const sourceRef = element.links.find(
                (link) => link.name === "source"
              )?.target.$ref;
              const sourceIndexObject =
                +sourceRef?.match(/\/objects\/(\d+)/)![1]!; // gets the #/objects/1 part and extracts the 1

              const targetRef = element.links.find(
                (link) => link.name === "target"
              )?.target.$ref;
              const targetIndexObject =
                +targetRef?.match(/\/objects\/(\d+)/)![1]!;

              console.log("sourceIndexObject", sourceIndexObject);
              console.log("targetIndexObject", targetIndexObject);
              console.log("nodeIndex", nodeIndexInstanceObjectRemoved);

              if (
                sourceIndexObject === nodeIndexInstanceObjectRemoved ||
                targetIndexObject === nodeIndexInstanceObjectRemoved
              ) {
                // remove the edge's representation from the representation instance model
                updatedRepresentationInstanceModel = {
                  ...updatedRepresentationInstanceModel,
                  package: {
                    ...updatedRepresentationInstanceModel.package,
                    objects:
                      updatedRepresentationInstanceModel.package.objects.filter(
                        (obj) => obj.name !== element.name
                      ),
                  },
                };
                return null;
              }
            }
            return element;
          })
          .filter((element): element is InstanceObject => element !== null),
      },
    };

    // Normalize the instance model representation refs indexes
    updatedInstanceModel.package.objects.forEach((obj, index) => {
      let newRef = obj.representation?.$ref;
      if (newRef) {
        newRef = newRef.replace(`/objects/${index + 1}`, `/objects/${index}`);
        obj.representation!.$ref = newRef;
      }
    });

    return { updatedInstanceModel, updatedRepresentationInstanceModel };
  }
}

export default ModelHelperFunctions;
