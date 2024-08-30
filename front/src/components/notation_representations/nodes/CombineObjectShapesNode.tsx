import React, { useEffect, useRef, useState } from "react";
import { CustomNodeData, Notation, Property } from "../../../types/types";
import { Handle, Position } from "@xyflow/react";
import dataTypeHelper from "../helpers/DataTypeHelper";
import Modal from "../ui_elements/Modal";
import CustomModal from "../ui_elements/Modal";

interface CombineObjectShapesNodeProps {
  id: string;
  isPalette?: boolean;
  data: CustomNodeData;
}

const CombineObjectShapesNode: React.FC<CombineObjectShapesNodeProps> = ({
  id,
  isPalette = false,
  data: initialData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [data, setData] = useState<CustomNodeData>({ ...initialData });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the max width and max height when node is rendered on the canvas to know our selection area when moving node around
  const maxWidth = Math.max(
    ...data.notation.graphicalRepresentation.map(
      (item) => item.position.extent?.width || 100
    )
  );

  const maxHeight = Math.max(
    ...data.notation.graphicalRepresentation.map(
      (item) => item.position.extent?.height || 100
    )
  );

  // Calculate the minimum x and y coordinates
  const minX = Math.min(
    ...data.notation.graphicalRepresentation
      .filter((item) => isPalette && item.shape !== "connector")
      .map((item) => item.position.x)
  );
  const minY = Math.min(
    ...data.notation.graphicalRepresentation
      .filter((item) => isPalette && item.shape !== "connector")
      .map((item) => item.position.y)
  );

  // Adjust positions based on the minimum x and y to normalize the coordinates
  const adjustedRepresentation = data.notation.graphicalRepresentation.map(
    (item) => {
      let newX = item.position.x - minX;
      let newY = item.position.y - minY;
      if (item.position.x === minX) {
        newX = 0; // if the x is the minimum, set it to 0 so that it starts from the left
      }
      if (item.position.y === minY) {
        newY = 0; // if the y is the minimum, set it to 0 so that it starts from the top
      }
      return {
        ...item,
        position: {
          ...item.position,
          x: newX,
          y: newY,
        },
      };
    }
  );

  // Calculate scale factor based on container size and max element size
  useEffect(() => {
    if (containerRef.current && isPalette) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const maxX = Math.max(
        ...adjustedRepresentation.map(
          (item) => item.position.x + (item.position.extent?.width || 100)
        )
      );
      const maxY = Math.max(
        ...adjustedRepresentation.map(
          (item) => item.position.y + (item.position.extent?.height || 100)
        )
      );

      const scaleX = containerWidth / maxX;
      const scaleY = containerHeight / maxY;
      const newScale = Math.min(scaleX, scaleY, 1); // Choose the smaller scale to fit within the container

      // Set a minimum scale to avoid making content too small
      const minScale = 0.5;
      setScale(Math.max(newScale, minScale));
    }
  }, [adjustedRepresentation]);

  // Handle text change
  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    originalIndex: number,
    propertyFromText: Property | undefined
  ) => {
    const newDefaultValue = event.target.value;

    // update the default value of the property
    propertyFromText!.defaultValue = newDefaultValue;

    // update the data
    const newData = { ...data };
    newData.notation.properties = data.notation.properties.map((prop) =>
      prop.name === propertyFromText!.name ? propertyFromText! : prop
    );

    setData(newData);
  };

  const handleDoubleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filter and sort the shapes according to the specified rendering order
  // adjust notation size when rendering in palette
  const rectangles = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "square"
  );
  const compartments = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "compartment"
  );
  const texts = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "text"
  );
  const connectors = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "connector"
  );

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "relative",
        width: isPalette ? "100%" : `${maxWidth}px`,
        height: isPalette ? "100%" : `${maxHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        padding: `${(1 - scale) * 50}%`, // add padding to help center the content when scaled down
      }}
    >
      {/* Render rectangles in the background */}
      {rectangles.map((rect, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${rect.position.x}px`,
            top: `${rect.position.y}px`,
            width: `${rect.position.extent?.width || 100}px`,
            height: `${rect.position.extent?.height || 100}px`,
            backgroundColor: rect.style.backgroundColor,
            borderColor: rect.style.borderColor,
            borderWidth: rect.style.borderWidth,
            borderStyle: rect.style.borderStyle,
          }}
        />
      ))}

      {/* Render compartments */}
      {compartments.map((compartment, index) => {
        const generatorName = compartment.generator;

        if (generatorName === "attributesForNotation") {
        } else if (generatorName === "operationsForNotation") {
        }

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${compartment.position.x}px`,
              top: `${compartment.position.y}px`,
              width: `${compartment.position.extent?.width || 100}px`,
              height: `${compartment.position.extent?.height || 10}px`,
              borderColor: "transparent",
              borderWidth: 0,
            }}
          />
        );
      })}

      {/* Render texts in the front */}
      {texts.map((textItem, idx) => {
        const originalIndex = data.notation.graphicalRepresentation.findIndex(
          (item) => item === textItem
        );
        const propertyFromText = data.notation.properties.find(
          (prop) => prop.name === textItem.text
        );

        // we dont want editable field in palette notations
        if (isPalette) {
          return (
            <span
              key={idx}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${textItem.position.extent?.width || 100}px`,
                height: `${textItem.position.extent?.height || 20}px`,
                color: textItem.style.color,
                fontSize: `${textItem.style.fontSize}px`,
                textAlign: textItem.style.alignment as
                  | "left"
                  | "center"
                  | "right",
              }}
            >
              {textItem.text}
            </span>
          );
        } else {
          return (
            <input
              key={idx}
              type={dataTypeHelper.determineInputFieldType(
                propertyFromText!.dataType
              )}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${textItem.position.extent?.width || 100}px`,
                height: `${textItem.position.extent?.height || 20}px`,
                color: textItem.style.color,
                backgroundColor: "transparent",
                fontSize: `${textItem.style.fontSize}px`,
                textAlign: textItem.style.alignment as
                  | "left"
                  | "center"
                  | "right",
              }}
              value={propertyFromText?.defaultValue as string | number}
              onChange={(e) =>
                handleTextChange(e, originalIndex, propertyFromText)
              }
            />
          );
        }
      })}

      {/* Render connectors in the front */}
      {!isPalette &&
        id &&
        connectors.map((connector, index) => (
          <Handle
            type={connector.style.alignment === "left" ? "source" : "target"} // can not set exact position on connector so will stick with this for now
            position={connector.style.alignment as Position} // temp
            style={{ background: connector.style.color }}
            id={`source-${index}`}
            key={index}
          />
        ))}

      {/* Modal for double click */}
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{data.notation.name} Details</h2>
        <p>Here you can edit the properties of the notation</p>

        <div>
          {data.notation.properties.map((property, index) => {
            const propertyDataType = property.dataType;

            if (propertyDataType === "Collection") {
              // show a text area for all items in the collection and
              // allow the user to add items through a new modal by clicking a button and
              // allow the user to remove items by selecting the item and clicking a remove button
              return (
                <div key={index}>
                  <label>{property.name}</label>
                  <br />
                  <textarea
                    value={property.defaultValue as string}
                    onChange={(e) => {
                      property.defaultValue = e.target.value;
                      setData({ ...data });
                    }}
                  />
                  <br />
                  <div className="flex flex-row w-full">
                    <div className="w-1/2 bg-black text-white text-center">
                      Add
                    </div>
                    <div className="w-1/2 text-center border-[1px] border-solid border-black">
                      Remove
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={index}>
                <label>{property.name}</label>
                <input
                  type={dataTypeHelper.determineInputFieldType(
                    property.dataType
                  )}
                  value={property.defaultValue as string | number}
                  onChange={(e) => {
                    property.defaultValue = e.target.value;
                    setData({ ...data });
                  }}
                />
              </div>
            );
          })}
        </div>
      </CustomModal>
    </div>
  );
};

export default CombineObjectShapesNode;
