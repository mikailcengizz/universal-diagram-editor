import React from "react";
import CustomModal from "../../../../ui_elements/Modal";
import {
  Attribute,
  CustomNodeData,
  Operation,
} from "../../../../../../types/types";
import dataTypeHelper from "../../../../helpers/TypeHelper";
import typeHelper from "../../../../helpers/TypeHelper";

interface ModalDoubleClickNotationProps {
  isNodeModalOpen: boolean;
  setIsNodeModalOpen: (isOpen: boolean) => void;
  data: CustomNodeData;
  setData: (data: CustomNodeData) => void;
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  isNodeOperationModalOpen: boolean;
  setIsNodeOperationModalOpen: (isOpen: boolean) => void;
}

function ModalDoubleClickNotation({
  isNodeModalOpen,
  setIsNodeModalOpen,
  data,
  setData,
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
}: ModalDoubleClickNotationProps) {
  return (
    <CustomModal
      isOpen={isNodeModalOpen}
      onClose={() => setIsNodeModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">{data.notation.name} Details</h2>

      <div>
        {data.notation.properties.map((property, index) => {
          const propertyDataType = property.dataType;

          if (propertyDataType === "Collection") {
            if (property.elementType === "Operation") {
              console.log("property.defaultValue", property.defaultValue);
              console.log(
                "Array.isArray(property.defaultValue)",
                Array.isArray(property.defaultValue)
              );
              console.log(
                "(property.defaultValue as Array<Operation>)",
                property.defaultValue as Array<Operation>
              );
            }
            // show a text area for all items in the collection and
            // allow the user to add items through a new modal by clicking a button and
            // allow the user to remove items by selecting the item and clicking a remove button
            return (
              <div key={index}>
                <label>{property.name}</label>
                <br />
                {/* Show all items in the collection */}
                <div className="bg-white h-10 overflow-y-scroll">
                  {property.defaultValue &&
                    Array.isArray(property.defaultValue) && (
                      <>
                        {property.elementType === "Attribute" &&
                          (property.defaultValue as Array<Attribute>).map(
                            (item: Attribute, idx: number) => (
                              <div key={idx}>
                                {typeHelper.determineVisibilityIcon(
                                  item.visibility
                                )}{" "}
                                {item.name}: {item.dataType}{" "}
                                {item.multiplicity && [item.multiplicity]}
                                {item.defaultValue && ` = ${item.defaultValue}`}
                              </div>
                            )
                          )}

                        {property.elementType === "Operation" &&
                          (property.defaultValue as Array<Operation>).map(
                            (item: Operation, idx: number) => (
                              <div key={idx}>
                                {typeHelper.determineVisibilityIcon(
                                  item.visibility
                                )}{" "}
                                {item.name}(
                                {item.parameters.map((parameter, index) => (
                                  <span key={index}>
                                    {parameter.name}: {parameter.dataType}
                                  </span>
                                ))}
                                ): {item.returnType}
                              </div>
                            )
                          )}
                      </>
                    )}
                </div>
                <br />
                {/* Add and remove buttons */}
                <div className="flex flex-row w-full">
                  <div
                    className="w-1/2 bg-black text-white text-center cursor-pointer"
                    onClick={() => {
                      if (property.elementType === "Attribute") {
                        setIsNodeAttributeModalOpen(true);
                      } else if (property.elementType === "Operation") {
                        setIsNodeOperationModalOpen(true);
                      }
                    }}
                  >
                    Add
                  </div>
                  <div className="w-1/2 text-center border-[1px] border-solid border-black cursor-pointer">
                    Remove
                  </div>
                </div>
              </div>
            );
          }

          // Properties that are not collections
          return (
            <div key={index}>
              <label>{property.name}</label>
              <input
                type={dataTypeHelper.determineInputFieldType(property.dataType)}
                value={property.defaultValue as string | number}
                onChange={(e) => {
                  property.defaultValue = e.target.value;
                  setData({ ...data });
                }}
              />
            </div>
          );
        })}
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickNotation;
