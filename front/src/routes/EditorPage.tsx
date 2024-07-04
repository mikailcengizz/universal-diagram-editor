/* eslint-disable no-restricted-globals */
import { useParams } from "react-router-dom";
import {  } from "reactflow";
import DiagramEditor from "../components/DiagramEditor";

export default function EditorPage() {
  return (
    <div id="editor">
      <h1>Editor</h1>
      <DiagramEditor />
    </div>
  );
}
