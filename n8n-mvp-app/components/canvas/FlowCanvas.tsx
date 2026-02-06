"use client";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar'; // Importing the file we just fixed

import Navbar from '@/components/layout/Navbar'; 
import ConditionNode from './ConditionNode';

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Start Webhook', jobType: 'trigger' }, 
    type: 'input',
    style: { background: '#fff', border: '1px solid #777', borderRadius: '8px', padding: '10px', width: 150 }
  },
];

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: type === 'condition' ? 'condition' : (type === 'trigger' ? 'input' : 'default'),
        position,
        data: { label: label, jobType: type },
        style: type === 'condition' ? {} : { 
          background: '#fff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '10px', 
          width: 150 
        }
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const updateNodeData = useCallback((id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({ condition: ConditionNode }), []);

  const handleSave = async () => {
    const workflowData = {
      ...(workflowId && { _id: workflowId }),
      name: "Example Workflow",
      nodes,
      edges,
    };
    const res = await fetch('/api/workflows', { method: 'POST', body: JSON.stringify(workflowData) });
    const data = await res.json();
    if (res.ok) {
      setWorkflowId(data._id);
      alert(`Workflow Saved!`);
    }
  };

  const handleRun = async () => {
    if (!workflowId) { alert("Please save first!"); return; }
    const res = await fetch('/api/execution', { method: 'POST', body: JSON.stringify({ workflowId }) });
    if (res.ok) alert('Execution Started!');
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="h-screen w-full flex flex-col bg-[#ebf4f6]"> 
      
      {/* Navbar */}
      <Navbar 
        onSave={handleSave} 
        onRun={handleRun} 
        isSaved={!!workflowId} 
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 bg-[#ebf4f6] relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
          >
            <Background color="#7ab2b2" gap={20} size={1} variant={BackgroundVariant.Dots}/>
            <Controls className="bg-white border-none shadow-md rounded-lg text-[#09637e] fill-[#09637e]" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}