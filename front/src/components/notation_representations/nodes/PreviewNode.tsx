import React from "react";
import Compartment from "../compartments/Compartment";

const PreviewNode = ({ data }: any) => {
  if (!data)
    return (
      <div>
        <span>No notation is currently being configured</span>
      </div>
    ); // return if no data is passed
  const { shape, sections, label, rules } = data;

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
          sections.map((section: any, index: any) => (
            <Compartment
              key={index}
              text={section.default}
              onChange={() => ""}
              style={{}}
            />
          ))}
      </div>
    );
  }

  // Other shapes like circle, arrow, dot would go here

  return null; // default return if no shape matches
};

export default PreviewNode;