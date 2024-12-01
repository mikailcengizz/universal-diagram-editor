import DiagramEditor from "../components/editor/DiagramEditor";
import SubHeader from "../components/editor/SubHeader";
import { useRef, useState } from "react";
import { Edge, Node } from "@xyflow/react";

export default function EditorPage() {
  const selectedConfigNameLocalStorage =
    localStorage.getItem("selectedConfig") || null;
  const [selectedMetaModelURI, setSelectedMetaModelURI] = useState<string>(
    selectedConfigNameLocalStorage || ""
  );
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const diagramAreaRef = useRef<HTMLDivElement>(null); // ref for the diagram area
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <div id="editor" className="overflow-y-hidden h-screen">
      <SubHeader
        onSelectConfig={setSelectedMetaModelURI}
        selectedMetaModelURI={selectedMetaModelURI}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        diagramAreaRef={diagramAreaRef}
        setNodes={setNodes}
        nodes={nodes}
        setEdges={setEdges}
        edges={edges}
      />
      <div>
        <DiagramEditor
          selectedMetaModelURI={selectedMetaModelURI!}
          showGrid={showGrid}
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
