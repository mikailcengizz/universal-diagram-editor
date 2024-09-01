import React from "react";
import CustomModal from "../../../../ui_elements/Modal";
import { CustomNodeData, Operation } from "../../../../../../types/types";

interface ModalAddOperationProps {
  data: CustomNodeData;
  isNodeOperationModalOpen: boolean;
  setIsNodeOperationModalOpen: (isOpen: boolean) => void;
  modifyingOperation: Operation;
  setModifyingOperation: (modifyingOperation: Operation) => void;
  setIsAddParameterModalOpen: (value: boolean) => void;
}

function ModalAddOperation({
  data,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  modifyingOperation,
  setModifyingOperation,
  setIsAddParameterModalOpen,
}: ModalAddOperationProps) {
  return (
    <CustomModal
      isOpen={isNodeOperationModalOpen}
      onClose={() => setIsNodeOperationModalOpen(false)}
      zIndex={10}
    >
      <h2>Operation</h2>

      <label>Name</label>
      <br />
      <input
        type="text"
        value={modifyingOperation.name}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            name: e.target.value,
          })
        }
      />
      <br />
      <label>Parameters</label>
      <br />
      {/* Show all parameters of the operation we are adding or modifying */}
      <div className="bg-white h-10 overflow-y-scroll">
        {(
          data.notation.properties.find(
            (property) => property.elementType === "Operation"
          )!.defaultValue as any[]
        ).map((operation, index) => {
          return (
            <div key={index}>
              {operation.name}: {operation.dataType} [{operation.multiplicity}]
              {operation.visibility && `, Visibility: ${operation.visibility}`}
              {operation.unique && ", Unique"}
              {operation.derived && ", Derived"}
              {operation.constraints &&
                `, Constraints: ${operation.constraints}`}
              {` = ${operation.defaultValue}`}
            </div>
          );
        })}
      </div>
      <br />
      {/* Add and remove buttons */}
      <div className="flex flex-row w-full">
        <div
          className="w-1/2 bg-black text-white text-center cursor-pointer"
          onClick={() => setIsAddParameterModalOpen(true)}
        >
          Add
        </div>
        <div className="w-1/2 text-center border-[1px] border-solid border-black cursor-pointer">
          Remove
        </div>
      </div>
    </CustomModal>
  );
}

export default ModalAddOperation;
