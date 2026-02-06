import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Play } from 'lucide-react';

const ManualTriggerNode = ({ id, data, selected }: any) => {
  const { updateNodeData } = useReactFlow();

  const handleNameChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { userName: evt.target.value });
  }, [id, updateNodeData]);

  return (
    <div 
      className={`relative px-4 py-3 shadow-md rounded-md min-w-62.5 border-2 transition-all bg-white
        ${selected ? 'border-emerald-600 shadow-lg' : 'border-emerald-500'}
      `}
    >
      <div className="flex items-center mb-3 border-b border-gray-100 pb-2">
        <Play className={`w-4 h-4 mr-2 ${selected ? 'text-emerald-700' : 'text-emerald-500'}`} />
        <div className="text-sm font-bold text-gray-700">Manual Trigger</div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold text-gray-500">Test User Name</label>
        <input 
          className="nodrag w-full text-xs px-2 py-1.5 border rounded focus:outline-none focus:border-emerald-500"
          placeholder="e.g. Minh"
          value={data.userName || ''}
          onChange={handleNameChange}
        />
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500" />
    </div>
  );
};

export default memo(ManualTriggerNode);