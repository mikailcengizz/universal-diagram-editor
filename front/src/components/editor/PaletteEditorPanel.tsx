import React from "react";
import {
  DragData,
  EClass,
  EPackage,
  InstanceNotation,
  MetaNotation,
} from "../../types/types";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesNode from "../notation_representations/edges/CombineRelationshipShapesEdge";
import CombineRoleShapesNode from "../notation_representations/nodes/CombineRoleShapesNode";
import { Position } from "@xyflow/react";

interface PaletteEditorPanelProps {
  title: string | undefined;
  notations: MetaNotation[];
}

const PaletteEditorPanel = ({ title, notations }: PaletteEditorPanelProps) => {
  const onDragStart = (event: React.DragEvent, notation: MetaNotation) => {
    const notationInstance: InstanceNotation = notation as InstanceNotation;
    const dragData: DragData = {
      notation: notationInstance,
      notationType: notation.type!,
    };

    event.dataTransfer.setData("palette-item", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", dragData);
  };

  const renderNodePreview = (notation: MetaNotation) => {
    const notationInstance: InstanceNotation = notation as InstanceNotation;
    switch (notation.name) {
      case "Class":
        return (
          <CombineObjectShapesNode
            key={notation.name}
            id={notation.name}
            data={{
              instanceNotation: notationInstance,
              metaNotations: notations,
              isPalette: true,
            }}
          />
        );
      case "EReference":
        const { x, y, targetX, targetY } =
          notation.graphicalRepresentation![0].position;
        return (
          <CombineRelationshipShapesNode
            key={notation.name}
            id={notation.name}
            isPalette={true}
            isNotationSlider={true}
            data={{
              instanceNotation: notationInstance,
              metaNotations: notations,
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
        {notations
          .filter(
            (notation) =>
              notation.name === "Class" ||
              notation.name === "DataType" ||
              notation.name === "Enumeration" ||
              notation.name === "ETypeParameter"
          )
          .map((notation: MetaNotation) => (
            <div
              key={notation.name}
              onDragStart={(event) => onDragStart(event, notation)}
              draggable
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                cursor: "grab",
                backgroundColor: "#fff",
              }}
            >
              {renderNodePreview(notation)}
            </div>
          ))}
      </div>

      <h2>Relation</h2>
      <div className="grid grid-cols-2">
        {notations
          .filter((notation) => notation.name === "Association")
          .map((notation: MetaNotation) => (
            <div
              key={notation.name}
              onDragStart={(event) => onDragStart(event, notation)}
              draggable
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                cursor: "grab",
                backgroundColor: "#fff",
              }}
            >
              {renderNodePreview(notation)}
            </div>
          ))}
      </div>
      <h2>Package</h2>
      <div className="grid grid-cols-2">
        {notations
          .filter((notation: MetaNotation) => notation.name === "Package")
          .map((notation) => (
            <div
              key={notation.name}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",
                width: "75px",
                height: "75px",
              }}
            >
              <div
                onDragStart={(event) => onDragStart(event, notation)}
                draggable
                className="h-full w-full cursor-grab"
              >
                {renderNodePreview(notation)}
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default PaletteEditorPanel;
