"use client";
import React, { useCallback, useRef, useState } from 'react';
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
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';


const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Start Webhook' }, 
    type: 'input',
    style: { background: '#fff', border: '1px solid #777', borderRadius: '8px', padding: '10px', width: 150 }
  },
];

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: type === 'trigger' ? 'input' : 'default',
        position,
        data: { label: label },
        style: { 
          background: '#fff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '10px', 
          width: 150,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const handleSave = async () => {
    const res = await fetch('/api/workflows', {
      method: 'POST',
      body: JSON.stringify({ name: "My Workflow", nodes, edges }),
    });
    if (res.ok) alert('Workflow Saved!');
  };

  const handleRun = async () => {
    const res = await fetch('/api/execution', { method: 'POST' });
    if (res.ok) alert('Job Sent!');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 z-10 shrink-0">
        <h1 className="font-bold text-xl text-slate-800">n8n Minimal</h1>
        <div className="flex gap-3">
          <button onClick={handleSave} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 font-medium transition">
            Save
          </button>
          <button onClick={handleRun} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition shadow-sm">
            Run Workflow
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 bg-slate-50 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background color="#94a3b8" gap={16} size={1} variant={BackgroundVariant.Dots}/>
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

// Wrapper ensures ReactFlowProvider is available
export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}