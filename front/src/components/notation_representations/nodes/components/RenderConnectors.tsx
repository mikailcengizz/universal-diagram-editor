import React, { useEffect, useMemo, useState } from "react";
import {
  DiagramNodeData,
  InstanceModel,
  NotationRepresentationItem,
} from "../../../../types/types";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { isEqual } from "lodash";

interface RenderConnectorsProps {
  isPalette?: boolean;
  isNotationSlider?: boolean;
  data: DiagramNodeData;
  instanceModel: InstanceModel;
  id: string;
  connectors: NotationRepresentationItem[];
}

function RenderConnectors({
  isPalette = false,
  isNotationSlider = false,
  data,
  instanceModel,
  id, // node id
  connectors,
}: RenderConnectorsProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [handlesRendered, setHandlesRendered] = useState(false);

  // memoize connectors to avoid unnecessary updates
  const memoizedConnectors = useMemo(() => connectors, [connectors]);

  // set handlesRendered to false when connectors change
  useEffect(() => {
    if (!isEqual(memoizedConnectors, connectors)) {
      setHandlesRendered(false);
    }
  }, [memoizedConnectors, connectors]);

  // update node internals once handles are rendered
  useEffect(() => {
    if (handlesRendered) {
      updateNodeInternals(id);
    }
  }, [id, handlesRendered, updateNodeInternals]);

  // callback for rendering completion
  useEffect(() => {
    setHandlesRendered(true);
  }, [connectors]);

  return (
    <>
      {id &&
        connectors.map((connector, index) => {
          let alignment = connector.style.alignment;
          let position: Position;
          let handleId: string;

          // set position and handleId based on alignment
          switch (alignment) {
            case "left":
              position = Position.Left;
              handleId = `handle-left-${index}`;
              break;
            case "right":
              position = Position.Right;
              handleId = `handle-right-${index}`;
              break;
            case "top":
              position = Position.Top;
              handleId = `handle-top-${index}`;
              break;
            case "bottom":
              position = Position.Bottom;
              handleId = `handle-bottom-${index}`;
              break;
            default:
              position = Position.Bottom; // default position
              handleId = `handle-${index}`; // default handle id
              break;
          }

          return (
            <Handle
              type="source" // using connection mode "loose" so to use source handles both for source and target
              position={position}
              style={{
                background: connector.style.color,
                left: `${connector.position.x}px`,
                top: `${connector.position.y}px`,
                zIndex: connector.style.zIndex,
              }}
              key={`${handleId}`}
              id={`${handleId}`}
            />
          );
        })}
    </>
  );
}

export default RenderConnectors;
