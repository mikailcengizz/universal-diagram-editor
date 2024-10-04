import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import typeHelper from "../../../../../helpers/TypeHelper";
import { DiagramNodeData } from "../../../../../../types/types";

interface ModalAddOperationProps {
  data: DiagramNodeData;
  isNodeOperationModalOpen: boolean;
  setIsNodeOperationModalOpen: (isOpen: boolean) => void;
  /* modifyingOperation: EOperation;
  setModifyingOperation: (modifyingOperation: EOperation) => void; */
  setIsAddParameterModalOpen: (value: boolean) => void;
  handleOperationSubmit: () => void;
}

function ModalAddOperation({
  data,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  /* modifyingOperation,
  setModifyingOperation, */
  setIsAddParameterModalOpen,
  handleOperationSubmit,
}: ModalAddOperationProps) {
  //const operations = data.instanceNotation.eOperations!;

  return (
    <CustomModal
      isOpen={isNodeOperationModalOpen}
      onClose={() => setIsNodeOperationModalOpen(false)}
      zIndex={10}
    >
      <h2>Operation</h2>

      <label>Name</label>
      <br />
      {/* <input
        type="text"
        value={modifyingOperation.name}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            name: e.target.value,
          })
        }
      /> */}
      <br />
      <label>Parameters</label>

      <br />
      {/* Show all parameters of the operation we are adding or modifying */}
      {/* <div className="bg-white h-10 overflow-y-scroll">
        {operations &&
          operations.map((operation, index) => {
            return (
              <div key={index}>
                {operation.eParameters!.map((parameter, index) => (
                  <span key={index}>
                    {parameter.name}: {parameter.eType?.name}{" "}
                    { {parameter.defaultValue && `= ${parameter.defaultValue}`} }
                  </span>
                ))}
              </div>
            );
          })}
      </div> */}
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
      {/* <input
        type="text"
        value={modifyingOperation.eType?.name}
        onChange={(e) =>
          setModifyingOperation({
            ...modifyingOperation,
            eType: {
              ...modifyingOperation.eType!,
              name: e.target.value,
            },
          })
        }
      /> */}

      {/* <label>Visibility</label>
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
      <br /> */}

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
