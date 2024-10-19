import React, { useEffect, useState } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Class,
  MetaModel,
  NotationRepresentationItem,
  Reference,
  Representation,
  RepresentationMetaModel,
  RepresentationType,
} from "../../../../../types/types";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";

interface ModalDoubleClickCompartmentProps {
  isCompartmentModalOpen: boolean;
  setIsCompartmentModalOpen: (isOpen: boolean) => void;
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

const textFieldsStyleMuiSx = {
  "& .MuiOutlinedInput-root": {
    border: "1px solid #d3d3d3",
    fontSize: "14px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const configureTextfieldStyle = "w-1/3 2xl:w-[450px]";

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

function ModalDoubleClickCompartment({
  isCompartmentModalOpen,
  setIsCompartmentModalOpen,
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
}: ModalDoubleClickCompartmentProps) {
  const [compartment, setCompartment] = useState<NotationRepresentationItem>({
    shape: "compartment",
    content: { $ref: "" },
    style: {
      color: "#000000",
      fontSize: 14,
      alignment: "left",
      layout: "vertical",
    },
    position: {
      x: 0,
      y: 0,
      extent: { width: 0, height: 0 },
    },
  });

  // This useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (
      selectedNotationRepresentationItemIndex !== null &&
      selectedNotationRepresentationItemIndex >= 0
    ) {
      const selectedElement =
        currentNotationElementRepresentation.graphicalRepresentation![
          selectedNotationRepresentationItemIndex
        ];
      if (
        selectedElement &&
        selectedElement.shape === "compartment" &&
        selectedElement.content
      ) {
        setCompartment(selectedElement);
      } else if (
        selectedElement &&
        selectedElement.shape === "compartment" &&
        !selectedElement.content &&
        selectedElement.position &&
        selectedElement.position.extent
      ) {
        // if we have dropped a compartment without content, we only need to update the position
        setCompartment({
          ...compartment!,
          position: {
            ...compartment!.position,
            x: selectedElement.position.x,
            y: selectedElement.position.y,
            extent: {
              width: selectedElement.position.extent.width,
              height: selectedElement.position.extent.height,
            },
          },
        });
      }
    }
  }, [
    selectedNotationRepresentationItemIndex,
    currentNotationElement,
    currentNotationElementRepresentation.graphicalRepresentation,
    compartment,
  ]);

  const handleContentChange = (e: any) => {
    const referenceIndex = currentNotationElement.references.findIndex(
      (reference) => reference.name === e.target.value
    );
    // constructing uri#/elements/0/references/0
    const newReference = `${selectedMetaModel.package.uri}#/elements/${selectedElementIndex}/references/${referenceIndex}`;

    setCompartment({
      ...compartment!,
      content: {
        $ref: newReference,
      },
    });
  };

  const handleStyleChange = (e: any) => {
    setCompartment({
      ...compartment!,
      style: {
        ...compartment!.style,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSave = () => {
    if (selectedNotationRepresentationItemIndex === null || !compartment)
      return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.graphicalRepresentation!,
    ];

    // Update the entire style and position objects in one go
    updatedRepresentation[selectedNotationRepresentationItemIndex] = {
      ...updatedRepresentation[selectedNotationRepresentationItemIndex],
      content: compartment.content,
      style: { ...compartment.style }, // Copy the entire style object
      position: { ...compartment.position }, // Copy the entire position object
    };

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      graphicalRepresentation: updatedRepresentation,
    });

    setIsCompartmentModalOpen(false); // Close modal after saving
  };

  return (
    <CustomModal
      isOpen={isCompartmentModalOpen}
      onClose={() => setIsCompartmentModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Compartment Details</h2>
      <div>
        {/* Content */}
        <div>
          <h3 className="text-sm">Content</h3>
          <FormControl className={configureTextfieldStyle}>
            <Select
              size="small"
              placeholder="Select Content Reference"
              sx={selectsStyleMuiSx}
              value={
                compartment!.content?.$ref === ""
                  ? ""
                  : (currentNotationElement.references[
                      +compartment!.content?.$ref.split("references/")[1]!
                    ] as Reference)!.name
              }
              onChange={(e) => handleContentChange(e)}
              displayEmpty
            >
              <MenuItem value="" disabled style={{ display: "none" }}>
                Select Content Reference
              </MenuItem>
              {currentNotationElement.references.map((reference, index) => (
                <MenuItem key={index} value={reference.name}>
                  {reference.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <h3>Style</h3>
        {/* Font size */}
        <div>
          <h3 className="text-sm">Text color</h3>
          <TextField
            size="small"
            type="color"
            name="color"
            className={configureTextfieldStyle}
            sx={textFieldsStyleMuiSx}
            placeholder="Text color"
            value={compartment?.style.color}
            onChange={handleStyleChange}
          />
        </div>
        <div>
          <h3 className="text-sm">Text size</h3>
          <TextField
            size="small"
            type="number"
            name="fontSize"
            className={configureTextfieldStyle}
            sx={textFieldsStyleMuiSx}
            placeholder="Text size"
            value={compartment?.style.fontSize}
            onChange={handleStyleChange}
          />
        </div>
        <div>
          <h3 className="text-sm">Text alignment</h3>
          <FormControl className={configureTextfieldStyle}>
            <Select
              size="small"
              sx={selectsStyleMuiSx}
              value={compartment?.style.alignment}
              onChange={(e) => handleStyleChange(e)}
              displayEmpty
              name="alignment"
            >
              <MenuItem value="" disabled style={{ display: "none" }}>
                Text alignment
              </MenuItem>
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <h3 className="text-sm">Layout</h3>
          <FormControl className={configureTextfieldStyle}>
            <Select
              size="small"
              sx={selectsStyleMuiSx}
              value={compartment?.style.layout}
              onChange={(e) => handleStyleChange(e)}
              displayEmpty
              name="layout"
            >
              <MenuItem value="" disabled style={{ display: "none" }}>
                Select Layout
              </MenuItem>
              <MenuItem value="horizontal">Horizontal</MenuItem>
              <MenuItem value="vertical">Vertical</MenuItem>
            </Select>
          </FormControl>
        </div>
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

export default ModalDoubleClickCompartment;
