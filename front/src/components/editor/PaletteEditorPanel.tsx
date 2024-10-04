import React from "react";
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
  const onDragStart = (event: React.DragEvent, notationElement: Class) => {
    const dragData: DragData = {
      notationElement: notationElement,
    };

    event.dataTransfer.setData("palette-item", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", dragData);
  };

  const renderNodePreview = (notationElement: Class) => {
    const notationElementRepresentation =
      ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
        notationElement,
        selectedRepresentationMetaModel
      )!;

    switch (notationElementRepresentation.type) {
      case "ClassNode":
        return (
          <CombineObjectShapesNode
            key={notationElementRepresentation.name}
            id={notationElementRepresentation.name}
            data={{
              notation: selectedMetaModel,
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
            key={notationElementRepresentation.name}
            id={notationElementRepresentation.name}
            data={{
              notation: selectedMetaModel,
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

      {/* Classifiers: Class, DataType, Enumeration, ETypeParameter */}
      <h2>Classifier</h2>
      <div className="grid grid-cols-2">
        {notationElements
          .filter(
            (notationElement) =>
              notationElement.name === "Class" ||
              notationElement.name === "DataType" ||
              notationElement.name === "Enumeration" ||
              notationElement.name === "ETypeParameter"
          )
          .map((notationElement: Class) => (
            <div
              key={notationElement.name}
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

      <h2>Relation</h2>
      <div className="grid grid-cols-2">
        {notationElements
          .filter((notationElement) => notationElement.name === "Association")
          .map((notationElement: Class) => (
            <div
              key={notationElement.name}
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
          .map((notationElement) => (
            <div
              key={notationElement.name}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",
                width: "75px",
                height: "75px",
              }}
            >
              <div
                onDragStart={(event) => onDragStart(event, notationElement)}
                draggable
                className="h-full w-full cursor-grab"
              >
                {renderNodePreview(notationElement)}
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default PaletteEditorPanel;
