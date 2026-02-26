'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Consumable, Tool } from '@/types/database';
import { updateConsumableQuantity, updateToolStatus } from '@/app/actions/logistics';
import { RefreshCw, Plus, Minus, AlertTriangle, CheckCircle, User, Wrench, Package } from 'lucide-react';

interface LogisticsClientProps {
  consumables: Consumable[];
  tools: Tool[];
  isAdmin: boolean;
}

export default function LogisticsClient({ consumables, tools, isAdmin }: LogisticsClientProps) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Consumables Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <Package className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white tracking-wider">
              CONSUMABLES <span className="text-xs text-gray-500 ml-2 font-mono">消耗品在庫</span>
            </h2>
          </div>
          <div className="grid gap-4">
            {consumables.map((item) => (
              <ConsumableItem key={item.id} item={item} isAdmin={isAdmin} />
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white tracking-wider">
              ARSENAL <span className="text-xs text-gray-500 ml-2 font-mono">装備・工具</span>
            </h2>
          </div>
          <div className="grid gap-4">
            {tools.map((tool) => (
              <ToolItem key={tool.id} tool={tool} isAdmin={isAdmin} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsumableItem({ item, isAdmin }: { item: Consumable; isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();
  // Heuristic for max: use max_capacity if available, else 100 if unit is %, else quantity * 1.5 or threshold * 3
  const max = item.max_capacity || (item.unit === '%' ? 100 : (item.threshold ? item.threshold * 3 : 100));
  const quantity = item.quantity ?? item.level ?? 0; // Fallback to level if quantity missing
  const threshold = item.threshold ?? 20;

  const percentage = Math.min(100, Math.max(0, (quantity / max) * 100));
  const isLow = quantity <= threshold;

  const handleUpdate = (delta: number) => {
    startTransition(async () => {
      const newQty = Math.max(0, quantity + delta);
      await updateConsumableQuantity(item.id, newQty);
    });
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 relative overflow-hidden group hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <h3 className="text-white font-medium flex items-center gap-2">
            {item.name}
            {isLow && <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />}
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-1">{item.type || 'SUPPLY'}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-cyan-400 font-bold">
            {quantity}<span className="text-xs text-gray-600 ml-1">{item.unit}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative z-10 mt-2">
        <motion.div
          className={`h-full ${isLow ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Warning Line (Threshold) */}
      <div
        className="absolute bottom-4 top-[3.5rem] w-0.5 bg-red-500/50 z-0 pointer-events-none"
        style={{ left: `${(threshold / max) * 100}%` }}
        title="Warning Threshold"
      />

      {isAdmin && (
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-800/50">
          <button
            disabled={isPending}
            onClick={() => handleUpdate(-1)}
            className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            disabled={isPending}
            onClick={() => handleUpdate(1)}
            className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ToolItem({ tool, isAdmin }: { tool: Tool; isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState(tool.status);
  const [editAssignee, setEditAssignee] = useState(tool.assigned_to || '');

  const statusColors = {
    'Available': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'In Use': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Maintenance': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Missing': 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateToolStatus(tool.id, editStatus, editAssignee || null);
      setIsEditing(false);
    });
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-medium">{tool.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 font-mono bg-gray-800 px-1.5 py-0.5 rounded">{tool.spec}</span>
            {tool.location && <span className="text-xs text-gray-600 font-mono">Loc: {tool.location}</span>}
          </div>
        </div>

        {isAdmin && !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-3 py-1 rounded-full text-xs font-mono border ${statusColors[tool.status] || 'bg-gray-800 text-gray-400'}`}
          >
            {tool.status}
          </button>
        ) : !isAdmin ? (
          <span className={`px-3 py-1 rounded-full text-xs font-mono border ${statusColors[tool.status] || 'bg-gray-800 text-gray-400'}`}>
            {tool.status}
          </span>
        ) : null}
      </div>

      {tool.assigned_to && !isEditing && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 font-mono bg-black/20 p-2 rounded">
          <User className="w-3 h-3" />
          ASSIGNED TO: <span className="text-cyan-400">{tool.assigned_to}</span>
        </div>
      )}

      {/* Admin Edit Mode */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-800 overflow-hidden"
          >
            <div className="grid gap-3">
              <div>
                <label className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-500 outline-none"
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Missing">Missing</option>
                </select>
              </div>

              {(editStatus === 'In Use' || editStatus === 'Maintenance') && (
                <div>
                  <label className="text-[10px] text-gray-500 font-mono uppercase block mb-1">Assigned To / Details</label>
                  <input
                    type="text"
                    value={editAssignee}
                    onChange={(e) => setEditAssignee(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-cyan-500 outline-none"
                    placeholder="Name or details..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="px-3 py-1.5 text-xs bg-cyan-900/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-900 hover:border-cyan-500 rounded flex items-center gap-2"
                >
                  {isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
