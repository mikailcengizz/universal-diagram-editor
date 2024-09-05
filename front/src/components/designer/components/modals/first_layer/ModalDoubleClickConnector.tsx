import React from "react";
import CustomModal from "../../../../ui_elements/Modal";

interface ModalDoubleClickConnectorProps {
  isConnectorModalOpen: boolean;
  setIsConnectorModalOpen: (isOpen: boolean) => void;
}

function ModalDoubleClickConnector({
  isConnectorModalOpen,
  setIsConnectorModalOpen,
}: ModalDoubleClickConnectorProps) {
  return (
    <CustomModal
      isOpen={isConnectorModalOpen}
      onClose={() => setIsConnectorModalOpen(false)}
      zIndex={5}
    >
      <h2 className="font-semibold">Connector Details</h2>
      <div>
        <div>
          <label>Color</label>
          <input type="color" />
        </div>
        <div>
          <label>Thickness</label>
          <input type="number" />
        </div>
      </div>
    </CustomModal>
  );
}

export default ModalDoubleClickConnector;
