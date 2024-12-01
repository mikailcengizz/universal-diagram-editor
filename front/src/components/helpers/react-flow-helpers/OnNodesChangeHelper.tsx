import { Node, NodeChange } from "@xyflow/react";
import {
  DiagramNodeData,
  InstanceModel,
  Position,
  RepresentationInstanceModel,
} from "../../../types/types";
import { updateInstanceModel } from "../../../redux/actions/objectInstanceModelActions";
import { updateRepresentationInstanceModel } from "../../../redux/actions/representationInstanceModelActions";
import ModelHelperFunctions from "../ModelHelperFunctions";

class OnNodesChangeHelper {
  static removeNode(
    nds: Node[],
    change: NodeChange<Node>,
    instanceModel: InstanceModel,
    representationInstanceModel: RepresentationInstanceModel,
    dispatch: any
  ) {
    if (change.type === "remove" && "id" in change) {
      // remove the node from the instance model
      const removedNode = nds.find((node) => node.id === change.id);

      if (!removedNode) {
        console.error("Node not found in nodes:", change.id);
        return;
      }

      const removedNodeData = removedNode?.data as DiagramNodeData;
      const nodeName = removedNodeData.instanceObject!.name;

      const instanceObjectRemoved = instanceModel.package.objects.find(
        (obj) => obj.name === nodeName
      );
      const nodeIndexInstanceObjectRemoved =
        instanceModel.package.objects.indexOf(instanceObjectRemoved!);

      if (instanceObjectRemoved) {
        const updatedInstanceModel = {
          ...instanceModel,
          package: {
            ...instanceModel.package,
            objects: instanceModel.package.objects.filter(
              (obj) => obj.name !== nodeName
            ),
          },
        };

        // when we remove a node, we always need to check if it is being referenced by other edges
        // if it is, we need to remove the edge as well
        // remove edges associated with the node in both models
        const {
          updatedInstanceModel: finalInstanceModel,
          updatedRepresentationInstanceModel: finalRepresentationInstanceModel,
        } = ModelHelperFunctions.removeEdgesWithNode(
          updatedInstanceModel,
          representationInstanceModel,
          nodeName,
          nodeIndexInstanceObjectRemoved,
          dispatch
        );

        // update both instance and representation models with the final state
        dispatch(updateInstanceModel(finalInstanceModel));
        dispatch(
          updateRepresentationInstanceModel(finalRepresentationInstanceModel)
        );

        // remove the node from the representation instance model
        const removedNodeRepresentation =
          finalRepresentationInstanceModel.package.objects.find(
            (obj) => obj.name === nodeName
          );

        if (removedNodeRepresentation) {
          const updatedRepresentationInstanceModel = {
            ...finalRepresentationInstanceModel,
            package: {
              ...finalRepresentationInstanceModel.package,
              objects: finalRepresentationInstanceModel.package.objects.filter(
                (obj) => obj.name !== nodeName
              ),
            },
          };

          dispatch(
            updateRepresentationInstanceModel(
              updatedRepresentationInstanceModel
            )
          );
        } else {
          console.error(
            "Classifier not found in representation model for ID: ",
            change.id
          );
        }
      }
    }
  }

  static updateNodePosition(
    nds: Node[],
    change: NodeChange<Node>,
    instanceModel: InstanceModel,
    representationInstanceModel: RepresentationInstanceModel,
    dispatch: any
  ) {
    if (change.type === "position" && "id" in change) {
      const changedNode = nds.find((node) => node.id === change.id);

      if (!changedNode) {
        console.error("Node not found in updated nodes:", change.id);
        return;
      }

      const changedNodeData = changedNode?.data as DiagramNodeData;
      const nodeName = changedNodeData.instanceObject!.name;

      const instanceObjectChanged = instanceModel.package.objects.find(
        (obj) => obj.name === nodeName
      );
      const indexInstanceObjectChanged = instanceModel.package.objects.indexOf(
        instanceObjectChanged!
      );

      if (instanceObjectChanged) {
        // ensure the new position is valid, fallback to the last known position if not
        const newPosition: Position = {
          x:
            change.position &&
            typeof change.position.x === "number" &&
            !isNaN(change.position.x)
              ? change.position.x
              : ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
                  instanceObjectChanged,
                  representationInstanceModel
                )!.position!.x,
          y:
            change.position &&
            typeof change.position.y === "number" &&
            !isNaN(change.position.y)
              ? change.position.y
              : ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
                  instanceObjectChanged,
                  representationInstanceModel
                )!.position!.y,
        };

        console.log("New position: ", newPosition);

        const updatedRepresentationInstanceModel = {
          ...representationInstanceModel,
          package: {
            ...representationInstanceModel.package,
            objects: representationInstanceModel.package.objects.map(
              (obj, index) => {
                // find the representation object that is mapped to the instance object
                // they have the same index as their relation is always 1:1
                if (index === indexInstanceObjectChanged) {
                  return {
                    ...obj,
                    position: newPosition, // update position with valid or fallback position
                  };
                }
                return obj;
              }
            ),
          },
        };

        dispatch(
          updateRepresentationInstanceModel(updatedRepresentationInstanceModel)
        );

        console.log("Position saved to localStorage.");
      } else {
        console.error(
          "Classifier not found in representation model for ID: ",
          change.id
        );
      }
    }
  }
}

export default OnNodesChangeHelper;
