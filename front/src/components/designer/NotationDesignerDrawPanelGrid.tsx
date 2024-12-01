import React, { useState, useEffect } from "react";
import {
  NotationRepresentationItem,
  Class,
  Representation,
  RepresentationMetaModel,
  MetaModel,
} from "../../types/types";
import ModalDoubleClickSquare from "./components/modals/first_layer/ModalDoubleClickSquare";
import ModalDoubleClickText from "./components/modals/first_layer/ModalDoubleClickText";
import ModalDoubleClickCompartment from "./components/modals/first_layer/ModalDoubleClickCompartment";
import ModalDoubleClickConnector from "./components/modals/first_layer/ModalDoubleClickConnector";

interface NotationDesignerDrawPanelGridProps {
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  selectedNotationElementIndex: number;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  gridSize: number;
}

const NotationDesignerDrawPanelGrid = ({
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  selectedNotationElementIndex,
  currentNotationElement,
  setCurrentNotationElement,
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  gridSize,
}: NotationDesignerDrawPanelGridProps) => {
  const [isSquareModalOpen, setIsSquareModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isCompartmentModalOpen, setIsCompartmentModalOpen] = useState(false);
  const [isConnectorModalOpen, setIsConnectorModalOpen] = useState(false);
  const [
    selectedNotationRepresentationItemIndex,
    setSelectedNotationRepresentationItemIndex,
  ] = useState<number | null>(null);

  // flag to track if any modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedNotationRepresentationItemIndex !== null && !isModalOpen) {
        const element = document.getElementById(
          `element-${selectedNotationRepresentationItemIndex}`
        );
        if (element && !element.contains(event.target as Node)) {
          setSelectedNotationRepresentationItemIndex(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedNotationRepresentationItemIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedNotationRepresentationItemIndex !== null) {
        const updatedRepresentation = [
          ...currentNotationElementRepresentation.graphicalRepresentation!,
        ];
        const element =
          updatedRepresentation[selectedNotationRepresentationItemIndex];
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
          case "Delete":
            updatedRepresentation.splice(
              selectedNotationRepresentationItemIndex,
              1
            );
            setSelectedNotationRepresentationItemIndex(null);
            break;
          default:
            return;
        }

        // update currentNotation's graphicalRepresentation directly
        setCurrentNotationElementRepresentation({
          ...currentNotationElementRepresentation,
          graphicalRepresentation: updatedRepresentation,
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedNotationRepresentationItemIndex,
    currentNotationElement,
    setCurrentNotationElement,
    currentNotationElementRepresentation,
    setCurrentNotationElementRepresentation,
    gridSize,
  ]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const shapeData = event.dataTransfer.getData("shape");
    const elementIndex = event.dataTransfer.getData("elementIndex");

    const grid = event.currentTarget.getBoundingClientRect();

    const x = Math.round((event.clientX - grid.left) / gridSize) * gridSize;
    const y = Math.round((event.clientY - grid.top) / gridSize) * gridSize;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation.graphicalRepresentation!,
    ];

    // if shapeData exists, this means we are adding a new element from the palette
    if (shapeData) {
      const representationData: NotationRepresentationItem =
        JSON.parse(shapeData);
      console.log("representationData", representationData);
      const newElement: NotationRepresentationItem = {
        shape: representationData.shape,
        style: representationData.style,
        position: representationData.position,
        content: representationData.content,
        markers: representationData.markers,
        text: representationData.text,
      };
      const extent = newElement.position?.extent || { width: 100, height: 100 };

      newElement.position = {
        x: x - (extent.width ?? 0) / 2,
        y: y - (extent.height ?? 0) / 2,
        extent,
      };
      console.log("newElement", newElement);

      // add new element to the graphicalRepresentation
      setCurrentNotationElementRepresentation({
        ...currentNotationElementRepresentation,
        graphicalRepresentation: [...updatedRepresentation, newElement],
      });

      // if elementIndex exists and is valid, this means we are moving an existing element
    } else if (elementIndex) {
      const index = parseInt(elementIndex, 10);

      // ensure that index is valid before accessing
      if (!isNaN(index) && index >= 0 && index < updatedRepresentation.length) {
        const extent = updatedRepresentation[index].position.extent || {
          width: 100,
          height: 100,
        };

        updatedRepresentation[index] = {
          ...updatedRepresentation[index],
          position: {
            x: x - (extent.width ?? 0) / 2,
            y: y - (extent.height ?? 0) / 2,
            extent,
          },
        };

        // update currentNotation's graphicalRepresentation directly
        setCurrentNotationElementRepresentation({
          ...currentNotationElementRepresentation,
          graphicalRepresentation: updatedRepresentation,
        });
      } else {
        console.error("Invalid index:", index);
      }
    } else {
      console.error(
        "Invalid operation: Neither shapeData nor valid elementIndex found"
      );
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.dataTransfer.setData("elementIndex", index.toString());
  };

  const handleElementClick = (index: number) => {
    setSelectedNotationRepresentationItemIndex(
      index === selectedNotationRepresentationItemIndex ? null : index
    );
  };

  const handleElementDoubleClick = (
    element: NotationRepresentationItem,
    index: number
  ) => {
    setSelectedNotationRepresentationItemIndex(index);
    switch (element.shape) {
      case "circle":
        // todo
        break;
      case "square":
        setIsSquareModalOpen(true);
        setIsModalOpen(true);
        break;
      case "text":
        setIsTextModalOpen(true);
        setIsModalOpen(true);
        break;
      case "compartment":
        setIsCompartmentModalOpen(true);
        setIsModalOpen(true);
        break;
      case "connector":
        setIsConnectorModalOpen(true);
        setIsModalOpen(true);
        break;
      default:
        console.error("Invalid shape:", element.shape);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotationRepresentationItemIndex(null);
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

    const updatedRepresentation = [
      ...currentNotationElementRepresentation.graphicalRepresentation!,
    ];
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

      // ensure the new dimensions are within the grid and positive
      if (newWidth > 0 && newHeight > 0) {
        element.position = {
          ...element.position,
          x: newX,
          y: newY,
          extent: { width: newWidth, height: newHeight },
        };

        setCurrentNotationElementRepresentation({
          ...currentNotationElementRepresentation,
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

  console.log("loaded meta model in draw panel", selectedMetaModel);

  return (
    <>
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
        {currentNotationElementRepresentation!.graphicalRepresentation &&
          currentNotationElementRepresentation!.graphicalRepresentation.map(
            (element, index) => (
              <div
                key={index}
                id={`element-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onClick={() => handleElementClick(index)}
                onDoubleClick={() => handleElementDoubleClick(element, index)}
                style={{
                  position: "absolute",
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.position.extent?.width || 100}px`,
                  height: `${element.position.extent?.height || 100}px`,
                  backgroundColor:
                    element.style?.backgroundColor || "transparent",
                  borderWidth: `${
                    element.shape === "compartment"
                      ? 1
                      : element.style?.borderWidth || 0
                  }px`,
                  borderStyle: element.style?.borderStyle || "solid",
                  borderColor:
                    element.shape === "compartment"
                      ? "#00b3ff"
                      : element.style?.borderColor || "black",
                  borderRadius: element.style?.borderRadius || 0,
                  color: element.style?.color || "black",
                  fontSize: `${element.style?.fontSize || 14}px`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign:
                    (element.style?.alignment as "left" | "right" | "center") ||
                    "center",
                  cursor: "move",
                  zIndex: element.style?.zIndex || 1,
                }}
              >
                {element.shape === "text" &&
                typeof element.text === "object" ? (
                  <span>
                    {"(ref: " +
                      currentNotationElement.attributes[
                        +element.text.$ref.split("attributes/")[1]
                      ].name +
                      ")"}
                  </span>
                ) : (
                  <span>{element.text as string}</span>
                )}

                {index === selectedNotationRepresentationItemIndex && (
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
                        height: "2px",
                        top: "-3px",
                        left: "0",
                        cursor: "ns-resize",
                        backgroundColor: "#ff0071",
                      }}
                      onMouseDown={(e) => handleResize(index, "top", e)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "2px",
                        bottom: "-3px",
                        left: "0",
                        cursor: "ns-resize",
                        backgroundColor: "#ff0071",
                      }}
                      onMouseDown={(e) => handleResize(index, "bottom", e)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: "2px",
                        height: "100%",
                        top: "0",
                        left: "-3px",
                        cursor: "ew-resize",
                        backgroundColor: "#ff0071",
                      }}
                      onMouseDown={(e) => handleResize(index, "left", e)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: "2px",
                        height: "100%",
                        top: "0",
                        right: "-3px",
                        cursor: "ew-resize",
                        backgroundColor: "#ff0071",
                      }}
                      onMouseDown={(e) => handleResize(index, "right", e)}
                    />
                  </>
                )}
              </div>
            )
          )}
      </div>

      <ModalDoubleClickSquare
        isSquareModalOpen={isSquareModalOpen}
        setIsSquareModalOpen={(isOpen) => {
          setIsSquareModalOpen(isOpen);
          if (!isOpen) handleCloseModal();
        }}
        currentNotationElementRepresentation={
          currentNotationElementRepresentation
        }
        setCurrentNotationElementRepresentation={
          setCurrentNotationElementRepresentation
        }
        currentNotationElement={currentNotationElement}
        setCurrentNotationElement={setCurrentNotationElement}
        selectedMetaModel={selectedMetaModel}
        setSelectedMetaModel={setSelectedMetaModel}
        selectedRepresentationMetaModel={selectedRepresentationMetaModel}
        setSelectedRepresentationMetaModel={setSelectedRepresentationMetaModel}
        selectedElementIndex={selectedNotationElementIndex}
        selectedNotationRepresentationItemIndex={
          selectedNotationRepresentationItemIndex
        }
      />

      <ModalDoubleClickText
        isTextModalOpen={isTextModalOpen}
        setIsTextModalOpen={(isOpen) => {
          setIsTextModalOpen(isOpen);
          if (!isOpen) handleCloseModal();
        }}
        currentNotationElementRepresentation={
          currentNotationElementRepresentation
        }
        setCurrentNotationElementRepresentation={
          setCurrentNotationElementRepresentation
        }
        currentNotationElement={currentNotationElement}
        setCurrentNotationElement={setCurrentNotationElement}
        selectedMetaModel={selectedMetaModel}
        setSelectedMetaModel={setSelectedMetaModel}
        selectedRepresentationMetaModel={selectedRepresentationMetaModel}
        setSelectedRepresentationMetaModel={setSelectedRepresentationMetaModel}
        selectedElementIndex={selectedNotationElementIndex}
        selectedNotationRepresentationItemIndex={
          selectedNotationRepresentationItemIndex
        }
      />

      <ModalDoubleClickCompartment
        isCompartmentModalOpen={isCompartmentModalOpen}
        setIsCompartmentModalOpen={(isOpen) => {
          setIsCompartmentModalOpen(isOpen);
          if (!isOpen) handleCloseModal();
        }}
        currentNotationElementRepresentation={
          currentNotationElementRepresentation
        }
        setCurrentNotationElementRepresentation={
          setCurrentNotationElementRepresentation
        }
        currentNotationElement={currentNotationElement}
        setCurrentNotationElement={setCurrentNotationElement}
        selectedMetaModel={selectedMetaModel}
        setSelectedMetaModel={setSelectedMetaModel}
        selectedRepresentationMetaModel={selectedRepresentationMetaModel}
        setSelectedRepresentationMetaModel={setSelectedRepresentationMetaModel}
        selectedElementIndex={selectedNotationElementIndex}
        selectedNotationRepresentationItemIndex={
          selectedNotationRepresentationItemIndex
        }
      />

      <ModalDoubleClickConnector
        isConnectorModalOpen={isConnectorModalOpen}
        setIsConnectorModalOpen={(isOpen) => {
          setIsConnectorModalOpen(isOpen);
          if (!isOpen) handleCloseModal();
        }}
        currentNotationElementRepresentation={
          currentNotationElementRepresentation
        }
        setCurrentNotationElementRepresentation={
          setCurrentNotationElementRepresentation
        }
        currentNotationElement={currentNotationElement}
        setCurrentNotationElement={setCurrentNotationElement}
        selectedMetaModel={selectedMetaModel}
        setSelectedMetaModel={setSelectedMetaModel}
        selectedRepresentationMetaModel={selectedRepresentationMetaModel}
        setSelectedRepresentationMetaModel={setSelectedRepresentationMetaModel}
        selectedElementIndex={selectedNotationElementIndex}
        selectedNotationRepresentationItemIndex={
          selectedNotationRepresentationItemIndex
        }
      />
    </>
  );
};

export default NotationDesignerDrawPanelGrid;
