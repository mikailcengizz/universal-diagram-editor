import React from "react";
import CloseIcon from "@mui/icons-material/Close";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: zIndex || 10,
        cursor: "unset",
      }}
    >
      <div
        style={{
          position: "relative",
          border: "1px solid black",
          backgroundColor: "#efefef",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
          cursor: "unset",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;