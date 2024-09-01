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
  handleOperationSubmit: () => void;
}

function ModalAddOperation({
  data,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  modifyingOperation,
  setModifyingOperation,
  setIsAddParameterModalOpen,
  handleOperationSubmit,
}: ModalAddOperationProps) {
  const operationProperty = data.notation.properties.find(
    (property) => property.elementType === "Operation"
  );

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
        {operationProperty &&
          operationProperty.defaultValue &&
          (operationProperty.defaultValue as any[]).map((operation, index) => {
            return (
              <div key={index}>
                {operation.name}: {operation.dataType} [{operation.multiplicity}
                ]
                {operation.visibility &&
                  `, Visibility: ${operation.visibility}`}
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

      <br />
      <label>Return Type</label>
      <br />
      <input
        type="text"
        value={modifyingOperation.returnType}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            returnType: e.target.value,
          })
        }
      />

      <br />
      <label>Preconditions</label>
      <br />
      <input
        type="text"
        value={modifyingOperation.preconditions}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            preconditions: e.target.value,
          })
        }
      />

      <br />
      <label>Postconditions</label>
      <br />
      <input
        type="text"
        value={modifyingOperation.postconditions}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            postconditions: e.target.value,
          })
        }
      />

      <br />
      <label>Body</label>
      <br />
      <input
        type="text"
        value={modifyingOperation.body}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            body: e.target.value,
          })
        }
      />

      <label>Visibility</label>
      <br />
      <select
        name="visibility"
        value={modifyingOperation.visibility}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            visibility: e.target.value,
          })
        }
      >
        <option value="public">public</option>
        <option value="protected">protected</option>
        <option value="private">private</option>
        <option value="package">package</option>
        <option value="published">published</option>
      </select>
      <br />

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
