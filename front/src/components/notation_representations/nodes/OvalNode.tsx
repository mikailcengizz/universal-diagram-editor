import { Handle, Position } from "@xyflow/react";
import React from "react";

const OvalNode = ({ data }: any) => {
  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "50%",
        backgroundColor: "white",
        padding: "10px",
        minWidth: "80px",
        minHeight: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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

export default OvalNode;
