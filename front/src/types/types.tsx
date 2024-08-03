export interface ConfigElement {
  id: string;
  label: string;
  shape: "rectangle" | "circle" | "arrow" | "dot";
  rules?: Record<string, any>;
}

export interface ConfigConnection {
  id: string;
  label: string;
  style: "solid" | "dashed";
  sourceId: string;
  targetId: string;
}

export interface ConfigListItem {
  name: string;
  filename: string;
}

export interface Notation {
  name: string;
  elements: ConfigElement[];
  connections: ConfigConnection[];
}

export interface Config {
  name: string;
  notations: Notation[];
}
