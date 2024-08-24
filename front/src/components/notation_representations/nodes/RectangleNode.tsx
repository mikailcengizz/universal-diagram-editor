import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import Compartment from "../compartments/Compartment";
import { Notation } from "../../../types/types";

interface RectangleNodeProps {
  id: string;
  notation: Notation;
  isPalette?: boolean;
}

const RectangleNode = ({
  id,
  notation,
  isPalette = false,
}: RectangleNodeProps) => {
  /* const [compartments, setCompartments] = useState(notation.sections || []);

  const handleCompartmentChange = (index: number, newText: string) => {
    const updatedCompartments = compartments.map((compartment, i) =>
      i === index ? { ...compartment, default: newText } : compartment
    );
    setCompartments(updatedCompartments);
  }; */

  return (
    <div
      id={id}
      style={{
        border: "1px solid black",
        borderRadius: "5px",
        backgroundColor: notation.styleProperties.general
          .find((prop) => prop.name === "Color")
          ?.default.toString(),
        padding: "6px 0",
        minWidth: "150px",
      }}
    >
      <span className="w-full text-center block border-b-[1px] border-black pb-1">
        {
          notation.semanticProperties.find((prop) => prop.name === "Name")
            ?.default
        }
      </span>

      {/* {compartments.map((section, index) => (
        <Compartment
          key={index}
          text={section.default}
          style={{ fontSize: `${notation.styleProperties.other[2].default}px` }}
          onChange={(newText) => handleCompartmentChange(index, newText)}
        />
      ))} */}

      {!isPalette && id && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            style={{ background: "#555" }}
            id={`source-${id}`}
          />
          <Handle
            type="target"
            position={Position.Top}
            style={{ background: "#555" }}
            id={`target-${id}`}
          />
        </>
      )}
    </div>
  );
};

export default RectangleNode;
