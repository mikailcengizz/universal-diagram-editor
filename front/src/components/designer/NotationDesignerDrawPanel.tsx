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
import NotationDesignerDrawEdge from "./NotationDesignerDrawEdge";

interface NotationDesignerDrawPanelProps {
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  selectedNotationElementIndex: number;
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
  selectedNotationElementIndex,
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
        currentNotationElementRepresentation={
          currentNotationElementRepresentation
        }
        saveNotation={(selectedElementIndex) =>
          saveNotation(selectedElementIndex, false)
        }
      />
      <div className="flex flex-col overflow-y-auto">
        {currentNotationElementRepresentation.type === "ClassNode" ? (
          // draw panel grid for nodes
          <NotationDesignerDrawPanelGrid
            currentNotationElementRepresentation={
              currentNotationElementRepresentation
            }
            setCurrentNotationElementRepresentation={
              setCurrentNotationElementRepresentation
            }
            selectedNotationElementIndex={selectedNotationElementIndex}
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
        ) : (
          currentNotationElementRepresentation.type === "ClassEdge" && (
            // draw panel for edges
            <NotationDesignerDrawEdge
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
            />
          )
        )}
      </div>
    </div>
  );
}

export default NotationDesignerDrawPanel;
