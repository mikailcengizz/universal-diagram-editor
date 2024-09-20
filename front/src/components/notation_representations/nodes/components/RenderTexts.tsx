import React from "react";
import {
  CustomNodeData,
  EAttribute,
  NotationRepresentationItem,
} from "../../../../types/types";
import dataTypeHelper from "../../../helpers/TypeHelper";

interface RenderTextsProps {
  data: CustomNodeData;
  texts: NotationRepresentationItem[];
  handleTextChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    originalIndex: number,
    attributeFromText: EAttribute | undefined
  ) => void;
}

function RenderTexts({ data, texts, handleTextChange }: RenderTextsProps) {
  return (
    <>
      {texts.map((textItem, idx) => {
        const originalIndex =
          data.nodeNotation.graphicalRepresentation!.findIndex(
            (item) => item === textItem
          );
        const attributeFromText = data.nodeNotation.eAttributes!.find(
          (prop) => prop.name === textItem.text
        );

        // we dont want editable field in palette notations
        if (data.isPalette) {
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
              {attributeFromText?.defaultValue}
            </span>
          );
        } else {
          return (
            <input
              key={idx}
              type={dataTypeHelper.determineInputFieldType(
                attributeFromText!.eAttributeType?.name!
              )}
              style={{
                position: "absolute",
                left: `${textItem.position.x}px`,
                top: `${textItem.position.y}px`,
                width: `${textItem.position.extent?.width || 100}px`,
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
              value={attributeFromText?.defaultValue as string | number}
              onChange={(e) =>
                handleTextChange(e, originalIndex, attributeFromText)
              }
            />
          );
        }
      })}
    </>
  );
}

export default RenderTexts;
