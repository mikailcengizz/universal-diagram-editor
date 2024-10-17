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
  ReactFlowInstance,
  Position,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  DiagramNodeData,
  DragData,
  InstanceModel,
  RepresentationInstanceModel,
  MetaModel,
  InstanceObject,
  Class,
  RepresentationMetaModel,
  RepresentationInstanceObject,
} from "../../types/types";
import PaletteEditorPanel from "./PaletteEditorPanel";
import configService from "../../services/ConfigService";
import ReactFlowWithInstance from "../ReactFlowWithInstance";
import CombineObjectShapesNode from "../notation_representations/nodes/CombineObjectShapesNode";
import CombineLinkShapesEdge from "../notation_representations/edges/CombineLinkShapesNode";
import ModalDoubleClickNotation from "../notation_representations/nodes/components/modals/first_layer/ModalDoubleClickNotation";
import { useDispatch, useSelector } from "react-redux";
import { updateRepresentationInstanceModel } from "../../redux/actions/representationInstanceModelActions";
import { updateInstanceModel } from "../../redux/actions/objectInstanceModelActions";
import { updateSelectedMetaModel } from "../../redux/actions/selectedConfigActions";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import ModelHelperFunctions from "../helpers/ModelHelperFunctions";
import OnNodesChangeHelper from "../helpers/react-flow-helpers/OnNodesChangeHelper";
import OnLoadHelper from "../helpers/react-flow-helpers/OnLoadHelper";
import ConstraintHelper from "../helpers/ConstraintHelper";
import AlertWithFade from "../ui_elements/AlertWithFade";
import OnEdgesChangeHelper from "../helpers/react-flow-helpers/OnEdgesChangeHelper";

const nodeTypes = {
  ClassNode: CombineObjectShapesNode,
};

const edgeTypes = {
  ClassEdge: CombineLinkShapesEdge,
};

interface DiagramEditorProps {
  selectedMetaModelURI: string;
  showGrid: boolean;
  diagramAreaRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const DiagramEditor = ({
  selectedMetaModelURI,
  showGrid,
  diagramAreaRef,
  nodes,
  setNodes,
  edges,
  setEdges,
}: DiagramEditorProps) => {
  const dispatch = useDispatch();
  const instanceModel: InstanceModel = useSelector(
    (state: any) => state.instanceModelStore.model
  );
  const representationInstanceModel: RepresentationInstanceModel = useSelector(
    (state: any) => state.representationInstanceModelStore.model
  );
  selectedMetaModelURI =
    localStorage.getItem("selectedMetaModel") || selectedMetaModelURI;

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedMetaModel, setSelectedMetaModel] = useState<MetaModel>({
    package: {
      name: "",
      uri: "",
      elements: [],
    },
  });
  const [selectedRepresentationMetaModel, setSelectedRepresentationMetaModel] =
    useState<RepresentationMetaModel>({
      package: {
        name: "",
        uri: "",
        elements: [],
      },
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<DiagramNodeData | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Store the selected edge ID
  const [hasInitializedNodes, setHasInitializedNodes] = useState(false);
  const [hasInitializedEdges, setHasInitializedEdges] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    // onLoad react flow functionality
    if (reactFlowInstance) {
      // Perform any additional actions when the instance is available
    }
  }, [reactFlowInstance]);

  useEffect(() => {
    if (selectedMetaModelURI) {
      const fetchMetaConfig = async () => {
        try {
          const response = await configService.getMetaConfigByUri(
            encodeURIComponent(selectedMetaModelURI)
          );
          setSelectedMetaModel(response.data);
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
          const response = await configService.getRepresentationConfigByUri(
            encodeURIComponent(selectedMetaModelURI + "-representation")
          );
          setSelectedRepresentationMetaModel(response.data);
        } catch (error) {
          console.error("Error fetching representation configuration: ", error);
        }
      };
      fetchRepresentationConfig();

      dispatch(updateSelectedMetaModel(selectedMetaModelURI));
    }
  }, [selectedMetaModelURI, dispatch, setNodes, setEdges]);

  const onDoubleClickEdge = (edgeId: string, data: DiagramNodeData) => {
    console.log("Double clicked on edge:", edgeId, data);
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
  }, [selectedMetaModel]);

  // Load the instance models from local storage
  useEffect(() => {
    const metaInstance = JSON.parse(localStorage.getItem("metaInstanceModel")!);
    const representationInstance = JSON.parse(
      localStorage.getItem("representationInstanceModel")!
    );

    if (metaInstance && representationInstance) {
      console.log("dispatching instance models from local storage");
      dispatch(updateInstanceModel(metaInstance));
      dispatch(updateRepresentationInstanceModel(representationInstance));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!reactFlowInstance) {
      return;
    }

    if (
      !hasInitializedNodes &&
      nodes.length === 0 &&
      instanceModel &&
      representationInstanceModel &&
      selectedMetaModel.package.elements.length > 0 &&
      selectedRepresentationMetaModel.package.elements.length > 0
    ) {
      const initialNodes = OnLoadHelper.initializeNodes(
        representationInstanceModel,
        instanceModel,
        selectedMetaModel,
        selectedRepresentationMetaModel
      );
      setNodes(initialNodes);
      setHasInitializedNodes(true);
    }
  }, [
    instanceModel,
    nodes.length,
    representationInstanceModel,
    selectedMetaModel,
    reactFlowInstance,
    selectedRepresentationMetaModel,
    setNodes,
    hasInitializedNodes,
  ]);

  // Initialize edges
  useEffect(() => {
    if (!reactFlowInstance) {
      return;
    }

    if (
      !hasInitializedEdges &&
      hasInitializedNodes &&
      edges.length === 0 &&
      nodes.length > 0 &&
      instanceModel &&
      representationInstanceModel &&
      selectedMetaModel.package.elements.length > 0 &&
      selectedRepresentationMetaModel.package.elements.length > 0
    ) {
      const initialEdges = OnLoadHelper.initializeEdges(
        nodes,
        onDoubleClickEdge,
        representationInstanceModel,
        instanceModel,
        selectedMetaModel,
        selectedRepresentationMetaModel
      );
      setEdges(initialEdges);
      setHasInitializedEdges(true);
    }
  }, [
    edges.length,
    instanceModel,
    nodes,
    reactFlowInstance,
    representationInstanceModel,
    selectedMetaModel,
    selectedRepresentationMetaModel,
    setEdges,
    hasInitializedEdges,
    hasInitializedNodes,
  ]);

  const updateInstanceModelWithNewNode = useCallback(
    (
      newNode: Node | Edge,
      isNode: boolean, // boolean to tell if the new node is a node or an edge
      notation: InstanceObject
    ) => {
      let newInstanceModel = { ...instanceModel };

      // if it is the first node we drop, we set the uri
      if (newInstanceModel.package.uri === "") {
        newInstanceModel.package.uri = selectedMetaModel.package.uri;
      }

      // Add the new node to the instance model together with its id
      let newInstanceObject = { ...notation };

      newInstanceModel.package.objects.push(newInstanceObject);

      dispatch(updateInstanceModel(newInstanceModel));
    },
    [instanceModel, selectedMetaModel, dispatch]
  );

  const updateRepresentationInstanceModelWithNewNode = useCallback(
    (
      newNode: Node | Edge,
      isNode: boolean, // boolean to tell if the new node is a node or an edge
      notation: RepresentationInstanceObject
    ) => {
      let newRepresentationInstanceModel = { ...representationInstanceModel };

      // if it is the first node we drop, we set the uri
      if (newRepresentationInstanceModel.package.uri === "") {
        newRepresentationInstanceModel.package.uri =
          selectedRepresentationMetaModel.package.uri;
      }

      // Add the new node to the instance model together with its id
      let newRepresentationInstanceObject = { ...notation };

      if (isNode) {
        newNode = newNode as Node;
        newRepresentationInstanceObject = {
          ...newRepresentationInstanceObject,
          position: {
            x: newNode.position.x,
            y: newNode.position.y,
          },
        };
      }

      newRepresentationInstanceModel.package.objects.push(
        newRepresentationInstanceObject
      );

      dispatch(
        updateRepresentationInstanceModel(newRepresentationInstanceModel)
      );
    },
    [representationInstanceModel, selectedRepresentationMetaModel, dispatch]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Check if source and target exist
      if (!params.source || !params.target) {
        console.error("Source or Target is missing from params:", params);
        return;
      }

      // Access the source and target node IDs
      const { source, target, sourceHandle, targetHandle } = params;

      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      // Find source and target notations in metaInstanceModel
      const sourceInstanceObject = instanceModel.package.objects.find(
        (obj) =>
          obj.name ===
          (sourceNode!.data as DiagramNodeData).instanceObject?.name
      );
      const targetInstanceObject = instanceModel.package.objects.find(
        (obj) =>
          obj.name ===
          (targetNode!.data as DiagramNodeData).instanceObject?.name
      );

      // Check if the source and target were found
      if (!sourceInstanceObject || !targetInstanceObject) {
        console.error("Source or Target notation not found:", {
          sourceInstanceObject,
          targetInstanceObject,
        });
        return; // Exit early if either instance is not found
      }

      // Get source and target instance representations
      const sourceRepresentation =
        ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
          sourceInstanceObject,
          representationInstanceModel
        );
      const targetRepresentation =
        ModelHelperFunctions.findRepresentationInstanceFromInstanceObjectInRepresentationInstanceModel(
          targetInstanceObject,
          representationInstanceModel
        );

      // Check if the source and target representations were found
      if (!sourceRepresentation || !targetRepresentation) {
        console.error("Source or Target representation not found:", {
          sourceRepresentation,
          targetRepresentation,
        });
        return; // Exit early if either representation is not found
      }

      if (!sourceHandle || !targetHandle) {
        console.error(
          "Source or Target handle is missing from params:",
          params
        );
        return;
      }

      // Extract the alignment and handle index from the handle ID (e.g., "handle-left-0")
      const extractHandleInfo = (handleId: string) => {
        const [prefix, alignment, index] = handleId.split("-");
        return { alignment, index: parseInt(index, 10) };
      };

      const sourceHandleInfo = extractHandleInfo(sourceHandle);
      const targetHandleInfo = extractHandleInfo(targetHandle);

      if (!sourceHandleInfo || !targetHandleInfo) {
        console.error("Source or Target handle info is missing or incorrect:", {
          sourceHandleInfo,
          targetHandleInfo,
        });
        return;
      }

      console.log("sourceHandleInfo:", sourceHandleInfo);
      console.log("targetHandleInfo:", targetHandleInfo);

      // Now find the correct graphicalRepresentation connector for the source and target
      const findConnectorIndex = (representation: any, index: number) => {
        const connectors = representation.graphicalRepresentation.filter(
          (item: any) => item.shape === "connector"
        );

        // Return the connector at the given index within the filtered connectors
        return connectors[index]
          ? representation.graphicalRepresentation.indexOf(connectors[index])
          : -1; // Return -1 if not found
      };

      const sourceConnectorIndex = findConnectorIndex(
        sourceRepresentation,
        sourceHandleInfo.index
      );

      const targetConnectorIndex = findConnectorIndex(
        targetRepresentation,
        targetHandleInfo.index
      );

      if (sourceConnectorIndex === -1 || targetConnectorIndex === -1) {
        console.error(
          "Could not find the correct connector in source or target graphicalRepresentation",
          {
            sourceConnectorIndex,
            targetConnectorIndex,
          }
        );
        return;
      }

      const sourceConnectorRef = `/representation/graphicalRepresentation/${sourceConnectorIndex}`;
      const targetConnectorRef = `/representation/graphicalRepresentation/${targetConnectorIndex}`;

      // Find the first Edge type of the notation which we can use as the default edge type
      let edgeNotationElement: Class | null =
        (selectedMetaModel.package.elements as Class[]).find(
          (element) =>
            ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
              element,
              selectedRepresentationMetaModel
            )?.type === "ClassEdge"
        ) || null;
      const edgeNotationElementRepresentation =
        ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
          edgeNotationElement!,
          selectedRepresentationMetaModel
        );

      // No edge types found in the language
      if (!edgeNotationElement) {
        console.error("No edge types found in the language.");
        return;
      }

      // Validate if the edge connection is allowed based on constraints
      // Fetch the constraints
      const constraints = edgeNotationElement.constraints || [];

      // Define the context for constraint evaluation
      const context = {
        self: {
          source: sourceInstanceObject,
          target: targetInstanceObject,
        },
      };

      // Validate each constraint
      const isValid = constraints.every((constraint) => {
        const parsedConstraint = ConstraintHelper.parseConstraint(constraint); // Parse the constraint into AST
        return ConstraintHelper.evaluateExpression(
          parsedConstraint,
          context,
          selectedMetaModel
        ); // Evaluate the parsed constraint
      });

      if (!isValid) {
        setAlertMessage(
          "Invalid connection based on constraints:" + constraints
        );
        setAlertSeverity("error");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 8000); // Alert will fade out after 6 seconds
        return;
      }

      const uniqueId = `${edgeNotationElement.name}-${uuidv4()}`;

      console.log("associationRepresentation", edgeNotationElement);

      // Make sure we reference the new edge to the new representation instance that we create after adding the edge to the instance model
      const metaRepresentationRef = edgeNotationElement.representation?.$ref!;
      const [modelUri] = metaRepresentationRef.split("#"); // use base URI to construct new URI
      const representationUri =
        modelUri + "#/objects/" + instanceModel.package.objects.length;
      // Create a new edge instance object
      const edgeInstanceObject: InstanceObject = {
        name: uniqueId,
        type: {
          $ref:
            selectedMetaModel.package.uri +
            "#/elements/" +
            (selectedMetaModel.package.elements as Class[]).findIndex(
              (element) => element.name === edgeNotationElement!.name
            ),
        },
        attributes: [],
        links: [
          {
            name: "source",
            target: {
              $ref:
                "#/objects/" +
                instanceModel.package.objects.indexOf(sourceInstanceObject) +
                sourceConnectorRef,
            },
          },
          {
            name: "target",
            target: {
              $ref:
                "#/objects/" +
                instanceModel.package.objects.indexOf(targetInstanceObject) +
                targetConnectorRef,
            },
          },
        ],
        representation: {
          $ref: representationUri,
        },
      };

      // Ensure graphicalRepresentation exists
      if (!edgeInstanceObject.representation) {
        console.error("Graphical representation is missing for edge");
        return;
      }

      const data: DiagramNodeData = {
        notation: {
          representationMetaModel: selectedRepresentationMetaModel,
          metaModel: selectedMetaModel,
        },
        notationElement: edgeNotationElement,
        instanceObject: edgeInstanceObject,
        position: {
          x: 0,
          y: 0,
        }, // edges don't have positions
      };

      console.log("onConnect edge params:", params);

      const newEdge: Edge = {
        ...params,
        id: `${uniqueId}`,
        type: "ClassEdge",
        source: source,
        sourceHandle: sourceHandle,
        target: target,
        targetHandle: targetHandle,
        // passing data to the combined edge component
        data: data as any,
      };

      console.log("edge created in OnConnect:", newEdge);

      setEdges((eds) => addEdge(newEdge, eds));

      // Update meta instance model with new edge
      updateInstanceModelWithNewNode(newEdge, false, edgeInstanceObject);

      const representationInstanceObject: RepresentationInstanceObject = {
        name: uniqueId,
        type: edgeNotationElementRepresentation!.type,
        position: {
          x: 0,
          y: 0,
        },
        graphicalRepresentation: [
          ...edgeNotationElementRepresentation!.graphicalRepresentation!,
        ],
      };

      // Update representation instance model with new edge
      updateRepresentationInstanceModelWithNewNode(
        newEdge,
        false,
        representationInstanceObject
      );
    },
    [
      setEdges,
      selectedMetaModel,
      selectedRepresentationMetaModel,
      nodes,
      instanceModel,
      updateInstanceModelWithNewNode,
      updateRepresentationInstanceModelWithNewNode,
    ]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // first apply the changes to the nodes
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);

        // then apply the changes to the instance models
        changes.forEach((change) => {
          OnNodesChangeHelper.updateNodePosition(
            updatedNodes,
            change,
            instanceModel,
            representationInstanceModel,
            dispatch
          );
          OnNodesChangeHelper.removeNode(
            nds,
            change,
            instanceModel,
            representationInstanceModel,
            dispatch
          );
        });

        return updatedNodes;
      });
    },

    [representationInstanceModel, dispatch, instanceModel, setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        // first apply the changes to the edges
        const updatedEdges = applyEdgeChanges(changes, eds);

        // then apply the changes to the instance models
        changes.forEach((change) => {
          OnEdgesChangeHelper.removeEdge(
            eds,
            change,
            instanceModel,
            representationInstanceModel,
            dispatch
          );
        });

        return updatedEdges;
      });
    },
    [setEdges, dispatch, instanceModel, representationInstanceModel]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("onDragOver triggered"); // log drag over event
  }, []);

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
      const { notationElement } = dragData;

      const uniqueId = `${notationElement.name}-${uuidv4()}`;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const instanceObject: InstanceObject = {
        name: uniqueId,
        type: {
          $ref:
            selectedMetaModel.package.uri +
            "#/elements/" +
            (selectedMetaModel.package.elements as Class[]).findIndex(
              (element) => element.name === notationElement.name
            ),
        },
        attributes: [],
        links: [],
        representation: {
          $ref:
            selectedRepresentationMetaModel.package.uri +
            "#/objects/" +
            representationInstanceModel.package.objects.length,
        },
      };

      const notationElementRepresentation =
        ModelHelperFunctions.findRepresentationFromClassInRepresentationMetaModel(
          notationElement,
          selectedRepresentationMetaModel
        )!;
      const representationInstanceObject: RepresentationInstanceObject = {
        name: uniqueId,
        type: notationElementRepresentation.type,
        position: position,
        graphicalRepresentation: [
          ...notationElementRepresentation.graphicalRepresentation!,
        ],
      };

      const nodeData: DiagramNodeData = {
        notation: {
          representationMetaModel: selectedRepresentationMetaModel,
          metaModel: selectedMetaModel,
        },
        notationElement: notationElement,
        instanceObject: instanceObject,
        position: position,
        isNotationSlider: false,
      };

      const nodeHandles = representationInstanceObject.graphicalRepresentation
        ?.filter(
          (representationItem) => representationItem.shape === "connector"
        )
        .flatMap((representationItem, index) => {
          const handleList = [];

          // Handle target and source for each side
          if (representationItem.style.alignment === "left") {
            // Add both target and source handles for 'left'
            handleList.push({
              id: `handle-left-target-${index}`,
              position: Position.Left,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "target" as "target",
            });
            handleList.push({
              id: `handle-left-source-${index}`,
              position: Position.Left,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "source" as "source",
            });
          } else if (representationItem.style.alignment === "right") {
            handleList.push({
              id: `handle-right-target-${index}`,
              position: Position.Right,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "target" as "target",
            });
            handleList.push({
              id: `handle-right-source-${index}`,
              position: Position.Right,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "source" as "source",
            });
          } else if (representationItem.style.alignment === "top") {
            handleList.push({
              id: `handle-top-target-${index}`,
              position: Position.Top,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "target" as "target",
            });
            handleList.push({
              id: `handle-top-source-${index}`,
              position: Position.Top,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "source" as "source",
            });
          } else if (representationItem.style.alignment === "bottom") {
            handleList.push({
              id: `handle-bottom-target-${index}`,
              position: Position.Bottom,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "target" as "target",
            });
            handleList.push({
              id: `handle-bottom-source-${index}`,
              position: Position.Bottom,
              x: representationItem.position.x,
              y: representationItem.position.y,
              type: "source" as "source",
            });
          }

          return handleList;
        });

      console.log("nodeHandles:", nodeHandles);

      const newNode: Node = {
        id: uniqueId,
        type: notationElementRepresentation.type, // ClassNode, EdgeNode
        handles: nodeHandles,
        position: position,
        data: nodeData as any,
      };

      console.log("Node dropped:", newNode);
      setNodes((nds) => nds.concat(newNode));

      // Update meta instance model with new node
      updateInstanceModelWithNewNode(newNode, true, instanceObject);

      // Update representation instance model with new node
      updateRepresentationInstanceModelWithNewNode(
        newNode,
        true,
        representationInstanceObject
      );

      console.log("nodes after drop:", nodes);
    },
    [
      nodes,
      selectedMetaModel,
      selectedRepresentationMetaModel,
      reactFlowInstance,
      representationInstanceModel,
      setNodes,
      updateInstanceModelWithNewNode,
      updateRepresentationInstanceModelWithNewNode,
    ]
  );

  return (
    <div className="flex h-full bg-white">
      <ReactFlowProvider>
        <PaletteEditorPanel
          title={selectedMetaModel?.package?.name}
          notationElements={selectedMetaModel?.package?.elements as Class[]}
          selectedMetaModel={selectedMetaModel}
          selectedRepresentationMetaModel={selectedRepresentationMetaModel}
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
              setReactFlowInstance={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              snapToGrid={true}
              snapGrid={[15, 15]}
              showGrid={showGrid}
              connectionMode={ConnectionMode.Loose}
            />
          </div>
        </div>
      </ReactFlowProvider>

      {/* Modal */}
      {isModalOpen && modalData && (
        <ModalDoubleClickNotation
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

      <AlertWithFade
        message={alertMessage}
        showAlert={showAlert}
        severity={alertSeverity}
      />
    </div>
  );
};

export default DiagramEditor;
