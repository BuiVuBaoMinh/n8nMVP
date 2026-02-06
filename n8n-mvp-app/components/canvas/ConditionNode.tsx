import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ConditionNode = ({ data }: any) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 bg-orange-500 mr-2" />
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
        style={{ top: '30%' }}
      />
      <div className="absolute right-[-25px] top-[20%] text-[10px] text-green-600 font-bold">TRUE</div>

      {/* Output Handle: FALSE */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        className="w-3 h-3 bg-red-500" 
        style={{ top: '70%' }}
      />
      <div className="absolute right-[0px] top-[50%] text-[10px] text-red-600 font-bold transform translate-x-[140%] translate-y-[20%]">FALSE</div>
    </div>
  );
};

export default memo(ConditionNode);