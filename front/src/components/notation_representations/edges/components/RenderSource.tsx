import React from "react";

interface RenderSourceProps {
  markerId: string;
  markerType: string; // Now expects a marker ID like 'ArrowClosed'
}

function RenderSource({ markerId, markerType }: RenderSourceProps) {
  const getMarkerSvg = (markerType: string) => {
    switch (markerType) {
      case "closedArrow":
        return <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />;
      case "openArrow":
        return <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="black" />;
      case "Circle":
        return <circle cx="5" cy="5" r="5" fill="black" />;
      case "Diamond":
        return <polygon points="0,5 5,10 10,5 5,0" fill="black" />;
      default:
        return null;
    }
  };

  return (
    <marker
      id={markerId}
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto"
    >
      {getMarkerSvg(markerType)}
    </marker>
  );
}

export default RenderSource;
