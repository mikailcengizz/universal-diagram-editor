import { Handle, Position } from "@xyflow/react";
import React from "react";

const RectangleNode = ({ id, data, isPalette = false }: any) => {
  console.log("RectangleNode Rendered:", { id }); // Debugging

  if (!id) {
    console.error("Error: Node ID is missing");
  }

  return (
    <div
      id={id}
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "white",
        padding: "10px",
        minWidth: "100px",
      }}
    >
      <strong>{data.label}</strong>
      {!isPalette && id && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: "#555" }}
            id={`source-${id}`} // Unique id for the source handle
          />
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#555" }}
            id={`target-${id}`} // Unique id for the target handle
          />
        </>
      )}
    </div>
  );
};

export default RectangleNode;
