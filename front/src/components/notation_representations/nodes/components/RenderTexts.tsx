import React from "react";
import {
  CustomNodeData,
  NotationRepresentationItem,
  Property,
} from "../../../../types/types";
import dataTypeHelper from "../../helpers/DataTypeHelper";

interface RenderTextsProps {
  isPalette: boolean;
  data: CustomNodeData;
  texts: NotationRepresentationItem[];
  handleTextChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    originalIndex: number,
    propertyFromText: Property | undefined
  ) => void;
}

function RenderTexts({
  isPalette,
  data,
  texts,
  handleTextChange,
}: RenderTextsProps) {
  return (
    <>
      {texts.map((textItem, idx) => {
        const originalIndex = data.notation.graphicalRepresentation.findIndex(
          (item) => item === textItem
        );
        const propertyFromText = data.notation.properties.find(
          (prop) => prop.name === textItem.text
        );

        // we dont want editable field in palette notations
        if (isPalette) {
          return (
            <span
              key={idx}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${textItem.position.extent?.width || 100}px`,
                height: `${textItem.position.extent?.height || 20}px`,
                color: textItem.style.color,
                fontSize: `${textItem.style.fontSize}px`,
                textAlign: textItem.style.alignment as
                  | "left"
                  | "center"
                  | "right",
              }}
            >
              {textItem.text}
            </span>
          );
        } else {
          return (
            <input
              key={idx}
              type={dataTypeHelper.determineInputFieldType(
                propertyFromText!.dataType
              )}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${
                  isPalette
                    ? (textItem.position.extent?.width || 100) + "px"
                    : "100%"
                } `,
                height: `${textItem.position.extent?.height || 20}px`,
                color: textItem.style.color,
                backgroundColor: "transparent",
                fontSize: `${textItem.style.fontSize}px`,
                textAlign: textItem.style.alignment as
                  | "left"
                  | "center"
                  | "right",
                borderColor: textItem.style.borderColor,
                borderWidth: textItem.style.borderWidth,
                borderStyle: textItem.style.borderStyle,
              }}
              value={propertyFromText?.defaultValue as string | number}
              onChange={(e) =>
                handleTextChange(e, originalIndex, propertyFromText)
              }
            />
          );
        }
      })}
    </>
  );
}

export default RenderTexts;
