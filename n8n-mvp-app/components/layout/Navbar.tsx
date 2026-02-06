import React from 'react';
import { Play, Save, Box, Layers, Settings, BookOpen, User } from 'lucide-react';

interface NavbarProps {
  onSave: () => void;
  onRun: () => void;
  isSaved: boolean;
}

export default function Navbar({ onSave, onRun, isSaved }: NavbarProps) {
  return (
    <nav className="h-16 bg-[#09637e] flex items-center justify-between px-6 shadow-md z-50 text-white shrink-0">
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#ebf4f6] p-1.5 rounded-lg">
            <Box className="w-6 h-6 text-[#09637e]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">n8n MVP</h1>
            <p className="text-[10px] text-[#7ab2b2] font-medium uppercase tracking-wider">Workflow Engine</p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-[#7ab2b2]/30 mx-2" />

        <div className="flex items-center gap-1">
          <NavButton icon={<Layers className="w-4 h-4" />} label="Workflows" active />
          <NavButton icon={<BookOpen className="w-4 h-4" />} label="Templates" />
          <NavButton icon={<Settings className="w-4 h-4" />} label="Settings" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Save Button */}
        <button 
          onClick={onSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border
            ${isSaved 
              ? 'bg-[#088395] border-[#7ab2b2] text-white shadow-sm' 
              : 'bg-transparent border-[#7ab2b2]/50 text-[#ebf4f6] hover:bg-[#088395]/50'
            }`}
        >
          <Save className="w-4 h-4" />
          <span>Save Workflow</span>
        </button>

        {/* Run Button */}
        <button 
          onClick={onRun}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#ebf4f6] text-[#09637e] hover:bg-white hover:shadow-lg hover:scale-105 transition-all shadow-md"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run</span>
        </button>
        
        {/* Profile Avatar */}
        <div className="ml-2 w-8 h-8 rounded-full bg-[#7ab2b2] flex items-center justify-center text-[#09637e] cursor-pointer hover:bg-[#ebf4f6] transition-colors">
            <User className="w-5 h-5" />
        </div>
      </div>
    </nav>
  );
}

function NavButton({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
      ${active ? 'text-white bg-[#088395]/40' : 'text-[#7ab2b2] hover:text-[#ebf4f6] hover:bg-[#088395]/20'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}