import React from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import {
  Attribute,
  Class,
  InstanceObject,
  MetaModel,
} from "../../../../../../types/types";
import { useSelector } from "react-redux";

interface ModalAddAttributeProps {
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  metaAttribute: Class;
  newAttribute: Attribute;
  setNewAttribute: (newAttribute: Attribute) => void;
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
      {metaAttribute.attributes!.map((attribute) => {
        /* const foundAttributeValue =
          newAttribute[attribute.name as keyof EAttributeInstance]; */

        return (
          <div key={attribute.name}>
            <label>{attribute.name}</label>
            <br />
            {attribute.attributeType?.name === "String" ? (
              <input
                name={attribute.name}
                className={inputStyle}
                type="text"
                value={attribute.defaultValue}
                onChange={(e) =>
                  handleAttributeChange(attribute.name!, e.target.value)
                }
              />
            ) : attribute.attributeType?.name === "Integer" ? (
              <input
                name={attribute.name}
                className={inputStyle}
                type="number"
                value={attribute.defaultValue}
                onChange={(e) =>
                  handleAttributeChange(
                    attribute.name!,
                    parseInt(e.target.value, 10)
                  )
                }
              />
            ) : attribute.attributeType?.name === "Boolean" ? (
              <input
                name={attribute.name}
                className={inputStyle}
                type="checkbox"
                checked={attribute.defaultValue}
                onChange={(e) =>
                  handleAttributeChange(attribute.name!, e.target.checked)
                }
              />
            ) : (
              <input
                name={attribute.name}
                className={inputStyle}
                type="text"
                value={attribute.defaultValue}
                onChange={(e) =>
                  handleAttributeChange(attribute.name!, e.target.value)
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
