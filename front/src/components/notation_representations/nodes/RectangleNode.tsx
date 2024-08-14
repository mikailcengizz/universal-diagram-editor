import React from "react";
import { Handle, Position } from "react-flow-renderer";

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
