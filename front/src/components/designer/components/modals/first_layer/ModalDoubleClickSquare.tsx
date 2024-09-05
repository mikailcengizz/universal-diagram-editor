import React, { useState, useEffect } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Notation,
  NotationRepresentationItem,
} from "../../../../../types/types";

interface ModalDoubleClickSquareProps {
  isSquareModalOpen: boolean;
  setIsSquareModalOpen: (isOpen: boolean) => void;
  currentNotation: Notation;
  setCurrentNotation: (value: Notation) => void;
  selectedElementIndex: number | null;
}

function ModalDoubleClickSquare({
  isSquareModalOpen,
  setIsSquareModalOpen,
  currentNotation,
  setCurrentNotation,
  selectedElementIndex,
}: ModalDoubleClickSquareProps) {
  const [square, setSquare] = useState<NotationRepresentationItem>();

  console.log("selectedElementIndexFromModal", selectedElementIndex);

  // This useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (selectedElementIndex !== null && selectedElementIndex >= 0) {
      const selectedElement =
        currentNotation.graphicalRepresentation[selectedElementIndex];
      if (selectedElement) {
        setSquare(selectedElement);
      }
    }
  }, [selectedElementIndex, currentNotation]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSquare({
      ...square!,
      style: {
        ...square!.style,
        backgroundColor: e.target.value,
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
    console.log("selectedElementIndex", selectedElementIndex);
    if (selectedElementIndex === null) return;

    const updatedRepresentation = [...currentNotation.graphicalRepresentation];
    updatedRepresentation[selectedElementIndex].style.backgroundColor =
      square!.style.backgroundColor;
    updatedRepresentation[selectedElementIndex].position.extent = {
      width: square!.position.extent!.width,
      height: square!.position.extent!.height,
    };

    setCurrentNotation({
      ...currentNotation,
      graphicalRepresentation: updatedRepresentation,
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
        <div>
          <label>Background color</label>
          <input
            type="color"
            value={square?.style.backgroundColor}
            onChange={handleColorChange}
          />
        </div>
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
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickSquare;
