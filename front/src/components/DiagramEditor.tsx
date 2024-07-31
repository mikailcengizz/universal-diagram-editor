// DiagramEditor.js

import React, { useState, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import removeElements from "react-flow-renderer";
import { Edge } from "reactflow";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start Node" },
    position: { x: 250, y: 5 },
  },
  { id: "2", data: { label: "Second Node" }, position: { x: 100, y: 100 } },
  { id: "3", data: { label: "Third Node" }, position: { x: 400, y: 100 } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" },
];

const DiagramEditor = () => {
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onElementsRemove = useCallback((elementsToRemove: any) => {
    setNodes((nds) =>
      nds.filter(
        (node) => !elementsToRemove.find((el: any) => el.id === node.id)
      )
    );
    setEdges((eds) =>
      eds.filter(
        (edge) => !elementsToRemove.find((el: any) => el.id === edge.id)
      )
    );
  }, []);

  const onLoad = useCallback(
    (_reactFlowInstance: any) => setReactFlowInstance(_reactFlowInstance),
    []
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowInstance!.project({ x: 0, y: 0 });
      const type = event.dataTransfer.getData("application/reactflow");
      const position = reactFlowInstance!.project({
        x: event.clientX - reactFlowBounds.x,
        y: event.clientY - reactFlowBounds.y,
      });
      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div style={{ height: 600 }} className="border-2">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onLoad={onLoad}
          onDrop={onDrop}
          onDragOver={onDragOver}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default DiagramEditor;
