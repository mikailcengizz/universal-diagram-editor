import { getBezierPath, useReactFlow, Position, BaseEdge } from "@xyflow/react";
import React, { useState } from "react";
import { CustomNodeData } from "../../../types/types";

interface CombineRelationshipShapesEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  style?: React.CSSProperties;
  markerEnd?: string;
  data: CustomNodeData;
  isPalette?: boolean;
  isNotationSlider?: boolean;
}

function CombineRelationshipShapesEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data: initialData,
  isPalette = false,
  isNotationSlider = false,
}: CombineRelationshipShapesEdgeProps) {
  const [data, setData] = useState<CustomNodeData>({ ...initialData });
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeStyles = {
    strokeWidth:
      data.nodeNotation.graphicalRepresentation![0].position.extent?.width,
    stroke: data.nodeNotation.graphicalRepresentation![0].style.backgroundColor,
    ...style,
  };

  console.log("modal open", isEdgeModalOpen);

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

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyles} />

      {/* Transparent overlay to capture double-click */}
      <svg style={{ position: "absolute", pointerEvents: "none" }}>
        <line
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
          stroke="transparent"
          strokeWidth={Number(edgeStyles.strokeWidth) + 10} // Increase the invisible hit area
          onDoubleClick={handleDoubleClick} // Capture the double-click event
          style={{ cursor: "pointer", pointerEvents: "all" }}
        />
      </svg>
    </>
  );
}

export default CombineRelationshipShapesEdge;
