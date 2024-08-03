import React, { useState, useEffect } from "react";
import axios from "axios";

const ConfigSelector: React.FC = () => {
  const [configs, setConfigs] = useState<string[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await axios.get("/config/list");
        setConfigs(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigs();
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConfig(e.target.value);
  };

  return (
    <div>
      <label>Select Configuration: </label>
      <select onChange={handleConfigChange}>
        <option value="">-- Select a Configuration --</option>
        {configs.map((config, index) => (
          <option key={index} value={config}>
            {config}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ConfigSelector;
