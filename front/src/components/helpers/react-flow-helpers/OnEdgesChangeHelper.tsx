import { Edge } from "@xyflow/react";
import {
  DiagramNodeData,
  InstanceModel,
  RepresentationInstanceModel,
} from "../../../types/types";
import { updateInstanceModel } from "../../../redux/actions/objectInstanceModelActions";
import { updateRepresentationInstanceModel } from "../../../redux/actions/representationInstanceModelActions";

class OnEdgesChangeHelper {
  static removeEdge = (
    edges: Edge[],
    change: any,
    instanceModel: InstanceModel,
    representationInstanceModel: RepresentationInstanceModel,
    dispatch: any
  ) => {
    if (change.type === "remove" && "id" in change) {
      const removedEdge = edges.find((edge) => edge.id === change.id);

      if (!removedEdge) {
        console.error("Node not found in nodes:", change.id);
        return;
      }

      const removedEdgeData = removedEdge?.data as DiagramNodeData;
      const edgeName = removedEdgeData.instanceObject!.name;

      const instanceObjectRemoved = instanceModel.package.objects.find(
        (obj) => obj.name === edgeName
      );

      if (instanceObjectRemoved) {
        // remove the edge from the instance model
        const updatedInstanceModel = {
          ...instanceModel,
          package: {
            ...instanceModel.package,
            objects: instanceModel.package.objects.filter(
              (obj) => obj.name !== edgeName
            ),
          },
        };

        // normalize the instance model representation refs indexes
        updatedInstanceModel.package.objects.forEach((obj, index) => {
          let newRef = obj.representation?.$ref;
          if (newRef) {
            newRef = newRef.replace(
              `/objects/${index + 1}`,
              `/objects/${index}`
            );
            obj.representation!.$ref = newRef;
          }
        });

        dispatch(updateInstanceModel(updatedInstanceModel));
      } else {
        console.error(
          "Classifier not found in representation model for ID: ",
          change.id
        );
      }

      // remove the node from the representation instance model
      const removedNodeRepresentation =
        representationInstanceModel.package.objects.find(
          (obj) => obj.name === edgeName
        );

      if (removedNodeRepresentation) {
        const updatedRepresentationInstanceModel = {
          ...representationInstanceModel,
          package: {
            ...representationInstanceModel.package,
            objects: representationInstanceModel.package.objects.filter(
              (obj) => obj.name !== edgeName
            ),
          },
        };

        dispatch(
          updateRepresentationInstanceModel(updatedRepresentationInstanceModel)
        );
      } else {
        console.error(
          "Classifier not found in representation model for ID: ",
          change.id
        );
      }
    }
  };
}

export default OnEdgesChangeHelper;
