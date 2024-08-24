import { useParams } from "react-router-dom";
import DiagramEditor from "../components/DiagramEditor";
import SubHeader from "../components/SubHeader";
import { useRef, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState } from "@xyflow/react";

export default function EditorPage() {
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const diagramAreaRef = useRef<HTMLDivElement>(null); // ref for the diagram area
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <div id="editor">
      <SubHeader
        onSelectConfig={setSelectedConfig}
        diagramAreaRef={diagramAreaRef}
        nodes={nodes}
        edges={edges}
      />
      <div>
        <DiagramEditor
          configFilename={selectedConfig}
          diagramAreaRef={diagramAreaRef}
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
        />{" "}
        {/* pass the selected config from the subheader to the editor */}
      </div>
    </div>
  );
}
