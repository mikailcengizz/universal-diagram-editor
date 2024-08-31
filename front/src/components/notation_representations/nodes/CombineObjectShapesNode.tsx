import React, { useEffect, useRef, useState } from "react";
import {
  CustomNodeData,
  Notation,
  NotationRepresentationItem,
  Property,
} from "../../../types/types";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import dataTypeHelper from "../helpers/DataTypeHelper";
import Modal from "../ui_elements/Modal";
import CustomModal from "../ui_elements/Modal";

interface CombineObjectShapesNodeProps {
  id: string;
  isPalette?: boolean;
  data: CustomNodeData;
  selected?: boolean;
}

const CombineObjectShapesNode: React.FC<CombineObjectShapesNodeProps> = ({
  id,
  isPalette = false,
  data: initialData,
  selected,
}) => {
  const [data, setData] = useState<CustomNodeData>({ ...initialData });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // Calculate the max width and max height when node is rendered on the canvas
  // to know our selection area when moving the node around
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

  const [containerSize, setContainerSize] = useState({
    width: maxWidth,
    height: maxHeight,
  });
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isNodeAttributeModalOpen, setIsNodeAttributeModalOpen] =
    useState(false); // second layer modal for node attributes
  const [isNodeOperationModalOpen, setIsNodeOperationModalOpen] =
    useState(false); // second layer modal for node operations
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    dataType: "",
    defaultValue: "",
    multiplicity: "",
    visibility: "",
    unique: false,
    derived: false,
    constraints: "",
  });

  let adjustedRepresentation: NotationRepresentationItem[] = [];
  console.log("initialData", initialData);
  if (initialData.notation.graphicalRepresentation.length > 0) {
    const validGraphicalItems =
      initialData.notation.graphicalRepresentation.filter(
        (item) =>
          (!isPalette || (isPalette && item.shape !== "connector")) &&
          item.position.x !== undefined &&
          item.position.y !== undefined
      ); // Only filter out connectors if isPalette is true
    // sometimes the x and y are undefined when the notation is on the canvas
    console.log("validGraphicalItems", validGraphicalItems);

    // only adjust the representation if there are valid graphical items
    if (validGraphicalItems.length > 0) {
      // Calculate the minimum x and y coordinates from the valid graphical items
      const minX = Math.min(
        ...validGraphicalItems.map((item) => item.position.x)
      );
      const minY = Math.min(
        ...validGraphicalItems.map((item) => item.position.y)
      );
      adjustedRepresentation = initialData.notation.graphicalRepresentation.map(
        (item) => {
          let newX = item.position.x - minX;
          let newY = item.position.y - minY;

          if (item.position.x === minX) {
            newX = 0; // if the x is the minimum, set it to 0 so that it starts from the left
          }
          if (item.position.y === minY) {
            newY = 0; // if the y is the minimum, set it to 0 so that it starts from the top
          }
          console.log("item", item);
          console.log("minX", minX);
          console.log("minY", minY);
          console.log("newX", newX);
          console.log("newY", newY);

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
    }
  }

  console.log("adjustedRepresentation", adjustedRepresentation);

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

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height }); // for extending the node when resizing
    }
  }, []);

  const handleResize = (
    event: any,
    { width, height }: { width: number; height: number }
  ) => {
    const aspectRatio = containerSize.width / containerSize.height;
    const newWidth = width;
    const newHeight = newWidth / aspectRatio;
    const newScale = newWidth / containerSize.width;

    setContainerSize({ width: newWidth, height: newHeight });
    setScale(newScale);
  };

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

  const handleAttributeSubmit = () => {
    // Find the "Attributes" collection
    const attributesProperty = data.notation.properties.find(
      (prop) => prop.elementType === "Attribute"
    );

    if (attributesProperty) {
      console.log("attributesProperty", attributesProperty);
      const attributes = attributesProperty.defaultValue
        ? (attributesProperty.defaultValue as Array<any>)
        : [];
      console.log("attributes", attributes);

      attributes.push({ ...newAttribute });

      attributesProperty.defaultValue = attributes;

      setData({ ...data });
    }

    // Reset and close the modal
    setNewAttribute({
      name: "",
      dataType: "",
      defaultValue: "",
      multiplicity: "",
      visibility: "",
      unique: false,
      derived: false,
      constraints: "",
    });
    setIsNodeAttributeModalOpen(false);
  };

  // Filter and sort the shapes according to the specified rendering order
  // adjust notation size when rendering in palette
  const rectangles = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "square"
  );
  console.log("adjusted rectangles", rectangles);
  const compartments = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "compartment"
  );
  console.log("adjusted compartments", compartments);
  const texts = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "text"
  );
  const connectors = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "connector"
  );

  return (
    <div
      ref={containerRef}
      onDoubleClick={() => setIsNodeModalOpen(true)}
      style={{
        position: "relative",
        width: isPalette ? "100%" : `${containerSize.width}px`,
        height: isPalette ? "100%" : `${containerSize.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        padding: `${(1 - scale) * 50}%`, // add padding to help center the content when scaled down
      }}
    >
      {/* Render rectangles in the background */}
      {rectangles.map((rect, index) => {
        console.log("rect", rect);

        return (
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
        );
      })}

      {/* Render compartments */}
      {compartments.map((compartment, index) => {
        const generatorName = compartment.generator;

        if (generatorName === "attributesForNotation") {
          const attributeProperty = data.notation.properties.find(
            (prop) => prop.elementType === "Attribute"
          )!;
          console.log("generating attributes", attributeProperty);
          console.log("compartment", compartment);

          return (
            <>
              {attributeProperty.defaultValue &&
                (attributeProperty.defaultValue as Array<any>).map(
                  (attribute, idx) => (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        left: `${compartment.position.x}px`,
                        top: `${compartment.position.y}px`,
                        width: `${compartment.position.extent?.width || 100}px`,
                        height: `${
                          compartment.position.extent?.height || 10
                        }px`,
                        maxWidth: `${
                          compartment.position.extent?.width || 100
                        }px`,
                        maxHeight: `${
                          compartment.position.extent?.height || 10
                        }px`,
                        borderLeft: "transparent",
                        borderTopColor: "black",
                        borderWidth: 1,
                        fontSize: `${compartment.style.fontSize}px`,
                        zIndex: 2,
                        wordWrap: "break-word",
                        padding: "2px 5px",
                        overflowX: "hidden",
                        overflowY: "scroll",
                      }}
                    >
                      <div key={idx}>
                        {attribute.name}: {attribute.dataType} [
                        {attribute.multiplicity}]
                        {attribute.visibility &&
                          `, Visibility: ${attribute.visibility}`}
                        {attribute.unique && ", Unique"}
                        {attribute.derived && ", Derived"}
                        {attribute.constraints &&
                          `, Constraints: ${attribute.constraints}`}
                        {` = ${attribute.defaultValue}`}
                      </div>
                    </div>
                  )
                )}
            </>
          );
        } else if (generatorName === "operationsForNotation") {
        }

        /* Default case for rendering direct text and not generator elements */
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

      {/* Node resizer */}
      {!isPalette && selected && (
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={100}
          minHeight={30}
          onResize={handleResize}
        />
      )}

      {/* Modal for double click */}
      <CustomModal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        zIndex={5}
      >
        <h2 className="font-semibold">{data.notation.name} Details</h2>

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
                  {/* Show all items in the collection */}
                  <div className="bg-white h-10 overflow-y-scroll">
                    {property.defaultValue &&
                      (property.defaultValue as Array<any>).map(
                        (item: any, idx: number) => (
                          <div key={idx}>
                            {item.name}: {item.dataType} [{item.multiplicity}]
                            {item.visibility &&
                              `, Visibility: ${item.visibility}`}
                            {item.unique && ", Unique"}
                            {item.derived && ", Derived"}
                            {item.constraints &&
                              `, Constraints: ${item.constraints}`}
                            {` = ${item.defaultValue}`}
                          </div>
                        )
                      )}
                  </div>
                  <br />
                  {/* Add and remove buttons */}
                  <div className="flex flex-row w-full">
                    <div
                      className="w-1/2 bg-black text-white text-center cursor-pointer"
                      onClick={() => {
                        if (property.elementType === "Attribute") {
                          setIsNodeAttributeModalOpen(true);
                        } else if (property.elementType === "Operation") {
                          setIsNodeOperationModalOpen(true);
                        }
                      }}
                    >
                      Add
                    </div>
                    <div className="w-1/2 text-center border-[1px] border-solid border-black cursor-pointer">
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

      {/* Attribute modal */}
      {/* Add or modify attributes */}
      <CustomModal
        isOpen={isNodeAttributeModalOpen}
        onClose={() => setIsNodeAttributeModalOpen(false)}
        zIndex={10}
      >
        <h2>Attribute</h2>
        {/* TODO: temporary hard coded fields, we need to get these from somewhere where an attribute can be defined*/}
        <label>Name</label>
        <br />
        <input
          type="text"
          value={newAttribute.name}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, name: e.target.value })
          }
        />
        <br />
        <label>Data type</label>
        <br />
        <input
          type="text"
          value={newAttribute.dataType}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, dataType: e.target.value })
          }
        />
        <label>Default value</label>
        <br />
        <input
          type="text"
          value={newAttribute.defaultValue}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, defaultValue: e.target.value })
          }
        />
        <label>Multiplicity</label>
        <br />
        <select
          name="multiplicity"
          value={newAttribute.multiplicity}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, multiplicity: e.target.value })
          }
        >
          <option value="0..1">0..1</option>
          <option value="0..*">0..*</option>
          <option value="1">1</option>
          <option value="1..*">1..*</option>
          <option value="*">*</option>
        </select>
        <br />
        <label>Visibility</label>
        <br />
        <select
          name="visibility"
          value={newAttribute.visibility}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, visibility: e.target.value })
          }
        >
          <option value="public">public</option>
          <option value="protected">protected</option>
          <option value="private">private</option>
          <option value="package">package</option>
          <option value="published">published</option>
        </select>
        <br />
        <label>Unique</label>
        <input
          type="checkbox"
          name="unique"
          checked={newAttribute.unique}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, unique: e.target.checked })
          }
        />
        <br />
        <label>Derived</label>
        <input
          type="checkbox"
          name="derived"
          checked={newAttribute.derived}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, derived: e.target.checked })
          }
        />
        <br />
        <label>Constraints</label>
        <br />
        <textarea name="constraints" />
        <button
          className="bg-black text-white px-2 py-[2px] font-semibold"
          onClick={handleAttributeSubmit}
        >
          Add Attribute
        </button>
      </CustomModal>
    </div>
  );
};

export default CombineObjectShapesNode;
