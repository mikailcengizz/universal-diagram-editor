import React, { useEffect, useState } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Class,
  MetaModel,
  NotationRepresentationItem,
  Representation,
  RepresentationMetaModel,
} from "../../../../../types/types";
import { MenuItem, Select } from "@mui/material";

interface ModalDoubleClickConnectorProps {
  isConnectorModalOpen: boolean;
  setIsConnectorModalOpen: (isOpen: boolean) => void;
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  selectedElementIndex: number | null;
  selectedNotationRepresentationItemIndex: number | null;
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
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  selectedElementIndex,
  selectedNotationRepresentationItemIndex,
}: ModalDoubleClickConnectorProps) {
  const [connector, setConnector] = useState<NotationRepresentationItem>();

  // this useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (
      selectedNotationRepresentationItemIndex !== null &&
      selectedNotationRepresentationItemIndex >= 0
    ) {
      const selectedElement =
        currentNotationElementRepresentation.graphicalRepresentation![
          selectedNotationRepresentationItemIndex
        ];
      if (selectedElement) {
        setConnector(selectedElement);
      }
    }
  }, [selectedNotationRepresentationItemIndex, currentNotationElement]);

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
    console.log(
      "selectedElementIndex",
      selectedNotationRepresentationItemIndex
    );
    if (selectedNotationRepresentationItemIndex === null || !connector) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.graphicalRepresentation!,
    ];

    // update entire style and position objects in one go
    updatedRepresentation[selectedNotationRepresentationItemIndex] = {
      ...updatedRepresentation[selectedNotationRepresentationItemIndex],
      content: connector.content,
      style: { ...connector.style }, // copy entire style object
      position: { ...connector.position }, // copy entire position object
    };

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      graphicalRepresentation: updatedRepresentation,
    });

    setIsConnectorModalOpen(false); // close modal after saving
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
