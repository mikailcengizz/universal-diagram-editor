import { Notation } from "../../../../../types/types";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalDoubleClickTextProps {
  isTextModalOpen: boolean;
  setIsTextModalOpen: (isOpen: boolean) => void;
  currentNotation: Notation;
  setCurrentNotation: (value: Notation) => void;
  selectedElementIndex: number | null;
}

function ModalDoubleClickText({
  isTextModalOpen,
  setIsTextModalOpen,
  currentNotation,
  setCurrentNotation,
  selectedElementIndex,
}: ModalDoubleClickTextProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedElementIndex === null) return;

    const updatedRepresentation = [...currentNotation.graphicalRepresentation];
    updatedRepresentation[selectedElementIndex].text = e.target.value;

    setCurrentNotation({
      ...currentNotation,
      graphicalRepresentation: updatedRepresentation,
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedElementIndex === null) return;

    const updatedRepresentation = [...currentNotation.graphicalRepresentation];
    updatedRepresentation[selectedElementIndex].style.fontSize = parseInt(
      e.target.value
    );

    setCurrentNotation({
      ...currentNotation,
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
