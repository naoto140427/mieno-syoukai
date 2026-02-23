"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CloudRain, Calendar, Plus, Save, FileJson, Gauge, Cloud, Sun, AlertCircle, Edit2, Trash2, X } from "lucide-react";
import { Archive } from "@/types/database";
import { addArchive, updateArchive, deleteArchive } from "@/app/actions/archives";

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case "Clear": return <Sun className="w-4 h-4 text-amber-400" />;
    case "Rainy": return <CloudRain className="w-4 h-4 text-blue-400" />;
    case "Cloudy": return <Cloud className="w-4 h-4 text-gray-400" />;
    default: return <Sun className="w-4 h-4 text-amber-400" />;
  }
};

interface ArchivesProps {
    archives?: Archive[];
    isAdmin?: boolean;
}

export default function Archives({ archives = [], isAdmin = false }: ArchivesProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Archive>>({
    title: "",
    date: new Date().toISOString().split('T')[0],
    distance: "0km",
    members: 1,
    weather: "Clear",
    details: "",
    geojson: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
        title: "",
        date: new Date().toISOString().split('T')[0],
        distance: "0km",
        members: 1,
        weather: "Clear",
        details: "",
        geojson: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (archive: Archive) => {
      setFormData(archive);
      setEditingId(archive.id);
      setShowForm(true);
      // Scroll to top or form
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: number) => {
      if (!confirm("Are you sure you want to delete this mission log?")) return;
      try {
          await deleteArchive(id);
      } catch (e) {
          console.error(e);
          alert("Failed to delete archive");
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
        const payload = {
            title: formData.title || "Untitled Operation",
            date: formData.date || new Date().toISOString().split('T')[0],
            distance: formData.distance || "0km",
            members: Number(formData.members) || 1,
            weather: (formData.weather as "Clear" | "Rainy" | "Cloudy" | "Snow") || "Clear",
            details: formData.details || "",
            geojson: formData.geojson || null
        };

        if (editingId) {
            await updateArchive(editingId, payload);
        } else {
            await addArchive(payload);
        }

        resetForm();
    } catch (err: unknown) {
        console.error('Error submitting log:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        alert('Failed to save log: ' + message);
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-6 lg:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mieno-navy/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter mb-2 glitch-text">
              作戦記録保管庫
              <span className="block text-lg text-cyan-500 font-mono tracking-widest mt-1">ARCHIVES</span>
            </h1>
            <p className="text-cyan-500/80 text-sm tracking-widest uppercase">
              :: Secure Data Storage // Access Level: 3 ::
            </p>
          </div>
          {isAdmin && (
            <button
                onClick={() => {
                    if (showForm && editingId) {
                        resetForm(); // If cancelling edit
                    } else {
                        setShowForm(!showForm);
                        if (!showForm) resetForm(); // Ensure clean state when opening
                    }
                }}
                className="group flex items-center gap-2 px-5 py-2 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 uppercase text-xs font-bold tracking-wider"
            >
                <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm && !editingId ? "rotate-45" : ""}`} />
                {showForm ? "キャンセル" : "新規記録作成"}
            </button>
          )}
        </div>

        {/* Form Area (Add/Edit) */}
        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-cyan-500/30 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
                {editingId && (
                    <div className="absolute top-2 right-2 text-xs text-amber-500 font-bold border border-amber-500/50 px-2 py-0.5 rounded bg-amber-900/20">
                        EDITING MODE
                    </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">作戦名</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="e.g. Operation: Dawnbreaker"
                      disabled={submitting}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">日時</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">天候</label>
                        <select
                            name="weather"
                            value={formData.weather}
                            onChange={handleInputChange}
                            className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                            disabled={submitting}
                        >
                            <option value="Clear">Clear (晴れ)</option>
                            <option value="Cloudy">Cloudy (曇り)</option>
                            <option value="Rainy">Rainy (雨)</option>
                            <option value="Snow">Snow (雪)</option>
                        </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">走行距離</label>
                        <input
                            name="distance"
                            value={formData.distance}
                            onChange={handleInputChange}
                            className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                            placeholder="e.g. 120km"
                            disabled={submitting}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">参加人数</label>
                        <input
                            type="number"
                            name="members"
                            value={formData.members}
                            onChange={handleInputChange}
                            className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                            min={1}
                            disabled={submitting}
                        />
                      </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">詳細レポート</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="Enter mission parameters..."
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs uppercase text-cyan-500 mb-1 flex items-center gap-2">
                      <FileJson className="w-3 h-3" />
                      GPSログデータ (GeoJSON)
                    </label>
                    <textarea
                      name="geojson"
                      value={formData.geojson || ''}
                      onChange={handleInputChange}
                      className="flex-1 w-full bg-black/50 border border-cyan-900/30 text-cyan-300/70 font-mono text-xs px-4 py-2 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                      placeholder='{ "type": "FeatureCollection", "features": [...] }'
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {editingId ? "変更を保存" : "記録を保存"}
                        </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Archives List */}
        <div className="grid grid-cols-1 gap-8">
            {archives.length === 0 ? (
                <div className="text-center py-12 border border-white/10 rounded-lg text-gray-500 bg-white/5">
                    No mission logs found.
                </div>
            ) : (
                archives.map((archive, index) => (
                    <motion.div
                    key={archive.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors duration-300 rounded-sm overflow-hidden"
                    >
                    <div className="flex flex-col lg:flex-row">

                        {/* Map Placeholder Area */}
                        <div className="w-full lg:w-1/3 h-64 lg:h-auto bg-black/40 border-b lg:border-b-0 lg:border-r border-white/10 relative flex items-center justify-center group-hover:bg-black/60 transition-colors">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                            <div className="border-2 border-dashed border-gray-700 w-3/4 h-3/4 flex items-center justify-center rounded-lg">
                            <span className="text-xs uppercase tracking-widest font-bold">地図描画エリア</span>
                            </div>
                        </div>
                        {/* Cyberpunk Map Decor */}
                        <div className="absolute bottom-2 right-2 text-[10px] text-cyan-900 font-mono">
                            LOG_ID: {archive.id}
                        </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative">
                            {/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(archive)}
                                        className="p-2 bg-blue-900/30 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(archive.id)}
                                        className="p-2 bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-bold text-cyan-500 border border-cyan-900/50 px-2 py-0.5 rounded bg-cyan-950/30">
                                    LOG_ID: {String(archive.id).padStart(4, '0')}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {archive.date}
                                </span>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                {archive.title}
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                                {archive.details}
                                </p>
                            </div>

                            {/* Telemetry Badges */}
                            <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full">
                                <Gauge className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs text-gray-300 font-mono">{archive.distance}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full">
                                <Users className="w-3 h-3 text-purple-400" />
                                <span className="text-xs text-gray-300 font-mono">{archive.members} operatives</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full">
                                <WeatherIcon condition={archive.weather} />
                                <span className="text-xs text-gray-300 font-mono">{archive.weather}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
