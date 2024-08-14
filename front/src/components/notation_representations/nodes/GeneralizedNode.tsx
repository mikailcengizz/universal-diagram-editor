import React from "react";
import Compartment from "../compartments/Compartment";
import { GeneralizedNodeData } from "../../../types/types";

const GeneralizedNode: React.FC<GeneralizedNodeData> = ({
  shape,
  label,
  sections = [],
  rules,
}) => {
  if (shape === "rectangle") {
    return (
      <div
        style={{
          border: "1px solid black",
          borderRadius: "5px",
          backgroundColor: "white",
          padding: "10px",
          minWidth: "150px",
        }}
      >
        {label && label.length > 0 && <strong>{label}</strong>}
        {sections &&
          sections.length > 0 &&
          sections.map((section, index) => (
            <Compartment key={index} text={section.default} />
          ))}
      </div>
    );
  }

  // Other shapes like circle, arrow, dot would go here

  return null; // default return if no shape matches
};

export default GeneralizedNode;
