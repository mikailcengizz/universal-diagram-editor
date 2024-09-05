import React, { useState, useCallback, useEffect } from "react";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { parseStringPromise } from "xml2js";
import { Config, CustomNodeData, DragData, Notation } from "../../types/types";
import PaletteEditorPanel from "./PaletteEditorPanel";
import configService from "../../services/ConfigService";
import ReactFlowWithInstance from "../ReactFlowWithInstance";
import createEdgeTypesFromConfig from "../notation_representations/edges/Helper";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";

const nodeTypes = {
  objectNode: CombineObjectShapesNode,
};

interface DiagramEditorProps {
  selectedConfigName: string | null;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  selectedConfigName,
  diagramAreaRef,
  nodes,
  setNodes,
  edges,
  setEdges,
}: DiagramEditorProps) => {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [config, setConfig] = useState<Config | null>({
    name: "",
    notations: { objects: [], relationships: [], roles: [] },
  });

  useEffect(() => {
    if (selectedConfigName) {
      console.log("Selected config name:", selectedConfigName);
      const fetchConfig = async () => {
        try {
          const response = await configService.getConfigByName(
            selectedConfigName
          );
          setConfig(response.data);
          console.log("Config fetched:", response.data); // Log the fetched configuration
        } catch (error) {
          console.error("Error fetching configuration: ", error);
        }
      };
      fetchConfig();
    }
  }, [selectedConfigName]);

  const edgeTypes = config ? createEdgeTypesFromConfig(config) : {};

  // TODO: set initial nodes and edges from local storage,
  useEffect(() => {
    /* if (config) {
      const initialNodes = [];
      setNodes(initialNodes);
      console.log("Initial nodes set:", initialNodes);
    } */
  }, [config]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const selectedEdgeType = "Association";

      const newEdge = {
        ...params,
        type: selectedEdgeType,
        data: {
          type: selectedEdgeType,
          onEdgeClick: () => {
            console.log("Edge clicked:", params.source, params.target);
            // Handle additional logic here if needed
          },
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
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
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

  const elementCount: { [key: string]: number } = {}; // To track the count of each element type

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.log("React Flow instance not set.");
        return;
      }

      const dragData: DragData = JSON.parse(
        event.dataTransfer.getData("palette-item")
      );
      const { notation } = dragData;

      const name = notation.name; // notation being dropped

      if (!elementCount[name]) {
        elementCount[name] = 1; // Initialize if it doesn't exist
      } else {
        elementCount[name] += 1; // Increment the count
      }

      const uniqueId = `${name}${elementCount[name]}`; // unique node id

      const nodeType = notation.type + "Node"; // objectNode, relationshipNode, roleNode

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeData: CustomNodeData = {
        notation,
        position,
      };

      const newNode: Node = {
        id: uniqueId,
        type: nodeType,
        position,
        data: nodeData as any,
      };

      console.log("Node dropped:", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, config]
  );

  const importFromXMI = async (xmiFile: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const xmiData = event.target?.result as string;
      const result = await parseStringPromise(xmiData);
      const importedNodes: Node[] = result.XMI["UML:Model"][0][
        "UML:Class"
      ]?.map((cls: any, index: number) => ({
        id: `node-${index}`,
        type: cls.$.type,
        data: {
          label: cls.$.name,
          sections: cls["Compartment"]?.map((compartment: any) => {
            return { name: compartment.$.name, default: compartment.$.default };
          }),
        },
        position: {
          x: parseFloat(cls.Position[0].$.x),
          y: parseFloat(cls.Position[0].$.y),
        },
      }));
      const importedEdges: Edge[] = result.XMI["UML:Model"][0][
        "UML:Association"
      ]?.map((assoc: any, index: number) => ({
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
    <div className="flex h-full bg-white">
      <ReactFlowProvider>
        {/* Define SVG markers for Edges */}
        <svg style={{ height: 0, width: 0 }}>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
            </marker>
            <marker
              id="arrowClosed"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#000" />
            </marker>
          </defs>
        </svg>

        <PaletteEditorPanel
          title={config?.name}
          notations={config!.notations}
        />
        <div
          style={{ minHeight: "100%", maxHeight: "100%", width: "100%" }}
          className="border-2 overflow-y-scroll"
          ref={diagramAreaRef}
        >
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
              edgeTypes={edgeTypes}
              snapToGrid={true}
              snapGrid={[15, 15]}
            />
          </div>
        </div>
      </ReactFlowProvider>

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
    </div>
  );
};

export default DiagramEditor;
