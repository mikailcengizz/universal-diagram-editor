// UploadConfig.tsx
import React, { useState } from "react";
import axios from "axios";

const UploadConfig: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("http://localhost:8080/config/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Configuration uploaded successfully.");
      } catch (error) {
        console.error("Error uploading configuration:", error);
        alert("Failed to upload configuration.");
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <br />
      <br />
      <button
        onClick={handleUpload}
        className="bg-black px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300"
      >
        Upload Configuration
      </button>
    </div>
  );
};

export default UploadConfig;
