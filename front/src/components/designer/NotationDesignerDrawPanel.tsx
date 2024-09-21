import React, { useState, useEffect } from "react";
import { InstanceNotation, NotationRepresentationItem } from "../../types/types";
import PaletteDrawPanel from "./PaletteDrawPanel";
import NotationDesignerDrawPanelGrid from "./NotationDesignerDrawPanelGrid";

interface NotationDesignerDrawPanelProps {
  currentNotation: InstanceNotation;
  setCurrentNotation: (value: any) => void;
  saveNotation: () => void;
}

const gridSize = 10; // Size of the grid squares

function NotationDesignerDrawPanel({
  currentNotation,
  setCurrentNotation,
  saveNotation,
}: NotationDesignerDrawPanelProps) {
  console.log("currentNotation", currentNotation);

  return (
    <div className="flex flex-col">
      <PaletteDrawPanel saveNotation={saveNotation} />
      <div className="flex flex-col overflow-y-auto">
        <NotationDesignerDrawPanelGrid
          currentNotation={currentNotation}
          setCurrentNotation={setCurrentNotation}
          gridSize={gridSize}
        />
      </div>
    </div>
  );
}

export default NotationDesignerDrawPanel;
