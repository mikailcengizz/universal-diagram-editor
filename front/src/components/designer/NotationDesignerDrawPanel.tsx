import React, { useState, useEffect } from "react";
import {
  Class,
  MetaModel,
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
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  saveNotation: (selectedElementIndex: number, removeElement: boolean) => void;
}

const gridSize = 10; // Size of the grid squares

function NotationDesignerDrawPanel({
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  saveNotation,
}: NotationDesignerDrawPanelProps) {
  return (
    <div className="flex flex-col border-t-[1px] border-gray-200">
      <PaletteDrawPanel
        selectedMetaModel={selectedMetaModel}
        currentNotationElement={currentNotationElement}
        saveNotation={(selectedElementIndex) =>
          saveNotation(selectedElementIndex, false)
        }
      />
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
          selectedMetaModel={selectedMetaModel}
          setSelectedMetaModel={setSelectedMetaModel}
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
