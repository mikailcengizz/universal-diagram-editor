import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import Compartment from "../compartments/Compartment";

const RectangleNode = ({ id, data, isPalette = false }: any) => {
  const [compartments, setCompartments] = useState(data.sections);

  const handleCompartmentChange = (index: number, newText: string) => {
    const updatedCompartments = compartments.map(
      (compartment: any, i: number) =>
        i === index ? { ...compartment, default: newText } : compartment
    );
    setCompartments(updatedCompartments);
  };

  return (
    <div
      id={id}
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: "white",
        padding: "10px",
        minWidth: "150px",
        textAlign: "center",
      }}
    >
      {/* Render each section */}
      {compartments.map((section: any, index: number) => (
        <Compartment
          key={index}
          text={section.default}
          onChange={(newText) => handleCompartmentChange(index, newText)}
        />
      ))}

      {/* Handles for connections */}
      {!isPalette && id && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: "#555" }}
            id={`source-${id}`} // Unique id for the source handle
          />
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#555" }}
            id={`target-${id}`} // Unique id for the target handle
          />
        </>
      )}
    </div>
  );
};

export default RectangleNode;
