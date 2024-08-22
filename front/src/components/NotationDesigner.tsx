import React, { useEffect, useState } from "react";
import { Config, ConfigListItem, Notation } from "../types/types";
import UploadConfig from "./UploadConfig";
import axios from "axios";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PreviewNode from "./notation_representations/nodes/PreviewNode";
import type { Shape } from "../types/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Slider from "react-slick";
import SimpleSlider from "./notation_representations/ui_elements/SimpleSlider";

var notationsSliderSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
};

const inputStyle =
  "border-[1px] border-solid border-[#C8C8C8] rounded-md w-60 h-[38px] px-[16px] py-2 text-[#595959]";

const NotationDesigner: React.FC = () => {
  const [notations, setNotations] = useState<Notation[]>([]);
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedConfig, setSelectedConfig] = useState<string | null>("");
  const [packageName, setPackageName] = useState<string>("");
  const [currentNotation, setCurrentNotation] = useState<Notation>({
    name: "",
    label: "",
    shape: "rectangle",
    style: null,
    sourceId: null,
    targetId: null,
    sections: [],
    mappings: [],
    rules: {},
  });

  useEffect(() => {
    // fetch available configurations from the server
    const fetchConfigs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/config/list", {
          headers: {
            Authorization: "Basic " + btoa("test@hotmail.com:test123"),
          },
        });
        const data: ConfigListItem[] = response.data;
        setAvailableConfigs(data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };

    fetchConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      // load the selected configuration from the server
      const loadConfig = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/config/get-config/${selectedConfig}`,
            {
              headers: {
                Authorization: "Basic " + btoa("test@hotmail.com:test123"),
              },
            }
          );
          const config = response.data as Config;
          setNotations(config.notations);
          setPackageName(config.name);
          // additional code to set up other state as necessary, such as rules
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadConfig();
    }
  }, [selectedConfig]);

  const addNotation = () => {
    if (!currentNotation!.name) {
      alert("Please enter a notation name.");
      return;
    }
    setNotations([...notations, currentNotation!]);
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    // Create a new array for sections with updated values
    const updatedSections = currentNotation.sections!.map((section, idx) =>
      idx === index ? { ...section, [field]: value } : section
    );

    const newCurrentNotation = {
      ...currentNotation,
      sections: updatedSections,
    };

    setCurrentNotation(newCurrentNotation);
  };

  const handleShapeChange = (e: SelectChangeEvent<string | null>) => {
    const newCurrentNotation = currentNotation!;
    newCurrentNotation.shape = e.target.value as Shape;
    setCurrentNotation(newCurrentNotation);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentNotation = currentNotation!;
    newCurrentNotation.label = e.target.value;
    setCurrentNotation(newCurrentNotation);
  };

  const handleRuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    ruleName: string
  ) => {
    const newCurrentNotation = currentNotation!;
    newCurrentNotation.rules![ruleName] = e.target.value;
    setCurrentNotation(newCurrentNotation);
  };

  const handleNotationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCurrentNotation = {
      ...currentNotation,
      name: e.target.value,
    };
    const index = newCurrentNotation.mappings.findIndex(
      (m: any) => m.shape === currentNotation?.shape
    );
    if (index !== -1) {
      newCurrentNotation.mappings[index].metamodel = e.target.value;
    } else {
      newCurrentNotation.mappings.push({
        shape: currentNotation?.shape!,
        metamodel: e.target.value,
      });
    }
    setCurrentNotation(newCurrentNotation);
  };

  const handleConfigNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageName(e.target.value);
  };

  const exportConfig = () => {
    if (!packageName) {
      alert("Please enter a configuration name.");
      return;
    }
    if (notations.length === 0) {
      alert("Please add at least one notation.");
      return;
    }
    if (!currentNotation?.name) {
      alert("Please enter a notation name.");
      return;
    }
    const config = {
      name: packageName,
      notations: notations,
    };
    const blob = new Blob([JSON.stringify(config)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${packageName}-config.json`;
    link.click();
  };

  const previewNotation = () => {
    switch (currentNotation.shape) {
      case "rectangle":
        return (
          <PreviewNode
            key={currentNotation.name}
            shape={currentNotation.shape}
            label={currentNotation.label}
            rules={currentNotation.rules}
            sections={currentNotation.sections}
            type={currentNotation}
          />
        );
      case "label":
        return <div>{currentNotation.label}</div>;
      case "compartment":
        return (
          <div
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              backgroundColor: "white",
              padding: "10px",
              minWidth: "150px",
            }}
          >
            <div style={{ paddingBottom: "5px" }}>
              <strong>{currentNotation.label}</strong>
            </div>
          </div>
        );
      case "arrow":
        return (
          <div style={{ width: "0", height: "0", border: "10px solid" }} />
        );
      case "dot":
        return (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "black",
            }}
          />
        );
      default:
        return <div>{currentNotation.label}</div>;
    }
  };

  return (
    <div className="w-full flex flex-row gap-x-4 pr-2">
      {/* Notation Designer */}
      <div className="w-2/3 rounded-md bg-white py-6 px-10">
        <h1 className="text-2xl font-extrabold mb-8">Notation Designer</h1>
        {/* dropdown to select existing configurations */}
        <div className="mb-5 flex flex-col gap-1">
          <label>Configuration</label>
          <FormControl className="w-60">
            <Select
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              displayEmpty
              inputProps={{
                "aria-label": "Without label",
              }}
              sx={{
                "& .MuiSelect-select": {
                  paddingRight: 4,
                  paddingLeft: 2,
                  paddingTop: 1,
                  paddingBottom: 1,
                  border: "1px solid #C8C8C8",
                  color: "#595959",
                },
              }}
            >
              <MenuItem value="">Select configuration</MenuItem>
              {availableConfigs.map((config, index) => (
                <MenuItem key={index} value={config.filename}>
                  {config.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mb-5 flex flex-col gap-1">
          <label>Configuration Name</label>
          <input
            type="text"
            value={packageName}
            placeholder="Configuration name"
            onChange={handleConfigNameChange}
            className={inputStyle}
          />
        </div>
        <div className="mb-5 flex flex-col gap-1">
          <label>Select node shape</label>
          <FormControl className="w-60">
            <Select
              value={selectedConfig}
              onChange={(e) => handleShapeChange(e)}
              displayEmpty
              inputProps={{
                "aria-label": "Without label",
              }}
              sx={{
                "& .MuiSelect-select": {
                  paddingRight: 4,
                  paddingLeft: 2,
                  paddingTop: 1,
                  paddingBottom: 1,
                },
              }}
            >
              <MenuItem value="">Select node shape</MenuItem>
              <MenuItem value="rectangle">Rectangle</MenuItem>
              <MenuItem value="compartment">Compartment</MenuItem>
              <MenuItem value="label">Label</MenuItem>
              <MenuItem value="arrow">Arrow</MenuItem>
              <MenuItem value="dot">Dot</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* Mapping to metamodel element */}
        {/* Example: { shape: "rectangle", metamodel: "Class" } */}
        <div className="mb-5 flex flex-col gap-1 w-60">
          <label>Notation Name</label>
          <input
            type="text"
            value={currentNotation.name}
            placeholder="Notation name"
            className={inputStyle}
            onChange={(e) => handleNotationNameChange(e)}
          />
        </div>

        {/* Label is an element of its own, so ownly show default label text when editing a label notation */}
        {currentNotation?.shape === "label" && (
          <div style={{ marginBottom: "20px" }}>
            <label>Default Label Text: </label>
            <input
              type="text"
              value={currentNotation.label!}
              onChange={handleLabelChange}
              className="border-2 border-lightgray"
            />
          </div>
        )}
        {currentNotation?.shape === "rectangle" && (
          <div className="mb-5 flex flex-col gap-1 w-60">
            <label>Sections</label>
            {currentNotation.sections!.map((section, index) => (
              <div key={index} className="flex flex-row gap-x-2">
                <input
                  type="text"
                  placeholder="Section name"
                  value={section.name}
                  onChange={(e) =>
                    handleSectionChange(index, "name", e.target.value)
                  }
                  className={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Default text"
                  value={section.default}
                  onChange={(e) =>
                    handleSectionChange(index, "default", e.target.value)
                  }
                  className={inputStyle}
                />
              </div>
            ))}
            <button
              onClick={() => {
                if (!currentNotation.sections) {
                  setCurrentNotation({
                    ...currentNotation!,
                    sections: [{ name: "", default: "" }],
                  });
                } else {
                  setCurrentNotation({
                    ...currentNotation!,
                    sections: [
                      ...currentNotation!.sections!,
                      { name: "", default: "" },
                    ],
                  });
                }
              }}
              className="bg-[#A7A7A7] px-4 py-1 text-white font-bold rounded-md border-[#0F0F10] border-[1px] hover:opacity-70 transition-all ease-out duration-300 mr-2"
            >
              Add Section
            </button>
          </div>
        )}
        <div className="mb-5 flex flex-col gap-1 w-60">
          <h3 className="font-bold">Rules and Constraints</h3>
          <div>
            <label>Max source connections</label>
            <input
              type="number"
              onChange={(e) => handleRuleChange(e, "maxSourceConnections")}
              className={inputStyle}
              placeholder="0"
            />
          </div>
          <div>
            <label>Max target connections</label>
            <input
              type="number"
              onChange={(e) => handleRuleChange(e, "maxTargetConnections")}
              className={inputStyle}
              placeholder="0"
            />
          </div>
          {/* more rule fields as necessary */}
        </div>
        <button
          onClick={addNotation}
          className="bg-[#FF7D34] px-4 py-1 w-60 text-white font-bold rounded-md border-[#0F0F10] border-[1px] hover:opacity-70 transition-all ease-out duration-300 mr-2"
        >
          Save Notation
        </button>

        <div className="relative max-w-xl">
          <h3 className="text-lg font-bold mt-8">Current Notations</h3>
          <input type="text" className={inputStyle} placeholder="Search..." />
          <ul>
            {notations &&
              notations.length > 0 &&
              notations.map((n) => (
                <li key={n.name}>
                  {n.name} ({n.shape}) <CloseOutlinedIcon />
                </li>
              ))}
          </ul>
          <SimpleSlider settings={notationsSliderSettings} slides={[]} />
        </div>

        <button
          onClick={exportConfig}
          className="bg-[#1B1B20] w-60 px-4 py-1 text-white font-bold rounded-md border-[#0F0F10] border-[1px] hover:opacity-70 transition-all ease-out duration-300 mt-4"
        >
          Export Configuration
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-bold">Upload config to team</h3>
          <FormControl className="w-60">
            <Select
              value={selectedConfig}
              onChange={(e) => handleShapeChange(e)}
              displayEmpty
              inputProps={{
                "aria-label": "Without label",
              }}
              sx={{
                "& .MuiSelect-select": {
                  paddingRight: 4,
                  paddingLeft: 2,
                  paddingTop: 1,
                  paddingBottom: 1,
                },
              }}
            >
              <MenuItem value="">Select team</MenuItem>
              <MenuItem value="team-1">Team 1</MenuItem>
              <MenuItem value="team-2">Team 2</MenuItem>
              <MenuItem value="team-3">Team 3</MenuItem>
              <MenuItem value="team-4">Team 4</MenuItem>
              <MenuItem value="team-5">Team 5</MenuItem>
            </Select>
          </FormControl>
          <UploadConfig
            packageName={packageName}
            selectedConfig={selectedConfig}
          />
        </div>
      </div>

      {/* Notation Preview */}
      <div className="w-1/3 rounded-md bg-white py-6 px-10">
        <h1 className="text-2xl font-extrabold mb-8">Notation Preview</h1>
        <div className="flex">
          {/* Render the selected notation */}
          {previewNotation()}
        </div>
      </div>
    </div>
  );
};

export default NotationDesigner;
