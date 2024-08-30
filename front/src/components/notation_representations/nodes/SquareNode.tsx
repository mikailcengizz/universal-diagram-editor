import { Handle, Position } from "@xyflow/react";
import React, { useState } from "react";
import Compartment from "../compartments/Compartment";
import {
  CustomNodeData,
  Notation,
  NotationRepresentationItem,
} from "../../../types/types";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

// Dropdown/Toolbar component
/* const CompartmentsDropdown = ({
  compartments,
  onSelectCompartment,
}: {
  compartments: NotationRepresentationItem[];
  onSelectCompartment: (compartment: NotationRepresentationItem) => void;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "100%",
        backgroundColor: "white",
        border: "1px solid black",
        zIndex: 10,
      }}
    >
      {compartments.map((compartment, index) => (
        <>
          {compartment.generator === "attributesForNotation" && (
            <div
              key={index}
              style={{ padding: "5px", cursor: "pointer" }}
              onClick={() => onSelectCompartment(compartment)}
            >
              Attribute
            </div>
          )}
          {compartment.generator === "operationsForNotation" && (
            <div
              key={index}
              style={{ padding: "5px", cursor: "pointer" }}
              onClick={() => onSelectCompartment(compartment)}
            >
              Operation
            </div>
          )}
        </>
      ))}
    </div>
  );
}; */

/* const EdgeTypeDropdown = ({
  onSelectEdgeType,
}: {
  onSelectEdgeType: (type: string) => void;
}) => {
  const edgeTypes = ["Association"]; // Add your edge types here

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "white",
        border: "1px solid black",
        zIndex: 10,
      }}
    >
      {edgeTypes.map((type, index) => (
        <div
          key={index}
          style={{ padding: "5px", cursor: "pointer" }}
          onClick={() => onSelectEdgeType(type)}
        >
          {type}
        </div>
      ))}
    </div>
  );
}; */

interface SquareNodeProps {
  id: string;
  isPalette?: boolean;
  data?: CustomNodeData;
}

/* const SquareNode = ({ id, isPalette = false, data }: SquareNodeProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [compartments, setCompartments] = useState<Notation[]>([]);
  const { notation, features } = data!;
  const [title, setTitle] = useState(
    notation.semanticProperties.find((prop) => prop.name === "Name")?.default ||
      "ClassName"
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleCompartmentChange = (index: number, newText: string) => {
    const updatedCompartments = compartments.map((compartment, i) =>
      i === index ? { ...compartment, default: newText } : compartment
    );
    setCompartments([...updatedCompartments]); // Spread to ensure new reference
  };

  const handleSelectFeature = (feature: Notation) => {
    setCompartments((prevCompartments) => {
      const newCompartments = [...prevCompartments, feature];

      // Sort compartments based on their feature names
      const featureOrder = features.map(
        (f) =>
          f.semanticProperties.find((prop) => prop.name === "Name")?.default
      );

      newCompartments.sort((a, b) => {
        const aName = a.semanticProperties.find(
          (prop) => prop.name === "Name"
        )?.default;
        const bName = b.semanticProperties.find(
          (prop) => prop.name === "Name"
        )?.default;
        return featureOrder.indexOf(aName) - featureOrder.indexOf(bName);
      });

      return newCompartments; // Return the new state
    });

    setShowDropdown(false); // Hide the dropdown after selection
  };

  const borderWidth = notation.styleProperties.border!.find(
    (prop) => prop.name === "Border Width"
  )?.default;
  const borderColor = notation.styleProperties
    .border!.find((prop) => prop.name === "Border Color")
    ?.default.toString();
  const color = notation.styleProperties
    .general!.find((prop) => prop.name === "Color")
    ?.default.toString();

  return (
    <div
      id={id}
      style={{
        borderColor: borderColor || "black",
        borderWidth: borderWidth ? `${borderWidth}px` : "1px",
        borderRadius: "5px",
        backgroundColor: color || "white",
        padding: "6px 0",
        minWidth: "150px",
        position: "relative",
      }}
    >
      {!isPalette ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          style={{
            width: "100%",
            textAlign:
              (notation.styleProperties
                .other!.find((prop) => prop.name === "Label Alignment")
                ?.default.toString() as "left" | "center" | "right") ||
              "center",
            borderBottom: `${borderWidth}px solid ${borderColor}`,
            paddingBottom: "4px",
            backgroundColor: "transparent",
            outline: "none",
            fontWeight: isEditing ? "bold" : "normal",
          }}
        />
      ) : (
        <span
          className={`w-full text-${
            notation.styleProperties.other!.find(
              (prop) => prop.name === "Label Alignment"
            )?.default
          } block border-b-[${
            borderWidth ? `${borderWidth}px` : "1px"
          }] border-[${borderColor ? borderColor : "black"}] pb-1`}
        >
          {title}
        </span>
      )}

      {compartments.length > 0 &&
        compartments.map((compartment, index) => (
          <Compartment
            key={`${index}-${
              compartment.semanticProperties.find(
                (prop) => prop.name === "Name"
              )?.default
            }`}
            text={
              compartment.semanticProperties
                .find((prop) => prop.name === "Name")
                ?.default.toString() || "Compartment"
            }
            style={{
              fontSize: `${
                notation.styleProperties.other!.find(
                  (props) => props.name === "Label Font Size"
                )?.default
              }px`,
            }}
            onChange={(newText) => handleCompartmentChange(index, newText)}
          />
        ))}

      <AddCircleOutlineOutlinedIcon
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "5px",
          right: "5px",
        }}
      />

      {showDropdown && (
        <FeatureDropdown
          features={features}
          onSelectFeature={handleSelectFeature}
        />
      )}

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

export default SquareNode;
*/
