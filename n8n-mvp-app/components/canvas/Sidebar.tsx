import React, { useState, useRef, useEffect } from 'react';
import { Bot, Split, Globe, MousePointerClick, Terminal, GripVertical, Search, ChevronDown } from 'lucide-react';

export default function Sidebar() {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({ x: dragRef.current.initialX + dx, y: dragRef.current.initialY + dy });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'agent', label: 'Agent', desc: 'Dynamically choose and utilize tools during runtime', icon: <Bot className="w-5 h-5 text-[#088395]" /> }, // Action Teal
    { type: 'condition', label: 'Condition', desc: 'Split flows based on If/Else conditions', icon: <Split className="w-5 h-5 text-[#09637e]" /> }, // Orange accent
    { type: 'trigger', label: 'Manual Trigger', desc: 'Start flow manually', icon: <MousePointerClick className="w-5 h-5 text-[#09637e]" /> }, // Primary Teal
    { type: 'custom', label: 'Custom Function', desc: 'Execute custom JS code', icon: <Terminal className="w-5 h-5 text-[#09637e]" /> }, // Pink accent
    { type: 'http', label: 'HTTP Request', desc: 'Send a HTTP request', icon: <Globe className="w-5 h-5 text-[#09637e]" /> }, // Green accent
  ];

  return (
    <div 
      style={{ left: position.x, top: position.y }}
      className="absolute w-[320px] bg-white rounded-[10px] border border-[#7ab2b2] shadow-2xl z-50 flex flex-col font-sans"
    >
      {/* Header & Search */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-[5] pb-2 space-y-4 cursor-move bg-[#09637e] rounded-t-[10px]"
      >
        <div className="flex items-center justify-between rounded-[1]">
          <h2 className="font-bold text-[#FFFFFF] text-md">Add Nodes</h2>
        </div>
      </div>
      
      {/* Node List Container */}
      <div className="flex-1 overflow-y-auto p-[3] h-[400px] scrollbar-thin scrollbar-thumb-[#ebf4f6] scrollbar-track-transparent">

        <div className="space-y-4">
            {nodeTypes.map((node) => (
            <div
                key={node.type}
                draggable
                onDragStart={(event) => onDragStart(event, node.type, node.label)}
                className="group relative flex items-start gap-4 p-3 rounded-xl hover:bg-[#ebf4f6] hover:outline-1 outline-[#09637e] cursor-grab active:cursor-grabbing transition-colors duration-200"
            >
                {/* Icon*/}
                <div className="mt-1 shrink-0">
                    {node.icon}
                </div>
                
                {/* Text Content */}
                <div className="flex-1 min-w-0 space-x-px-[4]">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#09637e]">
                            {node.label}
                        </span>
                        <GripVertical className="w-4 h-4 text-[#7ab2b2]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-[#7ab2b2] leading-relaxed mt-0.5 line-clamp-2 font-medium">
                        {node.desc}
                    </p>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}