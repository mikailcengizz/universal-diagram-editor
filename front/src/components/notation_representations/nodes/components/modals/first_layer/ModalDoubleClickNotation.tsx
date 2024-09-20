import React, { useEffect, useState } from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import {
  CustomNodeData,
  EAttribute,
  EAttributeInstance,
  EOperation,
  InstanceModelFile,
  Pattern,
} from "../../../../../../types/types";
import typeHelper from "../../../../../helpers/TypeHelper";
import { useDispatch, useSelector } from "react-redux";

interface ModalDoubleClickNotationProps {
  isNodeModalOpen: boolean;
  setIsNodeModalOpen: (isOpen: boolean) => void;
  nodeId: string;
  data: CustomNodeData;
  setData: (data: CustomNodeData) => void;
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  isNodeOperationModalOpen: boolean;
  setIsNodeOperationModalOpen: (isOpen: boolean) => void;
  onDataUpdate: (data: CustomNodeData) => void;
}

function ModalDoubleClickNotation({
  isNodeModalOpen,
  setIsNodeModalOpen,
  nodeId,
  data,
  setData,
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  onDataUpdate,
}: ModalDoubleClickNotationProps) {
  const dispatch = useDispatch();
  const instanceModel: InstanceModelFile = useSelector(
    (state: any) => state.instanceModelStore.model
  );
  const [relationshipTab, setRelationshipTab] = useState<number>(1);

  const handleNodeNotationAttributeChange = (
    attribute: EAttribute,
    value: any
  ) => {
    const newData = { ...data }; // Create a shallow copy of the data object
    newData.nodeNotation.eAttributes = newData.nodeNotation.eAttributes!.map(
      (prop) => {
        if (prop.name === attribute.name) {
          return { ...prop, defaultValue: value }; // Ensure each property is also copied
        }
        return prop;
      }
    );
    setData(newData); // Set the new data to trigger re-rendering
  };

  const handleNodeNotationOperationChange = (
    operation: EOperation,
    value: any
  ) => {
    const newData = { ...data }; // Create a shallow copy of the data object
    newData.nodeNotation.eOperations = newData.nodeNotation.eOperations!.map(
      (prop) => {
        if (prop.name === operation.name) {
          return { ...prop, defaultValue: value }; // Ensure each property is also copied
        }
        return prop;
      }
    );
    setData(newData); // Set the new data to trigger re-rendering
  };

  const handleRoleMarkerSourceChange = (newMarker: any) => {
    console.log("New source marker selected:", newMarker); // Add this for debugging
    const newData = { ...data };
    /* if (
      newData.nodeNotation
        .roles!.find((role) => role.name === "Source")!
        .graphicalRepresentation!.find(
          (item) => item.marker && item.marker.length > 0
        ) === undefined
    ) {
      newData.nodeNotation
        .roles!.find((role) => role.name === "Source")!
        .graphicalRepresentation!.push({
          shape: "marker",
          style: { pattern: "solid" as Pattern },
          position: { x: 0, y: 0 },
          marker: newMarker,
        });
    } else {
      newData.nodeNotation
        .roles!.find((role) => role.name === "Source")!
        .graphicalRepresentation!.find(
          (item) => item.marker && item.marker.length > 0
        )!.marker = newMarker;
    } */

    setData(newData); // Update modal data
    onDataUpdate(newData); // Update parent with new data
  };

  const handleRoleMarkerTargetChange = (newMarker: any) => {
    console.log("New target marker selected:", newMarker); // Add this for debugging
    const newData = { ...data };
    /*  if (
      newData.nodeNotation
        .roles!.find((role) => role.name === "Target")!
        .graphicalRepresentation!.find(
          (item) => item.marker && item.marker.length > 0
        ) === undefined
    ) {
      newData.nodeNotation
        .roles!.find((role) => role.name === "Target")!
        .graphicalRepresentation!.push({
          shape: "marker",
          style: { pattern: "solid" as Pattern },
          position: { x: 0, y: 0 },
          marker: newMarker,
        });
    } else {
      newData.nodeNotation
        .roles!.find((role) => role.name === "Target")!
        .graphicalRepresentation!.find(
          (item) => item.marker && item.marker.length > 0
        )!.marker = newMarker;
    } */

    setData(newData); // Update modal data
    onDataUpdate(newData); // Update parent with new data
  };

  // This should not be used to update data, but only to display the attributes of the class
  const [classifierAttributes, setClassifierAttributes] = useState<
    EAttributeInstance[] | undefined
  >([]);
  useEffect(() => {
    if (instanceModel && instanceModel.ePackages.length > 0) {
      const attributes = instanceModel.ePackages[0].eClassifiers.find(
        (cls) => cls.id === nodeId
      )?.eAttributes;
      setClassifierAttributes(attributes);
    }
    console.log("Classifier attributes:", classifierAttributes);
  }, [instanceModel]);

  return (
    <CustomModal
      isOpen={isNodeModalOpen}
      onClose={() => setIsNodeModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">{data.nodeNotation.name!} Details</h2>

      {/* Normal attributes - these are class specific, under eAttributes */}

      {/* Attributes with name = "Attribute" - these are fields, but under Classifier, and we add these to eAttributes of the class */}

      <div className="w-full">
        {data.nodeNotation.eAttributes &&
          data.nodeNotation.eAttributes.map((attribute, index) => {
            {
              /* Class-Specific Attributes (e.g., isAbstract, visibility) */
            }
            if (
              attribute.name === "name" ||
              attribute.name === "abstract" ||
              attribute.name === "visibility"
            ) {
              return (
                <div key={index}>
                  <label>{attribute.name}</label>
                  <input
                    type={typeHelper.determineInputFieldType(
                      attribute.eAttributeType!.name!
                    )}
                    value={attribute.defaultValue}
                    onChange={(e) =>
                      handleNodeNotationAttributeChange(
                        attribute,
                        e.target.value
                      )
                    }
                  />
                </div>
              );
            }
          })}

        {/* Field Attributes (e.g., class members inside compartments) should just be listed */}
        <h3>Class Attributes</h3>
        {classifierAttributes &&
          classifierAttributes.map((attribute, index) => {
            if (
              attribute.name !== "name" &&
              attribute.name !== "abstract" &&
              attribute.name !== "visibility"
            ) {
              return (
                <div key={index}>
                  <span>{attribute.name}</span>
                </div>
              );
            }
          })}

        {/* Add attribute field button */}
        <div className="flex flex-row w-full">
          <div
            className="w-1/2 bg-black text-white text-center cursor-pointer"
            onClick={() => {
              setIsNodeAttributeModalOpen(true);
            }}
          >
            Add
          </div>
          <div className="w-1/2 text-center border-[1px] border-solid border-black cursor-pointer">
            Remove
          </div>
        </div>

        <br />

        {/* Field Operations (e.g., class members inside compartments) */}
        <h3>Class Operations</h3>
        {data.nodeNotation.eOperations &&
          data.nodeNotation.eOperations.map((operation, index) => {
            if (
              operation.name !== "name" &&
              operation.name !== "abstract" &&
              operation.name !== "visibility"
            ) {
              return (
                <div key={index}>
                  <label>{operation.name}</label>
                  <input
                    type={typeHelper.determineInputFieldType(
                      operation.eType!.name!
                    )}
                    onChange={(e) =>
                      handleNodeNotationOperationChange(
                        operation,
                        e.target.value
                      )
                    }
                  />
                </div>
              );
            }
          })}

        {/* Add operation field button */}
        <div className="flex flex-row w-full">
          <div
            className="w-1/2 bg-black text-white text-center cursor-pointer"
            onClick={() => {
              setIsNodeOperationModalOpen(true);
            }}
          >
            Add
          </div>
          <div className="w-1/2 text-center border-[1px] border-solid border-black cursor-pointer">
            Remove
          </div>
        </div>

        <br />

        {data.nodeNotation.type === "EReference" && (
          <>
            <div className="flex flex-row w-full">
              <div className="w-1/3">
                <button
                  onClick={() => setRelationshipTab(1)}
                  className="bg-black text-white px-2 py-[2px] font-semibold w-full"
                >
                  Edge
                </button>
              </div>
              <div className="w-1/3">
                <button
                  onClick={() => setRelationshipTab(2)}
                  className="bg-black text-white px-2 py-[2px] font-semibold w-full"
                >
                  Source
                </button>
              </div>

              <div className="w-1/3">
                <button
                  onClick={() => setRelationshipTab(3)}
                  className="bg-black text-white px-2 py-[2px] font-semibold w-full"
                >
                  Target
                </button>
              </div>
            </div>
            {/* Edge tab */}
            {relationshipTab === 1
              ? {
                  /* <div className="flex flex-col w-full">
                {data.nodeNotation.properties!.map((property, index) => (
                  <div key={index}>
                    <label>{property.name}</label>
                    <input
                      className="border-[1px] border-solid border-black"
                      type={typeHelper.determineInputFieldType(
                        property.dataType
                      )}
                      value={property.defaultValue as string | number}
                      onChange={(e) =>
                        handleNodeNotationPropertyChange(
                          property,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}

                <label>Type</label>
                <select
                  className="border-[1px] border-solid border-black"
                  onChange={(e) => {
                    data.nodeNotation.graphicalRepresentation![0].shape = e
                      .target.value as "line" | "doubleLine";
                    setData({ ...data });
                  }}
                >
                  <option value="line">Line</option>
                  <option value="doubleLine">Double Line</option>
                </select>
                <label>Pattern</label>
                <select
                  className="border-[1px] border-solid border-black"
                  onChange={(e) => {
                    data.nodeNotation.graphicalRepresentation![0].style.pattern =
                      e.target.value as "solid" | "dotted" | "dashed";
                    setData({ ...data });
                  }}
                >
                  <option value="solid">Solid</option>
                  <option value="dotted">Dotted</option>
                  <option value="dashed">Dashed</option>
                </select>
              </div> */
                }
              : // Source tab
              relationshipTab === 2
              ? {
                  /* <div className="flex flex-col w-full">
                <h3 className="font-bold">Role</h3>
                {data.notations.relationships.map((relationship, index) => (
                  <>
                    {relationship
                      .roles!.filter((role) => role.name === "Source")
                      .map((role, index) => (
                        <div key={index}>
                          {role.properties!.map((roleProperty, index) => (
                            <div key={index}>
                              <label>{roleProperty.name}</label>
                              {roleProperty.values &&
                              roleProperty.values.length > 0 ? (
                                <select
                                  className="border-[1px] border-solid border-black"
                                  value={roleProperty.defaultValue as string}
                                  onChange={(e) => {
                                    roleProperty.defaultValue = e.target.value;
                                    setData({ ...data });
                                  }}
                                >
                                  {roleProperty.values.map((value, index) => (
                                    <option key={index} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  className="border-[1px] border-solid border-black"
                                  type={typeHelper.determineInputFieldType(
                                    roleProperty.dataType
                                  )}
                                  value={
                                    roleProperty.defaultValue as string | number
                                  }
                                  onChange={(e) => {
                                    roleProperty.defaultValue = e.target.value;
                                    setData({ ...data });
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                  </>
                ))}
                <label>Marker</label>
                <select
                  className="border-[1px] border-solid border-black"
                  value={
                    data.nodeNotation.roles!.find(
                      (role) => role.name === "Source"
                    )!.graphicalRepresentation![0].marker
                  }
                  onChange={(e) => handleRoleMarkerSourceChange(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="openArrow">Open arrow</option>
                  <option value="closedArrow">Closed arrow</option>
                </select>
              </div> */
                }
              : // Target tab
                relationshipTab === 3 &&
                {
                  /* <div className="flex flex-col w-full">
                    <h3 className="font-bold">Role</h3>
                    {data.notations.relationships.map((relationship, index) => (
                      <>
                        {relationship
                          .roles!.filter((role) => role.name === "Target")
                          .map((role, index) => (
                            <div key={index}>
                              {role.properties!.map((roleProperty, index) => (
                                <div key={index}>
                                  <label>{roleProperty.name}</label>
                                  {roleProperty.values &&
                                  roleProperty.values.length > 0 ? (
                                    <select
                                      className="border-[1px] border-solid border-black"
                                      value={
                                        roleProperty.defaultValue as string
                                      }
                                      onChange={(e) => {
                                        roleProperty.defaultValue =
                                          e.target.value;
                                        setData({ ...data });
                                      }}
                                    >
                                      {roleProperty.values.map(
                                        (value, index) => (
                                          <option key={index} value={value}>
                                            {value}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  ) : (
                                    <input
                                      className="border-[1px] border-solid border-black"
                                      type={typeHelper.determineInputFieldType(
                                        roleProperty.dataType
                                      )}
                                      value={
                                        roleProperty.defaultValue as
                                          | string
                                          | number
                                      }
                                      onChange={(e) => {
                                        roleProperty.defaultValue =
                                          e.target.value;
                                        setData({ ...data });
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                      </>
                    ))}
                    <label>Marker</label>
                    <select
                      className="border-[1px] border-solid border-black"
                      value={
                        data.nodeNotation.roles!.find(
                          (role) => role.name === "Target"
                        )!.graphicalRepresentation![0].marker
                      }
                      onChange={(e) =>
                        handleRoleMarkerTargetChange(e.target.value)
                      }
                    >
                      <option value="none">None</option>
                      <option value="openArrow">Open arrow</option>
                      <option value="closedArrow">Closed arrow</option>
                    </select>
                  </div> */
                }}
          </>
        )}
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickNotation;
