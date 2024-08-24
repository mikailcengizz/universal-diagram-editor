import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

const BiDirectionalReferenceEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{ stroke: "blue", strokeWidth: 2, strokeDasharray: "5,5" }}
    />
  );
};

export default BiDirectionalReferenceEdge;
