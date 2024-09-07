import {
  getBezierPath,
  useReactFlow,
  EdgeLabelRenderer,
  Position,
  BaseEdge,
} from "@xyflow/react";
import React from "react";
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
  data,
  isPalette = false,
  isNotationSlider = false,
}: CombineRelationshipShapesEdgeProps) {
  console.log("CombineRelationshipShapesEdge data:", data);
  console.log(
    "CombineRelationshipShapesEdge positions:",
    sourceX,
    sourceY,
    targetX,
    targetY
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  if (isPalette || isNotationSlider) {
    return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { setEdges } = useReactFlow();

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button className="edgebutton" onClick={onEdgeClick}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default CombineRelationshipShapesEdge;
