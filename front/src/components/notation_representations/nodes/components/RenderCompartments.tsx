import React from "react";
import {
  Class,
  DiagramNodeData,
  InstanceModel,
  InstanceObject,
  NotationRepresentationItem,
} from "../../../../types/types";
import typeHelper from "../../../helpers/TypeHelper";
import { useDispatch, useSelector } from "react-redux";

interface RenderCompartmentsProps {
  nodeId: string;
  compartments: NotationRepresentationItem[];
  data: DiagramNodeData;
  isPalette?: boolean;
  isNotationSlider?: boolean;
}

function RenderCompartments({
  nodeId,
  compartments,
  data,
  isPalette = false,
  isNotationSlider = false,
}: RenderCompartmentsProps) {
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.metaInstanceModelStore.model
  );

  return (
    <>
      {compartments.map((compartment, index) => {
        const generatorName = compartment.generator;
        let instanceObject: InstanceObject | undefined = undefined;
        if (instanceModel.package) {
          instanceObject = instanceModel.package!.objects.find(
            (obj) => obj.name === data.instanceObject?.name
          );
        }

        if (generatorName === "attributesForNotation" && instanceObject) {
          const attributes = instanceObject.attributes!.filter(
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
                      {/* {typeHelper.determineVisibilityIcon(attribute.visibility)}{" "} */}
                      {attribute.name} {attribute.value}
                    </div>
                  </div>
                ))}
            </div>
          );
        } /* else if (generatorName === "operationsForNotation" && classifier) {
          const operations = data.instance.eOperations!;

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
                      {/* {typeHelper.determineVisibilityIcon(operation.visibility)}{" "} }
                      {operation.name}
                      {operation.eParameters!.map((parameter, index) => (
                        <span key={index}>
                          {parameter.name}: {parameter.eType?.name}{" "}
                          {/* {parameter.defaultValue &&
                            `= ${parameter.defaultValue}`} }
                        </span>
                      ))}
                      {operation.eType && `: ${operation.eType}`}
                    </div>
                  </div>
                ))}
            </div>
          );
        } */

        /* Default case for rendering direct text and not generator elements */
        /* return (
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
        ); */
      })}
    </>
  );
}

export default RenderCompartments;
