import React from "react";
import {
  CustomNodeData,
  EAttribute,
  MetaInstanceModelFile,
  NotationRepresentationItem,
  RepresentationInstanceModelFile,
} from "../../../../types/types";
import dataTypeHelper from "../../../helpers/TypeHelper";
import { useDispatch, useSelector } from "react-redux";

interface RenderTextsProps {
  nodeId: string;
  data: CustomNodeData;
  texts: NotationRepresentationItem[];
  handleTextChange: (e: any, nameFromClassifier: string | undefined) => void;
}

function RenderTexts({
  nodeId,
  data,
  texts,
  handleTextChange,
}: RenderTextsProps) {
  const dispatch = useDispatch();
  const metaInstanceModel: MetaInstanceModelFile = useSelector(
    (state: any) => state.metaInstanceModelStore.model
  );

  return (
    <>
      {texts.map((textItem, idx) => {
        // If the text is "name", we need to render the name of the node
        let nameFromClassifier: string | undefined;
        if (
          textItem.text === "name" &&
          metaInstanceModel.ePackages?.length > 0
        ) {
          nameFromClassifier = metaInstanceModel.ePackages[0].eClassifiers.find(
            (cls) => cls.id === nodeId
          )?.name;
        }

        // If the attribute is found, render the text field
        if (nameFromClassifier !== undefined) {
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
                {nameFromClassifier}
              </span>
            );
          } else {
            return (
              <input
                key={idx}
                type={"text"}
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
                value={nameFromClassifier}
                onChange={(e) => handleTextChange(e, nameFromClassifier)}
              />
            );
          }
        }
      })}
    </>
  );
}

export default RenderTexts;
