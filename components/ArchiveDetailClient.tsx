'use client';

import React, { useState } from 'react';
import { Archive } from '@/types/database';
import { motion, Variants } from 'framer-motion';
import Map, { Source, Layer, LayerProps } from 'react-map-gl/mapbox';
import { MapPin, Calendar, Gauge, Zap, Mountain, Users, Cloud, Sun, CloudRain, Snowflake, ArrowLeft, Clock, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ElevationChart from './ElevationChart';
import { generateTacticalReport } from '@/app/actions/report';
import { Bot } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props {
  archive: Archive;
  isAdmin?: boolean;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case 'Clear': return <Sun className="w-5 h-5 text-amber-500" />;
    case 'Rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
    case 'Snow': return <Snowflake className="w-5 h-5 text-sky-300" />;
    case 'Cloudy':
    default: return <Cloud className="w-5 h-5 text-gray-400" />;
  }
};

const routeLayerStyle: LayerProps = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': '#06b6d4',
    'line-width': 4,
    'line-opacity': 0.8,
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function ArchiveDetailClient({ archive, isAdmin }: Props) {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const result = await generateTacticalReport(archive as unknown as Record<string, unknown>);
      if (result.success && result.report) {
        setAiReport(result.report);
      } else {
        setAiError(result.error || 'レポートの生成に失敗しました');
      }
    } catch {
      setAiError('予期せぬエラーが発生しました');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const mapboxToken = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '') : '';



  const hasRoute = archive.route_data && Array.isArray(archive.route_data) && archive.route_data.length > 0;

  const routeCoords = (archive.route_data as [number, number][]) || [];
  const geoJsonData: GeoJSON.Feature<GeoJSON.LineString> | null = hasRoute ? {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: routeCoords
    },
    properties: {}
  } : null;

  const initialView = hasRoute ? {
    longitude: routeCoords[0]?.[0] || 139.6917,
    latitude: routeCoords[0]?.[1] || 35.6895,
    zoom: 12
  } : {
    longitude: 139.6917, // Default Tokyo
    latitude: 35.6895,
    zoom: 10
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 selection:bg-gray-200">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
        <Link
          href="/archives"
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all border border-gray-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO ARCHIVES
        </Link>
      </div>

      {/* Hero Map Section */}
      <div className="w-full h-[45vh] relative bg-gray-200 overflow-hidden">
        {mapboxToken && hasRoute ? (
          <Map
            mapboxAccessToken={mapboxToken}
            initialViewState={initialView}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            scrollZoom={false}
            attributionControl={false}
            reuseMaps
          >
            {geoJsonData && (
              <Source id="route-detail" type="geojson" data={geoJsonData}>
              <Layer {...routeLayerStyle} />
            </Source>
            )}
          </Map>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
             <MapPin className="w-12 h-12 mb-4 opacity-50" />
             <span className="text-sm font-medium tracking-widest uppercase">No Route Data Available</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-16 -mt-10 relative z-10">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          {/* Header Section */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full bg-gray-50">
                    LOG #{String(archive.id).padStart(3, '0')}
                  </span>
                  {archive.location_name && (
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {archive.location_name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {archive.date}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                  {archive.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 shrink-0">
                 <WeatherIcon condition={archive.weather || "Clear"} />
                 <span className="text-sm font-medium text-gray-700">{archive.weather || "Clear"}</span>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5" /> Distance
                </span>
                <span className="text-2xl font-semibold text-gray-900">{archive.distance_km ? `${archive.distance_km} km` : archive.distance}</span>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Max Speed
                </span>
                <span className="text-2xl font-semibold text-gray-900">
                  {archive.max_speed ? `${archive.max_speed.toFixed(0)} km/h` : 'N/A'}
                </span>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> Avg Speed
                </span>
                <span className="text-2xl font-semibold text-gray-900">
                  {archive.avg_speed ? `${archive.avg_speed.toFixed(0)} km/h` : 'N/A'}
                </span>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-green-500" /> Duration
                </span>
                <span className="text-2xl font-semibold text-gray-900">
                  {archive.duration_time ? archive.duration_time : 'N/A'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-indigo-400" /> Max Elevation
                </span>
                <span className="text-2xl font-semibold text-gray-900">
                  {archive.max_elevation ? `${archive.max_elevation.toFixed(0)} m` : 'N/A'}
                </span>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" /> Elev Gain
                </span>
                <span className="text-2xl font-semibold text-gray-900">
                  {archive.elevation_gain ? `${archive.elevation_gain.toFixed(0)} m` : 'N/A'}
                </span>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Crew
                </span>
                <div className="flex items-center mt-1">
                  {archive.members && Array.isArray(archive.members) ? (
                    <div className="flex -space-x-2">
                      {archive.members.map((member, idx) => (
                        <div
                          key={idx}
                          title={member}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm"
                        >
                          {member.charAt(0)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-2xl font-semibold text-gray-900">{archive.members || '1'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

            {/* Elevation Chart */}
            {hasRoute && (archive.route_data as any[])[0]?.length >= 3 && (
              <ElevationChart routeData={archive.route_data as [number, number, number][]} />
            )}

        </motion.div>

        {/* Mission Report */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">
              Mission Report
            </h3>
            <div className="max-w-3xl mx-auto prose prose-lg prose-gray">
              <p className="text-lg text-gray-700 leading-loose whitespace-pre-wrap">
                {archive.details}
              </p>
            </div>
          </div>
        </motion.div>


        {/* AI Tactical Report Section */}
        {isAdmin && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#06b6d4]" />
                  AI Tactical Analysis
                </h3>
                {!aiReport && (
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingAi}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingAi ? '🛰 AIと通信中...' : '🤖 Generate Tactical Report'}
                  </button>
                )}
              </div>

              {aiError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100">
                  {aiError}
                </div>
              )}

              {aiReport ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="prose prose-lg prose-gray max-w-3xl mx-auto"
                >
                  <p className="text-lg text-gray-800 leading-loose whitespace-pre-wrap font-serif">
                    {aiReport}
                  </p>
                </motion.div>
              ) : (
                !isGeneratingAi && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Bot className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium tracking-widest uppercase">No AI Analysis Generated Yet</p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
