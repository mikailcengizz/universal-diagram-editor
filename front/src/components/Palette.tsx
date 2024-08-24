import React from "react";
import RectangleNode from "./notation_representations/nodes/RectangleNode";
import { Notation, Notations } from "../types/types";

interface PaletteProps {
  title: string | undefined;
  elements: Notations;
}

const Palette = ({ title, elements }: PaletteProps) => {
  const onDragStart = (event: React.DragEvent, element: Notation) => {
    event.dataTransfer.setData(
      "application/reactflow",
      element.semanticProperties.find((prop) => prop.name === "Name")?.default!
    );
    event.dataTransfer.setData(
      "element-label",
      element.semanticProperties.find((prop) => prop.name === "Name")?.default!
    );
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", element);
  };

  const renderNodePreview = (element: Notation) => {
    switch (
      element.styleProperties.general.find(
        (property) => property.name === "Shape"
      )?.default
    ) {
      case "square":
        return (
          <RectangleNode
            id="rectangle-preview"
            notation={element}
            isPalette={true}
          />
        );
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
