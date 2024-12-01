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
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // center the modal exactly in the middle of the page
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // modal backdrop
        zIndex: zIndex || 10,
        cursor: "unset",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // center the content inside the modal
          border: "1px solid black",
          backgroundColor: "#fff", // white background for the modal content
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "600px", // ensures it won't grow too big
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // shadow for visibility
          cursor: "unset",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "none",
            cursor: "pointer",
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
