import React from "react";
import {
  CustomNodeData,
  NotationRepresentationItem,
} from "../../../../types/types";

interface RenderCompartmentsProps {
  compartments: NotationRepresentationItem[];
  data: CustomNodeData;
  isPalette: boolean;
}

function RenderCompartments({
  compartments,
  data,
  isPalette,
}: RenderCompartmentsProps) {
  return (
    <>
      {compartments.map((compartment, index) => {
        const generatorName = compartment.generator;

        if (generatorName === "attributesForNotation") {
          const attributeProperty = data.notation.properties.find(
            (prop) => prop.elementType === "Attribute"
          )!;
          console.log("generating attributes", attributeProperty);
          console.log("compartment", compartment);

          const attributeHeight = compartment.position.extent?.height || 10; // Default height for each attribute
          const compartmentX = compartment.position.x;
          const compartmentY = compartment.position.y;

          return (
            <>
              {attributeProperty.defaultValue &&
                (attributeProperty.defaultValue as Array<any>).map(
                  (attribute, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: `${compartmentX}px`,
                        top: `${compartmentY + idx * attributeHeight}px`, // Adjust top position based on index
                        height: `${attributeHeight}px`,
                        width: `${
                          isPalette
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
                        {attribute.name}: {attribute.dataType} [
                        {attribute.multiplicity}]
                        {attribute.visibility &&
                          `, Visibility: ${attribute.visibility}`}
                        {attribute.unique && ", Unique"}
                        {attribute.derived && ", Derived"}
                        {attribute.constraints &&
                          `, Constraints: ${attribute.constraints}`}
                        {` = ${attribute.defaultValue}`}
                      </div>
                    </div>
                  )
                )}
            </>
          );
        } else if (generatorName === "operationsForNotation") {
          const operationProperty = data.notation.properties.find(
            (prop) => prop.elementType === "Operation"
          )!;
          console.log("generating operations", operationProperty);
          console.log("compartment", compartment);

          const operationHeight = compartment.position.extent?.height || 10; // Default height for each operation
          const compartmentX = compartment.position.x;
          const compartmentY = compartment.position.y;

          return (
            <>
              {operationProperty.defaultValue &&
                (operationProperty.defaultValue as Array<any>).map(
                  (operation, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: `${compartmentX}px`,
                        top: `${compartmentY + idx * operationHeight}px`, // Adjust top position based on index
                        height: `${operationHeight}px`,
                        width: `${
                          isPalette
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
                        {operation.name}: {operation.dataType} [
                        {operation.multiplicity}]
                        {operation.visibility &&
                          `, Visibility: ${operation.visibility}`}
                        {operation.unique && ", Unique"}
                        {operation.derived && ", Derived"}
                        {operation.constraints &&
                          `, Constraints: ${operation.constraints}`}
                        {` = ${operation.defaultValue}`}
                      </div>
                    </div>
                  )
                )}
            </>
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
