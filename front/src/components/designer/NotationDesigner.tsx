import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Representation,
  Reference,
} from "../../types/types";
import AlertWithFade from "../ui_elements/AlertWithFade";

const NotationDesigner = () => {
  const [availableConfigs, setAvailableConfigs] = useState<ConfigListItem[]>(
    []
  );
  const [selectedMetaModel, setSelectedMetaModel] = useState<MetaModel>({
    package: {
      name: "",
      uri: "",
      elements: [],
    },
  });
  const [selectedRepresentationMetaModel, setSelectedRepresentationMetaModel] =
    useState<RepresentationMetaModel>({
      package: {
        name: "",
        uri: "",
        elements: [],
      },
    });

  const [currentNotationElement, setCurrentNotationElement] = useState<Class>({
    name: "",
    isAbstract: false,
    isInterface: false,
    attributes: [],
    references: [],
    representation: {
      $ref: "",
    },
  });
  const [
    currentNotationElementRepresentation,
    setCurrentNotationElementRepresentation,
  ] = useState<Representation>({
    name: "",
    type: "None",
    graphicalRepresentation: [],
  });

  const [newAttribute, setNewAttribute] = useState<Attribute>({
    name: "",
    attributeType: {
      name: "String",
    },
    defaultValue: "",
    isUnique: undefined,
  });
  const [newReference, setNewReference] = useState<Reference>({
    name: "",
    element: {
      $ref: "",
    },
  });
  const [isConfigurePanelOpen, setIsConfigurePanelOpen] =
    useState<boolean>(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [selectedElementIndex, setSelectedElementIndex] = useState<number>(-1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    // fetch available configurations from the server
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

  const loadMetaConfig = async (selectedUri: string) => {
    try {
      const response = await configService.getMetaConfigByUri(
        encodeURIComponent(selectedUri)
      );
      if (!response.data || response.data === "" || response.data === null) {
        return;
      }
      const config = response.data as MetaModel;
      setSelectedMetaModel(config);
    } catch (error) {
      console.error("Error loading meta configuration:", error);
    }
  };

  const loadRepresentationConfig = async (selectedUri: string) => {
    try {
      const response = await configService.getRepresentationConfigByUri(
        encodeURIComponent(selectedUri + "-representation")
      );
      if (!response.data || response.data === "" || response.data === null) {
        return;
      }
      const config = response.data as RepresentationMetaModel;
      setSelectedRepresentationMetaModel(config);
    } catch (error) {
      console.error("Error loading representation configuration:", error);
    }
  };

  const deleteConfig = async (uri: string) => {
    try {
      await configService.deleteConfig(encodeURIComponent(uri));
    } catch (error) {
      console.error("Error deleting configuration:", error);
    }
  };

  const handleSelectUri = async (uri: string) => {
    // always reset current notation element
    setCurrentNotationElement({
      name: "",
      isAbstract: false,
      isInterface: false,
      attributes: [],
      references: [],
      representation: {
        $ref: "",
      },
    });
    // if the uri is already registered, load the config
    const config = availableConfigs.find((c) => c.uri === uri);
    if (config) {
      setSelectedMetaModel({
        package: {
          uri: config.uri,
          name: config.name,
          elements: [],
        },
      });
      setSelectedRepresentationMetaModel({
        package: {
          name: config.name + " Representation",
          uri: config.uri + "-representation",
          elements: [],
        },
      });
      await loadMetaConfig(config.uri);
      await loadRepresentationConfig(config.uri);
    } else {
      setSelectedMetaModel({
        package: {
          uri: uri,
          name: "",
          elements: [],
        },
      });
      setSelectedRepresentationMetaModel({
        package: {
          name: "",
          uri: uri + "-representation",
          elements: [],
        },
      });
    }
  };

  const handleAddAttribute = () => {
    setCurrentNotationElement({
      ...currentNotationElement,
      attributes: [...currentNotationElement.attributes!, newAttribute],
    });
    setNewAttribute({
      name: "",
      defaultValue: "",
      attributeType: { name: "String" },
      isUnique: undefined,
    });
  };

  const handleAddReference = () => {
    setCurrentNotationElement({
      ...currentNotationElement,
      references: [...currentNotationElement.references!, newReference],
    });
    setNewReference({
      name: "",
      element: {
        $ref: "",
      },
    });
  };

  const saveNotation = (
    selectedElementIndex: number,
    removeElement: boolean
  ) => {
    // save in the frontend
    const updatedElements = [...selectedMetaModel.package.elements];
    currentNotationElement.representation = {
      $ref:
        selectedRepresentationMetaModel.package.uri +
        "#/elements/" +
        selectedElementIndex,
    };
    currentNotationElement.constraints = [];

    if (selectedElementIndex === -1 && currentNotationElement.name !== "") {
      updatedElements.push(currentNotationElement);
    } else if (selectedElementIndex > -1) {
      if (removeElement) {
        updatedElements.splice(selectedElementIndex, 1);
      } else {
        updatedElements[selectedElementIndex] = currentNotationElement;
      }
    }

    const updatedMetaModel = {
      package: {
        ...selectedMetaModel.package,
        uri: selectedMetaModel.package.uri,
        elements: updatedElements,
      },
    };

    setSelectedMetaModel(updatedMetaModel);

    // save meta model in the backend
    console.log("saving meta config", updatedMetaModel);
    const saveConfig = async () => {
      try {
        await configService.saveMetaConfig(updatedMetaModel);
        setAlertMessage("Your notation was saved successfully!");
        setAlertSeverity("success");
      } catch (error) {
        setAlertMessage(
          "Failed to save notation. Please try again or contact support."
        );
        setAlertSeverity("error");
        console.error("Error saving configuration:", error);
      }
    };
    saveConfig();

    const updatedRepresentationElements = [
      ...selectedRepresentationMetaModel.package.elements,
    ];

    console.log("selectedElementIndex", selectedElementIndex);
    console.log("currentNotationElement", currentNotationElementRepresentation);

    if (selectedElementIndex === -1 && currentNotationElement.name !== "") {
      updatedRepresentationElements.push(currentNotationElementRepresentation);
      console.log("pushed new element", currentNotationElementRepresentation);
    } else if (selectedElementIndex > -1) {
      if (removeElement) {
        updatedRepresentationElements.splice(selectedElementIndex, 1);
        console.log("removed element", selectedElementIndex);
      } else {
        updatedRepresentationElements[selectedElementIndex] =
          currentNotationElementRepresentation;
        console.log("updated element", selectedElementIndex);
      }
    }

    const updatedRepresentationMetaModelURI =
      selectedRepresentationMetaModel.package.uri === ""
        ? selectedMetaModel.package.uri + "representation"
        : selectedRepresentationMetaModel.package.uri;
    const updatedRepresentationMetaModel = {
      package: {
        name: selectedMetaModel.package.name! + " Representation",
        uri: updatedRepresentationMetaModelURI,
        elements: updatedRepresentationElements,
      },
    };

    setSelectedRepresentationMetaModel(updatedRepresentationMetaModel);

    // save representation in the backend
    console.log("saving representation config", updatedRepresentationMetaModel);
    const saveRepresentationConfig = async () => {
      try {
        await configService.saveRepresentationConfig(
          updatedRepresentationMetaModel
        );
        setAlertMessage("Your notation was saved successfully!");
        setAlertSeverity("success");
      } catch (error) {
        setAlertMessage(
          "Failed to save notation's representation. Please try again."
        );
        setAlertSeverity("error");
        console.error("Error saving representation configuration:", error);
      }
    };
    saveRepresentationConfig();
    setSelectedElementIndex(selectedElementIndex);

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // alert fade out after 3 seconds
  };

  const handleDeleteConfig = (uri: string) => {
    deleteConfig(uri);
    setAvailableConfigs(availableConfigs.filter((c) => c.uri !== uri));
    setSelectedMetaModel({
      package: {
        name: "",
        uri: "",
        elements: [],
      },
    });
  };

  useEffect(() => {
    // show the button with animation
    if (currentNotationElement.name !== "") {
      setTimeout(() => {
        setIsButtonVisible(true);
      }, 100); // small delay for smoother appearance
    }
  }, [currentNotationElement.name]);

  return (
    <div className="flex flex-col h-full bg-white min-h-screen w-full pt-8 relative">
      {currentNotationElement.name !== "" &&
        currentNotationElementRepresentation !== undefined &&
        currentNotationElementRepresentation !== null &&
        currentNotationElementRepresentation.type !== "None" && (
          <div
            className={`absolute top-11 right-12 bg-[#1B1B20] px-4 py-2 w-fit rounded-md text-white cursor-pointer float-right hover:opacity-85 transition-opacity transition-transform duration-300 ease-in-out transform 
          ${
            isButtonVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
            onClick={() => setIsConfigurePanelOpen(!isConfigurePanelOpen)}
          >
            <span className="text-sm">
              Switch to{" "}
              {isConfigurePanelOpen ? "draw panel" : "configure panel"}
            </span>
            <AutorenewIcon className="ml-1" fontSize="small" />
          </div>
        )}

      {/* pass the same currentNotation and setCurrentNotation to both panels */}
      {isConfigurePanelOpen ? (
        <NotationDesignerConfigurePanel
          availableConfigs={availableConfigs}
          handleDeleteConfig={handleDeleteConfig}
          handleSelectUri={handleSelectUri}
          selectedElementIndex={selectedElementIndex}
          setSelectedElementIndex={setSelectedElementIndex}
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          setCurrentNotationElementRepresentation={
            setCurrentNotationElementRepresentation
          }
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          handleAddAttribute={handleAddAttribute}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddReference={handleAddReference}
          newReference={newReference}
          setNewReference={setNewReference}
          selectedMetaModel={selectedMetaModel}
          setSelectedMetaModel={setSelectedMetaModel}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
          setSelectedRepresentationMetaModel={
            setSelectedRepresentationMetaModel
          }
          saveNotation={(selectedElementIndex, removeElement) =>
            saveNotation(selectedElementIndex, removeElement)
          }
        />
      ) : (
        <NotationDesignerDrawPanel
          currentNotationElementRepresentation={
            currentNotationElementRepresentation
          }
          setCurrentNotationElementRepresentation={
            setCurrentNotationElementRepresentation
          }
          selectedNotationElementIndex={selectedElementIndex}
          currentNotationElement={currentNotationElement}
          setCurrentNotationElement={setCurrentNotationElement}
          selectedMetaModel={selectedMetaModel}
          setSelectedMetaModel={setSelectedMetaModel}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
          setSelectedRepresentationMetaModel={
            setSelectedRepresentationMetaModel
          }
          saveNotation={saveNotation}
        />
      )}

      <AlertWithFade
        message={alertMessage}
        showAlert={showAlert}
        severity={alertSeverity}
      />
    </div>
  );
};

export default NotationDesigner;
