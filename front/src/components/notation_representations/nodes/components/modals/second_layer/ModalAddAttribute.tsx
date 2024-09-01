import React from "react";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalAddAttributeProps {
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  newAttribute: {
    name: string;
    dataType: string;
    defaultValue: string;
    multiplicity: string;
    visibility: string;
    unique: boolean;
    derived: boolean;
  };
  setNewAttribute: (newAttribute: any) => void;
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
      <label>Data type</label>
      <br />
      <input
        type="text"
        value={newAttribute.dataType}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, dataType: e.target.value })
        }
      />
      <label>Default value</label>
      <br />
      <input
        type="text"
        value={newAttribute.defaultValue}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, defaultValue: e.target.value })
        }
      />
      <label>Multiplicity</label>
      <br />
      <select
        name="multiplicity"
        value={newAttribute.multiplicity}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, multiplicity: e.target.value })
        }
      >
        <option value="0..1">0..1</option>
        <option value="0..*">0..*</option>
        <option value="1">1</option>
        <option value="1..*">1..*</option>
        <option value="*">*</option>
      </select>
      <br />
      <label>Visibility</label>
      <br />
      <select
        name="visibility"
        value={newAttribute.visibility}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, visibility: e.target.value })
        }
      >
        <option value="public">public</option>
        <option value="protected">protected</option>
        <option value="private">private</option>
        <option value="package">package</option>
        <option value="published">published</option>
      </select>
      <br />
      <label>Unique</label>
      <input
        type="checkbox"
        name="unique"
        checked={newAttribute.unique}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, unique: e.target.checked })
        }
      />
      <br />
      <label>Derived</label>
      <input
        type="checkbox"
        name="derived"
        checked={newAttribute.derived}
        onChange={(e) =>
          setNewAttribute({ ...newAttribute, derived: e.target.checked })
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
