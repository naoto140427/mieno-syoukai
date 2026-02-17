'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
// @ts-expect-error react-map-gl/mapbox exports are not correctly typed in v8
import Map, { Source, Layer, LineLayer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// Coordinates
const START_POINT = [131.75, 33.20]; // Oita (Miyagawachi)
const END_POINT = [138.65, 35.70];   // Yamanashi (Hottarakashi Onsen approx)

// GeoJSON for the route
import type { Feature, LineString } from 'geojson';
const routeGeoJSON: Feature<LineString> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [START_POINT, END_POINT]
  }
};

const layerStyle: LineLayer = {
  id: 'route-line',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#06b6d4', // cyan-500
    'line-width': 4,
    'line-blur': 0
  }
};

const glowLayerStyle: LineLayer = {
  id: 'route-glow',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#22d3ee', // cyan-400
    'line-width': 12,
    'line-blur': 8,
    'line-opacity': 0.6
  }
};

const Logistics = () => {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [viewState, setViewState] = useState({
    longitude: 135.5,
    latitude: 34.5,
    zoom: 4.8,
    pitch: 45,
    bearing: 0
  });

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6 overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Glow Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 w-full h-full">

        {/* Text Content (Left / Top) */}
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <h3 className="text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase">
                Strategic Logistics Division
              </h3>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">広域展開作戦</span>
              <span className="block text-xl md:text-2xl mt-2 font-mono text-gray-600 tracking-widest">LOGISTICS</span>
            </h2>

            <div className="space-y-6 text-gray-300 font-light">
              {/* Mission Details Card */}
              <div className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                   <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9.553 2.276A1 1 0 009 2.118v1.764"></path></svg>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-400">作戦名</span>
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">CODE</span>
                    </h4>
                    <p className="text-xl text-white font-medium tracking-wide">Yuru-Camp (Mar 2026)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-400">予定日程</span>
                        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">SCHEDULE</span>
                      </h4>
                      <p className="text-sm text-cyan-100 font-mono">2026.03.02 - 03.04</p>
                    </div>
                    <div>
                      <h4 className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-400">投入機体</span>
                        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">ASSET</span>
                      </h4>
                      <p className="text-sm text-cyan-100 font-mono">SERENA LUXION (2025)</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-400">ルート</span>
                      <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">ROUTE</span>
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-300">
                      大分（宮河内ベース） 〜 山梨・長野エリア<br/>
                      <span className="text-xs text-gray-500">（ほったらかし温泉周辺・富士五湖エリア）</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                     <h4 className="flex items-baseline gap-2 mb-2">
                       <span className="text-sm font-bold text-gray-400">作戦目的</span>
                       <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">OBJECTIVE</span>
                     </h4>
                     <ul className="list-disc list-inside text-sm space-y-1 text-gray-400 marker:text-cyan-500">
                       <li>単独長距離機動におけるProPILOT 2.0のデータ収集および兵站（ロジスティクス）の最適化テスト。</li>
                       <li>聖地巡礼フィールドワークおよび野営（キャンプ）適性の検証。</li>
                     </ul>
                  </div>
                </div>
              </div>

              {/* Added Button */}
              <div className="mt-8">
                <Link href="/units" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 font-mono text-sm tracking-wider rounded-lg hover:bg-cyan-900/40 hover:border-cyan-500/60 transition-all duration-300 group">
                  <span className="font-bold">機体データベースへアクセス</span>
                  <span className="text-[10px] opacity-70">ACCESS DATABASE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Map Visualization (Right / Bottom) */}
        <div className="w-full lg:w-1/2 aspect-[4/3] relative rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-[0_0_40px_rgba(0,0,0,0.5)]">

           {/* Fallback / Offline UI */}
           {!mapboxToken ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm z-30">
               <div className="text-red-500 font-mono text-2xl tracking-widest animate-pulse mb-2">SYSTEM OFFLINE</div>
               <div className="text-gray-400 font-mono text-xs">MAP DATA UNAVAILABLE</div>
               <div className="mt-4 px-4 py-2 border border-red-900/50 bg-red-900/20 rounded text-red-400 font-mono text-xs">
                 ERROR: MISSING_ACCESS_TOKEN
               </div>
               <div className="mt-8 text-center px-8 text-gray-500 text-xs">
                 <p>To initialize visualization system:</p>
                 <code className="block mt-2 bg-black p-2 rounded border border-gray-800">NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx...</code>
               </div>
             </div>
           ) : (
            <Map
                mapboxAccessToken={mapboxToken}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: '100%', height: '100%'}}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                attributionControl={false}
                reuseMaps
            >
                <Source id="route-data" type="geojson" data={routeGeoJSON}>
                    <Layer {...glowLayerStyle} />
                    <Layer {...layerStyle} />
                </Source>
            </Map>
           )}

           <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay pointer-events-none z-20"></div>

           {/* UI Elements */}
           <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
             <span className="text-[10px] font-mono text-cyan-500 tracking-widest animate-pulse">SYSTEM STATUS: {mapboxToken ? 'ONLINE' : 'OFFLINE'}</span>
             <span className="text-[10px] font-mono text-gray-600">LAT: {viewState.latitude.toFixed(4)} N / LNG: {viewState.longitude.toFixed(4)} E</span>
           </div>

           <div className="absolute bottom-4 right-4 z-20 text-right pointer-events-none">
             <span className="text-[10px] font-mono text-cyan-500 tracking-widest block">TARGET ACQUISITION</span>
             <span className="text-[10px] font-mono text-gray-600">DISTANCE: 850KM (EST)</span>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Logistics;
