import {
  Background,
  Controls,
  useReactFlow,
  ReactFlow,
  Edge,
  ReactFlowInstance,
  Node,
  ReactFlowProps,
} from "@xyflow/react";
import { useEffect } from "react";

// Define the props type for the ReactFlowWithInstance component, extending ReactFlowProps
interface ReactFlowWithInstanceProps<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> extends Omit<ReactFlowProps<NodeType, EdgeType>, "onLoad"> {
  setReactFlowInstance: (
    instance: ReactFlowInstance<NodeType, EdgeType>
  ) => void;
  showGrid?: boolean;
}

// Create the component using the props type with generics
const ReactFlowWithInstance = <
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
>(
  props: ReactFlowWithInstanceProps<NodeType, EdgeType> &
    React.RefAttributes<HTMLDivElement>
) => {
  const { showGrid, setReactFlowInstance, ...restProps } = props;
  const reactFlowInstance = useReactFlow<NodeType, EdgeType>();

  useEffect(() => {
    if (reactFlowInstance) {
      setReactFlowInstance(reactFlowInstance); // Set the instance when it's ready
    }
  }, [reactFlowInstance, setReactFlowInstance]);

  return (
    <ReactFlow {...restProps}>
      <Controls />
      {showGrid && <Background color="#aaa" gap={16} />}
    </ReactFlow>
  );
};

export default ReactFlowWithInstance;
