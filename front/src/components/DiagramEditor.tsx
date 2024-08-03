import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
} from "react-flow-renderer";
import { parseStringPromise } from "xml2js";
import { Config } from "../types/types";
import Palette from "./Palette";
import axios from "axios";
import CustomNodeCircle from "./CustomNodeCircle";

const nodeTypes = {
  circle: CustomNodeCircle,
  // other custom node types
};

const DiagramEditor: React.FC<{ configFilename: string | null }> = ({
  configFilename,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    if (configFilename) {
      const fetchConfig = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/config/get-config/${configFilename}`,
            {
              headers: {
                Authorization: "Basic " + btoa("test@hotmail.com:test123"),
              },
            }
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

  // set initial nodes and edges if configuration is loaded
  useEffect(() => {
    if (config) {
      const elements = config.notations[0].elements;
      setNodes(
        elements.map((el: any, index: any) => ({
          id: `node-${index}`,
          type: "default",
          data: { label: el.label },
          position: { x: 100 * index, y: 100 },
        }))
      );
      console.log("Initial nodes set:", nodes); // log initial nodes set
    }
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

  const onLoad = useCallback((_reactFlowInstance: any) => {
    setReactFlowInstance(_reactFlowInstance);
    console.log("React Flow instance set in state:", _reactFlowInstance);
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

      const reactFlowBounds = reactFlowInstance.project({ x: 0, y: 0 });
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.x,
        y: event.clientY - reactFlowBounds.y,
      });

      const newNode: Node = {
        id: `${+new Date()}`,
        type: shape, // use shape as the node type
        position,
        data: { label: label || elementConfig.label },
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

  return (
    <div>
      <div style={{ height: 600 }} className="border-2 mb-24">
        <ReactFlowProvider>
          <Palette elements={config ? config.notations[0].elements : []} />
          <div style={{ flexGrow: 1, height: "100%" }}>
            <ReactFlow
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
            >
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>

      <button className="border-black border-2 px-4 py-1" onClick={exportToXMI}>
        Export to XMI
      </button>
      <br />

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
  );
};

export default DiagramEditor;
