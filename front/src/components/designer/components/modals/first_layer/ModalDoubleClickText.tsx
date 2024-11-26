import { Autocomplete, TextField } from "@mui/material";
import {
  Class,
  ClassAttributeReference,
  MetaModel,
  Representation,
  RepresentationMetaModel,
} from "../../../../../types/types";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalDoubleClickTextProps {
  isTextModalOpen: boolean;
  setIsTextModalOpen: (isOpen: boolean) => void;
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  selectedMetaModel: MetaModel;
  setSelectedMetaModel: (value: MetaModel) => void;
  selectedRepresentationMetaModel: RepresentationMetaModel;
  setSelectedRepresentationMetaModel: (value: RepresentationMetaModel) => void;
  selectedElementIndex: number | null;
  selectedNotationRepresentationItemIndex: number | null;
}

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

function ModalDoubleClickText({
  isTextModalOpen,
  setIsTextModalOpen,
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  selectedMetaModel,
  setSelectedMetaModel,
  selectedRepresentationMetaModel,
  setSelectedRepresentationMetaModel,
  selectedElementIndex,
  selectedNotationRepresentationItemIndex,
}: ModalDoubleClickTextProps) {
  if (
    currentNotationElementRepresentation === null ||
    currentNotationElementRepresentation === undefined ||
    currentNotationElementRepresentation.representationItems === null ||
    currentNotationElementRepresentation.representationItems === undefined ||
    selectedElementIndex === null ||
    selectedElementIndex === undefined ||
    selectedElementIndex === -1 ||
    selectedNotationRepresentationItemIndex === null ||
    selectedNotationRepresentationItemIndex === undefined ||
    selectedNotationRepresentationItemIndex === -1
  ) {
    return null;
  }

  const handleSelectClassAttributeReference = (attributeName: string) => {
    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.representationItems!,
    ];

    const classAttributeIndex = currentNotationElement.attributes.findIndex(
      (attribute) => attribute.name === attributeName
    );

    if (classAttributeIndex === -1) return;

    updatedRepresentation[selectedNotationRepresentationItemIndex].text = {
      $ref: `${selectedMetaModel.package.uri}#/elements/${selectedElementIndex}/attributes/${classAttributeIndex}`,
    };

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      representationItems: updatedRepresentation,
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNotationRepresentationItemIndex === null) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.representationItems!,
    ];
    updatedRepresentation[selectedNotationRepresentationItemIndex].text =
      e.target.value;

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      representationItems: updatedRepresentation,
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNotationRepresentationItemIndex === null) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.representationItems!,
    ];
    updatedRepresentation[
      selectedNotationRepresentationItemIndex
    ].style.fontSize = parseInt(e.target.value);

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      representationItems: updatedRepresentation,
    });
  };

  return (
    <CustomModal
      isOpen={isTextModalOpen}
      onClose={() => setIsTextModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Text Details</h2>
      <div className="flex flex-col gap-y-2">
        {/* Configuration name */}
        <div>
          <h3 className="text-sm">Text</h3>
          {/* If user wants dynamic text, user references it to a attribute */}
          <Autocomplete
            className={configureTextfieldStyle}
            freeSolo
            options={currentNotationElement.attributes.map(
              (attribute) => attribute.name
            )} // List of existing configuration URIs
            value={
              typeof currentNotationElementRepresentation.representationItems![
                selectedNotationRepresentationItemIndex!
              ].text === "object"
                ? currentNotationElement.attributes[
                    +(
                      currentNotationElementRepresentation.representationItems![
                        selectedNotationRepresentationItemIndex!
                      ].text as ClassAttributeReference
                    ).$ref.split("attributes/")[1]
                  ].name
                : (currentNotationElementRepresentation.representationItems![
                    selectedNotationRepresentationItemIndex!
                  ].text as string)!
            }
            onInputChange={(event, attributeName: string) => {
              handleSelectClassAttributeReference(attributeName);
            }}
            renderInput={(params) => {
              // If user wants static text, user types it
              return (
                <TextField
                  {...params}
                  size="small"
                  className={configureTextfieldStyle}
                  sx={textFieldsStyleMuiSx}
                  placeholder="Text"
                  onChange={handleTextChange}
                />
              );
            }}
          />
        </div>

        {/* Font size */}
        <div>
          <h3 className="text-sm">Font size</h3>
          <TextField
            size="small"
            className={configureTextfieldStyle}
            sx={textFieldsStyleMuiSx}
            placeholder="Font size"
            type="number"
            value={
              currentNotationElementRepresentation.representationItems![
                selectedNotationRepresentationItemIndex!
              ].style.fontSize
            }
            onChange={handleFontSizeChange}
          />
        </div>
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickText;
