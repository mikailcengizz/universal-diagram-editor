interface RenderLineProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  markerStart: string | undefined;
  markerEnd: string | undefined;
}

const RenderLine = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerStart,
  markerEnd,
}: RenderLineProps) => {
  console.log("RenderLine received markerStart:", markerStart);
  console.log("RenderLine received markerEnd:", markerEnd);

  return (
    <line
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      stroke="black"
      strokeWidth="2"
      markerStart={markerStart ? markerStart : undefined}
      markerEnd={markerEnd ? markerEnd : undefined}
    />
  );
};

export default RenderLine;
