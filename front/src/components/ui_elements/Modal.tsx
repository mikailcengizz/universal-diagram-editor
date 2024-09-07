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
        position: "absolute", // Changed to absolute positioning
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Center the modal exactly in the middle of the page
        width: "100%", // Full page width
        height: "100%", // Full page height
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Modal backdrop
        zIndex: zIndex || 10,
        cursor: "unset",
      }}
    >
      <div
        style={{
          position: "absolute", // Still use absolute for the inner modal container
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Center the content inside the modal
          border: "1px solid black",
          backgroundColor: "#fff", // White background for the modal content
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "600px", // Ensures it won't grow too big
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Adds a shadow for visibility
          cursor: "unset",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none", // Remove border
            background: "none", // No background for cleaner design
            cursor: "pointer", // Makes the button clickable
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
