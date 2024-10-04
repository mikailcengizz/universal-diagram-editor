import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";
//import { Parameter } from "../../../../../../types/types";

interface ModalAddParameterProps {
  isAddParameterModalOpen: boolean;
  setIsAddParameterModalOpen: (value: boolean) => void;
  //modifyingParameter: EParameter;
  //setModifyingParameter: (eParameter: EParameter) => void;
  handleParameterSubmit: () => void;
}

function ModalAddParameter({
  isAddParameterModalOpen,
  setIsAddParameterModalOpen,
  //modifyingParameter,
  //setModifyingParameter,
  handleParameterSubmit,
}: ModalAddParameterProps) {
  return (
    <CustomModal
      isOpen={isAddParameterModalOpen}
      onClose={() => setIsAddParameterModalOpen(false)}
      zIndex={10}
    >
      <h2>Add Parameter</h2>
      <label>Name</label>
      <br />
      {/* <input
        type="text"
        value={modifyingParameter.name}
        onChange={(e) =>
          setModifyingParameter({
            ...modifyingParameter,
            name: e.target.value,
          })
        }
      /> */}
      <br />
      {/* <label>Data Type</label>
      <br />
      <input
        type="text"
        value={modifyingParameter.dataType}
        onChange={(e) =>
          setModifyingParameter({
            ...modifyingParameter,
            eType: e.target.value,
          })
        }
      />
      <br /> */}
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
