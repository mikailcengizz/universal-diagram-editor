import React from "react";
import { Handle, Position } from "react-flow-renderer";

const DiamondNode = ({ data }: any) => {
  return (
    <div
      style={{
        border: "1px solid black",
        backgroundColor: "white",
        width: "100px",
        height: "100px",
        transform: "rotate(45deg)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <strong style={{ transform: "rotate(-45deg)" }}>{data.label}</strong>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default DiamondNode;
