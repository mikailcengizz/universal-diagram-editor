import React, { useEffect, useState } from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import {
  AttributeValue,
  DiagramNodeData,
  InstanceModel,
  RepresentationInstanceModel,
} from "../../../../../../types/types";
import typeHelper from "../../../../../helpers/TypeHelper";
import { useDispatch, useSelector } from "react-redux";
import ModelHelperFunctions from "../../../../../helpers/ModelHelperFunctions";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateInstanceModel } from "../../../../../../redux/actions/objectInstanceModelActions";

interface ModalDoubleClickNotationProps {
  isNodeModalOpen: boolean;
  setIsNodeModalOpen: (isOpen: boolean) => void;
  instanceModel: InstanceModel;
  data: DiagramNodeData;
  setData: (data: DiagramNodeData) => void;
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
  isNodeOperationModalOpen: boolean;
  setIsNodeOperationModalOpen: (isOpen: boolean) => void;
  onDataUpdate: (data: DiagramNodeData) => void;
}

function ModalDoubleClickNotation({
  isNodeModalOpen,
  setIsNodeModalOpen,
  instanceModel,
  data,
  setData,
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
  isNodeOperationModalOpen,
  setIsNodeOperationModalOpen,
  onDataUpdate,
}: ModalDoubleClickNotationProps) {
  const dispatch = useDispatch();
  const representationInstanceModel: RepresentationInstanceModel = useSelector(
    (state: any) => state.representationInstanceModelStore.model
  );
  const representationInstanceObject =
    ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
      data.instanceObject!,
      representationInstanceModel
    );
  const [relationshipTab, setRelationshipTab] = useState<number>(1);

  useEffect(() => {}, [instanceModel]);

  const handleNodeNotationAttributeChange = (
    attribute: AttributeValue,
    value: any
  ) => {
    const newData = { ...data }; // create a shallow copy of the data object
    newData.instanceObject!.attributes =
      newData.instanceObject!.attributes!.map((prop) => {
        if (prop.name === attribute.name) {
          return { name: attribute.name, value: value } as AttributeValue; // ensure each property is also copied
        }
        return prop;
      });
    const updatedInstanceModel = { ...instanceModel };
    updatedInstanceModel.package.objects =
      updatedInstanceModel.package.objects.map((object) => {
        if (object.name === data.instanceObject!.name) {
          object.attributes = newData.instanceObject!.attributes;
        }
        return object;
      });
    dispatch(updateInstanceModel(updatedInstanceModel));
    setData(newData); // set the new data to trigger re-rendering
  };

  const handleAttributeDelete = (index: number) => {
    const newData = { ...data };
    newData.instanceObject!.attributes =
      newData.instanceObject!.attributes!.filter((attr, idx) => idx !== index);

    const updatedInstanceModel = { ...instanceModel };
    updatedInstanceModel.package.objects =
      updatedInstanceModel.package.objects.map((object) => {
        if (object.name === data.instanceObject!.name) {
          object.attributes = newData.instanceObject!.attributes;
        }
        return object;
      });
    dispatch(updateInstanceModel(updatedInstanceModel));
    setData(newData);
  };

  const handleAttributeReferenceDelete = (index: number) => {
    const newData = { ...data };
    const attributeObjectIndex =
      +newData.instanceObject!.links[index].target.$ref.split("objects/")[1];

    // remove the attribute reference link from the instance object
    newData.instanceObject!.links = newData.instanceObject!.links!.filter(
      (link, idx) => idx !== index
    );

    // update the instance model with the new data
    const updatedInstanceModel = { ...instanceModel };
    updatedInstanceModel.package.objects =
      updatedInstanceModel.package.objects.map((object) => {
        if (object.name === data.instanceObject!.name) {
          object.links = newData.instanceObject!.links;
        }
        return object;
      });

    // remove the attribute object from the instance model
    updatedInstanceModel.package.objects.splice(attributeObjectIndex, 1);

    dispatch(updateInstanceModel(updatedInstanceModel));
    setData(newData);
  };

  const instanceObject = instanceModel.package.objects.find(
    (object) => object.name === data.instanceObject?.name
  );

  if (!instanceObject) {
    return null;
  }

  console.log("instanceObject", instanceObject);
  console.log("instanceModel", instanceModel);

  return (
    <CustomModal
      isOpen={isNodeModalOpen}
      onClose={() => setIsNodeModalOpen(false)}
      zIndex={5}
    >
      <div className="w-full flex flex-col gap-y-2">
        <h2 className="font-semibold">{instanceObject.name!} Details</h2>
        {instanceObject.attributes.map((attribute, index) => {
          console.log("Attribute:", attribute);
          /* class-specific attributes (e.g., isAbstract, isInterface) */
          return (
            <div key={index}>
              <h3 className="text-sm">{attribute.name}</h3>
              <div className="flex">
                <TextField
                  size="small"
                  type={typeHelper.determineInputFieldType(attribute.name!)}
                  value={attribute.value as string}
                  onChange={(e) =>
                    handleNodeNotationAttributeChange(attribute, e.target.value)
                  }
                />
                <div
                  className={`bg-[#000000] px-2 py-1 w-fit rounded-md items-center flex text-white text-xs cursor-pointer hover:opacity-85 trransition duration-300 ease-in-out float-left`}
                  onClick={() => handleAttributeDelete(index)}
                >
                  <DeleteIcon
                    style={{
                      width: "15px",
                      height: "15px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* References to Attribute objects, i.e added attribute instances */}
        <h3>Attributes</h3>
        {instanceObject.links &&
          instanceObject.links
            .filter((link) => link.name === "attribute")
            .map((reference, index) => {
              const targetObjectIndex =
                +reference.target.$ref.split("objects/")[1];
              const targetObject =
                instanceModel.package.objects[targetObjectIndex];

              const attributeName = targetObject.attributes.find(
                (attribute) => attribute.name === "name"
              )?.value;
              const attributeType = targetObject.attributes.find(
                (attribute) => attribute.name === "attributeType"
              )?.value;

              // actually the user should be able to choose the order of how the attributes are displayed and which ones are displayed
              // but will choose it for them for now
              const wholeAttribute = `${attributeName}: ${attributeType}`;

              return (
                <div key={index}>
                  <div className="flex">
                    <div className="border-[1px] border-[#c5c5c5] w-full py-2 px-4 rounded-md">
                      <span>{wholeAttribute}</span>
                    </div>

                    <div
                      className={`bg-[#000000] px-2 py-1 w-fit rounded-md items-center flex text-white text-xs cursor-pointer hover:opacity-85 trransition duration-300 ease-in-out float-left`}
                      onClick={() => handleAttributeReferenceDelete(index)}
                    >
                      <DeleteIcon
                        style={{
                          width: "15px",
                          height: "15px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        {/* Add attribute field button */}
        <div className="flex flex-row w-full">
          <div
            className="w-full bg-black text-white text-center cursor-pointer"
            onClick={() => {
              setIsNodeAttributeModalOpen(true);
            }}
          >
            Add
          </div>
        </div>

        <br />

        {representationInstanceObject &&
          representationInstanceObject!.type === "ClassEdge" && (
            <div>
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
            </div>
          )}
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickNotation;
