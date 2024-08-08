import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadConfig = (configName: any, selectedConfig: any) => {
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
          setFile(new File([response.data], configName));
        } catch (error) {
          console.error("Error loading configuration file:", error);
        }
      };

      fetchConfigFile();
    }
  }, [selectedConfig, configName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!configName) {
      alert("Please enter a configuration name.");
      return;
    }
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file, configName);
    } else {
      const configBlob = new Blob(
        [
          JSON.stringify({
            name: configName,
            // additional config data if necessary
          }),
        ],
        { type: "application/json" }
      );
      formData.append("file", configBlob, configName);
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
        className="bg-black px-4 py-1 text-white font-bold rounded-md hover:opacity-70 transition-all ease-out duration-300"
      >
        Upload Configuration
      </button>
    </div>
  );
};

export default UploadConfig;
