import {
  DiagramNodeData,
  InstanceModel,
  InstanceObject,
  MetaModel,
  NotationRepresentationItem,
  RepresentationInstanceModel,
  RepresentationInstanceObject,
  RepresentationMetaModel,
} from "../../../types/types";
import ModelHelperFunctions from "../ModelHelperFunctions";
import { Node, Edge, Position, HandleProps } from "@xyflow/react";
import ReferenceHelper from "../ReferenceHelper";
import { NodeHandleBounds } from "reactflow";

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
      .filter((instanceObject) => {
        const representationInstanceObject =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            instanceObject,
            representationInstanceModel
          );
        return (
          representationInstanceObject &&
          representationInstanceObject?.type === "ClassNode"
        );
      })
      .map((instanceObject) => {
        const representationInstanceObject =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            instanceObject,
            representationInstanceModel
          );

        if (
          !instanceObject ||
          !selectedMetaModel ||
          selectedMetaModel.package.elements.length === 0 ||
          !representationInstanceObject
        )
          return null;

        const position = representationInstanceObject.position || {
          x: 0,
          y: 0,
        };

        const nodeData: DiagramNodeData = {
          notation: {
            representationMetaModel: selectedRepresentationMetaModel,
            metaModel: selectedMetaModel,
          },
          instanceObject: instanceObject,
          position: position,
        };

        const nodeHandles = representationInstanceObject.graphicalRepresentation
          ?.filter(
            (representationItem) => representationItem.shape === "connector"
          )
          .flatMap((representationItem, index) => {
            const handleList = [];

            // Handle target and source for each side
            if (representationItem.style.alignment === "left") {
              // Add both target and source handles for 'left'
              handleList.push({
                id: `handle-left-${index}`,
                position: Position.Left,
                x: representationItem.position.x,
                y: representationItem.position.y,
                type: "source" as "source",
              });
            } else if (representationItem.style.alignment === "right") {
              handleList.push({
                id: `handle-right-${index}`,
                position: Position.Right,
                x: representationItem.position.x,
                y: representationItem.position.y,
                type: "source" as "source",
              });
            } else if (representationItem.style.alignment === "top") {
              handleList.push({
                id: `handle-top-${index}`,
                position: Position.Top,
                x: representationItem.position.x,
                y: representationItem.position.y,
                type: "source" as "source",
              });
            } else if (representationItem.style.alignment === "bottom") {
              handleList.push({
                id: `handle-bottom-${index}`,
                position: Position.Bottom,
                x: representationItem.position.x,
                y: representationItem.position.y,
                type: "source" as "source",
              });
            }

            return handleList;
          });

        const returnNode: Node = {
          id: instanceObject.name,
          type: "ClassNode", // as it is a classifer node
          handles: nodeHandles,
          position: representationInstanceObject.position!,
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

        // ref is currently #/objects/1/representation/graphicalRepresentation/2
        // we want to split in #/objects/1 and 2
        const targetRefParts = targetLink.target.$ref.split(
          "/representation/graphicalRepresentation/"
        );
        const sourceRefParts = sourceLink.target.$ref.split(
          "/representation/graphicalRepresentation/"
        );
        const targetObjectRef = targetRefParts[0];
        const sourceObjectRef = sourceRefParts[0];
        const targetConnectorRef = +targetRefParts[1];
        const sourceConnectorRef = +sourceRefParts[1];

        // Get the target and source objects from the links with the $ref
        const targetObject: InstanceObject | null =
          targetLink && targetLink.target.$ref
            ? ReferenceHelper.resolveRef(instanceModel.package, targetObjectRef)
            : null;

        const sourceObject: InstanceObject | null =
          sourceLink && sourceLink.target.$ref
            ? ReferenceHelper.resolveRef(instanceModel.package, sourceObjectRef)
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
          return null;
        } else if (!targetNode) {
          console.error("Target node not found:", targetObject);
          return null;
        }

        // Get source and target instance representations
        const sourceRepresentation =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            sourceObject,
            representationInstanceModel
          );
        const targetRepresentation =
          ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
            targetObject,
            representationInstanceModel
          );

        const sourceConenctor: NotationRepresentationItem | undefined =
          sourceRepresentation?.graphicalRepresentation![sourceConnectorRef];
        const targetConnector: NotationRepresentationItem | undefined =
          targetRepresentation?.graphicalRepresentation![targetConnectorRef];

        const sourceConnectorIndex =
          sourceRepresentation?.graphicalRepresentation
            ?.filter((item) => item.shape === "connector")
            .indexOf(sourceConenctor!);
        const targetConnectorIndex =
          targetRepresentation?.graphicalRepresentation
            ?.filter((item) => item.shape === "connector")
            .indexOf(targetConnector!);

        // Use these indices to backtrack and find the appropriate handles on the source and target nodes
        const findHandleByConnectorIndex = (
          node: Node,
          connectorIndex: number
        ) => {
          return node.handles!.find(
            (handle) => handle.id && handle.id.includes(`-${connectorIndex}`)
          );
        };

        const sourceHandle = findHandleByConnectorIndex(
          sourceNode,
          sourceConnectorIndex!
        );
        const targetHandle = findHandleByConnectorIndex(
          targetNode,
          targetConnectorIndex!
        );

        // Check if the source and target representations were found
        if (!sourceRepresentation || !targetRepresentation) {
          console.error("Source or Target representation not found:", {
            sourceRepresentation,
            targetRepresentation,
          });
          return null; // Exit early if either representation is not found
        }

        if (!sourceHandle || !targetHandle) {
          console.error(
            "Source or Target handle not found based on connector index:",
            {
              sourceHandle,
              targetHandle,
            }
          );
          return null;
        }

        if (!sourceHandle || !targetHandle) {
          console.error("Source or Target handle not found");
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

        const returnEdge: Edge = {
          id: instanceObj.name,
          source: sourceNode!.id,
          sourceHandle: sourceHandle.id,
          target: targetNode!.id,
          targetHandle: targetHandle.id,
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
