import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Class,
  MetaModel,
  NotationRepresentationItem,
  Representation,
  RepresentationMetaModel,
} from "../../types/types";
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
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  selectedElementIndex: number;
  setSelectedElementIndex: (value: number) => void;
}

function NotationsSlider({
  settings,
  selectedMetaModel,
  selectedRepresentationMetaModel,
  setCurrentNotationElement,
  setCurrentNotationElementRepresentation,
  selectedElementIndex,
  setSelectedElementIndex,
}: NotationsSliderProps) {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (selectedMetaModel && selectedRepresentationMetaModel) {
      setLoading(false);
    }
  }, [selectedMetaModel, selectedRepresentationMetaModel]);

  const updatedSettings = {
    ...settings,
    infinite: selectedMetaModel.package.elements.length > 5, // Disable infinite scroll when there's only 5 slides
  };

  let notationElementsRepresentation: Representation[] | null = null;
  if (
    selectedRepresentationMetaModel &&
    selectedRepresentationMetaModel.package.elements.length > 0 &&
    Array.isArray(selectedMetaModel.package.elements as Class[]) &&
    (selectedMetaModel.package.elements as Class[]).length > 0
  ) {
    notationElementsRepresentation = (
      selectedMetaModel.package.elements as Class[]
    ).map(
      (notationElement) =>
        ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
          notationElement,
          selectedRepresentationMetaModel
        )!
    );
  }

  const renderNodePreview = (notationElement: Class) => {
    const notationElementIndex = (
      selectedMetaModel.package.elements as Class[]
    ).indexOf(notationElement);
    const notationElementRepresentation =
      notationElementsRepresentation![notationElementIndex]!;

    switch (notationElementRepresentation.type) {
      case "ClassEdge":
        const { x, y, targetX, targetY } =
          notationElementRepresentation.graphicalRepresentation![0].position!;
        return (
          <CombineRelationshipShapesNode
            key={notationElementRepresentation.name}
            id={notationElementRepresentation.name}
            data={{
              notation: {
                metaModel: selectedMetaModel,
                representationMetaModel: selectedRepresentationMetaModel,
              },
              notationElement: notationElement,
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
              notation: {
                metaModel: selectedMetaModel,
                representationMetaModel: selectedRepresentationMetaModel,
              },
              notationElement: notationElement,
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

  const allGraphicalRepresentationItemsHasPosition = (
    graphicalRepresentationItems: NotationRepresentationItem[]
  ) => {
    return graphicalRepresentationItems!.every((item) => item.position);
  };

  console.log(
    "NotationsSlider.tsx: allNotationElements",
    selectedMetaModel.package.elements as Class[]
  );

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        notationElementsRepresentation && (
          <Slider
            {...updatedSettings}
            className="mt-2 border-[1px] border-[#d3d3d3] rounded-md"
          >
            {(selectedMetaModel.package.elements as Class[]) &&
            (selectedMetaModel.package.elements as Class[]).length > 0 ? (
              (selectedMetaModel.package.elements as Class[]).map(
                (notationElement, index) => {
                  const representation = notationElementsRepresentation![index];

                  return (
                    <div
                      key={index}
                      className="border-[1px] border-black text-center h-28 p-2 cursor-pointer content-center"
                      onClick={() => {
                        setSelectedElementIndex(index);
                        setCurrentNotationElement(notationElement);
                        setCurrentNotationElementRepresentation(representation);
                      }}
                    >
                      {representation &&
                      representation.graphicalRepresentation!.length > 0 &&
                      allGraphicalRepresentationItemsHasPosition(
                        representation.graphicalRepresentation!
                      ) ? (
                        renderNodePreview(notationElement)
                      ) : (
                        <span>{notationElement.name}</span>
                      )}
                    </div>
                  );
                }
              )
            ) : (
              <div>No Notations Available</div>
            )}
          </Slider>
        )
      )}
    </>
  );
}

export default NotationsSlider;
