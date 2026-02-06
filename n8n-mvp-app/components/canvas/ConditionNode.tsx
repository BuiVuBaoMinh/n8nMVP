import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitFork } from 'lucide-react';

const ConditionNode = ({ data, selected }: any) => {
  return (
    <div 
      className={`relative px-4 py-2 shadow-md rounded-md min-w-50 border-2 transition-all duration-200
        hover:cursor-pointer active:cursor-grabbing
        ${selected 
          ? 'border-orange-600 bg-orange-200 shadow-orange-200 shadow-lg' 
          : 'border-orange-500 bg-white'
        }
      `}
    >
      <div className="flex items-center">
        <GitFork className={`w-4 h-4 mr-2 ${selected ? 'text-orange-700' : 'text-orange-500'}`} />
        <div className="text-sm font-bold text-gray-700">Condition</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.label}</div>

      {/* Input Handle */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-slate-400" />

      {/* Output Handle: TRUE */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true"
        className="w-3 h-3 bg-green-500" 
        style={{ top: '35%' }}
      />
      <div className="absolute right-0 top-[23%] text-[10px] text-green-600 font-bold transform translate-x-[140%]">TRUE</div>

      {/* Output Handle: FALSE */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        className="w-3 h-3 bg-red-500" 
        style={{ top: '70%' }}
      />
      <div className="absolute right-0 top-[50%] text-[10px] text-red-600 font-bold transform translate-x-[140%] translate-y-[20%]">FALSE</div>
    </div>
  );
};

export default memo(ConditionNode);