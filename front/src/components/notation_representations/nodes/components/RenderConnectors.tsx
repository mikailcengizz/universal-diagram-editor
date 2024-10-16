import React, { useCallback, useEffect } from "react";
import { NotationRepresentationItem } from "../../../../types/types";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";

interface RenderConnectorsProps {
  isPalette?: boolean;
  isNotationSlider?: boolean;
  id: string;
  connectors: NotationRepresentationItem[];
}

function RenderConnectors({
  isPalette = false,
  isNotationSlider = false,
  id, // node id
  connectors,
}: RenderConnectorsProps) {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  return (
    <>
      {id &&
        connectors.map((connector, index) => (
          <Handle
            type={connector.style.alignment === "left" ? "target" : "source"}
            position={
              connector.style.alignment === "left"
                ? Position.Left
                : connector.style.alignment === "right"
                ? Position.Right
                : connector.style.alignment === "top"
                ? Position.Top
                : Position.Bottom
            } // Left, right, etc.
            style={{
              background: connector.style.color,
              // Ensure connector is placed based on custom position
              left: `${connector.position.x}px`,
              top: `${connector.position.y}px`,
              zIndex: connector.style.zIndex,
            }}
            id={`${
              connector.style.alignment === "left"
                ? `target-handle-${id}`
                : `source-handle-${id}`
            }`}
            key={index}
          />
        ))}
    </>
  );
}

export default RenderConnectors;
