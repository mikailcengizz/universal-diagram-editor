import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import {
  EAttributeInstance,
  InstanceNotation,
  MetaNotation,
} from "../../../../../../types/types";
import { useSelector } from "react-redux";

interface ModalAddAttributeProps {
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  metaAttribute: MetaNotation;
  newAttribute: EAttributeInstance;
  setNewAttribute: (newAttribute: EAttributeInstance) => void;
  handleAttributeSubmit: () => void;
}

const inputStyle = "border border-gray-300 rounded-md p-1";

function ModalAddAttribute({
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
  metaAttribute,
  newAttribute,
  setNewAttribute,
  handleAttributeSubmit,
}: ModalAddAttributeProps) {
  // Helper function to handle updating attributes
  // Attribute = {"name": "lowerBound"}
  // NewAttribute = {"name": "name", "lowerBound": 0}
  const handleAttributeChange = (attributeName: string, value: any) => {
    setNewAttribute({
      ...newAttribute,
      [attributeName]: value,
    });
  };

  return (
    <CustomModal
      isOpen={isNodeAttributeModalOpen}
      onClose={() => setIsNodeAttributeModalOpen(false)}
      zIndex={10}
    >
      <h2>Attribute</h2>
      {/* Iterate over metaAttribute.eAttributes and render form fields */}
      {metaAttribute.eAttributes!.map((attribute) => {
        const foundAttributeValue =
          newAttribute[attribute.name as keyof EAttributeInstance];

        return (
          <div key={attribute.name}>
            <label>{attribute.name}</label>
            <br />
            {attribute.eAttributeType?.name === "String" ? (
              <input
                name={attribute.name}
                className={inputStyle}
                type="text"
                value={
                  foundAttributeValue
                    ? foundAttributeValue
                    : attribute.defaultValue
                }
                onChange={(e) =>
                  handleAttributeChange(attribute.name, e.target.value)
                }
              />
            ) : attribute.eAttributeType?.name === "Integer" ? (
              <input
                name={attribute.name}
                className={inputStyle}
                type="number"
                value={
                  foundAttributeValue
                    ? foundAttributeValue
                    : attribute.defaultValue
                }
                onChange={(e) =>
                  handleAttributeChange(
                    attribute.name,
                    parseInt(e.target.value, 10)
                  )
                }
              />
            ) : attribute.eAttributeType?.name === "Boolean" ? (
              <input
                name={attribute.name}
                className={inputStyle}
                type="checkbox"
                checked={
                  foundAttributeValue
                    ? foundAttributeValue
                    : attribute.defaultValue
                }
                onChange={(e) =>
                  handleAttributeChange(attribute.name, e.target.checked)
                }
              />
            ) : (
              <input
                name={attribute.name}
                className={inputStyle}
                type="text"
                value={
                  foundAttributeValue
                    ? foundAttributeValue
                    : attribute.defaultValue
                }
                onChange={(e) =>
                  handleAttributeChange(attribute.name, e.target.value)
                }
              />
            )}
            <br />
          </div>
        );
      })}

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
