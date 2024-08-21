import React, { useState, useCallback, useEffect, useRef } from "react";
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
  ReactFlow,
} from "@xyflow/react";
import { parseStringPromise } from "xml2js";
import { Config, Notation } from "../types/types";
import Palette from "./Palette";
import configService from "../services/ConfigService";
import RectangleNode from "./notation_representations/nodes/RectangleNode";
import DiamondNode from "./notation_representations/nodes/DiamondNode";
import ParallelogramNode from "./notation_representations/nodes/ParallelogramNode";
import CustomEdge from "./notation_representations/edges/CustomEdge";
import GeneralizedNode from "./notation_representations/nodes/PreviewNode";
import OvalNode from "./notation_representations/nodes/OvalNode";
import CircleNode from "./notation_representations/nodes/CircleNode";
import ReactFlowWithInstance from "./ReactFlowWithInstance";

const nodeTypes = {
  rectangle: RectangleNode,
  /* circle: CircleNode,
  diamond: DiamondNode,
  parallelogram: ParallelogramNode,
  generalized: GeneralizedNode,
  oval: OvalNode, */
};

const edgeTypes = {
  custom: CustomEdge,
};

interface DiagramEditorProps {
  configFilename: string | null;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  configFilename,
  diagramAreaRef,
  nodes,
  setNodes,
  edges,
  setEdges,
}: DiagramEditorProps) => {
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [config, setConfig] = useState<Config | null>(null);

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

  const elementCount: { [key: string]: number } = {}; // To track the count of each element type

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.log("React Flow instance not set.");
        return;
      }

      const name = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("element-label");

      // find the element configuration based on the type
      const elementConfig = config?.notations.find((el) => el.name === name);

      if (!elementConfig) {
        console.log("Element configuration not found.");
        return;
      }

      // Update the count for this element type
      if (!elementCount[name]) {
        elementCount[name] = 1; // Initialize if it doesn't exist
      } else {
        elementCount[name] += 1; // Increment the count
      }

      // Generate a unique ID using the name and count
      const uniqueId = `${name}${elementCount[name]}`;

      const shape = elementConfig.shape; // extract shape from config

      // convert the screen coordinates to the flow's coordinate system
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uniqueId,
        type: shape, // use shape as the node type
        position,
        data: {
          label: label || elementConfig.label,
          sections: elementConfig.sections as any[],
        },
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
    <div className="flex h-full">
      <Palette title={config?.name} elements={config ? config.notations : []} />
      <div
        style={{ minHeight: "100%", maxHeight: "100%", width: "100%" }}
        className="border-2"
        ref={diagramAreaRef}
      >
        <ReactFlowProvider>
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
        </ReactFlowProvider>
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
    </div>
  );
};

export default DiagramEditor;
