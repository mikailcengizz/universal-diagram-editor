import React from "react";

interface RenderTargetProps {
  markerId: string;
  markerType: string;
}

function RenderTarget({ markerId, markerType }: RenderTargetProps) {
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
      {markerType === "arrow" && (
        <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
      )}
      {markerType === "circle" && <circle cx="5" cy="5" r="5" fill="black" />}
      {markerType === "diamond" && (
        <polygon points="0,5 5,10 10,5 5,0" fill="black" />
      )}
    </marker>
  );
}

export default RenderTarget;
