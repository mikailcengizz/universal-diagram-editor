import React, { useState, useEffect } from "react";
import { Notation, NotationRepresentationItem } from "../../types/types";
import PaletteDrawPanel from "./PaletteDrawPanel";

interface NotationDesignerDrawPanelProps {
  currentNotation: Notation;
  setCurrentNotation: (value: any) => void;
}

const gridSize = 10; // Size of the grid squares

function NotationDesignerDrawPanel({
  currentNotation,
  setCurrentNotation,
}: NotationDesignerDrawPanelProps) {
  const [selectedElementIndex, setSelectedElementIndex] = useState<
    number | null
  >(null);

  // Handle click outside the selected element to deselect it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedElementIndex !== null) {
        const element = document.getElementById(
          `element-${selectedElementIndex}`
        );
        if (element && !element.contains(event.target as Node)) {
          setSelectedElementIndex(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedElementIndex]);

  // Handle keyboard arrow keys to move the selected element
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedElementIndex !== null) {
        const updatedRepresentation = [
          ...currentNotation.graphicalRepresentation,
        ];
        const element = updatedRepresentation[selectedElementIndex];
        const currentPosition = element.position;

        switch (event.key) {
          case "ArrowUp":
            currentPosition.y -= gridSize;
            break;
          case "ArrowDown":
            currentPosition.y += gridSize;
            break;
          case "ArrowLeft":
            currentPosition.x -= gridSize;
            break;
          case "ArrowRight":
            currentPosition.x += gridSize;
            break;
          default:
            return; // Do nothing for other keys
        }

        setCurrentNotation({
          ...currentNotation,
          graphicalRepresentation: updatedRepresentation,
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementIndex, currentNotation, setCurrentNotation]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const shapeData = event.dataTransfer.getData("shape");
    const elementIndex = event.dataTransfer.getData("elementIndex");

    const grid = event.currentTarget.getBoundingClientRect();

    // Calculate drop position, aligning to the grid
    const x = Math.round((event.clientX - grid.left) / gridSize) * gridSize;
    const y = Math.round((event.clientY - grid.top) / gridSize) * gridSize;

    if (shapeData) {
      // New element from the palette
      const newElement: NotationRepresentationItem = JSON.parse(shapeData);
      const extent = newElement.position?.extent || { width: 100, height: 100 };

      // Adjust position to align borders with grid
      newElement.position = {
        x: x - extent.width / 2,
        y: y - extent.height / 2,
        extent,
      };

      setCurrentNotation({
        ...currentNotation,
        graphicalRepresentation: [
          ...currentNotation.graphicalRepresentation,
          newElement,
        ],
      });
    } else if (elementIndex !== null) {
      // Repositioning existing element
      const index = parseInt(elementIndex);
      const updatedRepresentation = [
        ...currentNotation.graphicalRepresentation,
      ];

      const extent = updatedRepresentation[index].position.extent || {
        width: 100,
        height: 100,
      };

      updatedRepresentation[index] = {
        ...updatedRepresentation[index],
        position: {
          x: x - extent.width / 2,
          y: y - extent.height / 2,
          extent,
        },
      };

      setCurrentNotation({
        ...currentNotation,
        graphicalRepresentation: updatedRepresentation,
      });
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.dataTransfer.setData("elementIndex", index.toString());
  };

  const handleElementClick = (index: number) => {
    setSelectedElementIndex(index === selectedElementIndex ? null : index);
  };

  const handleResize = (
    index: number,
    direction:
      | "topLeft"
      | "topRight"
      | "bottomLeft"
      | "bottomRight"
      | "top"
      | "bottom"
      | "left"
      | "right",
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    event.preventDefault();

    const updatedRepresentation = [...currentNotation.graphicalRepresentation];
    const element = updatedRepresentation[index];

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.position.extent?.width || 100;
    const startHeight = element.position.extent?.height || 100;
    const startXPos = element.position.x;
    const startYPos = element.position.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX =
        Math.round((moveEvent.clientX - startX) / gridSize) * gridSize;
      const deltaY =
        Math.round((moveEvent.clientY - startY) / gridSize) * gridSize;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;

      switch (direction) {
        case "topLeft":
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          newX = startXPos + deltaX;
          newY = startYPos + deltaY;
          break;
        case "topRight":
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          newY = startYPos + deltaY;
          break;
        case "bottomLeft":
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          newX = startXPos + deltaX;
          break;
        case "bottomRight":
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case "top":
          newHeight = startHeight - deltaY;
          newY = startYPos + deltaY;
          break;
        case "bottom":
          newHeight = startHeight + deltaY;
          break;
        case "left":
          newWidth = startWidth - deltaX;
          newX = startXPos + deltaX;
          break;
        case "right":
          newWidth = startWidth + deltaX;
          break;
      }

      // Ensure the new dimensions are within the grid and positive
      if (newWidth > 0 && newHeight > 0) {
        element.position = {
          ...element.position,
          x: newX,
          y: newY,
          extent: { width: newWidth, height: newHeight },
        };

        setCurrentNotation({
          ...currentNotation,
          graphicalRepresentation: updatedRepresentation,
        });
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex flex-col">
      <PaletteDrawPanel />
      <div className="flex flex-col overflow-y-auto">
        <div
          className="relative bg-gray-100 border border-gray-200"
          style={{
            width: "100%",
            minHeight: "100vh",
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundImage: `linear-gradient(to right, #ebebeb 1px, transparent 1px),
                            linear-gradient(to bottom, #ebebeb 1px, transparent 1px)`,
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {currentNotation.graphicalRepresentation.map((element, index) => (
            <div
              key={index}
              id={`element-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onClick={() => handleElementClick(index)}
              style={{
                position: "absolute",
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.position.extent?.width || 100}px`,
                height: `${element.position.extent?.height || 100}px`,
                backgroundColor:
                  element.style?.backgroundColor || "transparent",
                borderWidth: `${element.style?.borderWidth || 0}px`,
                borderStyle: element.style?.borderStyle || "solid",
                borderColor: element.style?.borderColor || "black",
                borderRadius: `${element.style?.borderRadius || 0}px`,
                color: element.style?.color || "black",
                fontSize: `${element.style?.fontSize || 14}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: element.style?.alignment || "center",
                cursor: "move",
                zIndex: element.style?.zIndex || 1,
                boxShadow:
                  index === selectedElementIndex ? "0 0 0 2px #ff0071" : "none",
              }}
            >
              {element.shape === "text" && element.text}

              {index === selectedElementIndex && (
                <>
                  {/* Resize handles */}
                  {/* Corners */}
                  <div
                    style={{
                      position: "absolute",
                      width: "4px",
                      height: "4px",
                      backgroundColor: "#ff0071",
                      top: "-5px",
                      left: "-5px",
                      cursor: "nwse-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "topLeft", e)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "4px",
                      height: "4px",
                      backgroundColor: "#ff0071",
                      top: "-5px",
                      right: "-5px",
                      cursor: "nesw-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "topRight", e)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "4px",
                      height: "4px",
                      backgroundColor: "#ff0071",
                      bottom: "-5px",
                      left: "-5px",
                      cursor: "nesw-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "bottomLeft", e)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "4px",
                      height: "4px",
                      backgroundColor: "#ff0071",
                      bottom: "-5px",
                      right: "-5px",
                      cursor: "nwse-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "bottomRight", e)}
                  />

                  {/* Edges (outer line) */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "1px",
                      top: "-3px",
                      left: "0",
                      cursor: "ns-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "top", e)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "1px",
                      bottom: "-3px",
                      left: "0",
                      cursor: "ns-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "bottom", e)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "100%",
                      top: "0",
                      left: "-3px",
                      cursor: "ew-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "left", e)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "100%",
                      top: "0",
                      right: "-3px",
                      cursor: "ew-resize",
                    }}
                    onMouseDown={(e) => handleResize(index, "right", e)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotationDesignerDrawPanel;
