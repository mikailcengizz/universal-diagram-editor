import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import { EAttribute } from "../../../../../../types/types";

interface ModalAddAttributeProps {
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  newAttribute: EAttribute;
  setNewAttribute: (newAttribute: EAttribute) => void;
  handleAttributeSubmit: () => void;
}

function ModalAddAttribute({
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
  newAttribute,
  setNewAttribute,
  handleAttributeSubmit,
}: ModalAddAttributeProps) {
  return (
    <CustomModal
      isOpen={isNodeAttributeModalOpen}
      onClose={() => setIsNodeAttributeModalOpen(false)}
      zIndex={10}
    >
      <h2>Attribute</h2>
      {/* TODO: temporary hard coded fields, we need to get these from somewhere where an attribute can be defined*/}
      <label>Name</label>
      <br />
      <input
        type="text"
        value={newAttribute.name}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, name: e.target.value })
        }
      />
      <br />
      {/* <label>Data type</label>
      <br />
      <input
        type="text"
        value={newAttribute.eAttributeType?.name}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, eAttributeType: e.target.value })
        }
      /> */}
      <label>Default value</label>
      <br />
      <input
        type="text"
        value={newAttribute.defaultValue}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, defaultValue: e.target.value })
        }
      />
      <label>Lower bound</label>
      <br />
      <input
        name="lowerBound"
        type="number"
        value={newAttribute.lowerBound}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, lowerBound: +e.target.value })
        }
      />
      <br />
      <label>Upper bound</label>
      <br />
      <input
        name="upperBound"
        type="number"
        value={newAttribute.upperBound}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, upperBound: +e.target.value })
        }
      />
      <br />
      <label>Unique</label>
      <input
        type="checkbox"
        name="unique"
        checked={newAttribute.isUnique}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, isUnique: e.target.checked })
        }
      />
      <br />
      <label>Derived</label>
      <input
        type="checkbox"
        name="derived"
        checked={newAttribute.isDerived}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, isDerived: e.target.checked })
        }
      />
      <br />
      <label>Constraints</label>
      <br />
      <textarea name="constraints" />
      <button
        className="bg-black text-white px-2 py-[2px] font-semibold"
        onClick={handleAttributeSubmit}
      >
        Add Attribute
      </button>
    </CustomModal>
  );
}

export default ModalAddAttribute;
