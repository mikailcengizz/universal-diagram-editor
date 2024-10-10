import React, { useEffect } from "react";
import {
  Class,
  DragData,
  MetaModel,
  Representation,
  RepresentationMetaModel,
} from "../../types/types";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineLinkShapesNode from "../notation_representations/edges/CombineLinkShapesNode";
import CombineRoleShapesNode from "../notation_representations/nodes/CombineRoleShapesNode";
import { Position } from "@xyflow/react";
import ReferenceHelper from "../helpers/ReferenceHelper";
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";

interface PaletteEditorPanelProps {
  selectedMetaModel: MetaModel;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  title: string | undefined;
  notationElements: Class[];
}

const PaletteEditorPanel = ({
  selectedMetaModel,
  selectedRepresentationMetaModel,
  title,
  notationElements,
}: PaletteEditorPanelProps) => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (selectedMetaModel && selectedRepresentationMetaModel) {
      setLoading(false);
    }
  }, [selectedMetaModel, selectedRepresentationMetaModel]);

  const onDragStart = (event: React.DragEvent, notationElement: Class) => {
    const dragData: DragData = {
      notationElement: notationElement,
    };

    event.dataTransfer.setData("palette-item", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", dragData);
  };

  let notationElementsRepresentation: Representation[] | null = null;
  if (
    selectedRepresentationMetaModel &&
    selectedRepresentationMetaModel.package.elements.length > 0
  ) {
    notationElementsRepresentation = notationElements.map(
      (notationElement) =>
        ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
          notationElement,
          selectedRepresentationMetaModel
        )!
    );
  }

  const renderNodePreview = (notationElement: Class) => {
    const notationElementIndex = notationElements.indexOf(notationElement);
    const notationElementRepresentation =
      notationElementsRepresentation![notationElementIndex]!;

    if (
      notationElementRepresentation &&
      notationElementRepresentation.graphicalRepresentation &&
      notationElementRepresentation.graphicalRepresentation.length > 0
    ) {
      switch (notationElementRepresentation.type) {
        case "ClassNode":
          return (
            <CombineObjectShapesNode
              key={notationElementIndex}
              id={notationElementIndex.toString()}
              data={{
                notation: {
                  metaModel: selectedMetaModel,
                  representationMetaModel: selectedRepresentationMetaModel,
                },
                notationElement: notationElement,
                instanceObject: undefined,
                position: undefined,
              }}
            />
          );
        case "ClassEdge":
          const { x, y, targetX, targetY } =
            notationElementRepresentation.graphicalRepresentation![0].position;
          return (
            <CombineLinkShapesNode
              key={notationElementIndex}
              id={notationElementIndex.toString()}
              data={{
                notation: {
                  metaModel: selectedMetaModel,
                  representationMetaModel: selectedRepresentationMetaModel,
                },
                notationElement: notationElement,
                instanceObject: undefined,
                position: undefined,
              }}
              sourceX={x}
              sourceY={y}
              targetX={targetX!}
              targetY={targetY!}
              sourcePosition={Position.Right}
              targetPosition={Position.Left}
            />
          );
        /* case "role":
        return <CombineRoleShapesNode />; */
      }
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
      className="overflow-y-scroll"
    >
      <h4>{title || "Palette"}</h4>

      {loading ? (
        <p>Loading...</p>
      ) : (
        notationElementsRepresentation && (
          <>
            {/* Classifiers: Class, DataType, Enumeration, ETypeParameter */}
            <h2>Classifier</h2>
            <div className="grid grid-cols-2">
              {notationElements
                .filter((notationElement, index) => {
                  const notationElementRepresentation =
                    notationElementsRepresentation![index];
                  return (
                    notationElementRepresentation &&
                    notationElementRepresentation.type === "ClassNode" &&
                    notationElementRepresentation.graphicalRepresentation
                      ?.length! > 0
                  );
                })
                .map((notationElement: Class, index) => (
                  <div
                    key={index}
                    onDragStart={(event) => onDragStart(event, notationElement)}
                    draggable
                    style={{
                      width: "62px",
                      height: "62px",
                      paddingLeft: "3px",
                      paddingTop: "3px",
                      border: "1px solid #ccc",
                      cursor: "grab",
                      backgroundColor: "#fff",
                    }}
                  >
                    {renderNodePreview(notationElement)}
                  </div>
                ))}
            </div>

            <h2>Relation</h2>
            <div className="grid grid-cols-2">
              {notationElements
                .filter((notationElement, index) => {
                  const notationElementRepresentation =
                    notationElementsRepresentation![index];
                  return (
                    notationElementRepresentation &&
                    notationElementRepresentation.type === "ClassEdge"
                  );
                })
                .map((notationElement: Class, index) => (
                  <div
                    key={index}
                    onDragStart={(event) => onDragStart(event, notationElement)}
                    draggable
                    style={{
                      margin: "10px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      cursor: "grab",
                      backgroundColor: "#fff",
                    }}
                  >
                    {renderNodePreview(notationElement)}
                  </div>
                ))}
            </div>
            <h2>Package</h2>
            <div className="grid grid-cols-2">
              {notationElements
                .filter(
                  (notationElement: Class) => notationElement.name === "Package"
                )
                .map((notationElement, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      backgroundColor: "transparent",
                      width: "75px",
                      height: "75px",
                    }}
                  >
                    <div
                      onDragStart={(event) =>
                        onDragStart(event, notationElement)
                      }
                      draggable
                      className="h-full w-full cursor-grab"
                    >
                      {renderNodePreview(notationElement)}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )
      )}
    </aside>
  );
};

export default PaletteEditorPanel;
