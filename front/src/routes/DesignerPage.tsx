/* eslint-disable no-restricted-globals */
import { useParams } from "react-router-dom";
import {} from "reactflow";
import NotationDesigner from "../components/NotationDesigner";

export default function EditorPage() {
  return (
    <div id="designer">
      <div>
        <NotationDesigner />
      </div>
    </div>
  );
}
