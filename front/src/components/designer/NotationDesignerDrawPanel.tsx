import React, { useState, useEffect } from "react";
import { Class, NotationRepresentationItem } from "../../types/types";
import PaletteDrawPanel from "./PaletteDrawPanel";
import NotationDesignerDrawPanelGrid from "./NotationDesignerDrawPanelGrid";

interface NotationDesignerDrawPanelProps {
  currentNotationElement: Class;
  setCurrentNotationElement: (value: any) => void;
  saveNotation: () => void;
}

const gridSize = 10; // Size of the grid squares

function NotationDesignerDrawPanel({
  currentNotationElement,
  setCurrentNotationElement,
  saveNotation,
}: NotationDesignerDrawPanelProps) {
  return (
    <div className="flex flex-col">
      <PaletteDrawPanel saveNotation={saveNotation} />
      <div className="flex flex-col overflow-y-auto">
        <NotationDesignerDrawPanelGrid
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          gridSize={gridSize}
        />
      </div>
    </div>
  );
}

export default NotationDesignerDrawPanel;
