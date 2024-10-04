import React, { useState, useEffect } from "react";
import {
  Class,
  NotationRepresentationItem,
  Representation,
  RepresentationMetaModel,
} from "../../types/types";
import PaletteDrawPanel from "./PaletteDrawPanel";
import NotationDesignerDrawPanelGrid from "./NotationDesignerDrawPanelGrid";

interface NotationDesignerDrawPanelProps {
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: any) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  saveNotation: () => void;
}

const gridSize = 10; // Size of the grid squares

function NotationDesignerDrawPanel({
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  saveNotation,
}: NotationDesignerDrawPanelProps) {
  return (
    <div className="flex flex-col">
      <PaletteDrawPanel saveNotation={saveNotation} />
      <div className="flex flex-col overflow-y-auto">
        <NotationDesignerDrawPanelGrid
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          setCurrentNotationElementRepresentation={
            setCurrentNotationElementRepresentation
          }
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
          setSelectedRepresentationMetaModel={
            setSelectedRepresentationMetaModel
          }
          gridSize={gridSize}
        />
      </div>
    </div>
  );
}

export default NotationDesignerDrawPanel;
