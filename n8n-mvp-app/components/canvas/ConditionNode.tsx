import React, { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { GitFork } from 'lucide-react';

const ConditionNode = ({ id, data, selected }: any) => {
  const { updateNodeData } = useReactFlow();

  const handleMatchChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { expectedName: evt.target.value });
  }, [id, updateNodeData]);

  return (
    <div 
      className={`relative px-4 py-3 shadow-md rounded-md min-w-62.5 border-2 transition-all bg-white
        ${selected ? 'border-orange-600 shadow-lg' : 'border-orange-500'}
      `}
    >
      <div className="flex items-center mb-3 border-b border-gray-100 pb-2">
        <GitFork className={`w-4 h-4 mr-2 ${selected ? 'text-orange-700' : 'text-orange-500'}`} />
        <div className="text-sm font-bold text-gray-700">If / Else</div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold text-gray-500">Continue if Name equals:</label>
        <input 
          className="nodrag w-full text-xs px-2 py-1.5 border rounded focus:outline-none focus:border-orange-500"
          placeholder="e.g. Minh"
          value={data.expectedName || ''}
          onChange={handleMatchChange}
        />
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />
      
      {/* TRUE Path */}
      <div className="absolute -right-3 top-10 flex items-center">
        <span className="mr-2 text-[10px] font-bold text-green-600">True</span>
        <Handle type="source" position={Position.Right} id="true" className="w-3 h-3 bg-green-500" />
      </div>

      {/* FALSE Path */}
      <div className="absolute -right-3 top-20 flex items-center">
        <span className="mr-2 text-[10px] font-bold text-red-600">False</span>
        <Handle type="source" position={Position.Right} id="false" className="w-3 h-3 bg-red-500" />
      </div>
    </div>
  );
};

export default memo(ConditionNode);