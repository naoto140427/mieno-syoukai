"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Package, AlertCircle, Plus, X, Search, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";

// Types
type Consumable = {
  id: string;
  name: string;
  level: number; // percentage
  max: number;
  unit: string;
  color: string;
};

type Tool = {
  id: string;
  name: string;
  spec: string;
  qty: number;
  status: "Available" | "In Use" | "Maintenance" | "Missing";
  location: string;
};

// Mock Data
const initialConsumables: Consumable[] = [
  { id: "c1", name: "Engine Oil (10W-40)", level: 85, max: 200, unit: "L", color: "bg-amber-500" },
  { id: "c2", name: "Brake Fluid (DOT4)", level: 45, max: 50, unit: "L", color: "bg-red-500" },
  { id: "c3", name: "Coolant (LLC)", level: 92, max: 100, unit: "L", color: "bg-green-500" },
  { id: "c4", name: "Chain Lube", level: 30, max: 20, unit: "Cans", color: "bg-blue-500" },
  { id: "c5", name: "Shop Towels", level: 12, max: 50, unit: "Rolls", color: "bg-gray-500" },
];

const initialTools: Tool[] = [
  { id: "t1", name: "Socket Set (Metric)", spec: "8mm - 24mm", qty: 2, status: "Available", location: "Cab A-1" },
  { id: "t2", name: "Torque Wrench", spec: "10-60 Nm", qty: 1, status: "In Use", location: "Workbench 2" },
  { id: "t3", name: "Paddock Stand", spec: "Rear", qty: 3, status: "Available", location: "Floor Area C" },
  { id: "t4", name: "Impact Driver", spec: "18V", qty: 2, status: "Maintenance", location: "Repair Bay" },
  { id: "t5", name: "Digital Multimeter", spec: "Fluke 117", qty: 1, status: "Available", location: "Cab B-3" },
  { id: "t6", name: "Allen Key Set", spec: "1.5mm - 10mm", qty: 4, status: "Available", location: "Cab A-2" },
  { id: "t7", name: "Oil Filter Wrench", spec: "65mm", qty: 1, status: "Missing", location: "Unknown" },
];

export default function Inventory() {
  const [consumables, setConsumables] = useState<Consumable[]>(initialConsumables);
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool; direction: "asc" | "desc" } | null>(null);

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

  return (
    <div className="min-h-screen bg-mieno-gray p-6 lg:p-12 font-sans text-mieno-text">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-mieno-navy tracking-tight">Resource & Inventory</h1>
            <p className="text-gray-500 mt-1">Equipment status and supply levels dashboard.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-mieno-navy text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-mieno-navy/90 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add Resource</span>
          </button>
        </div>

        {/* Consumables Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-mieno-navy" />
            <h2 className="text-xl font-bold text-mieno-navy">Consumables Status</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consumables.map((item, index) => (
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
                    <p className="text-sm text-gray-400">Max Capacity: {item.max}{item.unit}</p>
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
                    {Math.round((item.max * item.level) / 100)}{item.unit}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-6 h-6 text-mieno-navy" />
            <h2 className="text-xl font-bold text-mieno-navy">Equipment & Tools</h2>
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
                          {key.charAt(0).toUpperCase() + key.slice(1)}
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
                  {sortedTools.map((tool, index) => (
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
                  ))}
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
                <h3 className="text-xl font-bold text-mieno-navy">Add Resource</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all" placeholder="e.g. Engine Oil" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity / Level</label>
                    <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all" placeholder="L, kg, pcs" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mieno-navy focus:border-transparent outline-none transition-all">
                    <option>Consumable</option>
                    <option>Tool / Equipment</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-mieno-navy text-white font-medium rounded-lg shadow-md hover:bg-mieno-navy/90 transition-colors"
                >
                  Confirm Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
