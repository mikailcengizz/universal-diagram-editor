import { Background, Controls, useReactFlow, ReactFlow } from "@xyflow/react";
import { useEffect } from "react";

const ReactFlowWithInstance = (props: any) => {
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (reactFlowInstance) {
      props.onLoad?.(reactFlowInstance); // ensure the onLoad callback is called with the instance
    }
  }, [reactFlowInstance, props]);

  return (
    <ReactFlow {...props}>
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default ReactFlowWithInstance;
