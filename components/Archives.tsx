"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CloudRain, Calendar, Plus, Save, FileJson, Gauge, Cloud, Sun, Edit2, Trash2 } from "lucide-react";
import { Archive } from "@/types/database";
import { addArchive, updateArchive, deleteArchive } from "@/app/actions/archives";

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case "Clear": return <Sun className="w-4 h-4 text-amber-500" />;
    case "Rainy": return <CloudRain className="w-4 h-4 text-blue-500" />;
    case "Cloudy": return <Cloud className="w-4 h-4 text-gray-400" />;
    case "Snow": return <Cloud className="w-4 h-4 text-sky-300" />;
    default: return <Sun className="w-4 h-4 text-amber-500" />;
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
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              作戦記録
            </h1>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
              Archives
            </p>
          </div>
          {isAdmin && (
            <button
                onClick={() => {
                    if (showForm && editingId) {
                        resetForm();
                    } else {
                        setShowForm(!showForm);
                        if (!showForm) resetForm();
                    }
                }}
                className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 rounded-full text-xs font-bold tracking-wide"
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
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative">
                {editingId && (
                    <div className="absolute top-4 right-4 text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                        EDITING MODE
                    </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-transparent text-gray-900 px-4 py-3 text-sm rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      placeholder="e.g. Operation: Dawnbreaker"
                      disabled={submitting}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-transparent text-gray-900 px-4 py-3 text-sm rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Weather</label>
                        <select
                            name="weather"
                            value={formData.weather}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-transparent text-gray-900 px-4 py-3 text-sm rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none"
                            disabled={submitting}
                        >
                            <option value="Clear">Clear (晴れ)</option>
                            <option value="Cloudy">Cloudy (曇り)</option>
                            <option value="Rainy">Rainy (雨)</option>
                            <option value="Snow">Snow (雪)</option>
                        </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Distance</label>
                        <input
                            name="distance"
                            value={formData.distance}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-transparent text-gray-900 px-4 py-3 text-sm rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                            placeholder="e.g. 120km"
                            disabled={submitting}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Members</label>
                        <input
                            type="number"
                            name="members"
                            value={formData.members}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-transparent text-gray-900 px-4 py-3 text-sm rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                            min={1}
                            disabled={submitting}
                        />
                      </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Details</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-gray-50 border border-transparent text-gray-900 px-4 py-3 text-sm rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Enter mission parameters..."
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <FileJson className="w-3 h-3" />
                      GeoJSON Data
                    </label>
                    <textarea
                      name="geojson"
                      value={formData.geojson || ''}
                      onChange={handleInputChange}
                      className="flex-1 w-full bg-gray-50 border border-transparent text-gray-600 font-mono text-xs px-4 py-3 rounded-lg focus:bg-white focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                      placeholder='{ "type": "FeatureCollection", "features": [...] }'
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {submitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {editingId ? "Update Log" : "Save Log"}
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
                <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400">
                    <p className="text-sm font-medium">No archives found.</p>
                </div>
            ) : (
                archives.map((archive, index) => (
                    <motion.div
                    key={archive.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden"
                    >
                    <div className="flex flex-col lg:flex-row h-full">

                        {/* Map Placeholder Area */}
                        <div className="w-full lg:w-1/3 h-64 lg:h-auto bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 relative flex items-center justify-center">
                            <div className="text-gray-300 flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-200/50 flex items-center justify-center">
                                    <Cloud className="w-6 h-6 text-gray-400" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Map View</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-white">
                            {/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(archive)}
                                        className="p-2 bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(archive.id)}
                                        className="p-2 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-200 px-2 py-0.5 rounded-full bg-gray-50">
                                    LOG #{String(archive.id).padStart(3, '0')}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {archive.date}
                                </span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                                {archive.title}
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                                {archive.details}
                                </p>
                            </div>

                            {/* Telemetry Badges */}
                            <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                                <Gauge className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-600 font-medium">{archive.distance}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-600 font-medium">{archive.members} members</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                                <WeatherIcon condition={archive.weather} />
                                <span className="text-xs text-gray-600 font-medium">{archive.weather}</span>
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
