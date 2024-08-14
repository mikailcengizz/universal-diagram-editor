import { ReactFlowProvider } from "@xyflow/react";
import { useParams } from "react-router-dom";
import {} from "reactflow";
import DiagramEditor from "../components/DiagramEditor";
import SubHeader from "../components/SubHeader";
import { useState } from "react";

export default function EditorPage() {
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  return (
    <div id="editor">
      <SubHeader onSelectConfig={setSelectedConfig} />
      <div className="px-12 pt-4">
        <ReactFlowProvider>
          <DiagramEditor configFilename={selectedConfig} />{" "}
          {/* pass the selected config from the subheader to the editor */}
        </ReactFlowProvider>
      </div>
    </div>
  );
}
