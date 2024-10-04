import { useParams } from "react-router-dom";
import DiagramEditor from "../components/editor/DiagramEditor";
import SubHeader from "../components/editor/SubHeader";
import { useRef, useState } from "react";
import { Edge, Node, useEdgesState, useNodesState } from "@xyflow/react";

export default function EditorPage() {
  const selectedConfigNameLocalStorage =
    localStorage.getItem("selectedConfig") || null;
  const [selectedMetaModelURI, setSelectedMetaModelURI] = useState<string | null>(
    selectedConfigNameLocalStorage
  );
  const diagramAreaRef = useRef<HTMLDivElement>(null); // ref for the diagram area
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <div id="editor" className="overflow-y-hidden h-screen">
      <SubHeader
        onSelectConfig={setSelectedMetaModelURI}
        diagramAreaRef={diagramAreaRef}
        nodes={nodes}
        edges={edges}
      />
      <div>
        <DiagramEditor
          selectedMetaModelURI={selectedMetaModelURI!}
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
