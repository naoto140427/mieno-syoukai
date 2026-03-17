'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Pin, FileText, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LiveEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveEditor({ isOpen, onClose }: LiveEditorProps) {
  const [content, setContent] = useState('# 新規通達\n\nここにマークダウンで内容を入力します。\n\n- リスト1\n- リスト2');
  const [title, setTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [category, setCategory] = useState<'UPDATE' | 'PRESS' | 'REPORT' | 'TOURING'>('UPDATE');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-[#F5F5F7] z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Strategic Live Editor</h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
               {/* Category Toggles */}
               <div className="flex bg-gray-100 p-1 rounded-xl">
                 {(['UPDATE', 'PRESS', 'REPORT', 'TOURING'] as const).map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setCategory(cat)}
                     className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-lg transition-all ${
                       category === cat ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>

               {/* Pin Toggle */}
               <button
                 onClick={() => setIsPinned(!isPinned)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                   isPinned ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                 }`}
               >
                 <Pin size={16} className={isPinned ? 'fill-current' : ''} />
                 Pinned
               </button>

               {/* Save */}
               <button
                 onClick={() => alert('保存処理を実装')}
                 className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
               >
                 <Save size={16} />
                 Deploy
               </button>
            </div>
          </header>

          {/* Split View */}
          <div className="flex-1 flex overflow-hidden">
             {/* Left: Editor */}
             <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
                <input
                  type="text"
                  placeholder="Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-6 text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:outline-none focus:ring-0"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Markdown format supported..."
                  className="flex-1 w-full p-6 text-base text-gray-700 font-mono placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 resize-none bg-transparent"
                />
             </div>

             {/* Right: Preview */}
             <div className="w-1/2 bg-[#F5F5F7] overflow-y-auto p-12 flex justify-center">
                 <div className="w-full max-w-[600px] bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-widest uppercase">
                            {category}
                        </span>
                        {isPinned && <Pin size={16} className="text-amber-500 fill-current" />}
                        <span className="text-xs text-gray-400 font-mono ml-auto">
                            {new Date().toLocaleDateString('ja-JP')}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                        {title || 'Untitled'}
                    </h1>

                    <div className="prose prose-gray max-w-none">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                       </ReactMarkdown>
                    </div>
                 </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
