import React from "react";
import { Handle, Position } from "react-flow-renderer";

const CustomNodeUMLClass = ({ data }: any) => {
  const sections = data.sections || [];

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
    >
      {sections.map((section: any, index: number) => (
        <div
          key={index}
          style={{
            borderBottom:
              index < data.sections.length - 1 ? "1px solid black" : "none",
            padding: "5px",
          }}
        >
          <strong>{section.default}</strong>
        </div>
      ))}
    </div>
  );
};

export default CustomNodeUMLClass;
