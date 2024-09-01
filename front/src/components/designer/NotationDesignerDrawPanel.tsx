import React from "react";
import { Notation } from "../../types/types";
import PaletteDrawPanel from "./PaletteDrawPanel";

interface NotationDesignerDrawPanelProps {
  currentNotation: Notation;
  setCurrentNotation: (value: any) => void;
  newGraphicalElement: any;
  setNewGraphicalElement: (value: any) => void;
  handleAddGraphicalElement: () => void;
}

const gridSize = 10; // Size of the grid squares

function NotationDesignerDrawPanel({
  currentNotation,
  setCurrentNotation,
  newGraphicalElement,
  setNewGraphicalElement,
  handleAddGraphicalElement,
}: NotationDesignerDrawPanelProps) {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.dataTransfer.setData("elementIndex", index.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const elementIndex = parseInt(event.dataTransfer.getData("elementIndex"));
    const grid = event.currentTarget.getBoundingClientRect();
    const x = Math.round((event.clientX - grid.left) / gridSize) * gridSize;
    const y = Math.round((event.clientY - grid.top) / gridSize) * gridSize;

    const updatedRepresentation = [...currentNotation.graphicalRepresentation];
    updatedRepresentation[elementIndex] = {
      ...updatedRepresentation[elementIndex],
      position: { ...updatedRepresentation[elementIndex].position, x, y },
    };

    setCurrentNotation({
      ...currentNotation,
      graphicalRepresentation: updatedRepresentation,
    });
  };

  return (
    <div className="flex">
      <PaletteDrawPanel />
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">Draw Panel</h2>
        <div
          className="relative bg-gray-100 border border-gray-400"
          style={{
            width: "400px",
            height: "400px",
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundImage: `linear-gradient(to right, lightgray 1px, transparent 1px),
                            linear-gradient(to bottom, lightgray 1px, transparent 1px)`,
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {currentNotation.graphicalRepresentation.map((element, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              style={{
                position: "absolute",
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.position.extent?.width || 100}px`,
                height: `${element.position.extent?.height || 100}px`,
                backgroundColor:
                  element.style?.backgroundColor || "transparent",
                border: `${element.style?.borderWidth || 1}px ${
                  element.style?.borderStyle || "solid"
                } ${element.style?.borderColor || "black"}`,
                color: element.style?.color || "black",
                fontSize: `${element.style?.fontSize || 14}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: element.style?.alignment || "center",
                cursor: "move",
              }}
            >
              {element.shape === "text" ? element.text : element.shape}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotationDesignerDrawPanel;
