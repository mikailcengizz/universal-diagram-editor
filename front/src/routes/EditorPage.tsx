/* eslint-disable no-restricted-globals */
import { useParams } from "react-router-dom";
import {} from "reactflow";
import DiagramEditor from "../components/DiagramEditor";
import SubHeader from "../components/SubHeader";

export default function EditorPage() {
  return (
    <div id="editor">
      <SubHeader />
      <div className="px-12 pt-4">
        <h1>Editor</h1>
        <DiagramEditor />
      </div>
    </div>
  );
}
