import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import { useState } from "react";
import { CustomEdgeProps } from "../../../types/types";

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
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { setEdges } = useReactFlow();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from bubbling up
    console.log("Edge clicked from biderectional edge:", id);
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const onSelectType = (newType: string) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              type: newType, // Update the type of the edge
              data: { ...edge.data, type: newType },
            }
          : edge
      )
    );
    setShowDropdown(false);
  };

  return (
    <>
      <g onClick={handleEdgeClick}>
        <BaseEdge
          path={edgePath}
          markerStart="url(#arrowClosed)"
          markerEnd="url(#arrowClosed)"
          style={{ stroke: "blue", strokeWidth: 2, strokeDasharray: "5,5" }}
        />
      </g>

      {showDropdown && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              backgroundColor: "white",
              border: "1px solid black",
              padding: "4px",
              zIndex: 10,
              pointerEvents: "all",
            }}
          >
            <select
              onChange={(e) => onSelectType(e.target.value)}
              value={data?.type as string}
              style={{ width: "100%" }} // Ensuring full-width select
            >
              <option value="reference">Reference</option>
              <option value="bi-directional">Bi-Directional</option>
              {/* Add other types as needed */}
            </select>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default BiDirectionalReferenceEdge;
