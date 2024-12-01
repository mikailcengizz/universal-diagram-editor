import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";

interface ModalAddParameterProps {
  isAddParameterModalOpen: boolean;
  setIsAddParameterModalOpen: (value: boolean) => void;
  handleParameterSubmit: () => void;
}

function ModalAddParameter({
  isAddParameterModalOpen,
  setIsAddParameterModalOpen,
  handleParameterSubmit,
}: ModalAddParameterProps) {
  return (
    <CustomModal
      isOpen={isAddParameterModalOpen}
      onClose={() => setIsAddParameterModalOpen(false)}
      zIndex={10}
    >
      <h2>Add Parameter</h2>

      <button
        className="bg-black text-white px-2 py-[2px] font-semibold"
        onClick={() => {
          handleParameterSubmit();
          setIsAddParameterModalOpen(false);
        }}
      >
        Add Parameter
      </button>
    </CustomModal>
  );
}

export default ModalAddParameter;
