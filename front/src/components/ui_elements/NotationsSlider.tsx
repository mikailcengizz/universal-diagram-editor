import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Class, MetaModel, RepresentationMetaModel } from "../../types/types";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesNode from "../notation_representations/edges/CombineLinkShapesNode";
import CombineRoleShapesNode from "../notation_representations/nodes/CombineRoleShapesNode";
import { Position } from "@xyflow/react";
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";

interface NotationsSliderProps {
  settings: {};
  selectedMetaModel: MetaModel;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setCurrentNotationElement: (value: Class) => void;
}

function NotationsSlider({
  settings,
  selectedMetaModel,
  selectedRepresentationMetaModel,
  setCurrentNotationElement,
}: NotationsSliderProps) {
  const updatedSettings = {
    ...settings,
    infinite: selectedMetaModel.package.elements.length > 5, // Disable infinite scroll when there's only 5 slides
  };
  const allNotationElements = selectedMetaModel.package.elements;

  const renderNodePreview = (notationElement: Class) => {
    const notationElementRepresentation =
      ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
        notationElement,
        selectedRepresentationMetaModel
      )!;

    switch (notationElementRepresentation.type) {
      case "ClassEdge":
        const { x, y, targetX, targetY } =
          notationElementRepresentation.graphicalRepresentation![0].position!;
        return (
          <CombineRelationshipShapesNode
            key={notationElementRepresentation.name}
            id={notationElementRepresentation.name}
            data={{
              notation: selectedMetaModel,
              instanceObject: undefined, // not necessary for nodes inside the slider
              position: undefined, // not necessary for nodes inside the slider
              isNotationSlider: true,
            }}
            sourceX={x}
            sourceY={y}
            targetX={targetX!}
            targetY={targetY!}
            sourcePosition={Position.Right}
            targetPosition={Position.Left}
          />
        );
      default:
        return (
          <CombineObjectShapesNode
            key={notationElementRepresentation.name}
            id={notationElementRepresentation.name}
            data={{
              notation: selectedMetaModel,
              instanceObject: undefined, // not necessary for nodes inside the slider
              position: undefined, // not necessary for nodes inside the slider
              isNotationSlider: true,
            }}
          />
        );
      /* case "role":
        return <CombineRoleShapesNode />; */
    }
  };

  return (
    <Slider {...updatedSettings} className="mt-2">
      {allNotationElements && allNotationElements.length > 0 ? (
        (allNotationElements as Class[]).map((notationElement, index) => {
          const representation =
            ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
              notationElement,
              selectedRepresentationMetaModel
            );

          return (
            <div
              key={index}
              className="border-[1px] border-black text-center h-28 p-2 cursor-pointer content-center"
              onClick={() => setCurrentNotationElement(notationElement)}
            >
              {representation &&
              representation.graphicalRepresentation!.length > 0 ? (
                renderNodePreview(notationElement)
              ) : (
                <span>{notationElement.name}</span>
              )}
            </div>
          );
        })
      ) : (
        <div>No Notations Available</div>
      )}
    </Slider>
  );
}

export default NotationsSlider;
