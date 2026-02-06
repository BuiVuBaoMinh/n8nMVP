import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Globe, Mail } from 'lucide-react';

const HttpRequestNode = ({ id, data, selected }: any) => {

  const { updateNodeData } = useReactFlow();

  const handleEmailChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { recipientEmail: evt.target.value });
  }, [id, updateNodeData]);

  return (
    <div 
      className={`relative px-4 py-3 shadow-md rounded-md min-w-70 border-2 transition-all duration-200 bg-white
        ${selected 
          ? 'border-blue-600 shadow-blue-200 shadow-lg' 
          : 'border-blue-500'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
        <Globe className={`w-4 h-4 mr-2 ${selected ? 'text-blue-700' : 'text-blue-500'}`} />
        <div className="text-sm font-bold text-gray-700">Send Email Action</div>
      </div>

      {/* Configuration Body */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
          Recipient Email
        </label>
        
        <div className="relative flex items-center">
          <Mail className="w-3 h-3 absolute left-2 text-gray-400" />
          <input 
            type="email"
            className="nodrag w-full text-xs pl-7 pr-2 py-1.5 border border-gray-200 rounded hover:border-blue-400 focus:border-blue-600 focus:outline-none transition-colors text-gray-700"
            placeholder="receiver@example.com"
            value={data.recipientEmail || ''} 
            onChange={handleEmailChange}
          />
        </div>
        <p className="text-[10px] text-gray-400">
          Leave empty to use <code>input.userEmail</code>
        </p>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

export default memo(HttpRequestNode);