import React from "react";
import {
  Class,
  DiagramNodeData,
  InstanceModel,
  InstanceObject,
  NotationRepresentationItem,
  Reference,
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
    (state: any) => state.instanceModelStore.model
  );

  return (
    <>
      {compartments.map((compartment, index) => {
        // this string is #/elements/0/references/0
        const refToCreateContentFor: string | undefined =
          compartment.content?.$ref;
        if (!refToCreateContentFor) return null;
        // Regular expression to match numbers beside 'elements' and 'references'
        const elementNumber = parseInt(
          refToCreateContentFor.match(/\/elements\/(\d+)/)![1]
        );
        const referenceNumber = parseInt(
          refToCreateContentFor.match(/\/references\/(\d+)/)![1]
        );

        const referenceToCreateContentFor: Reference | undefined =
          data.notationElement?.references[referenceNumber];
        const referencingMetaClass: Class | undefined = data.notation?.metaModel
          .package?.elements[
          +referenceToCreateContentFor?.element.$ref.split("elements/")[1]!
        ] as Class;

        if (data.instanceObject) {
          // Link object for example Attribute class or Operation class
          const linkObjects = data.instanceObject.links
            .filter((link) => {
              const linkObject =
                instanceModel.package.objects[
                  +link.target.$ref.split("objects/")[1]
                ];

              const linkObjectClass = data.notation?.metaModel.package.elements[
                +linkObject.type.$ref.split("elements/")[1]
              ] as Class;

              if (!linkObjectClass || !referencingMetaClass) return false;
              return linkObjectClass!.name === referencingMetaClass!.name;
            })
            .map((link) => {
              return instanceModel.package.objects[
                +link.target.$ref.split("objects/")[1]
              ];
            });

          const compartmentHeight = compartment.position.extent?.height || 10; // Default height for each attribute
          const compartmentX = compartment.position.x;
          const compartmentY = compartment.position.y;

          return (
            <div key={index}>
              {linkObjects &&
                linkObjects.map((linkObject, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: `${compartmentX}px`,
                      top: `${compartmentY + idx * compartmentHeight}px`, // adjust top position based on index
                      height: `${compartmentHeight}px`,
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
                      {linkObject.attributes && (
                        <span>
                          {linkObject.attributes.map((attribute, i) => {
                            return (
                              <span key={i}>
                                {attribute.name === "name" && attribute.value}
                                {attribute.name === "attributeType" &&
                                  ": " + attribute.value}
                              </span>
                            );
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          );
        }
      })}
    </>
  );
}

export default RenderCompartments;
