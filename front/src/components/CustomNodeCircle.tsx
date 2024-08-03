import React from "react";
import { Handle, Position } from "react-flow-renderer";

const CustomNodeCircle = ({ data }: { data: any }) => {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #222",
        borderRadius: "50%",
        padding: 10,
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ borderRadius: 0 }}
      />
    </div>
  );
};

export default CustomNodeCircle;
