/* eslint-disable no-restricted-globals */
import { useParams } from "react-router-dom";
import {} from "reactflow";
import NotationDesigner from "../components/designer/NotationDesigner";

export default function DesignerPage() {
  return (
    <div id="designer">
      <div>
        <NotationDesigner />
      </div>
    </div>
  );
}
