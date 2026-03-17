'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, AlertTriangle, Shield, Save } from 'lucide-react';
import { saveGlobalSettings, getGlobalSettings } from '@/app/actions/admin';

interface GlobalOverrideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalOverride({ isOpen, onClose }: GlobalOverrideProps) {
  const [emergencyBanner, setEmergencyBanner] = useState(false);
  const [aiStrictness, setAiStrictness] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isLoaded) {
      getGlobalSettings().then(data => {
        setEmergencyBanner(data.emergency_banner);
        setAiStrictness(data.ai_persona_strictness);
        setIsLoaded(true);
      });
    }
  }, [isOpen, isLoaded]);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveGlobalSettings(emergencyBanner, aiStrictness);
    if (!result.success) {
      alert('Failed to save settings.');
    }
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 text-white rounded-xl backdrop-blur-md">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Global Override</h2>
                    <p className="text-[10px] text-gray-400 font-mono">System-wide Settings</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8 bg-[#F5F5F7]">

                {/* Emergency Banner Toggle */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-2xl ${emergencyBanner ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'} transition-colors`}>
                        <AlertTriangle size={24} />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Emergency Banner</h3>
                        <p className="text-xs text-gray-500">Display site-wide alert</p>
                     </div>
                  </div>
                  <button
                    onClick={() => setEmergencyBanner(!emergencyBanner)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${emergencyBanner ? 'bg-red-500' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${emergencyBanner ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* AI Strictness Slider */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
                        <Shield size={24} />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">AI Persona Strictness</h3>
                        <p className="text-xs text-gray-500">Adjust AI response tone</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Casual</span>
                        <span>Strict</span>
                     </div>
                     <input
                       type="range"
                       min="0"
                       max="100"
                       value={aiStrictness}
                       onChange={(e) => setAiStrictness(Number(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                     />
                     <div className="text-center">
                        <span className="text-2xl font-bold text-gray-900 font-mono">{aiStrictness}</span>
                        <span className="text-xs text-gray-400 ml-1">%</span>
                     </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 bg-white border-t border-gray-100">
                 <button
                   onClick={handleSave}
                   disabled={isSaving || !isLoaded}
                   className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                 >
                   {isSaving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                   ) : (
                     <>
                        <Save size={18} />
                        Save Configuration
                     </>
                   )}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
