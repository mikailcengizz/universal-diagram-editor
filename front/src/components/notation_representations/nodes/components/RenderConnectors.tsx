import React from "react";
import { NotationRepresentationItem } from "../../../../types/types";
import { Handle, Position } from "@xyflow/react";

interface RenderConnectorsProps {
  isPalette: boolean;
  id: string;
  connectors: NotationRepresentationItem[];
}

function RenderConnectors({
  isPalette,
  id,
  connectors,
}: RenderConnectorsProps) {
  return (
    <>
      {!isPalette &&
        id &&
        connectors.map((connector, index) => (
          <Handle
            type={connector.style.alignment === "left" ? "source" : "target"} // can not set exact position on connector so will stick with this for now
            position={connector.style.alignment as Position} // temp
            style={{ background: connector.style.color }}
            id={`source-${index}`}
            key={index}
          />
        ))}
    </>
  );
}

export default RenderConnectors;
