import React, { useState } from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import {
  Attribute,
  CustomNodeData,
  Operation,
  Pattern,
  Property,
} from "../../../../../../types/types";
import typeHelper from "../../../../../helpers/TypeHelper";

interface ModalDoubleClickNotationProps {
  isNodeModalOpen: boolean;
  setIsNodeModalOpen: (isOpen: boolean) => void;
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
  data,
  setData,
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  onDataUpdate,
}: ModalDoubleClickNotationProps) {
  const [relationshipTab, setRelationshipTab] = useState<number>(1);

  const handleNodeNotationPropertyChange = (property: Property, value: any) => {
    const newData = { ...data }; // Create a shallow copy of the data object
    newData.nodeNotation.properties = newData.nodeNotation.properties!.map(
      (prop) => {
        if (prop.name === property.name) {
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
    if (
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
    }

    setData(newData); // Update modal data
    onDataUpdate(newData); // Update parent with new data
  };

  const handleRoleMarkerTargetChange = (newMarker: any) => {
    console.log("New target marker selected:", newMarker); // Add this for debugging
    const newData = { ...data };
    if (
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
    }

    setData(newData); // Update modal data
    onDataUpdate(newData); // Update parent with new data
  };

  return (
    <CustomModal
      isOpen={isNodeModalOpen}
      onClose={() => setIsNodeModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">{data.nodeNotation.name!} Details</h2>

      <div className="w-full">
        {data.nodeNotation.properties &&
          data.nodeNotation.properties.map((property, index) => {
            const propertyDataType = property.dataType;

            if (propertyDataType === "Collection") {
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
                                  {item.defaultValue &&
                                    ` = ${item.defaultValue}`}
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

            // Properties that are not collections and node is not a relationship
            if (data.nodeNotation.type !== "relationship") {
              return (
                <div key={index}>
                  <label>{property.name}</label>
                  <input
                    type={typeHelper.determineInputFieldType(property.dataType)}
                    value={property.defaultValue as string | number}
                    onChange={(e) =>
                      handleNodeNotationPropertyChange(property, e.target.value)
                    }
                  />
                </div>
              );
            }

            return null;
          })}
        <br />

        {data.nodeNotation.type === "relationship" && (
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
            {relationshipTab === 1 ? (
              <div className="flex flex-col w-full">
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
              </div>
            ) : // Source tab
            relationshipTab === 2 ? (
              <div className="flex flex-col w-full">
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
              </div>
            ) : (
              // Target tab
              relationshipTab === 3 && (
                <div className="flex flex-col w-full">
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
                                    value={roleProperty.defaultValue as string}
                                    onChange={(e) => {
                                      roleProperty.defaultValue =
                                        e.target.value;
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
                </div>
              )
            )}
          </>
        )}
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickNotation;
