import { Handle, Position } from "@xyflow/react";
import React from "react";

const RectangleNode = ({ data }: any) => {
  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "white",
        padding: "10px",
        minWidth: "100px",
      }}
    >
      <strong>{data.label}</strong>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default RectangleNode;
