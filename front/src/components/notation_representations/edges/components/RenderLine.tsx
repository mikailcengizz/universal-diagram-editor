import React, { useState, useRef } from "react";

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
  const [anchorPoints, setAnchorPoints] = useState<{ x: number; y: number }[]>(
    []
  );

  const svgRef = useRef<SVGSVGElement>(null); // use ref for the SVG element

  let draggingIndex: number | null = null; // index of the anchor point being dragged

  // convert the mouse coordinates to the correct SVG coordinates
  const getSVGCoords = (event: MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: event.clientX, y: event.clientY };

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const screenCTM = svg.getScreenCTM();
    if (screenCTM) {
      return point.matrixTransform(screenCTM.inverse());
    }
    return { x: event.clientX, y: event.clientY };
  };

  // handle dragging
  const handleMouseMove = (event: MouseEvent) => {
    if (draggingIndex !== null) {
      const { x, y } = getSVGCoords(event); // get the correct SVG coordinates
      setAnchorPoints((prev) => {
        const newAnchorPoints = [...prev];
        if (newAnchorPoints.length > 0) {
          newAnchorPoints[draggingIndex!] = { x, y };
        } else {
          newAnchorPoints.push({ x, y });
        }

        console.log("newAnchorPoints", newAnchorPoints);
        return newAnchorPoints;
      });
    }
  };

  const handleMouseUp = () => {
    draggingIndex = null; // stop dragging
    window.removeEventListener("mousemove", handleMouseMove); // detach listeners
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // stop propagation so it doesn't trigger line drag
    draggingIndex = index; // set the index of the anchor point being dragged
    window.addEventListener("mousemove", handleMouseMove); // attach listeners to window
    window.addEventListener("mouseup", handleMouseUp);
  };

  // handle right-click to add a new anchor point
  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault(); // prevent the default context menu
    const pointsToUse = [
      { x: sourceX, y: sourceY },
      ...anchorPoints,
      { x: targetX, y: targetY },
    ];

    // find the midpoint between two existing points on the line
    const closestPointIndex = findClosestPointIndex(
      event.clientX,
      event.clientY,
      pointsToUse
    );
    const nextPointIndex = closestPointIndex + 1;

    const midpoint = {
      x: (pointsToUse[closestPointIndex].x + pointsToUse[nextPointIndex].x) / 2,
      y: (pointsToUse[closestPointIndex].y + pointsToUse[nextPointIndex].y) / 2,
    };

    const newAnchorPoints = [...anchorPoints];
    newAnchorPoints.splice(nextPointIndex - 1, 0, midpoint); // insert the midpoint between points

    setAnchorPoints(newAnchorPoints);
  };

  // find the closest point in the line to the mouse position
  const findClosestPointIndex = (
    mouseX: number,
    mouseY: number,
    pointsToUse: Array<{ x: number; y: number }>
  ) => {
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;

    pointsToUse.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.x - mouseX, 2) + Math.pow(point.y - mouseY, 2)
      );
      if (distance < minDistance) {
        closestIndex = index;
        minDistance = distance;
      }
    });

    return closestIndex;
  };

  // calculate the points of the polyline including the anchor points
  const points = [
    { x: sourceX, y: sourceY },
    ...anchorPoints,
    { x: targetX, y: targetY },
  ]
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <svg
      id={"line" + id} // set the ID of the SVG
      ref={svgRef} // attach ref to the SVG
      style={{ pointerEvents: "auto" }}
    >
      {/* Render the polyline */}
      <polyline
        id={"polyline" + id}
        points={points}
        fill="none"
        stroke="black"
        strokeWidth="2"
        markerStart={markerStart ? markerStart : undefined}
        markerEnd={markerEnd ? markerEnd : undefined}
        onContextMenu={handleRightClick} // right-click to add anchor point
      />

      {/* Render draggable anchor points */}
      {anchorPoints.map((anchor, index) => (
        <circle
          key={`${id}-anchor-${index}`}
          cx={anchor.x}
          cy={anchor.y}
          r={5} // anchor point radius
          fill="black" // color of the anchor point
          stroke="white" // white border around the anchor point
          strokeWidth="2"
          onMouseDown={(e) => handleMouseDown(index, e)} // make the anchor point draggable
          style={{ cursor: "pointer", zIndex: 10 }} // ensure the anchor point is above the line
        />
      ))}
    </svg>
  );
};

export default RenderLine;
