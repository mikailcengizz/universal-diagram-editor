import React from "react";
import SquareNode from "./notation_representations/nodes/SquareNode";
import { Notation, Notations } from "../types/types";

interface PaletteProps {
  title: string | undefined;
  elements: Notations;
}

const Palette = ({ title, elements }: PaletteProps) => {
  const onDragStart = (event: React.DragEvent, element: Notation) => {
    const dragData = {
      notation: element,
      features: elements.features, // Pass the features related to this element
    };

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(dragData)
    );
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", dragData);
  };

  const renderNodePreview = (element: Notation) => {
    const data = {
      label: element.semanticProperties.find((prop) => prop.name === "Name")
        ?.default!,
      notation: element,
      features: elements.features,
      relations: elements.relations,
    };

    switch (
      element.styleProperties.general!.find(
        (property) => property.name === "Shape"
      )?.default
    ) {
      case "square":
        return <SquareNode id="square-preview" isPalette={true} data={data} />;
      // Add cases for other shapes as needed
      default:
        return (
          <div>
            {
              element.semanticProperties.find((prop) => prop.name === "Name")
                ?.default!
            }
          </div>
        );
    }
  };

  return (
    <aside
      style={{
        padding: "10px",
        width: "19%",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        borderRight: "1px solid #ddd",
      }}
    >
      <h4>{title || "Palette"}</h4>
      <div className="flex flex-wrap">
        {elements.classifiers.map((element: Notation) => (
          <div
            key={
              element.semanticProperties.find((prop) => prop.name === "Name")
                ?.default!
            }
            onDragStart={(event) => onDragStart(event, element)}
            draggable
            style={{
              margin: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              cursor: "grab",
              backgroundColor: "#fff",
            }}
          >
            {renderNodePreview(element)}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Palette;
