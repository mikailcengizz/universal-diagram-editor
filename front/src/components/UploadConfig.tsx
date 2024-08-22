import React, { useEffect, useState } from "react";
import axios from "axios";

interface UploadConfigProps {
  packageName: string;
  selectedConfig: string | null;
}

const UploadConfig = ({ packageName, selectedConfig }: UploadConfigProps) => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedConfig && selectedConfig.length > 0) {
      // set the file name if a config is selected and loaded for modification
      const fetchConfigFile = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/config/get-config/${selectedConfig}`,
            {
              responseType: "blob",
              headers: {
                Authorization: "Basic " + btoa("test@hotmail.com:test123"),
              },
            }
          );
          setFile(new File([response.data], packageName));
        } catch (error) {
          console.error("Error loading configuration file:", error);
        }
      };

      fetchConfigFile();
    }
  }, [selectedConfig, packageName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!packageName) {
      alert("Please enter a configuration name.");
      return;
    }
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file, packageName);
    } else {
      const configBlob = new Blob(
        [
          JSON.stringify({
            name: packageName,
            // additional config data if necessary
          }),
        ],
        { type: "application/json" }
      );
      formData.append("file", configBlob, packageName);
    }

    try {
      await axios.post("http://localhost:8080/config/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Basic " + btoa("test@hotmail.com:test123"),
        },
      });
      alert("Configuration uploaded successfully.");
    } catch (error) {
      console.error("Error uploading configuration:", error);
      alert("Failed to upload configuration.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <br />
      <br />
      <button
        onClick={handleUpload}
        className="bg-[#1B1B20] w-60 px-4 py-1 text-white font-bold rounded-md border-[#0F0F10] border-[1px] hover:opacity-70 transition-all ease-out duration-300"
      >
        Upload Configuration
      </button>
    </div>
  );
};

export default UploadConfig;
