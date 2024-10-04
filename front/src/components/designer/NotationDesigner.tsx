import React, { useEffect, useState } from "react";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";
import NotationDesignerConfigurePanel from "./NotationDesignerConfigurePanel";
import NotationDesignerDrawPanel from "./NotationDesignerDrawPanel";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import configService from "../../services/ConfigService";
import {
  ConfigListItem,
  Attribute,
  MetaModel,
  RepresentationMetaModel,
  Class,
  Notation,
} from "../../types/types";

const NotationDesigner = () => {
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedNotation, setSelectedNotation] = useState<Notation>({
    metaModel: {
      package: {
        name: "",
        uri: "",
        elements: [],
      },
    },
    representationMetaModel: {
      package: {
        uri: "",
        elements: [],
      },
    },
  });

  const [currentNotationElement, setCurrentNotationElement] = useState<Class>({
    name: "",
    attributes: [],
    references: [],
    representation: undefined,
  });
  const [selectedNotationType, setSelectedNotationType] = useState<string>();
  const [newAttribute, setNewAttribute] = useState<Attribute>({
    name: "",
    attributeType: {
      name: "String",
    },
  });
  const [isConfigurePanelOpen, setIsConfigurePanelOpen] =
    useState<boolean>(true);
  const [isConfigLoaded, setIsConfigLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Fetch available configurations from the server
    const fetchConfigs = async () => {
      try {
        const response = await axios.get("/config/list", {
          headers: {
            Authorization: "Basic " + btoa("test@hotmail.com:test123"),
          },
        });
        setAvailableConfigs(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };

    fetchConfigs();
  }, []);

  useEffect(() => {
    // Only load config if it's not loaded yet or when a new config name is selected
    if (selectedNotation.metaModel!.package && !isConfigLoaded) {
      const loadMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByUri(
            selectedNotation.metaModel!.package.uri
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as MetaModel;
          setSelectedNotation({
            ...selectedNotation,
            metaModel: config,
          });
          setIsConfigLoaded(true); // Mark config as loaded
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadMetaConfig();

      const loadRepresentationConfig = async () => {
        try {
          const response = await configService.getRepresentationConfigByUri(
            selectedNotation.representationMetaModel!.package.uri
          );
          if (
            !response.data ||
            response.data === "" ||
            response.data === null
          ) {
            return;
          }
          const config = response.data as RepresentationMetaModel;
          setSelectedNotation({
            ...selectedNotation,
            representationMetaModel: config,
          });
        } catch (error) {
          console.error("Error loading configuration:", error);
        }
      };
      loadRepresentationConfig();
    }
  }, [selectedNotation, isConfigLoaded]);

  const handleNotationTypeChange = (e: SelectChangeEvent<string>) => {
    /* setSelectedNotationType(value);
    setCurrentNotation({
      ...currentNotation,
      type: value,
    }); */
  };

  const handleAddAttribute = () => {
    /* setCurrentNotation({
      ...currentNotation,
      attributes: [...currentNotation.attributes!, newAttribute],
    });
    setNewAttribute({
      id: "",
      name: "",
      defaultValue: "",
      eAttributeType: undefined,
      isUnique: false,
      lowerBound: 0,
      upperBound: 1,
    }); */
  };

  const saveNotation = () => {
    // Save in the frontend
    const updatedElements = { ...selectedNotation.metaModel!.package.elements };

    setSelectedNotation({
      ...selectedNotation,
      metaModel: {
        ...selectedNotation.metaModel!,
        package: {
          ...selectedNotation.metaModel!.package,
          elements: updatedElements,
        },
      },
    });

    // Save in the backend
    const saveConfig = async () => {
      try {
        await axios.post(
          "/config/save",
          {
            uri: selectedNotation?.metaModel!.package.uri,
            elements: updatedElements,
          },
          {
            headers: {
              Authorization: "Basic " + btoa("test@hotmail.com:test123"),
            },
          }
        );
      } catch (error) {
        console.error("Error saving configuration:", error);
      }
    };
    saveConfig();
  };

  return (
    <div className="flex flex-col h-full bg-white min-h-screen w-full ">
      <div className="w-full pt-4 pb-4 px-12">
        <div
          className="bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer float-right hover:opacity-85 transition duration-300 ease-in-out"
          onClick={() => setIsConfigurePanelOpen(!isConfigurePanelOpen)}
        >
          <span className="text-sm">
            Switch to {isConfigurePanelOpen ? "draw panel" : "configure panel"}
          </span>
          <AutorenewIcon className="ml-1" fontSize="small" />
        </div>
      </div>

      {/* Pass the same currentNotation and setCurrentNotation to both panels */}
      {isConfigurePanelOpen ? (
        <NotationDesignerConfigurePanel
          selectedNotationType={selectedNotationType!}
          handleNotationTypeChange={handleNotationTypeChange}
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddProperty={handleAddAttribute}
          availableConfigs={availableConfigs}
          selectedNotation={selectedNotation}
          setSelectedNotation={(config) => {
            setSelectedNotation(config);
            setIsConfigLoaded(false); // Reset flag if a new config is selected
          }}
          saveNotation={saveNotation}
        />
      ) : (
        <NotationDesignerDrawPanel
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          saveNotation={saveNotation}
        />
      )}
    </div>
  );
};

export default NotationDesigner;
