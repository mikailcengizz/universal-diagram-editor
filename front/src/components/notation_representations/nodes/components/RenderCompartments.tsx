import React from "react";
import {
  EAttribute,
  CustomNodeData,
  EOperation,
  NotationRepresentationItem,
} from "../../../../types/types";
import typeHelper from "../../../helpers/TypeHelper";

interface RenderCompartmentsProps {
  compartments: NotationRepresentationItem[];
  data: CustomNodeData;
}

function RenderCompartments({ compartments, data }: RenderCompartmentsProps) {
  return (
    <>
      {compartments.map((compartment, index) => {
        const generatorName = compartment.generator;

        if (generatorName === "attributesForNotation") {
          const attributes = data.nodeNotation.eAttributes!.filter(
            (attribute) =>
              attribute.name !== "name" &&
              attribute.name !== "abstract" &&
              attribute.name !== "visibility"
          )!;

          const attributeHeight = compartment.position.extent?.height || 10; // Default height for each attribute
          const compartmentX = compartment.position.x;
          const compartmentY = compartment.position.y;

          return (
            <div key={index}>
              {attributes &&
                attributes.map((attribute, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: `${compartmentX}px`,
                      top: `${compartmentY + idx * attributeHeight}px`, // Adjust top position based on index
                      height: `${attributeHeight}px`,
                      width: `${
                        data.isPalette
                          ? (compartment.position.extent?.width || 100) + "px"
                          : "100%"
                      }`,
                      fontSize: `${compartment.style.fontSize}px`,
                      zIndex: 2,
                      wordWrap: "break-word",
                      padding: "2px 5px",
                      overflowX: "hidden",
                      overflowY: "auto",
                    }}
                  >
                    <div key={idx}>
                      {/* {typeHelper.determineVisibilityIcon(attribute.visibility)}{" "} */}
                      {attribute.name}: {attribute.eAttributeType}{" "}
                      {[attribute.lowerBound, attribute.upperBound].join("..")}
                      {attribute.defaultValue && ` = ${attribute.defaultValue}`}
                    </div>
                  </div>
                ))}
            </div>
          );
        } else if (generatorName === "operationsForNotation") {
          const operations = data.nodeNotation.eOperations!;

          const operationHeight = compartment.position.extent?.height || 10; // Default height for each operation
          const compartmentX = compartment.position.x;
          const compartmentY = compartment.position.y;

          return (
            <div key={index}>
              {operations &&
                operations.map((operation, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: `${compartmentX}px`,
                      top: `${compartmentY + idx * operationHeight}px`, // Adjust top position based on index
                      height: `${operationHeight}px`,
                      width: `${
                        data.isPalette
                          ? (compartment.position.extent?.width || 100) + "px"
                          : "100%"
                      }`,
                      fontSize: `${compartment.style.fontSize}px`,
                      zIndex: 2,
                      wordWrap: "break-word",
                      padding: "2px 5px",
                      overflowX: "hidden",
                      overflowY: "auto",
                    }}
                  >
                    <div key={idx}>
                      {/* {typeHelper.determineVisibilityIcon(operation.visibility)}{" "} */}
                      {operation.name}
                      {operation.eParameters!.map((parameter, index) => (
                        <span key={index}>
                          {parameter.name}: {parameter.eType?.name}{" "}
                          {/* {parameter.defaultValue &&
                            `= ${parameter.defaultValue}`} */}
                        </span>
                      ))}
                      {operation.eType && `: ${operation.eType}`}
                    </div>
                  </div>
                ))}
            </div>
          );
        }

        /* Default case for rendering direct text and not generator elements */
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${compartment.position.x}px`,
              top: `${compartment.position.y}px`,
              width: `${compartment.position.extent?.width || 100}px`,
              height: `${compartment.position.extent?.height || 10}px`,
              borderColor: "transparent",
              borderWidth: 0,
            }}
          />
        );
      })}
    </>
  );
}

export default RenderCompartments;
