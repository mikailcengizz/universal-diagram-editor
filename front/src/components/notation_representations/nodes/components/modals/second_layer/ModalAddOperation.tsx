import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import { DiagramNodeData } from "../../../../../../types/types";

interface ModalAddOperationProps {
  data: DiagramNodeData;
  isNodeOperationModalOpen: boolean;
  setIsNodeOperationModalOpen: (isOpen: boolean) => void;
  setIsAddParameterModalOpen: (value: boolean) => void;
  handleOperationSubmit: () => void;
}

function ModalAddOperation({
  data,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  setIsAddParameterModalOpen,
  handleOperationSubmit,
}: ModalAddOperationProps) {
  return (
    <CustomModal
      isOpen={isNodeOperationModalOpen}
      onClose={() => setIsNodeOperationModalOpen(false)}
      zIndex={10}
    >
      <h2>Operation</h2>

      {/* Add and remove buttons for parameters */}
      <div className="flex flex-row w-full">
        <div
          className="w-1/2 bg-black text-white text-center cursor-pointer"
          onClick={() => setIsAddParameterModalOpen(true)}
        >
          Add Parameter
        </div>
        <div className="w-1/2 text-center border-[1px] border-solid border-black cursor-pointer">
          Remove Parameter
        </div>
      </div>

      <button
        className="bg-black text-white px-2 py-[2px] font-semibold"
        onClick={handleOperationSubmit}
      >
        Add Operation
      </button>
    </CustomModal>
  );
}

export default ModalAddOperation;
