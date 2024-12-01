import React, { useState } from "react";
import CustomModal from "../../../../../ui_elements/Modal";
import {
  AttributeValue,
  Class,
  DiagramNodeData,
  InstanceModel,
  RepresentationInstanceModel,
} from "../../../../../../types/types";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { updateInstanceModel } from "../../../../../../redux/actions/objectInstanceModelActions";

interface ModalAddAttributeProps {
  data: DiagramNodeData;
  instanceModel: InstanceModel;
  representationInstanceModel: RepresentationInstanceModel;
  isNodeAttributeModalOpen: boolean;
  setIsNodeAttributeModalOpen: (isOpen: boolean) => void;
}

const inputStyle = "border border-gray-300 rounded-md p-1";

const textFieldsStyleMuiSx = {
  "& .MuiOutlinedInput-root": {
    border: "1px solid #d3d3d3",
    fontSize: "14px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const configureTextfieldStyle = "w-1/3 2xl:w-[450px]";

function ModalAddAttribute({
  data,
  instanceModel,
  representationInstanceModel,
  isNodeAttributeModalOpen,
  setIsNodeAttributeModalOpen,
}: ModalAddAttributeProps) {
  const dispatch = useDispatch();
  const attributeClass = data.notation!.metaModel.package.elements.find(
    (element) => element.name === "Attribute"
  )! as Class;
  const initialModifyingAttributeAttributes =
    attributeClass &&
    attributeClass.attributes!.map((attribute) => {
      return {
        name: attribute.name,
        value: attribute.defaultValue,
      } as AttributeValue;
    });

  const [modifiyingAttributeAttributes, setModifyingAttributeAttributes] =
    useState<AttributeValue[]>(initialModifyingAttributeAttributes || []);
  const handleAttributeChange = (
    attributeName: string,
    value: any,
    index: number
  ) => {
    const newAttributes = [...modifiyingAttributeAttributes];
    newAttributes[index] = { ...newAttributes[index], value: value };
    setModifyingAttributeAttributes(newAttributes);
  };

  const handleAttributeSubmit = () => {
    let newAttributeAttributes = [...modifiyingAttributeAttributes];
    let updatedInstanceModel = { ...instanceModel };
    updatedInstanceModel.package.objects
      .find(
        (instanceObject) => instanceObject.name === data.instanceObject!.name
      )!
      .links.push({
        name: "attribute",
        target: {
          $ref:
            data.notation?.metaModel.package.uri +
            "#/objects/" +
            updatedInstanceModel.package.objects.length,
        },
      });

    updatedInstanceModel.package.objects.push({
      name: "Attribute-" + uuidv4(),
      type: {
        $ref:
          data.notation?.metaModel.package.uri +
          "#/elements/" +
          (data.notation?.metaModel.package.elements as any[]).findIndex(
            (element) => element.name === "Attribute"
          ),
      },
      attributes: [...newAttributeAttributes],
      links: [],
      representation: {
        $ref:
          data.notation?.metaModel.package.uri +
          "#/elements/" +
          representationInstanceModel.package.objects.length,
      },
    });

    dispatch(updateInstanceModel(updatedInstanceModel));

    setIsNodeAttributeModalOpen(false);
    setModifyingAttributeAttributes(initialModifyingAttributeAttributes || []);
  };

  return (
    <CustomModal
      isOpen={isNodeAttributeModalOpen}
      onClose={() => setIsNodeAttributeModalOpen(false)}
      zIndex={10}
    >
      <h2>Attribute</h2>
      <div className="flex flex-col gap-y-2">
        {modifiyingAttributeAttributes.map((attribute, index) => {
          return (
            <div key={attribute.name}>
              <label>{attribute.name}</label>
              <br />
              <input
                name={attribute.name}
                className={inputStyle}
                type="text"
                value={attribute.value}
                onChange={(e) =>
                  handleAttributeChange(attribute.name!, e.target.value, index)
                }
              />
              <br />
            </div>
          );
        })}
      </div>

      <br />
      <button
        className="bg-black text-white px-2 py-[2px] font-semibold"
        onClick={handleAttributeSubmit}
      >
        Add Attribute
      </button>
    </CustomModal>
  );
}

export default ModalAddAttribute;
