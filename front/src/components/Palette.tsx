import React from "react";
import { DragData, Notation, Notations } from "../types/types";
import CombineObjectShapesNode from "./notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesNode from "./notation_representations/nodes/CombineRelationshipShapesNode";
import CombineRoleShapesNode from "./notation_representations/nodes/CombineRoleShapesNode";

interface PaletteProps {
  title: string | undefined;
  notations: Notations;
}

const Palette = ({ title, notations }: PaletteProps) => {
  const onDragStart = (event: React.DragEvent, notation: Notation) => {
    const dragData: DragData = {
      notation: notation,
      notationType: notation.type,
    };

    event.dataTransfer.setData("palette-item", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "move";
    console.log("onDragStart - element dragged:", dragData);
  };

  const renderNodePreview = (notation: Notation) => {
    const notationType = notation.type;

    switch (notationType) {
      case "object":
        return (
          <CombineObjectShapesNode
            key={notation.name}
            id={notation.name}
            isPalette={true}
            data={{ notation }}
          />
        );
      case "relationship":
        return <CombineRelationshipShapesNode />;
      case "role":
        return <CombineRoleShapesNode />;
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
    >
      <h4>{title || "Palette"}</h4>
      <h2>Objects</h2>
      <div className="grid grid-cols-2">
        {notations.objects.map((notation: Notation) => (
          <div
            key={notation.name}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              backgroundColor: "transparent",
              maxWidth: "75px",
              width: "75px",
              maxHeight: "75px",
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
      <h2>Relationships</h2>
      <div className="flex flex-wrap">
        {notations.relationships.map((notation: Notation) => (
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
      <h2>Roles</h2>
      <div className="flex flex-wrap">
        {notations.roles.map((notation: Notation) => (
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
    </aside>
  );
};

export default Palette;
