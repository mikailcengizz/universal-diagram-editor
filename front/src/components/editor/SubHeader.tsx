import React, { useEffect, useRef, useState } from "react";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import configService from "../../services/ConfigService";
import { ConfigListItem } from "../../types/types";
import { ArrowRightOutlined } from "@mui/icons-material";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { Edge, Node as ReactFlowNode } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { updateModel } from "../../redux/actions/instanceModelActions";

interface SubHeaderProps {
  onSelectConfig: (configName: string) => void;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: ReactFlowNode[];
  edges: Edge[];
}

function SubHeader({
  onSelectConfig,
  diagramAreaRef,
  nodes,
  edges,
}: SubHeaderProps) {
  const dispatch = useDispatch();
  const [dropdownVisibleFile, setDropdownVisibleFile] = useState(false);
  const [sidewayDropdownVisibleExportAs, setSidewayDropdownVisibleExportAs] =
    useState(false);
  const [dropdownVisibleDiagramType, setDropdownVisibleDiagramType] =
    useState(false);
  const [dropdownVisibleDisplay, setDropdownVisibleDisplay] = useState(false);
  const [configs, setConfigs] = useState<ConfigListItem[]>([]);

  // Ref to detect outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await configService.getMetaConfigList();
        setConfigs(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigs();
  }, []);

  useEffect(() => {
    // handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSidewayDropdownVisibleExportAs(false);
        setDropdownVisibleFile(false);
        setDropdownVisibleDiagramType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    if (dropdownName === "file") {
      setDropdownVisibleFile(!dropdownVisibleFile);
      setDropdownVisibleDiagramType(false);
      setDropdownVisibleDisplay(false);
    } else if (dropdownName === "diagramType") {
      setDropdownVisibleDiagramType(!dropdownVisibleDiagramType);
      setDropdownVisibleFile(false);
      setDropdownVisibleDisplay(false);
    } else if (dropdownName === "display") {
      setDropdownVisibleDisplay(!dropdownVisibleDisplay);
      setDropdownVisibleFile(false);
      setDropdownVisibleDiagramType(false);
    }
  };

  const onCreateNewDiagramHandler = () => {
    onSelectConfig("");
    setDropdownVisibleFile(false);

    // Clear the diagram
    // setNodes([]);
    // setEdges([]);

    // Clear the diagram instance
    dispatch(
      updateModel({
        name: "",
        type: "instance",
        ePackages: [],
      })
    );
  };

  const onSaveDiagramHandler = () => {
    console.log("Save diagram");
    setDropdownVisibleFile(false);
  };

  const onImportDiagramHandler = () => {
    console.log("Import diagram");
    setDropdownVisibleFile(false);
  };

  const exportToJPEG = () => {
    if (diagramAreaRef.current === null) {
      return;
    }
    htmlToImage
      .toJpeg(diagramAreaRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
      })
      .then((dataUrl) => {
        saveAs(dataUrl, "diagram.jpeg");
      })
      .catch((error) => {
        console.error("Error exporting to JPEG:", error);
      });
  };

  const exportToXMI = () => {
    const xmiData = `
      <XMI>
        <UML:Model>
          ${nodes
            .map(
              (node: any) => `
              <UML:Class name="${node.data.label}">
                <Position x="${node.position.x}" y="${node.position.y}" />
              </UML:Class>
            `
            )
            .join("")}
          ${edges
            .map(
              (edge: any) =>
                `<UML:Association source="${edge.source}" target="${edge.target}" />`
            )
            .join("")}
        </UML:Model>
      </XMI>
    `;
    const blob = new Blob([xmiData], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagram.xmi";
    link.click();
  };

  const onExportDiagramHandler = (fileType: string) => {
    console.log("Export diagram");
    setDropdownVisibleFile(false);

    if (fileType === "png") {
      console.log("Exporting as PNG");
    } else if (fileType === "jpeg") {
      console.log("Exporting as JPEG");
      exportToJPEG();
    } else if (fileType === "svg") {
      console.log("Exporting as SVG");
    } else if (fileType === "xmi") {
      console.log("Exporting as XMI");
      exportToXMI();
    } else if (fileType === "pdf") {
      console.log("Exporting as PDF");
    }
  };

  const dropdownItemCSS =
    "px-4 py-2 hover:bg-gray-100 cursor-pointer h-10 items-center flex justify-between relative";

  return (
    <div ref={dropdownRef}>
      {/* Dropdown titles */}
      <div className="flex w-full bg-[#1B1B20] text-white align-middle px-12 items-center h-10 border-b-2 relative z-10">
        <div
          className="flex hover:cursor-pointer w-12 mr-4"
          onClick={() => toggleDropdown("file")}
        >
          <span>File</span>
          <ArrowDropDownOutlinedIcon />
        </div>

        <div
          className="flex hover:cursor-pointer w-[8.5rem] mr-4"
          onClick={() => toggleDropdown("diagramType")}
        >
          <span>Diagram type</span>
          <ArrowDropDownOutlinedIcon />
        </div>

        <div
          className="flex hover:cursor-pointer"
          onClick={() => toggleDropdown("display")}
        >
          <span>Display</span>
          <ArrowDropDownOutlinedIcon />
        </div>
      </div>

      {/* Dropdowns in their own div container to have them possitioned correctly with position absolute relative to above subheader */}
      <div className="flex w-full px-12 relative z-10">
        {dropdownVisibleFile && (
          <div className="absolute top-0 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 py-2">
            <div
              onClick={onCreateNewDiagramHandler}
              className={dropdownItemCSS}
            >
              New
            </div>
            <div onClick={onSaveDiagramHandler} className={dropdownItemCSS}>
              Save
            </div>
            <div onClick={onImportDiagramHandler} className={dropdownItemCSS}>
              Import...
            </div>
            <div
              onClick={() => setSidewayDropdownVisibleExportAs(true)}
              onMouseEnter={() => setSidewayDropdownVisibleExportAs(true)}
              onMouseLeave={() => setSidewayDropdownVisibleExportAs(false)}
              className={dropdownItemCSS}
            >
              <span>Export as</span>
              <ArrowRightOutlined />
              {sidewayDropdownVisibleExportAs && (
                <div className="absolute top-[-0.5rem] left-[12rem] w-48 bg-white border border-gray-200 rounded shadow-lg py-2">
                  <div
                    className={dropdownItemCSS}
                    onClick={() => onExportDiagramHandler("png")}
                  >
                    PNG
                  </div>
                  <div
                    className={dropdownItemCSS}
                    onClick={() => onExportDiagramHandler("jpeg")}
                  >
                    JPEG
                  </div>
                  <div
                    className={dropdownItemCSS}
                    onClick={() => onExportDiagramHandler("svg")}
                  >
                    SVG
                  </div>
                  <div
                    className={dropdownItemCSS}
                    onClick={() => onExportDiagramHandler("xmi")}
                  >
                    XMI
                  </div>
                  <div
                    className={dropdownItemCSS}
                    onClick={() => onExportDiagramHandler("pdf")}
                  >
                    PDF
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/** Dropdown for diagram type */}
        {dropdownVisibleDiagramType && (
          <div className="absolute top-0 left-[7rem] w-48 bg-white border border-gray-200 rounded shadow-lg">
            <div className="py-2">
              {configs.map((config: any, index: any) => (
                <div
                  key={index}
                  className={dropdownItemCSS}
                  onClick={() => {
                    onSelectConfig(config.name);
                    setDropdownVisibleDiagramType(false);
                  }}
                >
                  {config.name ? config.name : "Untitled"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/** Dropdown for display */}
        {dropdownVisibleDisplay && (
          <div className="absolute top-0 left-[16.5rem] w-48 bg-white border border-gray-200 rounded shadow-lg">
            <div className="py-2">
              <div className={dropdownItemCSS}>Grid</div>
              <div className={dropdownItemCSS}>Fullscreen</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubHeader;
