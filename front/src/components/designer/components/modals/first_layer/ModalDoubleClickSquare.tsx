import React, { useState, useEffect } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Class,
  DiagramNodeData,
  MetaModel,
  NotationRepresentationItem,
  Representation,
  RepresentationMetaModel,
} from "../../../../../types/types";

interface ModalDoubleClickSquareProps {
  isSquareModalOpen: boolean;
  setIsSquareModalOpen: (isOpen: boolean) => void;
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

function ModalDoubleClickSquare({
  isSquareModalOpen,
  setIsSquareModalOpen,
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
}: ModalDoubleClickSquareProps) {
  const [square, setSquare] = useState<NotationRepresentationItem>();

  // This useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (
      selectedNotationRepresentationItemIndex !== null &&
      selectedNotationRepresentationItemIndex >= 0
    ) {
      const selectedElement =
        currentNotationElementRepresentation?.representationItems![
          selectedNotationRepresentationItemIndex
        ];
      if (selectedElement) {
        setSquare(selectedElement);
      }
    }
  }, [selectedNotationRepresentationItemIndex, currentNotationElement]);

  const handleStyleChange = (e: any) => {
    setSquare({
      ...square!,
      style: {
        ...square!.style,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSquare({
      ...square!,
      position: {
        ...square!.position,
        extent: {
          width: parseInt(e.target.value),
          height: parseInt(e.target.value),
        },
      },
    });
  };

  const handleSave = () => {
    console.log(
      "selectedElementIndex",
      selectedNotationRepresentationItemIndex
    );
    if (selectedNotationRepresentationItemIndex === null || !square) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.representationItems!,
    ];

    // Update the entire style and position objects in one go
    updatedRepresentation[selectedNotationRepresentationItemIndex] = {
      ...updatedRepresentation[selectedNotationRepresentationItemIndex],
      style: { ...square.style }, // Copy the entire style object
      position: { ...square.position }, // Copy the entire position object
    };

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      representationItems: updatedRepresentation,
    });

    setIsSquareModalOpen(false); // Close modal after saving
  };

  return (
    <CustomModal
      isOpen={isSquareModalOpen}
      onClose={() => setIsSquareModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Square Details</h2>
      <div>
        <h3>Style</h3>
        <div>
          <label>Background color</label>
          <input
            type="color"
            name="backgroundColor"
            value={square?.style.backgroundColor}
            onChange={handleStyleChange}
          />
        </div>
        <div>
          <label>Border color</label>
          <input
            type="color"
            name="borderColor"
            value={square?.style.borderColor}
            onChange={handleStyleChange}
          />
        </div>
        <div>
          <label>Border width</label>
          <input
            type="number"
            name="borderWidth"
            value={square?.style.borderWidth}
            onChange={handleStyleChange}
          />
        </div>
        <div>
          <label>Border radius</label>
          <input
            type="number"
            name="borderRadius"
            value={square?.style.borderRadius || 0}
            onChange={handleStyleChange}
          />
        </div>
        <div>
          <label>Border style</label>
          <select onChange={(e) => handleStyleChange(e)} name="borderStyle">
            <option value="solid">Solid</option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
          </select>
        </div>
        <h3>Size</h3>
        <div>
          <label>Width</label>
          <input
            type="number"
            value={square?.position.extent?.width}
            onChange={handleSizeChange}
          />
        </div>
        <div>
          <label>Height</label>
          <input
            type="number"
            value={square?.position.extent?.height}
            onChange={handleSizeChange}
          />
        </div>
        <h3>Position</h3>
        <div>
          <label>X</label>
          <input type="number" value={square?.position.x} />
        </div>
        <div>
          <label>Y</label>
          <input type="number" value={square?.position.y} />
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

export default ModalDoubleClickSquare;
