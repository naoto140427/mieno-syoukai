"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  X, UploadCloud, Map as MapIcon, Zap, Mountain,
  Activity, Check, Calendar, Users, MapPin, Loader2, Gauge
} from "lucide-react";
import { parseGPX, ParsedGPXData } from "@/lib/gpx/parser";
import { getLocationName } from "@/lib/gpx/geocoding";
import { Archive } from "@/types/database";

type Phase = "idle" | "analyzing" | "preview";

interface TacticalDropzoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Archive, "id">) => Promise<void>;
}

const LOADING_TEXTS = [
  "🛰 衛星リンク確立中...",
  "📍 軌跡データを抽出中...",
  "📊 テレメトリー解析中...",
  "✅ 解析完了"
];

export default function TacticalDropzoneModal({ isOpen, onClose, onSave }: TacticalDropzoneModalProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedGPXData | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [members, setMembers] = useState<number>(1);
  const [weather, setWeather] = useState<Archive["weather"]>("Clear");
  const [details, setDetails] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase("idle");
      setLoadingTextIndex(0);
      setParsedData(null);
      setLocationName("");
      setTitle("");
      setDate(new Date().toISOString().split("T")[0]);
      setMembers(1);
      setWeather("Clear");
      setDetails("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Loading text rotation effect
  useEffect(() => {
    if (phase === "analyzing") {
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev < LOADING_TEXTS.length - 1 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    // Default title from filename if not set
    if (!title) {
      setTitle(file.name.replace(/\.gpx$/i, ""));
    }

    setPhase("analyzing");
    setLoadingTextIndex(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseGPX(text);
        setParsedData(parsed);

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
        let loc = "Unknown Location";
        if (token && parsed.centerPoint) {
          loc = await getLocationName(parsed.centerPoint[0], parsed.centerPoint[1], token);
        }
        setLocationName(loc);

        // Wait a bit to show off the cool loading sequence
        setTimeout(() => {
          setPhase("preview");
        }, 2500);
      } catch (err) {
        console.error("GPX Parsing error:", err);
        alert("Failed to parse GPX file.");
        setPhase("idle");
      }
    };
    reader.readAsText(file);
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/gpx+xml": [".gpx"],
      "text/xml": [".gpx"]
    },
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedData) return;

    setIsSubmitting(true);
    try {
      const archiveData: Omit<Archive, "id"> = {
        title: title || "Untitled Operation",
        date,
        distance: `${parsedData.distance} km`,
        members,
        weather,
        details: details || "No details provided.",
        distance_km: parsedData.distance,
        max_speed: parsedData.maxSpeed,
        max_elevation: parsedData.maxElevation,
        route_data: parsedData.routeData,
        location_name: locationName,
      };

      await onSave(archiveData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                Tactical Data Upload
                <span className="block text-[10px] text-gray-400 font-normal">タクティカル・データ入稿</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {phase === "idle" && (
                <div
                  {...getRootProps()}
                  className={`
                    w-full h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                    ${isDragActive ? "border-cyan-400 bg-cyan-50/50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? "bg-cyan-100 text-cyan-600" : "bg-gray-100 text-gray-400"}`}>
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">GPXファイルをここにドロップして作戦記録を解析</p>
                  <p className="text-sm text-gray-400">またはクリックしてファイルを選択</p>
                </div>
              )}

              {phase === "analyzing" && (
                <div className="w-full h-80 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-gray-100 border-t-cyan-500 rounded-full mb-8"
                  />
                  <motion.p
                    key={loadingTextIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium text-gray-900 tracking-wide"
                  >
                    {LOADING_TEXTS[loadingTextIndex]}
                  </motion.p>
                </div>
              )}

              {phase === "preview" && parsedData && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Telemetry Preview Badges */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Extracted Telemetry</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <Gauge className="w-5 h-5 text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Distance</span>
                        <span className="text-lg font-bold text-gray-900">{parsedData.distance} <span className="text-xs font-normal text-gray-500">km</span></span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <Zap className="w-5 h-5 text-amber-500 mb-2" />
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Max Speed</span>
                        <span className="text-lg font-bold text-gray-900">{parsedData.maxSpeed.toFixed(0)} <span className="text-xs font-normal text-gray-500">km/h</span></span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <Mountain className="w-5 h-5 text-blue-400 mb-2" />
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Max Elev</span>
                        <span className="text-lg font-bold text-gray-900">{parsedData.maxElevation.toFixed(0)} <span className="text-xs font-normal text-gray-500">m</span></span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <MapPin className="w-5 h-5 text-red-500 mb-2" />
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Location</span>
                        <span className="text-sm font-bold text-gray-900 truncate w-full px-2" title={locationName}>{locationName || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Operation Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all"
                          placeholder="e.g. Operation Nightfall"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date</label>
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Weather</label>
                          <select
                            value={weather}
                            onChange={e => setWeather(e.target.value as Archive["weather"])}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all text-gray-900 appearance-none"
                          >
                            <option value="Clear">Clear</option>
                            <option value="Rainy">Rainy</option>
                            <option value="Cloudy">Cloudy</option>
                            <option value="Snow">Snow</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Members</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={members}
                          onChange={e => setMembers(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Operation Details</label>
                      <textarea
                        required
                        value={details}
                        onChange={e => setDetails(e.target.value)}
                        rows={7}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all resize-none"
                        placeholder="Describe the operation..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          SUBMITTING...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          SUBMIT DATA
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
