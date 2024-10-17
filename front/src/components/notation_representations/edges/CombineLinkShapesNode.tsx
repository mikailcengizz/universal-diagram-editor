import { getBezierPath, useReactFlow, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import {
  DiagramNodeData,
  InstanceModel,
  InstanceObject,
  Marker,
  NotationRepresentationItem,
  Representation,
  RepresentationInstanceModel,
  RepresentationInstanceObject,
} from "../../../types/types";
import RenderLine from "./components/RenderLine";
import ModelHelperFunctions from "../../helpers/ModelHelperFunctions";
import ReferenceHelper from "../../helpers/ReferenceHelper";
import { useDispatch, useSelector } from "react-redux";

interface CombineRelationshipShapesEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  style?: React.CSSProperties;
  markerStart?: string;
  markerEnd?: string;
  data: DiagramNodeData;
}

function CombineLinkShapesNode({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerStart,
  markerEnd,
  data: initialData,
}: CombineRelationshipShapesEdgeProps) {
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.instanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModel = useSelector(
    (state: any) => state.representationInstanceModelStore.model
  );

  const [data, setData] = useState<DiagramNodeData>({ ...initialData });
  console.log("combineLinkShapesNode edge id", id);
  console.log("combineLinkShapesNode edge data", data);

  let sourceRepresentationInstance = undefined;
  let sourceConnectorRepresentationInstance = undefined;
  let targetRepresentationInstance = undefined;
  let targetConnectorRepresentationInstance = undefined;

  const isNotationSlider = data.isNotationSlider || false;
  const isDesignerPreview = data.isDesignerPreview || false;
  const isPalette =
    data.instanceObject === undefined &&
    !isNotationSlider &&
    !isDesignerPreview;

  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const representation =
    isPalette || isNotationSlider || isDesignerPreview
      ? (data.notationElementRepresentation as Representation)
      : (ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
          data.instanceObject!,
          representationInstanceModel
        ) as RepresentationInstanceObject);

  const hasGraphicalRepresentation =
    representation &&
    representation.graphicalRepresentation &&
    representation.graphicalRepresentation.length > 0;

  const edgeStyles = {
    strokeWidth: hasGraphicalRepresentation
      ? representation!.graphicalRepresentation![0].style.width
      : 1,
    stroke: hasGraphicalRepresentation
      ? representation!.graphicalRepresentation![0].style.color
      : "#000000",
    strokeDasharray: !hasGraphicalRepresentation
      ? "0" // Solid line
      : representation!.graphicalRepresentation![0].style.lineStyle === "dotted"
      ? "5,5"
      : representation!.graphicalRepresentation![0].style.lineStyle === "dashed"
      ? "10,10"
      : "0", // Solid line
  };

  // Get marker styles
  const markerSource: Marker = hasGraphicalRepresentation
    ? representation!.graphicalRepresentation![0].markers![0]
    : { type: "none" };
  const markerTarget: Marker = hasGraphicalRepresentation
    ? representation!.graphicalRepresentation![0].markers![1]
    : { type: "none" };

  // Helper function to get the marker style and dimensions
  const getMarkerStyle = (marker: any) => ({
    color: marker?.style?.color || "#000000",
    width: marker?.style?.width || 1,
  });

  const sourceMarkerStyle = getMarkerStyle(markerSource);
  const targetMarkerStyle = getMarkerStyle(markerTarget);

  // scaling factors for the palette and notation slider
  const scale = isPalette ? 0.4 : isDesignerPreview ? 1 : 1; // scale down to fit within palette and notation slider
  const paletteWidth = isPalette ? 55 : isDesignerPreview ? 200 : 94;
  const paletteHeight = isPalette ? 55 : isDesignerPreview ? 200 : 94;

  // Manually render the line for palette or notation slider context used for previewing
  if (isPalette || isNotationSlider || isDesignerPreview) {
    return (
      <svg
        width={paletteWidth}
        height={paletteHeight}
        viewBox={`0 0 ${paletteWidth} ${paletteHeight}`} // Define the aspect ratio here, based on the full size scale
      >
        <defs>
          {/* Define marker elements with dynamic color and width */}
          <marker
            id={"sourceMarkerPreview"}
            viewBox={"0 0 10 10"}
            refX="9"
            refY="5"
            markerWidth={
              markerSource.type === "none" ? 0 : sourceMarkerStyle.width
            }
            markerHeight={
              markerSource.type === "none" ? 0 : sourceMarkerStyle.width
            }
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10"
              fill={
                markerSource.type === "openArrow"
                  ? "none"
                  : sourceMarkerStyle.color
              }
              stroke={sourceMarkerStyle.color}
            />
          </marker>
          <marker
            id={"targetMarkerPreview"}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth={
              markerTarget.type === "none" ? 0 : targetMarkerStyle.width
            }
            markerHeight={
              markerTarget.type === "none" ? 0 : targetMarkerStyle.width
            }
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10"
              fill={
                markerTarget.type === "openArrow"
                  ? "none"
                  : targetMarkerStyle.color
              }
              stroke={targetMarkerStyle.color}
            />
          </marker>
        </defs>

        <line
          x1={0}
          y1={0}
          x2={paletteWidth}
          y2={paletteHeight}
          stroke={edgeStyles.stroke}
          strokeWidth={edgeStyles.strokeWidth! * scale}
          strokeDasharray={edgeStyles.strokeDasharray}
          markerStart={
            markerSource?.type ? `url(#${"sourceMarkerPreview"})` : undefined
          }
          markerEnd={
            markerTarget?.type ? `url(#${"targetMarkerPreview"})` : undefined
          }
        />
      </svg>
    );
  }

  if (data.instanceObject === undefined) {
    return null;
  }

  const sourceRef = data.instanceObject.links.find(
    (link) => link.name === "source"
  )?.target.$ref;
  const targetRef = data.instanceObject.links.find(
    (link) => link.name === "target"
  )?.target.$ref;
  const targetRefParts = targetRef!.split(
    "/representation/graphicalRepresentation/"
  );
  const sourceRefParts = sourceRef!.split(
    "/representation/graphicalRepresentation/"
  );
  const targetObjectRef = targetRefParts[0];
  const sourceObjectRef = sourceRefParts[0];
  const targetConnectorRef = +targetRefParts[1]; // connector index
  const sourceConnectorRef = +sourceRefParts[1];

  const targetObject: InstanceObject | null = ReferenceHelper.resolveRef(
    instanceModel.package,
    targetObjectRef
  );

  const sourceObject: InstanceObject | null = ReferenceHelper.resolveRef(
    instanceModel.package,
    sourceObjectRef
  );

  // Get source and target instance representations
  sourceRepresentationInstance =
    ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
      sourceObject!,
      representationInstanceModel
    );
  targetRepresentationInstance =
    ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
      targetObject!,
      representationInstanceModel
    );

  if (!sourceRepresentationInstance || !targetRepresentationInstance) {
    console.error(
      "Source or Target representation not found in CombineLinkShapesNode:",
      {
        sourceRepresentationInstance,
        targetRepresentationInstance,
      }
    );
  }

  // Get source and target connector representations
  sourceConnectorRepresentationInstance =
    sourceRepresentationInstance!.graphicalRepresentation![sourceConnectorRef];
  targetConnectorRepresentationInstance =
    targetRepresentationInstance!.graphicalRepresentation![targetConnectorRef];

  const getMarkerRotation = (alignment: string) => {
    switch (alignment) {
      case "top":
        return 90;
      case "bottom":
        return -90;
      case "left":
        return 0;
      case "right":
        return -180;
      default:
        return 0; // Default is no rotation
    }
  };

  let sourceRotation = 0;
  let targetRotation = 0;

  sourceRotation = getMarkerRotation(
    sourceConnectorRepresentationInstance?.style?.alignment!
  );
  targetRotation = getMarkerRotation(
    targetConnectorRepresentationInstance?.style?.alignment!
  );

  const handleDoubleClick = () => {
    if (data.onDoubleClick) {
      data.onDoubleClick(id, data); // Access the onDoubleClick function
    } else {
      console.error("onDoubleClick function is not defined");
    }
  };

  return (
    <svg id={"edge-svg-" + id} width={targetX} height={targetY}>
      <defs>
        {/* Define the marker here */}
        <marker
          id={"sourceMarker" + id}
          viewBox="0 0 10 10"
          refX="9" // Move the arrowhead to start at the exact point of the source
          refY="5" // Keep it centered
          markerWidth={
            markerSource.type === "none" ? 0 : sourceMarkerStyle.width
          }
          markerHeight={
            markerSource.type === "none" ? 0 : sourceMarkerStyle.width
          }
          orient={`${sourceRotation}`}
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill={
              markerSource.type === "openArrow"
                ? "none"
                : sourceMarkerStyle.color
            }
            stroke={
              markerSource.type === "openArrow"
                ? sourceMarkerStyle.color
                : "none"
            }
          />
        </marker>
        <marker
          id={"targetMarker" + id}
          viewBox="0 0 10 10"
          refX="9" // Ensure this aligns properly with the end of the line
          refY="5" // Center of the marker
          markerWidth={
            markerTarget.type === "none" ? 0 : targetMarkerStyle.width
          }
          markerHeight={
            markerTarget.type === "none" ? 0 : targetMarkerStyle.width
          }
          orient={`${targetRotation}`}
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill={
              markerTarget.type === "openArrow"
                ? "none"
                : targetMarkerStyle.color
            }
            stroke={
              markerTarget.type === "openArrow"
                ? targetMarkerStyle.color
                : "none"
            }
          />
        </marker>
      </defs>

      {/* Render the line with dynamic markers */}
      <RenderLine
        id={id}
        key={id}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        markerStart={
          markerSource?.type ? `url(#${"sourceMarker" + id})` : undefined
        }
        markerEnd={
          markerTarget?.type ? `url(#${"targetMarker" + id})` : undefined
        }
      />

      {/* Transparent overlay to capture double-click */}
      <svg
        id={"transparent-overlay" + id}
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <line
          id={"overlay-line" + id}
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke="transparent"
          onDoubleClick={handleDoubleClick}
          strokeWidth={Number(edgeStyles.strokeWidth) + 10} // Increase the clickable area
          style={{ cursor: "pointer", pointerEvents: "all" }}
        />
      </svg>
    </svg>
  );
}

export default CombineLinkShapesNode;
