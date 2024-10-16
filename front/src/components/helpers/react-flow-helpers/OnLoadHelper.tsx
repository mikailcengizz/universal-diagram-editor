import {
  DiagramNodeData,
  InstanceModel,
  InstanceObject,
  MetaModel,
  RepresentationInstanceModel,
  RepresentationMetaModel,
} from "../../../types/types";
import ModelHelperFunctions from "../ModelHelperFunctions";
import { Node, Edge, Position } from "@xyflow/react";
import ReferenceHelper from "../ReferenceHelper";

class OnLoadHelper {
  static initializeNodes = (
    representationInstanceModel: RepresentationInstanceModel,
    instanceModel: InstanceModel,
    selectedMetaModel: MetaModel,
    selectedRepresentationMetaModel: RepresentationMetaModel
  ): Node[] => {
    if (
      !representationInstanceModel ||
      !instanceModel ||
      representationInstanceModel.package.objects.length === 0
    )
      return [];

    const returnNodes = instanceModel.package.objects
      .filter((instanceObj) => {
        const representationInstanceObj =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            instanceObj,
            representationInstanceModel
          );
        return (
          representationInstanceObj &&
          representationInstanceObj?.type === "ClassNode"
        );
      })
      .map((instanceObj) => {
        const representationInstanceObj =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            instanceObj,
            representationInstanceModel
          );

        if (
          !instanceObj ||
          !selectedMetaModel ||
          selectedMetaModel.package.elements.length === 0 ||
          !representationInstanceObj
        )
          return null;

        const position = representationInstanceObj.position || {
          x: 0,
          y: 0,
        };

        const nodeData: DiagramNodeData = {
          notation: {
            representationMetaModel: selectedRepresentationMetaModel,
            metaModel: selectedMetaModel,
          },
          instanceObject: instanceObj,
          position: position,
        };

        const nodeHandles = representationInstanceObj.graphicalRepresentation
          ?.filter(
            (representationItem) => representationItem.shape === "connector"
          )
          .map((representationItem) => {
            return {
              id:
                representationItem.style.alignment === "left"
                  ? "target-handle-" + instanceObj.name
                  : "source-handle-" + instanceObj.name,
              position:
                representationItem.style.alignment === "left"
                  ? Position.Left
                  : Position.Right,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type:
                representationItem.style.alignment === "left"
                  ? ("target" as "target")
                  : ("source" as "source"),
            };
          });

        console.log("nodeHandles:", nodeHandles);

        const returnNode: Node = {
          id: instanceObj.name,
          type: "ClassNode", // as it is a classifer node
          handles: nodeHandles,
          position: representationInstanceObj.position!,
          data: nodeData as any,
        };

        return returnNode;
      })
      .filter(Boolean); // Filter out null values

    return returnNodes as Node[];
  };

  static initializeEdges = (
    nodes: Node[],
    onDoubleClickEdge: (edgeId: string, data: DiagramNodeData) => void,
    representationInstanceModel: RepresentationInstanceModel,
    instanceModel: InstanceModel,
    selectedMetaModel: MetaModel,
    selectedRepresentationMetaModel: RepresentationMetaModel
  ) => {
    if (
      !instanceModel ||
      !representationInstanceModel ||
      instanceModel.package.objects.length === 0
    )
      return [];

    const returnEdges = instanceModel.package.objects
      // temporary fix for edge nodes, this needs to be done by not having edges in the eClassifiers array
      // but instead in eFeatures array, and then just reference them by id in the eReferences array
      .filter((instanceObj) => {
        const representationInstanceObj =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            instanceObj,
            representationInstanceModel
          );
        return (
          representationInstanceObj &&
          representationInstanceObj?.type === "ClassEdge"
        );
      })
      .map((instanceObj) => {
        console.log("instanceObj initialize Edges:", instanceObj);
        const edgeRepresentation =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            instanceObj,
            representationInstanceModel
          );

        if (!edgeRepresentation) {
          console.error(
            "Edge representation not found for instance edge:",
            instanceObj
          );
          return null;
        }

        // Get the target and source links
        const targetLink = instanceObj.links.find(
          (link) => link.name === "target"
        );
        const sourceLink = instanceObj.links.find(
          (link) => link.name === "source"
        );

        if (!targetLink || !sourceLink) {
          console.error(
            "Target or Source link not found for instance edge:",
            instanceObj
          );
          return null;
        }

        // Get the target and source objects from the links with the $ref
        const targetObject: InstanceObject | null =
          targetLink && targetLink.target.$ref
            ? ReferenceHelper.resolveRef(
                instanceModel.package,
                targetLink.target.$ref
              )
            : null;

        const sourceObject: InstanceObject | null =
          sourceLink && sourceLink.target.$ref
            ? ReferenceHelper.resolveRef(
                instanceModel.package,
                sourceLink.target.$ref
              )
            : null;

        if (!targetObject) {
          console.error("Target object not found:", targetLink);
          return null;
        } else if (!sourceObject) {
          console.error("Source object not found:", sourceLink);
          return null;
        }

        const sourceNode = nodes.find(
          (node) =>
            (node.data as DiagramNodeData).instanceObject!.name ===
            sourceObject?.name
        );

        const targetNode = nodes.find(
          (node) =>
            (node.data as DiagramNodeData).instanceObject!.name ===
            targetObject?.name
        );

        if (!sourceNode) {
          console.error("Source node not found:", sourceObject);
          console.log("Nodes:", nodes);
          return null;
        } else if (!targetNode) {
          console.error("Target node not found:", targetObject);
          return null;
        }

        const diagramEdgeData: DiagramNodeData = {
          notation: {
            representationMetaModel: selectedRepresentationMetaModel,
            metaModel: selectedMetaModel,
          },
          instanceObject: instanceObj,
          onDoubleClick: onDoubleClickEdge,
        };

        console.log("sourceNode:", sourceNode);
        console.log("targetNode:", targetNode);

        const returnEdge: Edge = {
          id: instanceObj.name,
          source: sourceNode!.id,
          sourceHandle: sourceNode.handles!.find(
            (handle) => handle.type === "source"
          )!.id,
          target: targetNode!.id,
          targetHandle: targetNode.handles!.find(
            (handle) => handle.type === "target"
          )!.id,
          type: "ClassEdge", // Assuming a default edge type
          data: diagramEdgeData as any,
        };

        return returnEdge;
      })
      .filter(Boolean); // Filter out null values

    return returnEdges as Edge[];
  };
}

export default OnLoadHelper;
