import React, { useState, useCallback, useEffect } from "react";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { parseStringPromise } from "xml2js";
import {
  CustomNodeData,
  DragData,
  EAttribute,
  EClass,
  EClassInstance,
  EClassRepresentation,
  EClassRepresentationInstance,
  EReference,
  MetaInstanceModelFile,
  MetaModelFile,
  InstanceNotation,
  RepresentationInstanceModelFile,
  RepresentationModelFile,
  MetaNotation,
  Position,
} from "../../types/types";
import PaletteEditorPanel from "./PaletteEditorPanel";
import configService from "../../services/ConfigService";
import ReactFlowWithInstance from "../ReactFlowWithInstance";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineRelationshipShapesEdge from "../notation_representations/edges/CombineRelationshipShapesEdge";
import ModalDoubleClickNotation from "../notation_representations/nodes/components/modals/first_layer/ModalDoubleClickNotation";
import typeHelper from "../helpers/TypeHelper";
import { all } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../redux/actions/representationInstanceModelActions";
import { updateMetaInstanceModel } from "../../redux/actions/metaInstanceModelActions";
import { updateSelectedConfig } from "../../redux/actions/selectedConfigActions";

const nodeTypes = {
  ClassNode: CombineObjectShapesNode,
};

const edgeTypes = {
  edge: CombineRelationshipShapesEdge,
};

interface DiagramEditorProps {
  selectedConfigName: string | null;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  selectedConfigName,
  diagramAreaRef,
  nodes,
  setNodes,
  edges,
  setEdges,
}: DiagramEditorProps) => {
  const dispatch = useDispatch();
  const metaInstanceModel: MetaInstanceModelFile = useSelector(
    (state: any) => state.metaInstanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModelFile =
    useSelector((state: any) => state.representationInstanceModelStore.model);

  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [metaConfig, setConfig] = useState<MetaModelFile | null>({
    name: "",
    type: "meta",
    ePackages: [],
  });
  const [representationConfig, setRepresentationConfig] =
    useState<RepresentationModelFile | null>({
      name: "",
      type: "representation",
      ePackages: [],
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CustomNodeData | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Store the selected edge ID

  useEffect(() => {
    if (selectedConfigName) {
      const fetchMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByName(
            selectedConfigName
          );
          setConfig(response.data);
          // clear canvas when new config is selected
          setNodes([]);
          setEdges([]);
        } catch (error) {
          console.error("Error fetching configuration: ", error);
        }
      };
      fetchMetaConfig();

      const fetchRepresentationConfig = async () => {
        try {
          const response = await configService.getRepresentationConfigByName(
            selectedConfigName
          );
          setRepresentationConfig(response.data);
        } catch (error) {
          console.error("Error fetching representation configuration: ", error);
        }
      };
      fetchRepresentationConfig();

      dispatch(updateSelectedConfig(selectedConfigName));
    }
  }, [selectedConfigName]);

  const onDoubleClickEdge = (edgeId: string, data: CustomNodeData) => {
    setModalData(data); // Set the data to be displayed in the modal
    setSelectedEdgeId(edgeId); // Store the selected edge ID
    setIsModalOpen(true); // Open the modal
  };

  const onEdgeDataChange = (edgeId: string, updatedData: any) => {
    console.log("Updating edge:", edgeId, updatedData); // Add this for debugging
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: updatedData, key: Date.now() }
          : edge
      )
    );
  };

  // TODO: set initial nodes and edges from local storage,
  useEffect(() => {
    /* if (config) {
      const initialNodes = [];
      setNodes(initialNodes);
      console.log("Initial nodes set:", initialNodes);
    } */
  }, [metaConfig]);

  // Load the instance models from local storage
  useEffect(() => {
    const metaInstance = JSON.parse(localStorage.getItem("metaInstanceModel")!);
    const representationInstance = JSON.parse(
      localStorage.getItem("representationInstanceModel")!
    );

    if (metaInstance && representationInstance) {
      dispatch(updateMetaInstanceModel(metaInstance));
      dispatch(updateRepresentationInstanceModel(representationInstance));
    }
  }, [dispatch]);

  useEffect(() => {
    const initializeNodes = (): Node[] => {
      if (
        !representationInstanceModel ||
        !metaInstanceModel ||
        representationInstanceModel.ePackages.length === 0
      )
        return [];

      const returnNodes = representationInstanceModel.ePackages[0].eClassifiers
        .map((representationClassifier) => {
          const metaInstance = metaInstanceModel.ePackages[0].eClassifiers.find(
            (metaClassifier) =>
              metaClassifier.id === representationClassifier.referenceMetaId
          );

          if (!metaInstance || !metaConfig || metaConfig.ePackages.length === 0)
            return null;

          const nodeData: CustomNodeData = {
            metaNotations: metaConfig?.ePackages[0].eClassifiers.map(
              (cls) => cls
            ) as MetaNotation[],
            instanceNotation: {
              id: metaInstance.id,
              name: metaInstance.name,
              eAttributes: metaInstance.eAttributes,
              eOperations: metaInstance.eOperations,
              eReferences: metaInstance.eReferences,
              eSubpackages: metaInstanceModel.ePackages[0].eSubpackages,
              graphicalRepresentation:
                representationClassifier.graphicalRepresentation,
            },
            position: representationClassifier.position,
          };

          const returnNode: Node = {
            id: metaInstance.id,
            type: "ClassNode", // as it is a classifer node
            position: representationClassifier.position,
            data: nodeData as any,
          };

          return returnNode;
        })
        .filter(Boolean); // Filter out null values

      return returnNodes as Node[];
    };

    const initialNodes = initializeNodes();
    setNodes(initialNodes);
  }, [representationInstanceModel, metaInstanceModel, setNodes, metaConfig]);

  useEffect(() => {
    const initializeEdges = () => {
      if (
        !metaInstanceModel ||
        !representationInstanceModel ||
        metaInstanceModel.ePackages.length === 0
      )
        return [];

      const returnEdges = metaInstanceModel.ePackages[0].eClassifiers.flatMap(
        (metaClassifier) => {
          return (metaClassifier.eReferences || [])
            .map((reference) => {
              const targetRepresentation =
                representationInstanceModel.ePackages[0].eClassifiers.find(
                  (repClassifier) =>
                    repClassifier.referenceMetaId ===
                    reference.eReferenceType?.id
                );

              const sourceRepresentation =
                representationInstanceModel.ePackages[0].eClassifiers.find(
                  (repClassifier) =>
                    repClassifier.referenceMetaId === metaClassifier.id
                );

              if (!sourceRepresentation || !targetRepresentation) return null;

              const returnEdge: Edge = {
                id: `edge-${sourceRepresentation.id}-${targetRepresentation.id}`,
                source: sourceRepresentation.id,
                target: targetRepresentation.id,
                type: "edge", // Assuming a default edge type
                data: {
                  onDoubleClick: onDoubleClickEdge,
                  type: reference.name,
                },
              };

              return returnEdge;
            })
            .filter(Boolean); // Filter out null values
        }
      );
      return returnEdges as Edge[];
    };

    const initialEdges = initializeEdges();
    setEdges(initialEdges);
  }, [metaInstanceModel, representationInstanceModel, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      let defaultEdge: InstanceNotation = metaConfig!.ePackages[0].eClassifiers
        .map((cls) => cls as EClass)
        .filter((cls) => cls.name === "Association")[0] as InstanceNotation;
      defaultEdge.graphicalRepresentation =
        representationConfig?.ePackages[0].eClassifiers
          .map((cls) => cls as EClassRepresentation)
          .filter(
            (cls) => cls.name === "Association"
          )[0].graphicalRepresentation;

      const allNotations = typeHelper.mergeMetaAndRepresentation(
        metaConfig!.ePackages,
        representationConfig!.ePackages
      );

      const data: CustomNodeData = {
        metaNotations: allNotations,
        instanceNotation: defaultEdge,
      };

      const newEdge = {
        ...params,
        type: "edge",
        // passing data to the combined edge component
        data: data as any,
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, metaConfig, representationConfig]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change) => {
        if (change.type === "position" && "id" in change) {
          const classifierInRepresentation =
            representationInstanceModel.ePackages[0].eClassifiers.find(
              (classifier) => classifier.referenceMetaId === change.id
            );

          if (classifierInRepresentation) {
            // Ensure the new position is valid, fallback to the last known position if not
            const newPosition: Position = {
              x:
                change.position &&
                typeof change.position.x === "number" &&
                !isNaN(change.position.x)
                  ? change.position.x
                  : classifierInRepresentation.position.x,
              y:
                change.position &&
                typeof change.position.y === "number" &&
                !isNaN(change.position.y)
                  ? change.position.y
                  : classifierInRepresentation.position.y,
            };

            console.log("New position: ", newPosition);

            const updatedRepresentationInstanceModel = {
              ...representationInstanceModel,
              ePackages: representationInstanceModel.ePackages.map((pkg) => ({
                ...pkg,
                eClassifiers: pkg.eClassifiers.map((classifier) => {
                  if (classifier.referenceMetaId === change.id) {
                    return {
                      ...classifier,
                      position: newPosition, // Update position with valid or fallback position
                    };
                  }
                  return classifier;
                }),
              })),
            };

            dispatch(
              updateRepresentationInstanceModel(
                updatedRepresentationInstanceModel
              )
            );

            console.log("Position saved to localStorage.");
          } else {
            console.error(
              "Classifier not found in representation model for ID: ",
              change.id
            );
          }
        }
      });
    },
    [setNodes, representationInstanceModel, dispatch]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onLoad = useCallback((instance: any) => {
    setReactFlowInstance(instance);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

  const updateMetaInstanceModelWithNewNode = (
    newNode: Node,
    notation: InstanceNotation
  ) => {
    let newMetaInstanceModel = { ...metaInstanceModel };

    // Initialize root package if it doesn't exist
    if (newMetaInstanceModel.ePackages.length === 0) {
      newMetaInstanceModel.ePackages.push({
        name: metaConfig?.ePackages[0].name!,
        eClassifiers: [],
        eSubpackages: [],
        id: metaConfig?.ePackages[0].name!,
      });
    }

    // Add the new node to the instance model together with its id
    const uniqueId = newNode.id;
    const { graphicalRepresentation, ...restOfNotation } = notation; // excludes graphical representation field from notation
    const newEClassInstance: EClassInstance = {
      ...(restOfNotation as EClassInstance),
      id: uniqueId,
    };

    newMetaInstanceModel.ePackages[0].eClassifiers.push(newEClassInstance);

    dispatch(updateMetaInstanceModel(newMetaInstanceModel));
  };

  const updateRepresentationInstanceModelWithNewNode = (
    newNode: Node,
    notation: InstanceNotation
  ) => {
    let newRepresentationInstanceModel = { ...representationInstanceModel };

    // Initialize root package if it doesn't exist
    if (
      newRepresentationInstanceModel.ePackages.length === 0 &&
      representationConfig &&
      representationConfig.ePackages[0]
    ) {
      newRepresentationInstanceModel.ePackages.push({
        name: representationConfig?.ePackages[0].name!,
        eSubpackages: [],
        eClassifiers: [],
        id: representationConfig?.ePackages[0].name!,
        position: { x: 0, y: 0 },
        referenceMetaId: metaConfig?.ePackages[0].name!,
      });
    }

    const uniqueRepresentationId = `${notation.name}${
      elementCount[notation.name]
    }-rpr`; // unique representation id
    // Add the new node to the instance model together with its id
    let newEClassRepresentationInstance: EClassRepresentationInstance = {
      ...(notation as EClassRepresentationInstance),
      id: uniqueRepresentationId,
      referenceMetaId: newNode.id,
      position: {
        x: newNode.position.x,
        y: newNode.position.y,
      },
    };

    // Add graphical representation if it exists, and if the representation config exists
    if (representationConfig && representationConfig.ePackages[0]) {
      newEClassRepresentationInstance = {
        ...newEClassRepresentationInstance,
        graphicalRepresentation: [
          ...(representationConfig?.ePackages[0].eClassifiers
            .map((cls) => cls as EClassRepresentationInstance)
            .find((cls) => cls.name === notation.name)
            ?.graphicalRepresentation || []),
        ],
      };
    }

    newRepresentationInstanceModel.ePackages[0].eClassifiers.push(
      newEClassRepresentationInstance
    );

    dispatch(updateRepresentationInstanceModel(newRepresentationInstanceModel));
  };

  const elementCount: { [key: string]: number } = {}; // To track the count of each element type

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        console.log("React Flow instance not set.");
        return;
      }

      const dragData: DragData = JSON.parse(
        event.dataTransfer.getData("palette-item")
      );
      const { notation } = dragData;

      const name = notation.name; // notation being dropped

      if (!elementCount[name]) {
        elementCount[name] = 1; // Initialize if it doesn't exist
      } else {
        elementCount[name] += 1; // Increment the count
      }

      const uniqueId = `${name}${elementCount[name]}`; // unique node id

      const nodeType = notation.name + "Node"; // ClassNode, ReferenceNode, etc.

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const allNotations = typeHelper.mergeMetaAndRepresentation(
        metaConfig!.ePackages,
        representationConfig!.ePackages
      );

      const nodeData: CustomNodeData = {
        metaNotations: allNotations,
        instanceNotation: notation,
        position: position,
        isNotationSlider: false,
        isPalette: false,
      };

      const newNode: Node = {
        id: uniqueId,
        type: nodeType,
        position,
        data: nodeData as any,
      };

      console.log("Node dropped:", newNode);
      setNodes((nds) => nds.concat(newNode));

      // Update meta instance model with new node
      updateMetaInstanceModelWithNewNode(newNode, notation);

      // Update representation instance model with new node
      updateRepresentationInstanceModelWithNewNode(newNode, notation);
    },
    [
      reactFlowInstance,
      metaConfig,
      representationConfig,
      metaInstanceModel,
      representationInstanceModel,
    ]
  );

  const importFromXMI = async (xmiFile: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const xmiData = event.target?.result as string;
      const result = await parseStringPromise(xmiData);
      const importedNodes: Node[] = result.XMI["UML:Model"][0][
        "UML:Class"
      ]?.map((cls: any, index: number) => ({
        id: `node-${index}`,
        type: cls.$.type,
        data: {
          label: cls.$.name,
          sections: cls["Compartment"]?.map((compartment: any) => {
            return { name: compartment.$.name, default: compartment.$.default };
          }),
        },
        position: {
          x: parseFloat(cls.Position[0].$.x),
          y: parseFloat(cls.Position[0].$.y),
        },
      }));
      const importedEdges: Edge[] = result.XMI["UML:Model"][0][
        "UML:Association"
      ]?.map((assoc: any, index: number) => ({
        id: `edge-${index}`,
        source: assoc.$.source,
        target: assoc.$.target,
      }));
      setNodes(importedNodes);
      setEdges(importedEdges);
    };
    reader.readAsText(xmiFile);
  };

  return (
    <div className="flex h-full bg-white">
      <ReactFlowProvider>
        <PaletteEditorPanel
          title={metaConfig?.name}
          notations={typeHelper.mergeMetaAndRepresentation(
            metaConfig!.ePackages,
            representationConfig!.ePackages
          )}
        />
        <div
          style={{ minHeight: "100%", maxHeight: "100%", width: "100%" }}
          className="border-2 overflow-y-scroll"
          ref={diagramAreaRef}
        >
          <div style={{ flexGrow: 1, height: "100%", cursor: "grab" }}>
            <ReactFlowWithInstance
              nodes={nodes}
              edges={edges.map((edge) => ({
                ...edge,
                data: {
                  ...edge.data,
                  onDoubleClick: onDoubleClickEdge,
                },
              }))}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              snapToGrid={true}
              snapGrid={[15, 15]}
            />
          </div>
        </div>
      </ReactFlowProvider>

      {/* Modal */}
      {isModalOpen && modalData && (
        <ModalDoubleClickNotation
          nodeId=""
          data={modalData}
          isNodeAttributeModalOpen={false}
          isNodeModalOpen={isModalOpen}
          isNodeOperationModalOpen={false}
          setData={(newData) => {
            setModalData(newData);
            onEdgeDataChange(selectedEdgeId!, newData);
          }}
          setIsNodeAttributeModalOpen={() => {}}
          setIsNodeModalOpen={setIsModalOpen}
          setIsNodeOperationModalOpen={() => {}}
          onDataUpdate={(updatedData) => {
            onEdgeDataChange(selectedEdgeId!, updatedData);
          }}
        />
      )}

      <div>
        <h3 className="font-bold">Import from XMI</h3>
        <input
          type="file"
          accept=".xmi"
          alt="Import from XMI"
          placeholder="Import from XMI"
          onChange={(e) => {
            if (e.target.files) {
              importFromXMI(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
};

export default DiagramEditor;
