import React from 'react';
import { Play, Save, Box, Layers, Settings, BookOpen, User, Bell } from 'lucide-react';
import { Button } from '../ui/button';

interface NavbarProps {
  onSave: () => void;
  onRun: () => void;
  isSaved: boolean;
}

export default function Navbar({ onSave, onRun, isSaved }: NavbarProps) {
  return (
    <nav className="h-16 bg-[#09637e] flex items-center justify-between px-6 shadow-lg z-50 text-white shrink-0">
      {/* Left: Brand */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="bg-[#ebf4f6] p-2 rounded-lg shadow-inner">
            <Box className="w-5 h-5 text-[#09637e]" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-none tracking-tight">n8n MVP</h1>
            <span className="text-[10px] text-[#7ab2b2] font-semibold uppercase tracking-widest mt-0.5">
              Workflow Engine
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-[#7ab2b2]/30 mx-2" />

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <NavButton icon={<Layers className="w-4 h-4" />} label="Workflows" active />
          <NavButton icon={<BookOpen className="w-4 h-4" />} label="Templates" />
          <NavButton icon={<Settings className="w-4 h-4" />} label="Settings" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Save Status */}
        <div className="flex items-center text-xs font-medium text-[#7ab2b2] gap-2 mr-2">
            {isSaved ? (
                <span className="flex items-center gap-1.5 text-[#ebf4f6]">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                    Saved
                </span>
            ) : (
                <span>Unsaved changes</span>
            )}
        </div>

        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[#7ab2b2]/50 text-[#ebf4f6] hover:bg-[#088395] hover:border-[#ebf4f6] hover:cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>

        <button 
          onClick={onRun}
          className="group flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-[#ebf4f6] text-[#09637e] hover:bg-white hover:scale-105 hover:cursor-pointer transition-all shadow-md active:scale-95"
        >
          <Play className="w-4 h-4 fill-[#09637e] group-hover:fill-[#088395]" />
          <span>Run</span>
        </button>
        
        <div className="h-8 w-px bg-[#7ab2b2]/30 mx-1" />

        <Button className="text-[#7ab2b2] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
        </Button>
        <div className="w-9 h-9 rounded-full bg-[#088395] border-2 border-[#7ab2b2]/50 flex items-center justify-center text-white cursor-pointer hover:bg-[#7ab2b2] transition-colors">
            <User className="w-5 h-5" />
        </div>
      </div>
    </nav>
  );
}

function NavButton({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
      ${active 
        ? 'text-white bg-[#088395]/40 shadow-sm border border-[#7ab2b2]/20' 
        : 'text-[#7ab2b2] hover:text-[#ebf4f6] hover:bg-[#088395]/20'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}