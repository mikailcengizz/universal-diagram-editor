import React, { useEffect, useRef, useState } from "react";
import {
  DiagramNodeData,
  InstanceModel,
  NotationRepresentationItem,
  Representation,
  RepresentationInstanceModel,
  RepresentationInstanceObject,
} from "../../../types/types";
import { NodeResizer } from "@xyflow/react";
import RenderConnectors from "./components/RenderConnectors";
import ModalDoubleClickNotation from "./components/modals/first_layer/ModalDoubleClickNotation";
import ModalAddAttribute from "./components/modals/second_layer/ModalAddAttribute";
import RenderTexts from "./components/RenderTexts";
import RenderCompartments from "./components/RenderCompartments";
import RenderRectangles from "./components/RenderRectangles";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../../redux/actions/representationInstanceModelActions";
import ReferenceHelper from "../../helpers/ReferenceHelper";
import ModelHelperFunctions from "../../helpers/ModelHelperFunctions";
import { updateInstanceModel } from "../../../redux/actions/objectInstanceModelActions";
import RenderCircles from "./components/RenderCircles";

interface CombineObjectShapesNodeProps {
  id: string;
  data: DiagramNodeData;
  selected?: boolean;
}

const CombineObjectShapesNode = ({
  id: nodeId,
  data: initialData,
  selected,
}: CombineObjectShapesNodeProps) => {
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.instanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModel = useSelector(
    (state: any) => state.representationInstanceModelStore.model
  );

  const [data, setData] = useState<DiagramNodeData>({ ...initialData });
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isNodeAttributeModalOpen, setIsNodeAttributeModalOpen] =
    useState(false); // second layer modal for node attributes
  const [isNodeOperationModalOpen, setIsNodeOperationModalOpen] =
    useState(false); // second layer modal for node operations
  const isNotationSlider = data.isNotationSlider || false;
  const isPalette = data.instanceObject === undefined && !isNotationSlider;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1); // used for palette scaling
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });
  const [validGraphicalItems, setValidGraphicalItems] = useState<
    NotationRepresentationItem[]
  >([]);

  let representationRef = undefined;
  if (isPalette || isNotationSlider) {
    representationRef = data.notationElement?.representation!.$ref!;
  } else {
    representationRef = data.instanceObject?.representation!.$ref!;
  }
  const [representationUri, jsonPointer] = representationRef.split("#");
  let representation = ReferenceHelper.resolveRef(
    isPalette || isNotationSlider
      ? data.notation?.representationMetaModel.package
      : representationInstanceModel.package,
    jsonPointer
  )! as Representation | RepresentationInstanceObject;

  useEffect(() => {
    if (!representation) {
      return;
    }

    // filter valid graphical items
    const filteredGraphicalItems =
      representation.graphicalRepresentation!.filter(
        (item) =>
          (!isPalette || (isPalette && item.shape !== "connector")) &&
          (!isNotationSlider ||
            (isNotationSlider && item.shape !== "connector")) &&
          item.position &&
          item.position.x !== undefined &&
          item.position.y !== undefined
      );

    // set the valid graphical items
    setValidGraphicalItems(filteredGraphicalItems);

    // set container size for the graphical representation
    const maxWidth = Math.max(
      ...filteredGraphicalItems.map(
        (item) => item.position.extent?.width || 100
      )
    );
    const maxHeight = Math.max(
      ...filteredGraphicalItems.map(
        (item) => item.position.extent?.height || 100
      )
    );

    setContainerSize({
      width: maxWidth,
      height: maxHeight,
    });
    if (containerRef.current) {
      containerRef.current.style.width = `${maxWidth}px`;
      containerRef.current.style.height = `${maxHeight}px`;
    }
  }, [representation, isPalette, isNotationSlider]);

  let maxX = Math.max(
    ...validGraphicalItems.map(
      (item) => item.position.x + (item.position.extent?.width || 100)
    )
  );
  let maxY = Math.max(
    ...validGraphicalItems.map(
      (item) => item.position.y + (item.position.extent?.height || 100)
    )
  );

  useEffect(() => {
    if (containerRef.current && (isPalette || isNotationSlider)) {
      const scaleX = (isNotationSlider ? 97 : 54) / maxX;
      const scaleY = (isNotationSlider ? 97 : 54) / maxY;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    }

    if (containerRef.current) {
      // calculate the max width and max height when node is rendered on the canvas
      // to know our selection area when moving the node around
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
      if (!isPalette && !isNotationSlider) {
        containerRef.current.style.width = `${width}px`;
        containerRef.current.style.height = `${height}px`;
      }
    }
  }, [maxX, maxY, isPalette, isNotationSlider]);

  let adjustedRepresentation: NotationRepresentationItem[] =
    validGraphicalItems;

  if (isNotationSlider || isPalette) {
    // calculate the minimum x and y coordinates to center the notation in the palette/slider
    const minX = Math.min(
      ...validGraphicalItems.map((item) => item.position.x)
    );
    const minY = Math.min(
      ...validGraphicalItems.map((item) => item.position.y)
    );
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    adjustedRepresentation = validGraphicalItems.map((item) => ({
      ...item,
      position: {
        ...item.position,
        x: item.position.x - centerX + (isNotationSlider ? 97 / 2 : 105 / 2), // adjust for center in slider
        y: item.position.y - centerY + (isNotationSlider ? 97 / 2 : 105 / 2),
      },
    }));

    maxX = Math.max(
      ...adjustedRepresentation.map(
        (item) => item.position.x + (item.position.extent?.width || 100)
      )
    );
    maxY = Math.max(
      ...adjustedRepresentation.map(
        (item) => item.position.y + (item.position.extent?.height || 100)
      )
    );
  } else {
    // calculate the minimum x and y coordinates from the valid graphical items
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

  const handleResize = (
    event: any,
    { width, height }: { width: number; height: number }
  ) => {
    // find the class representation in local storage
    const notationElementRepresentationInstance =
      ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
        data.instanceObject!,
        representationInstanceModel
      );

    if (notationElementRepresentationInstance) {
      // get the original width and height of the container
      const originalWidth = containerSize.width;
      const originalHeight = containerSize.height;

      // calculate the uniform scaling factor based on the new width and height
      const scaleX = width / originalWidth;
      const scaleY = height / originalHeight;
      const uniformScale = Math.min(scaleX, scaleY);

      // update the container size based on the new width and height
      //setContainerSize({ width, height });
      setScale(uniformScale); // Set the uniform scaling factor

      if (containerRef.current) {
        containerRef.current.style.transform = `scale(${uniformScale})`;
      }

      // apply scaling to the graphical elements
      const updatedGraphicalRepresentation =
        notationElementRepresentationInstance.graphicalRepresentation!.map(
          (item) => {
            // scale both the position and the extent (size)
            return {
              ...item,
              position: {
                ...item.position,
                x: item.position.x, // scale position X
                y: item.position.y, // scale position Y
                extent: item.position.extent
                  ? {
                      width:
                        (item.position.extent?.width || 100) * uniformScale, // scale width
                      height:
                        (item.position.extent?.height || 100) * uniformScale, // scale height
                    }
                  : item.position.extent,
              },
            };
          }
        );

      const instanceObjectIndex = instanceModel.package.objects.findIndex(
        (obj) => obj.name === data.instanceObject!.name
      );

      // update the representation instance model with the scaled graphical representation
      const updatedRepresentationInstanceModel: RepresentationInstanceModel = {
        package: {
          ...representationInstanceModel.package,
          objects: representationInstanceModel.package.objects.map(
            (obj, index) => {
              if (index === instanceObjectIndex) {
                return {
                  ...obj,
                  graphicalRepresentation: updatedGraphicalRepresentation,
                };
              }
              return obj;
            }
          ),
        },
      };

      // dispatch the updated representation instance model to Redux
      dispatch(
        updateRepresentationInstanceModel(updatedRepresentationInstanceModel)
      );
    }
  };

  // handle text change
  const handleTextChange = (e: any, nameFromClassifier: string | undefined) => {
    const newDefaultValue = e.target.value;
    let newInstanceModel = { ...instanceModel };

    // update the name of the class
    newInstanceModel.package.objects.find(
      (cls) => cls.name === data.instanceObject!.name
    )!.name = newDefaultValue;
    dispatch(updateInstanceModel(newInstanceModel));
  };

  // filter and sort the shapes according to the specified rendering order
  // adjust notation size when rendering in palette
  const rectangles = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "square"
  );
  const circles = adjustedRepresentation.filter(
    (representationItem) => representationItem.shape === "circle"
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
        width:
          isPalette || isNotationSlider
            ? `${maxX}px`
            : `${containerSize.width}px`,
        height:
          isPalette || isNotationSlider
            ? `${maxY}px`
            : `${containerSize.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        display: "flex",
        justifyContent: isNotationSlider ? "center" : "flex-start",
        alignItems: isNotationSlider ? "center" : "flex-start",
      }}
    >
      {/* Render rectangles in the background */}
      <RenderRectangles
        rectangles={rectangles}
        data={data}
        isPalette={isPalette}
        isNotationSlider={isNotationSlider}
      />

      <RenderCircles
        circles={circles}
        data={data}
        isPalette={isPalette}
        isNotationSlider={isNotationSlider}
      />

      {/* Render compartments */}
      <RenderCompartments
        nodeId={nodeId}
        compartments={compartments}
        data={data}
        isNotationSlider={isNotationSlider}
        isPalette={isPalette}
      />

      {/* Render texts in the front */}
      <RenderTexts
        nodeId={nodeId}
        data={data}
        handleTextChange={handleTextChange}
        texts={texts}
        isNotationSlider={isNotationSlider}
        isPalette={isPalette}
      />

      {/* Render connectors in the front */}
      {!isPalette && !isNotationSlider && connectors.length > 0 && (
        <RenderConnectors
          connectors={connectors}
          id={nodeId}
          key={nodeId}
          data={data}
          instanceModel={instanceModel}
          isNotationSlider={isNotationSlider}
          isPalette={isPalette}
        />
      )}

      {/* Node resizer */}
      {!isPalette && !isNotationSlider && selected && (
        <NodeResizer
          color="#ff0071"
          onResize={handleResize}
          isVisible={selected}
          minWidth={100}
          minHeight={30}
        />
      )}

      {!isPalette && !isNotationSlider && (
        <>
          {/* Modal for double click */}
          <ModalDoubleClickNotation
            data={data}
            instanceModel={instanceModel}
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
            data={data}
            instanceModel={instanceModel}
            representationInstanceModel={representationInstanceModel}
            isNodeAttributeModalOpen={isNodeAttributeModalOpen}
            setIsNodeAttributeModalOpen={setIsNodeAttributeModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default CombineObjectShapesNode;
