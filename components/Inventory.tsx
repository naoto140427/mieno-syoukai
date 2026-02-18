"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Package, AlertCircle, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Consumable, Tool } from "@/types/database";

export default function Inventory() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool; direction: "asc" | "desc" } | null>(null);

  // Data Fetching
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [consumablesRes, toolsRes] = await Promise.all([
        supabase.from('consumables').select('*').order('id', { ascending: true }),
        supabase.from('tools').select('*').order('id', { ascending: true })
      ]);

      if (consumablesRes.error) throw consumablesRes.error;
      if (toolsRes.error) throw toolsRes.error;

      // Ensure types match what component expects
      // Note: DB returns id as number, component handles it.
      // We assume 'level' in DB is percentage 0-100 as per mock data convention
      // We map 'max_capacity' to match usage if needed, but we'll update usage to 'max_capacity'

      setConsumables(consumablesRes.data as Consumable[]);
      setTools(toolsRes.data as Tool[]);
    } catch (err: unknown) {
      console.error('Error fetching inventory:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message || 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  // Sorting Logic
  const sortedTools = [...tools].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Tool) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Admin Modal Submit Handler (Optional, keeping consistent with replacing mocks)
  const handleAddItem = async (e: React.FormEvent) => {
      // Logic for adding items could go here if implemented,
      // but primary requirement is Admin page integration.
      // For now, we'll just close modal or implement a basic insert if needed.
      e.preventDefault();
      setIsModalOpen(false);
      // Implementation of this specific modal is not the primary task (Admin page is),
      // but to avoid broken UI, we could implement it.
      // Given scope, I'll leave it as a UI placeholder or basic close.
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mieno-gray flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-mieno-navy/30 border-t-mieno-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-mieno-gray flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data Retrieval Failed</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchData}
                    className="bg-mieno-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-mieno-navy/90 transition-all"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-mieno-gray p-6 lg:p-12 font-sans text-mieno-text">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-mieno-navy tracking-tight">
              資材・備品管理
              <span className="block text-sm text-gray-500 font-mono tracking-wider mt-1">INVENTORY</span>
            </h1>
            <p className="text-gray-500 mt-1">Equipment status and supply levels dashboard.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-mieno-navy text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-mieno-navy/90 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>資材を追加</span>
          </button>
        </div>

        {/* Consumables Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-mieno-navy" />
            <h2 className="text-xl font-bold text-mieno-navy">
              消耗品在庫
              <span className="ml-2 text-xs text-gray-400 font-mono uppercase tracking-wider">CONSUMABLES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consumables.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                    No consumables data available.
                </div>
            ) : (
                consumables.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-400">Max Capacity: {item.max_capacity}{item.unit}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${item.level < 20 ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                    </div>

                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                        className={`absolute top-0 left-0 h-full ${item.color} rounded-full`}
                    />
                    </div>

                    <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-500">{item.level}% Remaining</span>
                    <span className="text-mieno-navy font-bold">
                        {Math.round((item.max_capacity * item.level) / 100)}{item.unit}
                    </span>
                    </div>
                </motion.div>
                ))
            )}
          </div>
        </section>

        {/* Tools Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-6 h-6 text-mieno-navy" />
            <h2 className="text-xl font-bold text-mieno-navy">
              整備工具・機材
              <span className="ml-2 text-xs text-gray-400 font-mono uppercase tracking-wider">TOOLS</span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {["name", "spec", "qty", "status", "location"].map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key as keyof Tool)}
                        className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                      >
                        <div className="flex items-center gap-1">
                          {{ name: "品名", spec: "仕様/サイズ", qty: "数量", status: "状態", location: "保管場所" }[key]}
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 -mb-1 ${sortConfig?.key === key && sortConfig.direction === 'asc' ? 'text-mieno-navy' : 'text-gray-300'}`} />
                            <ChevronDown className={`w-3 h-3 ${sortConfig?.key === key && sortConfig.direction === 'desc' ? 'text-mieno-navy' : 'text-gray-300'}`} />
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tools.length === 0 ? (
                      <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No tools data available.</td>
                      </tr>
                  ) : (
                    sortedTools.map((tool, index) => (
                        <motion.tr
                        key={tool.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 transition-colors"
                        >
                        <td className="px-6 py-4 font-medium text-gray-900">{tool.name}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{tool.spec}</td>
                        <td className="px-6 py-4 text-gray-600">{tool.qty}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${tool.status === 'Available' ? 'bg-green-50 text-green-700 border-green-200' :
                                tool.status === 'In Use' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                tool.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-red-50 text-red-700 border-red-200'
                            }`}
                            >
                            {tool.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm flex items-center gap-2">
                            {tool.location}
                        </td>
                        </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>

      {/* Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-mieno-navy">資材を追加</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Note: This form is currently illustrative/mock as per scope focus on Admin page integration. */}
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">品名 / 名称</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all" placeholder="e.g. Engine Oil" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">数量 / 残量</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">単位</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all" placeholder="L, kg, pcs" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">種別</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all">
                    <option>Consumable</option>
                    <option>Tool / Equipment</option>
                  </select>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                    キャンセル
                    </button>
                    <button
                    type="submit"
                    className="px-6 py-2 bg-mieno-navy text-white font-medium rounded-lg shadow-md hover:bg-mieno-navy/90 transition-colors"
                    >
                    登録する
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
