import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import { parseStringPromise } from "xml2js";
import { Config } from "../types/types";
import Palette from "./Palette";
import CustomNodeCircle from "./CustomNodeCircle";
import CustomNodeUMLClass from "./CustomNodeUMLClass";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import configService from "../services/ConfigService";
import ReactFlowWithInstance from "./ReactFlowWithInstance";

const nodeTypes = {
  circle: CustomNodeCircle,
  umlClass: CustomNodeUMLClass,
  // other custom node types
};

interface DiagramEditorProps {
  configFilename: string | null;
}

const DiagramEditor = ({ configFilename }: DiagramEditorProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null); // ref for the diagram area

  useEffect(() => {
    if (configFilename) {
      const fetchConfig = async () => {
        try {
          const response = await configService.getConfigByFilename(
            configFilename
          );
          setConfig(response.data);
          console.log("Config fetched:", response.data); // Log the fetched configuration
        } catch (error) {
          console.error("Error fetching configuration: ", error);
        }
      };
      fetchConfig();
    }
  }, [configFilename]);

  // TODO: set initial nodes and edges from local storage,
  useEffect(() => {
    /* if (config) {
      const initialNodes = [];
      setNodes(initialNodes);
      console.log("Initial nodes set:", initialNodes);
    } */
  }, [config]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onLoad = useCallback((instance: any) => {
    setReactFlowInstance(instance);
    console.log("React Flow instance set:", instance);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.log("React Flow instance not set.");
        return;
      }

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("element-label");

      // find the element configuration based on the type
      const elementConfig = config?.notations[0].elements.find(
        (el) => el.id === type
      );

      if (!elementConfig) {
        console.log("Element configuration not found.");
        return;
      }

      const shape = elementConfig.shape; // extract shape from config

      // convert the screen coordinates to the flow's coordinate system
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${+new Date()}`,
        type: shape, // use shape as the node type
        position,
        data: {
          label: label || elementConfig.label,
          sections: elementConfig.sections, // add sections to data
        },
      };

      console.log("Node dropped:", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, config]
  );

  const exportToXMI = () => {
    const xmiData = `
      <XMI>
        <UML:Model>
          ${nodes
            .map(
              (node) => `
              <UML:Class name="${node.data.label}">
                <Position x="${node.position.x}" y="${node.position.y}" />
              </UML:Class>
            `
            )
            .join("")}
          ${edges
            .map(
              (edge) =>
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

  const importFromXMI = async (xmiFile: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const xmiData = event.target?.result as string;
      const result = await parseStringPromise(xmiData);
      const importedNodes: Node[] = result.XMI["UML:Model"][0]["UML:Class"].map(
        (cls: any, index: number) => ({
          id: `node-${index}`,
          type: "default",
          data: { label: cls.$.name },
          position: {
            x: parseFloat(cls.Position[0].$.x),
            y: parseFloat(cls.Position[0].$.y),
          },
        })
      );
      const importedEdges: Edge[] = result.XMI["UML:Model"][0][
        "UML:Association"
      ].map((assoc: any, index: number) => ({
        id: `edge-${index}`,
        source: assoc.$.source,
        target: assoc.$.target,
      }));
      setNodes(importedNodes);
      setEdges(importedEdges);
    };
    reader.readAsText(xmiFile);
  };

  const exportToJPEG = () => {
    if (diagramRef.current === null) {
      return;
    }
    htmlToImage
      .toJpeg(diagramRef.current, { quality: 0.95, backgroundColor: "#ffffff" })
      .then((dataUrl) => {
        saveAs(dataUrl, "diagram.jpeg");
      })
      .catch((error) => {
        console.error("Error exporting to JPEG:", error);
      });
  };

  return (
    <div>
      <div style={{ height: 600 }} className="border-2 mb-24" ref={diagramRef}>
        <ReactFlowProvider>
          <Palette
            title={config?.name}
            elements={config ? config.notations[0].elements : []}
          />
          <div style={{ flexGrow: 1, height: "100%", cursor: "grab" }}>
            <ReactFlowWithInstance
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              snapToGrid={true}
              snapGrid={[15, 15]}
            />
          </div>
        </ReactFlowProvider>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Export to XMI</h3>
        <button
          className="border-black border-2 px-4 py-1"
          onClick={exportToXMI}
        >
          Export to XMI
        </button>
      </div>

      <div>
        <h3 className="font-bold">Import from XMI</h3>
        <input
          type="file"
          accept=".xmi"
          alt="Import from XMI"
          placeholder="Import from XMI"
          onChange={(e) => {
            if (e.target.files) {
              importFromXMI(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Export to JPEG</h3>
        <button
          className="border-black border-2 px-4 py-1"
          onClick={exportToJPEG}
        >
          Export to JPEG
        </button>
      </div>
    </div>
  );
};

export default DiagramEditor;
