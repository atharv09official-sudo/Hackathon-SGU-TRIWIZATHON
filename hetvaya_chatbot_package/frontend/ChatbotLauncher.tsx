import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { ProductAiAssistant } from './ProductAiAssistant';
import { ChatContext } from './types';

export interface ChatbotLauncherProps {
  activeTab?: string;
  onNavigateTab?: (tab: any) => void;
  userRole?: string;
  context?: ChatContext | null;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

export const ChatbotLauncher: React.FC<ChatbotLauncherProps> = ({
  activeTab,
  onNavigateTab,
  userRole,
  context,
  isOpen: externalOpen,
  onToggleOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const setOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(open) : val;
    if (onToggleOpen) {
      onToggleOpen(nextVal);
    }
    if (!isControlled) {
      setInternalOpen(nextVal);
    }
  };

  // Derive role-aware context if not explicitly provided
  const derivedContext: ChatContext | null = context || (
    userRole === 'ganesh'
      ? { retailerId: 'STORE-MH-KOL-001', retailerName: 'Ganesh Kirana Store' }
      : userRole === 'sunita'
      ? { warehouseId: 'WH-PUN', warehouseName: 'Pune Central Fulfilment Hub' }
      : userRole === 'rohit'
      ? { planCode: 'PLAN-STATEWIDE-OR-TOOLS' }
      : null
  );

  return (
    <>
      {/* Kept mounted so the conversation survives closing the panel */}
      <div
        className={`fixed bottom-20 left-4 sm:left-5 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[min(640px,calc(100vh-7rem))] shadow-2xl rounded-2xl ${
          open ? 'block animate-in fade-in slide-in-from-bottom-4 duration-200' : 'hidden'
        }`}
      >
        <ProductAiAssistant
          context={derivedContext}
          onNavigateTab={onNavigateTab}
          onClose={() => setOpen(false)}
        />
      </div>

      {/* Floating Launcher Action Button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close HETVAYA AI assistant' : 'Open HETVAYA AI assistant'}
        className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
        title="Open HETVAYA Product AI Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 transition-transform group-hover:scale-110" />}
      </button>

      {/* Floating Prompt Pill Badge (visible when chatbot is closed) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-20 sm:bottom-5 sm:left-22 z-50 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 text-white border border-indigo-500/40 shadow-2xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-md group animate-in fade-in duration-300"
          title="Click to query FMCG inventory, FEFO batch risks, freight rates & allocations"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-indigo-200 group-hover:text-white transition-colors">Ask HETVAYA AI</span>
          <span className="text-[10px] text-slate-400 font-normal">· FMCG Assistant</span>
        </button>
      )}
    </>
  );
};
