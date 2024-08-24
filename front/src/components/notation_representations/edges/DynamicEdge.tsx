import {
  EdgeProps,
  getBezierPath,
  useReactFlow,
  EdgeLabelRenderer,
} from "@xyflow/react";
import ReferenceEdge from "./ReferenceEdge";
import BiDirectionalReferenceEdge from "./BiDirectionalReferenceEdge";
import { useState } from "react";

const DynamicEdge = (props: EdgeProps) => {
  const {
    id,
    data,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
  } = props;

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

  const onEdgeClick = () => {
    console.log("Edge clicked:", id);
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const onSelectType = (newType: string) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, type: newType } }
          : edge
      )
    );
    console.log("Selected edge type:", newType);
    setShowDropdown(false); // Hide dropdown after selection
  };

  const renderEdge = () => {
    switch (data?.type) {
      case "reference":
        return <ReferenceEdge {...props} />;
      case "bi-directional":
        return <BiDirectionalReferenceEdge {...props} />;
      // Add more cases for other edge types...
      default:
        return <ReferenceEdge {...props} />; // Fallback to a default edge type
    }
  };

  return (
    <>
      <g onClick={onEdgeClick} style={{ cursor: "pointer" }}>
        {renderEdge()}
      </g>

      {showDropdown && (
        <EdgeLabelRenderer>
          <foreignObject
            x={labelX - 30} // Adjust positioning if needed
            y={labelY - 20} // Adjust positioning if needed
            width={100}
            height={50}
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid black",
                padding: "4px",
                zIndex: 10,
              }}
            >
              <select
                onChange={(e) => onSelectType(e.target.value)}
                value={data?.type as string}
              >
                <option value="reference">Reference</option>
                <option value="bi-directional">Bi-Directional</option>
                {/* Add other types as needed */}
              </select>
            </div>
          </foreignObject>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DynamicEdge;
