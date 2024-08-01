// Define types for the configuration elements
export interface ConfigElement {
  id: string;
  label: string;
  shape: "rectangle" | "circle" | "arrow" | "dot"; // Specify allowed shapes
}

export interface ConfigConnection {
  id: string;
  label: string;
  style: "solid" | "dashed";
  sourceId: string;
  targetId: string;
}

export interface Notation {
  name: string;
  elements: ConfigElement[];
  connections: ConfigConnection[];
}

export interface Config {
  notations: Notation[];
}
