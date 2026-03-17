'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Kanban, CheckCircle2, Clock, Activity, GripVertical } from 'lucide-react';
import { updateNewsStatus } from '@/app/actions/admin';
import type { News } from '@/types/database';

interface OperationBoardProps {
  isOpen: boolean;
  onClose: () => void;
  operations: News[];
}

export default function OperationBoard({ isOpen, onClose, operations }: OperationBoardProps) {
  const touringOps = operations.filter(op => op.category === 'TOURING');

  // States for lanes
  const [upcoming, setUpcoming] = useState<News[]>([]);
  const [active, setActive] = useState<News[]>([]);
  const [completed, setCompleted] = useState<News[]>([]);

  useEffect(() => {
    setUpcoming(touringOps.filter(op => op.location === 'Upcoming' || !op.location));
    setActive(touringOps.filter(op => op.location === 'Active'));
    setCompleted(touringOps.filter(op => op.location === 'Completed'));
  }, [operations]);

  const handleDragStart = (e: React.DragEvent, id: number, sourceLane: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, sourceLane }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetLane: 'Upcoming' | 'Active' | 'Completed') => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    const { id, sourceLane } = JSON.parse(data);
    if (sourceLane === targetLane) return;

    // Optimistic UI update
    let item: News | undefined;
    if (sourceLane === 'Upcoming') {
        item = upcoming.find(i => i.id === id);
        setUpcoming(prev => prev.filter(i => i.id !== id));
    } else if (sourceLane === 'Active') {
        item = active.find(i => i.id === id);
        setActive(prev => prev.filter(i => i.id !== id));
    } else {
        item = completed.find(i => i.id === id);
        setCompleted(prev => prev.filter(i => i.id !== id));
    }

    if (item) {
        item.location = targetLane;
        if (targetLane === 'Upcoming') setUpcoming(prev => [...prev, item!]);
        else if (targetLane === 'Active') setActive(prev => [...prev, item!]);
        else setCompleted(prev => [...prev, item!]);

        // Backend update
        await updateNewsStatus(id, targetLane);
    }
  };

  const OperationCard = ({ op, lane }: { op: News, lane: string }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, op.id, lane)}
      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 cursor-grab active:cursor-grabbing group transition-colors mb-3"
    >
      <div className="flex items-start gap-3">
        <GripVertical size={16} className="text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{op.title}</h4>
            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(op.date).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full h-[85vh] bg-[#F5F5F7] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.25)] z-50 rounded-t-3xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 text-white rounded-lg">
                  <Kanban size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Operation Board</h2>
                  <p className="text-[10px] text-gray-500 font-mono">Tactical Deployment Control</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto p-8">
              <div className="flex gap-6 min-w-max h-full">

                 {/* Lane: Upcoming */}
                 <div
                   className="w-[320px] bg-gray-200/50 rounded-3xl p-4 flex flex-col"
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, 'Upcoming')}
                 >
                    <div className="flex items-center justify-between mb-4 px-2">
                       <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                           Upcoming
                       </h3>
                       <span className="text-xs font-mono text-gray-400">{upcoming.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-[100px]">
                        {upcoming.map(op => <OperationCard key={op.id} op={op} lane="Upcoming" />)}
                    </div>
                 </div>

                 {/* Lane: Active */}
                 <div
                   className="w-[320px] bg-blue-50/50 rounded-3xl p-4 flex flex-col border border-blue-100"
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, 'Active')}
                 >
                    <div className="flex items-center justify-between mb-4 px-2">
                       <h3 className="text-xs font-bold tracking-widest text-blue-700 uppercase flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                           Active
                       </h3>
                       <span className="text-xs font-mono text-blue-400">{active.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-[100px]">
                        {active.map(op => <OperationCard key={op.id} op={op} lane="Active" />)}
                    </div>
                 </div>

                 {/* Lane: Completed */}
                 <div
                   className="w-[320px] bg-green-50/50 rounded-3xl p-4 flex flex-col border border-green-100"
                   onDragOver={handleDragOver}
                   onDrop={(e) => handleDrop(e, 'Completed')}
                 >
                    <div className="flex items-center justify-between mb-4 px-2">
                       <h3 className="text-xs font-bold tracking-widest text-green-700 uppercase flex items-center gap-2">
                           <CheckCircle2 size={14} className="text-green-500" />
                           Completed
                       </h3>
                       <span className="text-xs font-mono text-green-400">{completed.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-[100px]">
                        {completed.map(op => <OperationCard key={op.id} op={op} lane="Completed" />)}
                    </div>
                 </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
