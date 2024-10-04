import { getBezierPath, useReactFlow, Position } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import { DiagramNodeData } from "../../../types/types";
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

  console.log("data", data);

  const representationInstanceObject =
    ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInLocalStorage(
      data.instanceObject!
    );

  const edgeStyles = {
    strokeWidth:
      representationInstanceObject!.graphicalRepresentation![0].style.lineWidth,
    stroke:
      representationInstanceObject!.graphicalRepresentation![0].style.color,
    strokeDasharray:
      representationInstanceObject!.graphicalRepresentation![0].style
        .lineStyle === "dotted"
        ? "5,5"
        : representationInstanceObject!.graphicalRepresentation![0].style
            .lineStyle === "dashed"
        ? "10,10"
        : "0",
    ...style,
  };

  console.log("edgeStyles", edgeStyles);

  // Manually render the line for palette or notation slider context
  if (isPalette || isNotationSlider) {
    return (
      <svg width="100%" height="100%">
        <line
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke={edgeStyles.stroke}
          strokeWidth={edgeStyles.strokeWidth}
          markerEnd={markerEnd}
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

  console.log("edgePath", sourceX, sourceY, targetX, targetY, edgePath);

  return (
    <svg width="100%" height="100%">
      <defs>
        {/* Define the marker here */}
        <marker
          id="openArrow"
          viewBox="0 0 10 10"
          refX="9" // Move the arrowhead to start at the exact point of the source
          refY="5" // Keep it centered
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse" // Automatically reverse the direction at the start
        >
          <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="black" />
        </marker>
        <marker
          id="closedArrow"
          viewBox="0 0 10 10"
          refX="9" // Ensure this aligns properly with the end of the line
          refY="5" // Center of the marker
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10" fill="black" />
        </marker>
      </defs>

      {/* Render the line with dynamic markers */}
      <RenderLine
        id={id}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        markerStart={markers.source ? `url(#${markers.source})` : undefined}
        markerEnd={markers.target ? `url(#${markers.target})` : undefined}
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
