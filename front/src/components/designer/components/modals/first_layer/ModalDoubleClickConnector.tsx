import React, { useEffect, useState } from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  InstanceNotation,
  NotationRepresentationItem,
} from "../../../../../types/types";

interface ModalDoubleClickConnectorProps {
  isConnectorModalOpen: boolean;
  setIsConnectorModalOpen: (isOpen: boolean) => void;
  currentNotation: InstanceNotation;
  setCurrentNotation: (value: InstanceNotation) => void;
  selectedElementIndex: number | null;
}

function ModalDoubleClickConnector({
  isConnectorModalOpen,
  setIsConnectorModalOpen,
  currentNotation,
  setCurrentNotation,
  selectedElementIndex,
}: ModalDoubleClickConnectorProps) {
  const [connector, setConnector] = useState<NotationRepresentationItem>();

  // This useEffect ensures that the modal's fields are populated with the current values
  useEffect(() => {
    if (selectedElementIndex !== null && selectedElementIndex >= 0) {
      const selectedElement =
        currentNotation.graphicalRepresentation![selectedElementIndex];
      if (selectedElement) {
        setConnector(selectedElement);
      }
    }
  }, [selectedElementIndex, currentNotation]);

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

    const updatedRepresentation = [...currentNotation.graphicalRepresentation!];

    // Update the entire style and position objects in one go
    updatedRepresentation[selectedElementIndex] = {
      ...updatedRepresentation[selectedElementIndex],
      generator: connector.generator,
      style: { ...connector.style }, // Copy the entire style object
      position: { ...connector.position }, // Copy the entire position object
    };

    setCurrentNotation({
      ...currentNotation,
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
      <h2 className="font-semibold">Compartment Details</h2>
      <div>
        <h3>Style</h3>
        <div>
          <label>Alignment</label>
          <select
            name="alignment"
            onChange={handleStyleChange}
            value={connector?.style.alignment}
          >
            <option value="none">None</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
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

export default ModalDoubleClickConnector;
