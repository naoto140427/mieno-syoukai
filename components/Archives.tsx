"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, CloudRain, Calendar, Plus, Save, FileJson, Gauge, Cloud, Sun } from "lucide-react";

// Types
type Archive = {
  id: string;
  title: string;
  date: string;
  distance: string;
  members: number;
  weather: "Clear" | "Rainy" | "Cloudy" | "Snow";
  details: string;
};

// Mock Data
const initialArchives: Archive[] = [
  {
    id: "op-001",
    title: "Operation: Yuru-Camp (Vanguard)",
    date: "2023-11-15",
    distance: "350km",
    members: 4,
    weather: "Clear",
    details: "High-speed deployment to Fuji Five Lakes sector. Primary objective: Camp site security and nutrient acquisition.",
  },
  {
    id: "op-002",
    title: "Project: Night Run (Stealth)",
    date: "2023-12-01",
    distance: "120km",
    members: 2,
    weather: "Rainy",
    details: "Urban reconnaissance under low-visibility conditions. Testing waterproof capabilities of Unit-01.",
  },
  {
    id: "op-003",
    title: "Mission: Seaside (Coastline)",
    date: "2024-01-10",
    distance: "200km",
    members: 3,
    weather: "Cloudy",
    details: "Coastal patrol along Route 134. Traffic density: High. Evasion maneuvers executed.",
  },
];

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case "Clear": return <Sun className="w-4 h-4 text-amber-400" />;
    case "Rainy": return <CloudRain className="w-4 h-4 text-blue-400" />;
    case "Cloudy": return <Cloud className="w-4 h-4 text-gray-400" />;
    default: return <Sun className="w-4 h-4 text-amber-400" />;
  }
};

export default function Archives() {
  const [archives, setArchives] = useState<Archive[]>(initialArchives);
  const [showForm, setShowForm] = useState(false);

  // New Log State
  const [newLog, setNewLog] = useState({
    title: "",
    date: "",
    details: "",
    geojson: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewLog({ ...newLog, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate and push to DB
    const log: Archive = {
      id: `op-${Date.now()}`,
      title: newLog.title || "New Operation",
      date: newLog.date || new Date().toISOString().split('T')[0],
      distance: "0km", // Mock
      members: 1, // Mock
      weather: "Clear", // Mock
      details: newLog.details,
    };
    setArchives([log, ...archives]);
    setShowForm(false);
    setNewLog({ title: "", date: "", details: "", geojson: "" });
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
              OPERATION ARCHIVES
            </h1>
            <p className="text-cyan-500/80 text-sm tracking-widest uppercase">
              :: Secure Data Storage // Access Level: 3 ::
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="group flex items-center gap-2 px-5 py-2 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 uppercase text-xs font-bold tracking-wider"
          >
            <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? "rotate-45" : ""}`} />
            {showForm ? "Cancel Entry" : "New Log Entry"}
          </button>
        </div>

        {/* New Log Form Area */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Operation Title</label>
                    <input
                      name="title"
                      value={newLog.title}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="e.g. Operation: Dawnbreaker"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newLog.date}
                        onChange={handleInputChange}
                        className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-1">Status</label>
                      <div className="w-full bg-black/50 border border-white/10 text-gray-500 px-4 py-2 text-sm cursor-not-allowed">
                        AUTO-LOGGING
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Mission Details</label>
                    <textarea
                      name="details"
                      value={newLog.details}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-black/50 border border-white/10 text-white px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="Enter mission parameters..."
                    />
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs uppercase text-cyan-500 mb-1 flex items-center gap-2">
                      <FileJson className="w-3 h-3" />
                      GPS Log Data (GeoJSON)
                    </label>
                    <textarea
                      name="geojson"
                      value={newLog.geojson}
                      onChange={handleInputChange}
                      className="flex-1 w-full bg-black/50 border border-cyan-900/30 text-cyan-300/70 font-mono text-xs px-4 py-2 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                      placeholder='{ "type": "FeatureCollection", "features": [...] }'
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Archive Data
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Archives List */}
        <div className="grid grid-cols-1 gap-8">
          {archives.map((archive, index) => (
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
                       <span className="text-xs uppercase tracking-widest font-bold">Map Rendering Area</span>
                     </div>
                   </div>
                   {/* Cyberpunk Map Decor */}
                   <div className="absolute bottom-2 right-2 text-[10px] text-cyan-900 font-mono">
                     LAT: 35.6895 N / LNG: 139.6917 E
                   </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold text-cyan-500 border border-cyan-900/50 px-2 py-0.5 rounded bg-cyan-950/30">
                        LOG_ID: {archive.id.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {archive.date}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {archive.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
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
          ))}
        </div>
      </div>
    </div>
  );
}
