import React, { useEffect, useState } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Notation,
  NotationRepresentationItem,
} from "../../../../../types/types";

interface ModalDoubleClickCompartmentProps {
  isCompartmentModalOpen: boolean;
  setIsCompartmentModalOpen: (isOpen: boolean) => void;
  currentNotation: Notation;
  setCurrentNotation: (value: Notation) => void;
  selectedElementIndex: number | null;
}

function ModalDoubleClickCompartment({
  isCompartmentModalOpen,
  setIsCompartmentModalOpen,
  currentNotation,
  setCurrentNotation,
  selectedElementIndex,
}: ModalDoubleClickCompartmentProps) {
  const [compartment, setCompartment] = useState<NotationRepresentationItem>();

  // This useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (selectedElementIndex !== null && selectedElementIndex >= 0) {
      const selectedElement =
        currentNotation.graphicalRepresentation[selectedElementIndex];
      if (selectedElement) {
        setCompartment(selectedElement);
      }
    }
  }, [selectedElementIndex, currentNotation]);

  const handleGeneratorChange = (e: any) => {
    setCompartment({
      ...compartment!,
      generator: e.target.value,
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

  const handleSizeChange = (e: any) => {
    setCompartment({
      ...compartment!,
      position: {
        ...compartment!.position,
        extent: {
          width: parseInt(e.target.value),
          height: parseInt(e.target.value),
        },
      },
    });
  };

  const handlePositionChange = (e: any) => {
    setCompartment({
      ...compartment!,
      position: {
        ...compartment!.position,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSave = () => {
    console.log("selectedElementIndex", selectedElementIndex);
    if (selectedElementIndex === null || !compartment) return;

    const updatedRepresentation = [...currentNotation.graphicalRepresentation];

    // Update the entire style and position objects in one go
    updatedRepresentation[selectedElementIndex] = {
      ...updatedRepresentation[selectedElementIndex],
      generator: compartment.generator,
      style: { ...compartment.style }, // Copy the entire style object
      position: { ...compartment.position }, // Copy the entire position object
    };

    setCurrentNotation({
      ...currentNotation,
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
        <h3>Generator</h3>
        <div>
          <label>Generator</label>
          <select
            name="generator"
            onChange={handleGeneratorChange}
            value={compartment?.generator!}
          >
            <option value="none">None</option>
            <option value="attributesForNotation">attributesForNotation</option>
            <option value="operationsForNotation">operationsForNotation</option>
          </select>
        </div>
        <h3>Style</h3>
        <div>
          <label>Text color</label>
          <input
            type="color"
            name="color"
            onChange={handleStyleChange}
            value={compartment?.style.color}
          />
        </div>
        <div>
          <label>Text size</label>
          <input
            type="number"
            name="fontSize"
            onChange={handleStyleChange}
            value={compartment?.style.fontSize}
          />
        </div>
        <div>
          <label>Text alignment</label>
          <select
            name="textAlign"
            onChange={handleStyleChange}
            value={compartment?.style.alignment}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <h3>Size</h3>
        <div>
          <label>Width</label>
          <input
            type="number"
            name="width"
            onChange={handleSizeChange}
            value={compartment?.position.extent?.width}
          />
        </div>
        <div>
          <label>Height</label>
          <input
            type="number"
            name="height"
            onChange={handleSizeChange}
            value={compartment?.position.extent?.height}
          />
        </div>
        <h3>Position</h3>
        <div>
          <label>X</label>
          <input
            type="number"
            name="x"
            onChange={handlePositionChange}
            value={compartment?.position.x}
          />
        </div>
        <div>
          <label>Y</label>
          <input
            type="number"
            name="y"
            onChange={handlePositionChange}
            value={compartment?.position.y}
          />
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
