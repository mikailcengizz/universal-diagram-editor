import { Class, Representation } from "../../../../../types/types";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalDoubleClickTextProps {
  isTextModalOpen: boolean;
  setIsTextModalOpen: (isOpen: boolean) => void;
  currentNotationElementRepresentation: Representation;
  setCurrentNotationElementRepresentation: (value: Representation) => void;
  currentNotationElement: Class;
  setCurrentNotationElement: (value: Class) => void;
  selectedElementIndex: number | null;
}

function ModalDoubleClickText({
  isTextModalOpen,
  setIsTextModalOpen,
  currentNotationElementRepresentation,
  setCurrentNotationElementRepresentation,
  currentNotationElement,
  setCurrentNotationElement,
  selectedElementIndex,
}: ModalDoubleClickTextProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedElementIndex === null) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.graphicalRepresentation!,
    ];
    updatedRepresentation[selectedElementIndex].text = e.target.value;

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      graphicalRepresentation: updatedRepresentation,
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedElementIndex === null) return;

    const updatedRepresentation = [
      ...currentNotationElementRepresentation?.graphicalRepresentation!,
    ];
    updatedRepresentation[selectedElementIndex].style.fontSize = parseInt(
      e.target.value
    );

    setCurrentNotationElementRepresentation({
      ...currentNotationElementRepresentation,
      graphicalRepresentation: updatedRepresentation,
    });
  };

  return (
    <CustomModal
      isOpen={isTextModalOpen}
      onClose={() => setIsTextModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Text Details</h2>
      <div>
        <div>
          <label>Text</label>
          <input type="text" onChange={handleTextChange} />
        </div>
        <div>
          <label>Font Size</label>
          <input type="number" onChange={handleFontSizeChange} />
        </div>
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickText;
