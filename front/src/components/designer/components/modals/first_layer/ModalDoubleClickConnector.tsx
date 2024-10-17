import React, { useEffect, useState } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Class,
  DiagramNodeData,
  NotationRepresentationItem,
  Representation,
} from "../../../../../types/types";
import { MenuItem, Select } from "@mui/material";

interface ModalDoubleClickConnectorProps {
  isConnectorModalOpen: boolean;
  setIsConnectorModalOpen: (isOpen: boolean) => void;
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  selectedElementIndex: number | null;
}

const selectsStyleMuiSx = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d3d3d3",
  },
};

const propertyTextfieldStyle = "w-1/6 2xl:w-[200px]";

function ModalDoubleClickConnector({
  isConnectorModalOpen,
  setIsConnectorModalOpen,
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  selectedElementIndex,
}: ModalDoubleClickConnectorProps) {
  const [connector, setConnector] = useState<NotationRepresentationItem>();

  // This useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (selectedElementIndex !== null && selectedElementIndex >= 0) {
      const selectedElement =
        currentNotationElementRepresentation.graphicalRepresentation![
          selectedElementIndex
        ];
      if (selectedElement) {
        setConnector(selectedElement);
      }
    }
  }, [selectedElementIndex, currentNotationElement]);

  const handleStyleChange = (e: any) => {
    setConnector({
      ...connector!,
      style: {
        ...connector!.style,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSave = () => {
    console.log("selectedElementIndex", selectedElementIndex);
    if (selectedElementIndex === null || !connector) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.graphicalRepresentation!,
    ];

    // Update the entire style and position objects in one go
    updatedRepresentation[selectedElementIndex] = {
      ...updatedRepresentation[selectedElementIndex],
      generator: connector.generator,
      style: { ...connector.style }, // Copy the entire style object
      position: { ...connector.position }, // Copy the entire position object
    };

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      graphicalRepresentation: updatedRepresentation,
    });

    setIsConnectorModalOpen(false); // Close modal after saving
  };

  return (
    <CustomModal
      isOpen={isConnectorModalOpen}
      onClose={() => setIsConnectorModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Connector Details</h2>
      <div>
        <h3>Style</h3>
        <Select
          className={propertyTextfieldStyle}
          sx={selectsStyleMuiSx}
          value={connector?.style.alignment}
          onChange={(e) => handleStyleChange(e)}
          displayEmpty
          name="alignment"
        >
          <MenuItem value="" disabled style={{ display: "none" }}>
            Alignment
          </MenuItem>
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="right">Right</MenuItem>
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
        </Select>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Save
        </button>
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickConnector;
