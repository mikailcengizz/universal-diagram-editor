import { Handle, Position } from "@xyflow/react";
import React from "react";

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
        id="a"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        id="b"
      />
    </div>
  );
};

export default DiamondNode;
