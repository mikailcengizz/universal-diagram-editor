import { getBezierPath, useReactFlow, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import {
  DiagramNodeData,
  NotationRepresentationItem,
  Representation,
  RepresentationInstanceObject,
} from "../../../types/types";
import RenderLine from "./components/RenderLine";
import ModelHelperFunctions from "../../helpers/ModelHelperFunctions";

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
  const [data, setData] = useState<DiagramNodeData>({ ...initialData });
  const isNotationSlider = data.isNotationSlider || false;
  const isPalette = data.instanceObject === undefined && !isNotationSlider;

  const [markers, setMarkers] = useState<{
    source: string | undefined;
    target: string | undefined;
  }>({
    source: undefined,
    target: undefined,
  });

  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  /* useEffect(() => {
    const sourceRole = data.nodeNotation.roles?.find(
      (role) => role.name === "Source"
    );
    const targetRole = data.nodeNotation.roles?.find(
      (role) => role.name === "Target"
    );

    const sourceMarker = sourceRole?.graphicalRepresentation?.[0]?.marker;
    const targetMarker = targetRole?.graphicalRepresentation?.[0]?.marker;

    setMarkers({
      source: sourceMarker,
      target: targetMarker,
    });
  }, [data.nodeNotation.roles]); */

  const representation =
    isPalette || isNotationSlider
      ? (data.notationElementRepresentation as Representation)
      : (ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInLocalStorage(
          data.instanceObject!
        ) as RepresentationInstanceObject);

  const edgeStyles = {
    strokeWidth:
      representation!.graphicalRepresentation!.length === 0
        ? 1
        : representation!.graphicalRepresentation![0].style.width,
    stroke:
      representation!.graphicalRepresentation!.length === 0
        ? "#000000"
        : representation!.graphicalRepresentation![0].style.color,
    strokeDasharray:
      representation!.graphicalRepresentation!.length === 0
        ? "0" // Solid line
        : representation!.graphicalRepresentation![0].style.lineStyle ===
          "dotted"
        ? "5,5"
        : representation!.graphicalRepresentation![0].style.lineStyle ===
          "dashed"
        ? "10,10"
        : "0", // Solid line
  };

  // Get marker styles
  const markerSource = representation!.graphicalRepresentation![0].markers![0];
  const markerTarget = representation!.graphicalRepresentation![0].markers![1];

  // Helper function to get the marker style and dimensions
  const getMarkerStyle = (marker: any) => ({
    color: marker?.style?.color || "#000000",
    width: marker?.style?.width || 1,
  });

  const sourceMarkerStyle = getMarkerStyle(markerSource);
  const targetMarkerStyle = getMarkerStyle(markerTarget);

  // Manually render the line for palette or notation slider context used for previewing
  if (isPalette || isNotationSlider) {
    return (
      <svg width="100%" height="100%">
        <defs>
          {/* Define marker elements with dynamic color and width */}
          <marker
            id={"sourceMarker"}
            viewBox={"0 0 10 10"}
            refX="9"
            refY="5"
            markerWidth={sourceMarkerStyle.width}
            markerHeight={sourceMarkerStyle.width}
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
            id={"targetMarker"}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth={targetMarkerStyle.width}
            markerHeight={targetMarkerStyle.width}
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
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke={edgeStyles.stroke}
          strokeWidth={edgeStyles.strokeWidth}
          strokeDasharray={edgeStyles.strokeDasharray}
          markerStart={
            markerSource?.type ? `url(#${"sourceMarker"})` : undefined
          }
          markerEnd={markerTarget?.type ? `url(#${"targetMarker"})` : undefined}
        />
      </svg>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { setEdges } = useReactFlow();

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleDoubleClick = () => {
    if (data.onDoubleClick) {
      data.onDoubleClick(id, data); // Access the onDoubleClick function
    } else {
      console.error("onDoubleClick function is not defined");
    }
  };

  return (
    <svg width="100%" height="100%">
      <defs>
        {/* Define the marker here */}
        <marker
          id={"sourceMarker"}
          viewBox="0 0 10 10"
          refX="9" // Move the arrowhead to start at the exact point of the source
          refY="5" // Keep it centered
          markerWidth={sourceMarkerStyle.width}
          markerHeight={sourceMarkerStyle.width}
          orient="auto-start-reverse" // Automatically reverse the direction at the start
        >
          <path
            d="M 0 0 L 10 5 L 0 10"
            fill={
              markerTarget.type === "openArrow"
                ? "none"
                : sourceMarkerStyle.color
            }
            stroke={sourceMarkerStyle.color}
            strokeWidth={sourceMarkerStyle.width}
          />
        </marker>
        <marker
          id={"targetMarker"}
          viewBox="0 0 10 10"
          refX="9" // Ensure this aligns properly with the end of the line
          refY="5" // Center of the marker
          markerWidth={targetMarkerStyle.width}
          markerHeight={targetMarkerStyle.width}
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
            strokeWidth={targetMarkerStyle.width}
          />
        </marker>
      </defs>

      {/* Render the line with dynamic markers */}
      <RenderLine
        id={id}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        markerStart={markerSource?.type ? `url(#${"sourceMarker"})` : undefined}
        markerEnd={markerTarget?.type ? `url(#${"targetMarker"})` : undefined}
      />

      {/* Transparent overlay to capture double-click */}
      <svg style={{ position: "absolute", pointerEvents: "none" }}>
        <line
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
