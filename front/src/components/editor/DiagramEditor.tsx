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
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesEdge from "../notation_representations/edges/CombineRelationshipShapesEdge";
import ModalDoubleClickNotation from "../notation_representations/nodes/components/modals/first_layer/ModalDoubleClickNotation";

const nodeTypes = {
  objectNode: CombineObjectShapesNode,
};

const edgeTypes = {
  edge: CombineRelationshipShapesEdge,
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
    notations: { objects: [], relationships: [] },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CustomNodeData | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Store the selected edge ID

  useEffect(() => {
    if (selectedConfigName) {
      console.log("Selected config name:", selectedConfigName);
      const fetchConfig = async () => {
        try {
          const response = await configService.getMetaConfigByName(
            selectedConfigName
          );
          setConfig(response.data);
          // clear canvas when new config is selected
          setNodes([]);
          setEdges([]);
          console.log("Config fetched:", response.data); // Log the fetched configuration
        } catch (error) {
          console.error("Error fetching configuration: ", error);
        }
      };
      fetchConfig();
    }
  }, [selectedConfigName]);

  const onDoubleClickEdge = (edgeId: string, data: CustomNodeData) => {
    setModalData(data); // Set the data to be displayed in the modal
    setSelectedEdgeId(edgeId); // Store the selected edge ID
    setIsModalOpen(true); // Open the modal
  };

  const onEdgeDataChange = (edgeId: string, updatedData: any) => {
    console.log("Updating edge:", edgeId, updatedData); // Add this for debugging
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: updatedData, key: Date.now() }
          : edge
      )
    );
  };

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
      const defaultEdge = config!.notations.relationships[0];

      const data: CustomNodeData = {
        notations: config!.notations,
        nodeNotation: defaultEdge,
      };

      const newEdge = {
        ...params,
        type: "edge",
        // passing data to the combined edge component
        data: data as any,
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, config]
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
        notations: config!.notations,
        nodeNotation: notation,
        position: position,
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
              edges={edges.map((edge) => ({
                ...edge,
                data: {
                  ...edge.data,
                  onDoubleClick: onDoubleClickEdge,
                },
              }))}
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

      {/* Modal */}
      {isModalOpen && modalData && (
        <ModalDoubleClickNotation
          data={modalData}
          isNodeAttributeModalOpen={false}
          isNodeModalOpen={isModalOpen}
          isNodeOperationModalOpen={false}
          setData={(newData) => {
            setModalData(newData);
            onEdgeDataChange(selectedEdgeId!, newData);
          }}
          setIsNodeAttributeModalOpen={() => {}}
          setIsNodeModalOpen={setIsModalOpen}
          setIsNodeOperationModalOpen={() => {}}
          onDataUpdate={(updatedData) => {
            onEdgeDataChange(selectedEdgeId!, updatedData);
          }}
        />
      )}

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
