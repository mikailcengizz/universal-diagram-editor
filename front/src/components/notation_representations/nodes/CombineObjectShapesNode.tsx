import React, { useEffect, useRef, useState } from "react";
import {
  Attribute,
  CustomNodeData,
  NotationRepresentationItem,
  Operation,
  Parameter,
  Property,
} from "../../../types/types";
import { NodeResizer } from "@xyflow/react";
import RenderConnectors from "./components/RenderConnectors";
import ModalDoubleClickNotation from "./components/modals/first_layer/ModalDoubleClickNotation";
import ModalAddAttribute from "./components/modals/second_layer/ModalAddAttribute";
import ModalAddParameter from "./components/modals/third_layer/ModalAddParameter";
import ModalAddOperation from "./components/modals/second_layer/ModalAddOperation";
import RenderTexts from "./components/RenderTexts";
import RenderCompartments from "./components/RenderCompartments";
import RenderRectangles from "./components/RenderRectangles";

interface CombineObjectShapesNodeProps {
  id: string;
  isPalette?: boolean;
  isNotationSlider?: boolean;
  data: CustomNodeData;
  selected?: boolean;
}

const CombineObjectShapesNode: React.FC<CombineObjectShapesNodeProps> = ({
  id,
  isPalette = false,
  isNotationSlider = false, // only used for slider item width
  data: initialData,
  selected,
}) => {
  const [data, setData] = useState<CustomNodeData>({ ...initialData });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1); // used for palette scaling
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
  const [isAddParameterModalOpen, setIsAddParameterModalOpen] = useState(false); // third layer modal for adding parameters to operations
  const [modifiyingAttribute, setModifyingAttribute] = useState<Attribute>({
    name: "",
    dataType: "",
    defaultValue: "",
    multiplicity: "",
    visibility: "public",
    unique: false,
    derived: false,
    constraints: "",
  });
  const [modifyingOperation, setModifyingOperation] = useState<Operation>({
    name: "",
    parameters: [],
    returnType: "",
    preconditions: "",
    postconditions: "",
    body: "",
    visibility: "public",
  });
  const [modifyingParameter, setModifyingParameter] = useState<Parameter>({
    name: "",
    dataType: "",
    defaultValue: "",
  });

  let adjustedRepresentation: NotationRepresentationItem[] = [];
  if (initialData.notation.graphicalRepresentation.length > 0) {
    const validGraphicalItems =
      initialData.notation.graphicalRepresentation.filter(
        (item) =>
          (!isPalette || (isPalette && item.shape !== "connector")) &&
          item.position.x !== undefined &&
          item.position.y !== undefined
      ); // Only filter out connectors if isPalette is true
    // sometimes the x and y are undefined when the notation is on the canvas

    // only adjust the representation if there are valid graphical items
    if (validGraphicalItems.length > 0) {
      // Calculate the minimum x and y coordinates from the valid graphical items
      const minX = Math.min(
        ...validGraphicalItems.map((item) => item.position.x)
      );
      const minY = Math.min(
        ...validGraphicalItems.map((item) => item.position.y)
      );
      adjustedRepresentation = validGraphicalItems.map((item) => {
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
      });
    }
  }

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

  // Set the size constraints for the grid columns
  const maxGridCellSize = isNotationSlider ? 97 : 54;

  // Calculate the scaling factor to fit the graphical representation into the grid column
  useEffect(() => {
    if (containerRef.current && isPalette) {
      const scaleX = maxGridCellSize / maxX;
      const scaleY = maxGridCellSize / maxY;

      // Choose the smaller scale to fit within the container
      const newScale = Math.min(scaleX, scaleY, 1);

      // Set the scale, ensuring it does not exceed the grid cell size
      setScale(newScale);
    }
  }, [maxX, maxY, isPalette]);

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
    // Calculate the aspect ratio of the container
    const aspectRatio = containerSize.width / containerSize.height;

    // Maintain aspect ratio: calculate the new height based on the aspect ratio and the new width
    const newWidth = width;
    const newHeight = newWidth / aspectRatio;

    // Calculate the new scale factor based on the width change
    const newScale = newWidth / containerSize.width;

    // Update the container size and scale
    setContainerSize({ width: newWidth, height: newHeight });
    setScale(newScale);

    // Update the container's transform style to apply the new scale
    if (containerRef.current) {
      containerRef.current.style.transform = `scale(${newScale})`;
    }
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
      const attributes = attributesProperty.defaultValue
        ? (attributesProperty.defaultValue as Array<any>)
        : [];

      attributes.push({ ...modifiyingAttribute });

      attributesProperty.defaultValue = attributes;

      setData({ ...data });
    }

    // Reset and close the modal
    setModifyingAttribute({
      name: "",
      dataType: "",
      defaultValue: "",
      multiplicity: "",
      visibility: "public",
      unique: false,
      derived: false,
      constraints: "",
    });
    setIsNodeAttributeModalOpen(false);
  };

  const handleOperationSubmit = () => {
    // Find the operation property
    const operationProperty = data.notation.properties.find(
      (prop) => prop.elementType === "Operation"
    );

    if (operationProperty) {
      const operations = operationProperty.defaultValue
        ? (operationProperty.defaultValue as Array<any>)
        : [];
      const newModifyingOperation = { ...modifyingOperation };

      // Find the index of the operation we are modifying
      const operationIndex = operations.findIndex(
        (operation) => operation.name === newModifyingOperation.name
      );

      // If the operation already exists, update it
      if (operationIndex !== -1) {
        operations[operationIndex] = newModifyingOperation;
      } else {
        // Otherwise, add the new operation
        operations.push(newModifyingOperation);
      }

      operationProperty.defaultValue = operations;

      setData({ ...data });
    }

    // Reset and close the modal
    setModifyingOperation({
      name: "",
      parameters: [],
      returnType: "",
      preconditions: "",
      postconditions: "",
      body: "",
      visibility: "public",
    });
    setIsNodeOperationModalOpen(false);
  };

  const handleParameterSubmit = () => {
    // Find the operation property
    const operationProperty = data.notation.properties.find(
      (prop) => prop.elementType === "Operation"
    );

    if (operationProperty) {
      const operations = operationProperty.defaultValue
        ? (operationProperty.defaultValue as Array<any>)
        : [];
      const newModifyingOperation = { ...modifyingOperation };

      // Find the index of the parameter we are modifying
      const parameterIndex = newModifyingOperation.parameters.findIndex(
        (parameter) => parameter.name === modifyingParameter.name
      );

      // If the parameter already exists, update it
      if (parameterIndex !== -1) {
        newModifyingOperation.parameters[parameterIndex] = modifyingParameter;
      } else {
        // Otherwise, add the new parameter
        newModifyingOperation.parameters.push(modifyingParameter);
      }

      // Find the index of the operation we are modifying
      const operationIndex = operations.findIndex(
        (operation) => operation.name === newModifyingOperation.name
      );

      // If the operation already exists, update it
      if (operationIndex !== -1) {
        operations[operationIndex] = newModifyingOperation;
      } else {
        // Otherwise, add the new operation
        operations.push(newModifyingOperation);
      }

      operationProperty.defaultValue = operations;

      setModifyingOperation(newModifyingOperation);
      setData({ ...data });
    }
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
      onDoubleClick={() => setIsNodeModalOpen(true)}
      style={{
        position: "relative",
        width: isPalette ? "100%" : `${containerSize.width}px`,
        height: isPalette ? "100%" : `${containerSize.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Render rectangles in the background */}
      <RenderRectangles
        rectangles={rectangles}
        isPalette={isPalette}
      />

      {/* Render compartments */}
      <RenderCompartments
        compartments={compartments}
        data={data}
        isPalette={isPalette}
      />

      {/* Render texts in the front */}
      <RenderTexts
        data={data}
        handleTextChange={handleTextChange}
        isPalette={isPalette}
        texts={texts}
      />

      {/* Render connectors in the front */}
      <RenderConnectors
        isPalette={isPalette}
        connectors={connectors}
        id={id}
        key={id}
      />

      {/* Node resizer */}
      {!isPalette && selected && (
        <NodeResizer
          color="#ff0071"
          onResize={handleResize}
          isVisible={selected}
          minWidth={100}
          minHeight={30}
        />
      )}

      {/* Modal for double click */}
      <ModalDoubleClickNotation
        data={data}
        isNodeAttributeModalOpen={isNodeAttributeModalOpen}
        isNodeModalOpen={isNodeModalOpen}
        isNodeOperationModalOpen={isNodeOperationModalOpen}
        setData={setData}
        setIsNodeAttributeModalOpen={setIsNodeAttributeModalOpen}
        setIsNodeModalOpen={setIsNodeModalOpen}
        setIsNodeOperationModalOpen={setIsNodeOperationModalOpen}
      />

      {/* Attribute modal */}
      {/* Add or modify attributes */}
      <ModalAddAttribute
        handleAttributeSubmit={handleAttributeSubmit}
        isNodeAttributeModalOpen={isNodeAttributeModalOpen}
        newAttribute={modifiyingAttribute}
        setIsNodeAttributeModalOpen={setIsNodeAttributeModalOpen}
        setNewAttribute={setModifyingAttribute}
      />

      {/* Operation modal */}
      {/* Add or modify operations */}
      <ModalAddOperation
        data={data}
        isNodeOperationModalOpen={isNodeOperationModalOpen}
        modifyingOperation={modifyingOperation}
        setModifyingOperation={setModifyingOperation}
        setIsNodeOperationModalOpen={setIsNodeOperationModalOpen}
        setIsAddParameterModalOpen={setIsAddParameterModalOpen}
        handleOperationSubmit={handleOperationSubmit}
      />

      {/* Add parameter modal */}
      <ModalAddParameter
        isAddParameterModalOpen={isAddParameterModalOpen}
        setIsAddParameterModalOpen={setIsAddParameterModalOpen}
        modifyingParameter={modifyingParameter}
        setModifyingParameter={setModifyingParameter}
        handleParameterSubmit={handleParameterSubmit}
      />
    </div>
  );
};

export default CombineObjectShapesNode;
