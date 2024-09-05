import React from "react";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalDoubleClickCompartmentProps {
  isCompartmentModalOpen: boolean;
  setIsCompartmentModalOpen: (isOpen: boolean) => void;
}

function ModalDoubleClickCompartment({
  isCompartmentModalOpen,
  setIsCompartmentModalOpen,
}: ModalDoubleClickCompartmentProps) {
  return (
    <CustomModal
      isOpen={isCompartmentModalOpen}
      onClose={() => setIsCompartmentModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Compartment Details</h2>
      <div>
        <div>
          <label>Color</label>
          <input type="color" />
        </div>
        <div>
          <label>Size</label>
          <input type="number" />
        </div>
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickCompartment;
