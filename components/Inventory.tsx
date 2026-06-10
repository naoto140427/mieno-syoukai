"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Package, Plus, X,
  Minus, RefreshCw, CheckCircle2, AlertTriangle, Info,
  ArrowUpDown, CalendarClock, MapPin, Hash
} from "lucide-react";
import { Consumable, Tool } from "@/types/database";
import { updateConsumableLevel, toggleToolStatus, addConsumable, addTool, createInventoryRequest } from "@/app/actions/inventory";

// ─── Types ───────────────────────────────────────────────────────────────────

interface InventoryProps {
  consumables?: Consumable[];
  tools?: Tool[];
  isAdmin?: boolean;
}

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

// ─── Toast Component ──────────────────────────────────────────────────────────

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  const icons = {
    success: <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />,
    error: <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />,
    info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
  };
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-xl rounded-2xl px-4 py-3 min-w-[240px] max-w-xs"
          >
            {icons[t.type]}
            <span className="text-sm font-medium text-gray-800 flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<string, { dot: string; text: string; bg: string }> = {
  Available:   { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50/80" },
  "In Use":    { dot: "bg-blue-400",    text: "text-blue-700",    bg: "bg-blue-50/80"    },
  Maintenance: { dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50/80"   },
  Missing:     { dot: "bg-red-400",     text: "text-red-700",     bg: "bg-red-50/80"     },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Inventory({ consumables = [], tools = [], isAdmin = false }: InventoryProps) {
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool; direction: "asc" | "desc" } | null>(null);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [requestModalTool, setRequestModalTool] = useState<Tool | null>(null);
  const [requestDates, setRequestDates] = useState({ start: "", end: "" });
  const [isRequesting, setIsRequesting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form State
  const [newItemType, setNewItemType] = useState<"consumable" | "tool">("consumable");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", level: 100, max_capacity: 0, unit: "", color: "bg-blue-500",
    spec: "", qty: 1, status: "Available" as Tool["status"], location: "",
  });

  // ── Toast helpers ────────────────────────────────────────────────────────
  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Sorting ──────────────────────────────────────────────────────────────
  const sortedTools = [...tools].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = a[key] ?? ""; const bVal = b[key] ?? "";
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Tool) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleUpdateLevel = async (id: number, delta: number) => {
    if (!isAdmin) return;
    setLoadingAction(id);
    try {
      await updateConsumableLevel(id, delta);
    } catch {
      addToast("error", "在庫レベルの更新に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    if (!isAdmin) return;
    setLoadingAction(id);
    try {
      await toggleToolStatus(id, currentStatus);
      addToast("success", "ステータスを更新しました");
    } catch {
      addToast("error", "ステータスの更新に失敗しました");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRequestDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalTool) return;
    setIsRequesting(true);
    try {
      await createInventoryRequest(requestModalTool.id, requestDates.start, requestDates.end);
      setRequestModalTool(null);
      setRequestDates({ start: "", end: "" });
      addToast("success", "デプロイ申請を送信しました");
    } catch {
      addToast("error", "デプロイ申請の送信に失敗しました");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (newItemType === "consumable") {
        await addConsumable({
          name: formData.name, level: Number(formData.level),
          max_capacity: Number(formData.max_capacity), unit: formData.unit, color: formData.color,
        });
      } else {
        await addTool({
          name: formData.name, spec: formData.spec,
          qty: Number(formData.qty), status: formData.status, location: formData.location,
        });
      }
      setIsModalOpen(false);
      setFormData({ name: "", level: 100, max_capacity: 0, unit: "", color: "bg-blue-500", spec: "", qty: 1, status: "Available", location: "" });
      addToast("success", "資材を追加しました");
    } catch {
      setFormError("追加に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toolColumns = ["name", "spec", "qty", "status", "location"] as const;
  const toolHeaders: Record<typeof toolColumns[number], string> = {
    name: "品名", spec: "仕様/サイズ", qty: "数量", status: "状態", location: "保管場所",
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F5F5F7] min-h-screen p-6 lg:p-12 font-sans">
      <ToastContainer toasts={toasts} remove={removeToast} />

      <div className="max-w-7xl mx-auto space-y-14">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200/80 pb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">MIENO CORP. SYSTEM</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              資材・備品管理
            </h1>
            <p className="text-sm text-gray-500 mt-1.5 font-mono tracking-wider">INVENTORY MANAGEMENT SYSTEM</p>
          </div>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2.5 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              資材を追加
            </motion.button>
          )}
        </div>

        {/* ── Consumables ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">消耗品在庫</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest mt-0.5">CONSUMABLES</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {consumables.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                <Package className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">消耗品データがありません</p>
              </div>
            ) : (
              consumables.map((item, index) => {
                const pct = Math.min(100, Math.max(0, item.level));
                const isLow = pct < 20;
                const remaining = Math.round((item.max_capacity * pct) / 100);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 24 }}
                    className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 relative overflow-hidden flex flex-col gap-4"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Max: {item.max_capacity}{item.unit}</p>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${isLow ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`} />
                    </div>

                    {/* Big Number */}
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black tabular-nums ${isLow ? "text-red-500" : "text-gray-900"}`}>
                        {remaining}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">{item.unit}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.07, ease: "easeOut" }}
                          className={`absolute top-0 left-0 h-full rounded-full ${
                            isLow ? "bg-red-400" : (item.color || "bg-blue-500")
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                        <span>{pct}% 残量</span>
                        {isLow && <span className="text-red-500 font-semibold">⚠ LOW</span>}
                      </div>
                    </div>

                    {/* Admin Controls — slide in on hover */}
                    {isAdmin && (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">補充調整</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateLevel(item.id, -10)}
                            disabled={loadingAction === item.id}
                            className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-40"
                          >
                            {loadingAction === item.id ? <RefreshCw size={12} className="animate-spin" /> : <Minus size={14} />}
                          </button>
                          <button
                            onClick={() => handleUpdateLevel(item.id, 10)}
                            disabled={loadingAction === item.id}
                            className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-100 transition-colors disabled:opacity-40"
                          >
                            {loadingAction === item.id ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={14} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* ── Tools ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-none">整備工具・機材</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest mt-0.5">TOOLS & EQUIPMENT</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {toolColumns.map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-700 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          {toolHeaders[key]}
                          <ArrowUpDown className={`w-3 h-3 ${sortConfig?.key === key ? "text-gray-700" : "text-gray-300"}`} />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                        <Wrench className="w-6 h-6 mx-auto mb-2 opacity-30" />
                        工具・機材データがありません
                      </td>
                    </tr>
                  ) : (
                    sortedTools.map((tool, index) => (
                      <motion.tr
                        key={tool.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.04 }}
                        className="group hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Wrench size={12} className="text-gray-500" />
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">{tool.name}</span>
                          </div>
                        </td>
                        {/* Spec */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">{tool.spec || "—"}</span>
                        </td>
                        {/* Qty */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Hash size={12} className="text-gray-400" />
                            {tool.qty}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={tool.status} />
                        </td>
                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                            <span>{tool.location || "—"}</span>
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isAdmin && (
                              <button
                                onClick={() => handleToggleStatus(tool.id, tool.status)}
                                disabled={loadingAction === tool.id}
                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-40"
                                title="ステータスを切り替え"
                              >
                                {loadingAction === tool.id
                                  ? <RefreshCw size={12} className="animate-spin" />
                                  : <RefreshCw size={12} />
                                }
                                切替
                              </button>
                            )}
                            <button
                              onClick={() => setRequestModalTool(tool)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
                            >
                              <CalendarClock size={12} />
                              申請
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>{/* /max-w */}

      {/* ── Add Item Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">資材を追加</h3>
                  <p className="text-xs text-gray-400 mt-0.5">ADD NEW INVENTORY ITEM</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-5">
                {formError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm flex items-center gap-2">
                    <AlertTriangle size={15} />
                    {formError}
                  </div>
                )}

                {/* Type Toggle */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">種別</label>
                  <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
                    {(["consumable", "tool"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewItemType(t)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                          newItemType === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {t === "consumable" ? "消耗品" : "工具"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">品名</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    placeholder={newItemType === "consumable" ? "例: エンジンオイル" : "例: トルクレンチ"}
                  />
                </div>

                {newItemType === "consumable" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">最大容量</label>
                        <input
                          type="number" required value={formData.max_capacity}
                          onChange={(e) => setFormData({ ...formData, max_capacity: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">単位</label>
                        <input
                          type="text" required value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                          placeholder="L / kg / 本"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">現在レベル (%)</label>
                        <input
                          type="number" required min="0" max="100" value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">カラー</label>
                        <select
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                        >
                          <option value="bg-blue-500">Blue</option>
                          <option value="bg-emerald-500">Green</option>
                          <option value="bg-amber-500">Amber</option>
                          <option value="bg-red-500">Red</option>
                          <option value="bg-purple-500">Purple</option>
                          <option value="bg-gray-500">Gray</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">仕様 / サイズ</label>
                      <input
                        type="text" required value={formData.spec}
                        onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                        placeholder="例: 10mm-24mm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">数量</label>
                        <input
                          type="number" required min="1" value={formData.qty}
                          onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">状態</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as Tool["status"] })}
                          className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                        >
                          <option value="Available">Available</option>
                          <option value="In Use">In Use</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Missing">Missing</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">保管場所</label>
                      <input
                        type="text" required value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F5F5F7] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                        placeholder="例: キャビネット A-2"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}
                    className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors disabled:opacity-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit" disabled={isSubmitting}
                    className="flex-1 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-2xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <><RefreshCw className="w-4 h-4 animate-spin" /> 保存中...</> : "登録する"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Deployment Request Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {requestModalTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRequestModalTool(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md"
            >
              <button
                onClick={() => setRequestModalTool(null)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="mb-8">
                <p className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mb-1">EQUIPMENT REQUEST</p>
                <h2 className="text-2xl font-bold text-gray-900">デプロイ申請</h2>
              </div>

              <div className="mb-6 p-4 bg-[#F5F5F7] rounded-2xl">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">対象機材</p>
                <p className="font-bold text-gray-900">{requestModalTool.name}</p>
                {requestModalTool.spec && <p className="text-xs text-gray-500 font-mono mt-0.5">{requestModalTool.spec}</p>}
              </div>

              <form onSubmit={handleRequestDeployment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">開始日</label>
                    <input
                      type="date" required value={requestDates.start}
                      onChange={(e) => setRequestDates((p) => ({ ...p, start: e.target.value }))}
                      className="w-full bg-[#F5F5F7] border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">終了日</label>
                    <input
                      type="date" required value={requestDates.end}
                      onChange={(e) => setRequestDates((p) => ({ ...p, end: e.target.value }))}
                      className="w-full bg-[#F5F5F7] border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit" disabled={isRequesting}
                  className="w-full mt-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold tracking-widest uppercase text-sm rounded-2xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isRequesting ? <RefreshCw className="animate-spin" size={16} /> : <><CalendarClock size={16} /> SUBMIT REQUEST</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
