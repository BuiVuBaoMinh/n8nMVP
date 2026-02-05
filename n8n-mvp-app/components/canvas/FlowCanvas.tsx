"use client";
import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Start Webhook' }, 
    type: 'input',
    style: { background: '#fff', border: '1px solid #777', borderRadius: '8px', padding: '10px', width: 150 }
  },
];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleSave = async () => {
    const res = await fetch('/api/workflows', {
      method: 'POST',
      body: JSON.stringify({ name: "My Workflow", nodes, edges }),
    });
    if (res.ok) alert('Workflow Saved to Mongo!');
  };

  const handleRun = async () => {
    const res = await fetch('/api/execution', { method: 'POST' });
    if (res.ok) alert('Job Sent to Redis!');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 z-10">
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
      
      <div className="flex-1 bg-slate-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#94a3b8" gap={16} size={1} variant={BackgroundVariant.Dots}/>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}