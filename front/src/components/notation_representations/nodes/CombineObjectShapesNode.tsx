import React, { useEffect, useRef, useState } from "react";
import {
  CustomNodeData,
  EAttribute,
  EAttributeInstance,
  EClass,
  EOperation,
  EParameter,
  MetaInstanceModelFile,
  NotationRepresentationItem,
  RepresentationInstanceModelFile,
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
import { updateMetaInstanceAttribute } from "../../../redux/actions/metaInstanceModelActions";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../../redux/actions/representationInstanceModelActions";

interface CombineObjectShapesNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
}

const CombineObjectShapesNode = ({
  id: nodeId,
  data: initialData,
  selected,
}: CombineObjectShapesNodeProps) => {
  const dispatch = useDispatch();
  const metaInstanceModel: MetaInstanceModelFile = useSelector(
    (state: any) => state.metaInstanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModelFile =
    useSelector((state: any) => state.representationInstanceModelStore.model);

  const [data, setData] = useState<CustomNodeData>({ ...initialData });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1); // used for palette scaling
  // Calculate the max width and max height when node is rendered on the canvas
  // to know our selection area when moving the node around
  const maxWidth = Math.max(
    ...data.instanceNotation.graphicalRepresentation!.map(
      (item) => item.position.extent?.width || 100
    )
  );

  const maxHeight = Math.max(
    ...data.instanceNotation.graphicalRepresentation!.map(
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
  const metaAttribute = data.metaNotations.find(
    (notation) => notation.name === "Attribute"
  )!;
  const [modifiyingAttribute, setModifyingAttribute] =
    useState<EAttributeInstance>({
      id: "",
      ...metaAttribute.eAttributes?.reduce(
        (acc, attribute) => ({
          ...acc,
          [attribute.name]: attribute.defaultValue,
        }),
        {}
      ),
    });

  const [modifyingOperation, setModifyingOperation] = useState<EOperation>({
    name: "",
    eParameters: [],
    eType: undefined,
  });
  const [modifyingParameter, setModifyingParameter] = useState<EParameter>({
    name: "",
    eType: undefined,
  });

  let adjustedRepresentation: NotationRepresentationItem[] = [];
  if (initialData.instanceNotation.graphicalRepresentation!.length > 0) {
    const validGraphicalItems =
      initialData.instanceNotation.graphicalRepresentation!.filter(
        (item) =>
          (!data.isPalette || (data.isPalette && item.shape !== "connector")) &&
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
  const maxGridCellSize = data.isNotationSlider ? 97 : 54;

  // Calculate the scaling factor to fit the graphical representation into the grid column
  useEffect(() => {
    if (containerRef.current && data.isPalette) {
      const scaleX = maxGridCellSize / maxX;
      const scaleY = maxGridCellSize / maxY;

      // Choose the smaller scale to fit within the container
      const newScale = Math.min(scaleX, scaleY, 1);

      // Set the scale, ensuring it does not exceed the grid cell size
      setScale(newScale);
    }
  }, [maxX, maxY, data.isPalette]);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height }); // for extending the node when resizing
    }

    // initialize newAttribute with default values of the meta attribute
    if (metaAttribute.eAttributes) {
      metaAttribute.eAttributes.forEach((attribute) => {
        if (!modifiyingAttribute[attribute.name as keyof EAttributeInstance]) {
          setModifyingAttribute({
            ...modifiyingAttribute,
            [attribute.name]: attribute.defaultValue,
          });
        }
      });
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

    // Calculate scaling factors based on the new size
    const scaleX = newWidth / containerSize.width;
    const scaleY = newHeight / containerSize.height;

    // Update the container size and scale
    setContainerSize({ width: newWidth, height: newHeight });
    setScale(scaleX); // Apply scaling uniformly for simplicity

    // Update the container's transform style to apply the new scale
    if (containerRef.current) {
      containerRef.current.style.transform = `scale(${scaleX})`;
    }

    // Find the classifier in the representation model by referenceMetaId
    const classifierInRepresentation =
      representationInstanceModel.ePackages[0].eClassifiers.find(
        (classifier) => classifier.referenceMetaId === nodeId
      );

    if (classifierInRepresentation) {
      // Calculate max dimensions of the original graphicalRepresentation items
      const originalMaxWidth = Math.max(
        ...classifierInRepresentation.graphicalRepresentation!.map(
          (item) => item.position.extent?.width || 100
        )
      );
      const originalMaxHeight = Math.max(
        ...classifierInRepresentation.graphicalRepresentation!.map(
          (item) => item.position.extent?.height || 100
        )
      );

      // Calculate overall scaling factor to maintain aspect ratio based on new width and height
      const scaleFactorWidth = newWidth / originalMaxWidth;
      const scaleFactorHeight = newHeight / originalMaxHeight;

      // Ensure both X and Y scaling maintain aspect ratio
      const uniformScaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

      // Update the extent (width and height) **and** position (x and y) for **all** items
      const updatedGraphicalRepresentation =
        classifierInRepresentation.graphicalRepresentation!.map((item) => {
          return {
            ...item,
            position: {
              ...item.position,
              x: item.position.x * uniformScaleFactor, // Scale position x
              y: item.position.y * uniformScaleFactor, // Scale position y
              extent: {
                width:
                  (item.position.extent?.width || 100) * uniformScaleFactor, // Scale width
                height:
                  (item.position.extent?.height || 100) * uniformScaleFactor, // Scale height
              },
            },
          };
        });

      // Update the classifier with the new graphicalRepresentation in the representation model
      const updatedRepresentationInstanceModel = {
        ...representationInstanceModel,
        ePackages: representationInstanceModel.ePackages.map((pkg) => ({
          ...pkg,
          eClassifiers: pkg.eClassifiers.map((classifier) => {
            if (classifier.referenceMetaId === nodeId) {
              return {
                ...classifier,
                graphicalRepresentation: updatedGraphicalRepresentation,
              };
            }
            return classifier;
          }),
        })),
      };

      // Dispatch the updated representation instance model to Redux
      dispatch(
        updateRepresentationInstanceModel(updatedRepresentationInstanceModel)
      );
    }
  };

  // Handle text change
  const handleTextChange = (e: any, nameFromClassifier: string | undefined) => {
    const newDefaultValue = e.target.value;
    let newInstanceModel = { ...metaInstanceModel };

    // update the name of the class
    newInstanceModel.ePackages[0].eClassifiers.find(
      (cls) => cls.name === data.instanceNotation.name
    )!.name = newDefaultValue;
    dispatch({ type: "UPDATE_MODEL", payload: newInstanceModel });
  };

  const handleAttributeSubmit = () => {
    // give the attribute a unique id if it is a new attribute
    let newAttribute = { ...modifiyingAttribute };
    if (!modifiyingAttribute.id) {
      newAttribute.id = `attribute-${Date.now()}`;
    }
    setModifyingAttribute(newAttribute);

    dispatch(updateMetaInstanceAttribute(nodeId, newAttribute));

    // Reset and close the modal
    // re-initialize newAttribute with default values of the meta attribute
    if (metaAttribute.eAttributes) {
      metaAttribute.eAttributes.forEach((attribute) => {
        if (!modifiyingAttribute[attribute.name as keyof EAttributeInstance]) {
          setModifyingAttribute({
            ...modifiyingAttribute,
            [attribute.name]: attribute.defaultValue,
          });
        }
      });
    }
    setIsNodeAttributeModalOpen(false);
  };

  const handleOperationSubmit = () => {
    // Find the "Operations" collection i.e if the classifier can have operations
    const operationReference = data.instanceNotation.eReferences!.find(
      (prop) => prop.name === "operations"
    );

    if (operationReference) {
      const operations = data.instanceNotation.eOperations
        ? (data.instanceNotation.eOperations as Array<any>)
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

      data.instanceNotation.eOperations = operations;

      setData({ ...data });
    }

    // Reset and close the modal
    setModifyingOperation({
      name: "",
      eParameters: [],
      eType: undefined,
    });
    setIsNodeOperationModalOpen(false);
  };

  const handleParameterSubmit = () => {
    // Find the "Operations" collection i.e if the classifier can have operations
    const operationReference = data.instanceNotation.eOperations!.find(
      (prop) => prop.name === "operations"
    );

    if (operationReference) {
      const operations = data.instanceNotation.eOperations
        ? (data.instanceNotation.eOperations as Array<any>)
        : [];
      const newModifyingOperation = { ...modifyingOperation };

      // Find the index of the parameter we are modifying
      const parameterIndex = newModifyingOperation.eParameters!.findIndex(
        (parameter) => parameter.name === modifyingParameter.name
      );

      // If the parameter already exists, update it
      if (parameterIndex !== -1) {
        newModifyingOperation.eParameters![parameterIndex] = modifyingParameter;
      } else {
        // Otherwise, add the new parameter
        newModifyingOperation.eParameters!.push(modifyingParameter);
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

      data.instanceNotation.eOperations = operations;

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
        width: data.isPalette ? "100%" : `${containerSize.width}px`,
        height: data.isPalette ? "100%" : `${containerSize.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Render rectangles in the background */}
      <RenderRectangles rectangles={rectangles} data={data} />

      {/* Render compartments */}
      <RenderCompartments
        nodeId={nodeId}
        compartments={compartments}
        data={data}
      />

      {/* Render texts in the front */}
      <RenderTexts
        nodeId={nodeId}
        data={data}
        handleTextChange={handleTextChange}
        texts={texts}
      />

      {/* Render connectors in the front */}
      <RenderConnectors connectors={connectors} id={nodeId} key={nodeId} />

      {/* Node resizer */}
      {!data.isPalette && selected && (
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
        nodeId={nodeId}
        data={data}
        isNodeAttributeModalOpen={isNodeAttributeModalOpen}
        isNodeModalOpen={isNodeModalOpen}
        isNodeOperationModalOpen={isNodeOperationModalOpen}
        setData={setData}
        setIsNodeAttributeModalOpen={setIsNodeAttributeModalOpen}
        setIsNodeModalOpen={setIsNodeModalOpen}
        setIsNodeOperationModalOpen={setIsNodeOperationModalOpen}
        onDataUpdate={(updatedData) => {
          setData(updatedData);
        }}
      />

      {/* Attribute modal */}
      {/* Add or modify attributes */}
      <ModalAddAttribute
        handleAttributeSubmit={handleAttributeSubmit}
        isNodeAttributeModalOpen={isNodeAttributeModalOpen}
        metaAttribute={metaAttribute}
        newAttribute={modifiyingAttribute}
        setNewAttribute={setModifyingAttribute}
        setIsNodeAttributeModalOpen={setIsNodeAttributeModalOpen}
      />

      {/* Operation modal */}
      {/* Add or modify operations */}
      {/* <ModalAddOperation
        data={data}
        isNodeOperationModalOpen={isNodeOperationModalOpen}
        modifyingOperation={modifyingOperation}
        setModifyingOperation={setModifyingOperation}
        setIsNodeOperationModalOpen={setIsNodeOperationModalOpen}
        setIsAddParameterModalOpen={setIsAddParameterModalOpen}
        handleOperationSubmit={handleOperationSubmit}
      /> */}

      {/* Add parameter modal */}
      {/* <ModalAddParameter
        isAddParameterModalOpen={isAddParameterModalOpen}
        setIsAddParameterModalOpen={setIsAddParameterModalOpen}
        modifyingParameter={modifyingParameter}
        setModifyingParameter={setModifyingParameter}
        handleParameterSubmit={handleParameterSubmit}
      /> */}
    </div>
  );
};

export default CombineObjectShapesNode;
