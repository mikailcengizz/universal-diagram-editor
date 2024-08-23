import React from "react";
import { Notation } from "../types/types";
import RectangleNode from "./notation_representations/nodes/RectangleNode";

interface PaletteProps {
  title: string | undefined;
  elements: Notation[];
}

const Palette = ({ title, elements }: PaletteProps) => {
  const onDragStart = (event: React.DragEvent, element: Notation) => {
    event.dataTransfer.setData("application/reactflow", element.name);
    event.dataTransfer.setData("element-label", element.label!);
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", element); // log the dragged element

    // Create a temporary element to use as the drag image
    const dragImage = document.createElement("div");
    dragImage.style.width = "100px"; // adjust size as needed
    dragImage.style.height = "50px";
    dragImage.style.backgroundColor = "white";
    dragImage.style.border = "1px solid black";
    dragImage.style.textAlign = "center";
    dragImage.style.lineHeight = "50px";
    dragImage.innerText = element.label || "Dragging...";

    // Make the drag image invisible to avoid showing it in the DOM
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 50, 25);

    // Remove the drag image after a short delay
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const renderNodePreview = (element: Notation) => {
    switch (element.shape) {
      case "rectangle":
        return (
          <RectangleNode
            id="rectangle-preview"
            notation={element}
            isPalette={true}
          />
        );
      // add cases for other custom node types as needed
      default:
        return <div>{element.label}</div>;
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
      <div className="flex">
        {elements.map((element) => (
          <div
            key={element.name}
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
