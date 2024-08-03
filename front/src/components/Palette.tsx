import React from "react";
import { ConfigElement } from "../types/types";

interface PaletteProps {
  title: string | undefined;
  elements: ConfigElement[];
}

const Palette = ({ title, elements }: PaletteProps) => {
  const onDragStart = (event: React.DragEvent, element: ConfigElement) => {
    event.dataTransfer.setData("application/reactflow", element.id);
    event.dataTransfer.setData("element-label", element.label);
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", element); // log the dragged element
  };

  return (
    <aside
      style={{
        padding: "10px",
        width: "100%",
        backgroundColor: "#f4f4f4",
        borderRight: "1px solid #ddd",
      }}
    >
      <h4>{title || "Palette"}</h4>
      <div className="flex">
        {elements.map((element) => (
          <div
            key={element.id}
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
            {element.label}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Palette;
