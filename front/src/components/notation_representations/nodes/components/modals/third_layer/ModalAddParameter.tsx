import React from "react";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalAddParameterProps {
  isAddParameterModalOpen: boolean;
  setIsAddParameterModalOpen: (value: boolean) => void;
  modifyingParameter: {
    name: string;
    dataType: string;
    defaultValue: string;
  };
  setModifyingParameter: (value: {
    name: string;
    dataType: string;
    defaultValue: string;
  }) => void;
}

function ModalAddParameter({
  isAddParameterModalOpen,
  setIsAddParameterModalOpen,
  modifyingParameter,
  setModifyingParameter,
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
      <input
        type="text"
        value={modifyingParameter.name}
        onChange={(e) =>
          setModifyingParameter({
            ...modifyingParameter,
            name: e.target.value,
          })
        }
      />
      <br />
      <label>Data Type</label>
      <br />
      <input
        type="text"
        value={modifyingParameter.dataType}
        onChange={(e) =>
          setModifyingParameter({
            ...modifyingParameter,
            dataType: e.target.value,
          })
        }
      />
      <br />
      <label>Default Value</label>
      <br />
      <input
        type="text"
        value={modifyingParameter.defaultValue}
        onChange={(e) =>
          setModifyingParameter({
            ...modifyingParameter,
            defaultValue: e.target.value,
          })
        }
      />
    </CustomModal>
  );
}

export default ModalAddParameter;
