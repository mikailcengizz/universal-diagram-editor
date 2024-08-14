import React from "react";
import { Handle, Position } from "react-flow-renderer";

const ParallelogramNode = ({ data }: any) => {
  return (
    <div
      style={{
        border: "1px solid black",
        backgroundColor: "white",
        padding: "10px",
        width: "120px",
        height: "60px",
        transform: "skew(20deg)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <strong style={{ transform: "skew(-20deg)" }}>{data.label}</strong>
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

export default ParallelogramNode;
