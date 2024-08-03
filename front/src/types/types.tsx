export interface ConfigElement {
  id: string;
  label: string;
  shape: "rectangle" | "circle" | "arrow" | "dot"; // allowed shapes
  rules?: Record<string, any>; // additional rules or constraints
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
