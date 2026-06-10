'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { m, useInView, animate } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Route, ChevronRight, Layers, Flame } from 'lucide-react';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, LineString, Point, FeatureCollection } from 'geojson';
import type { ArchiveTrack } from '@/app/logistics/page';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const TRACK_COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// route_data は [lng, lat, ele] or [lng, lat] の配列
function toLineString(track: ArchiveTrack): Feature<LineString> | null {
  if (!track.route_data || track.route_data.length < 2) return null;
  return {
    type: 'Feature',
    properties: { id: track.id, title: track.title, date: track.date },
    geometry: {
      type: 'LineString',
      coordinates: (track.route_data as number[][]).map(([lng, lat]) => [lng, lat]),
    },
  };
}

function toHeatmapPoints(tracks: ArchiveTrack[]): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];
  tracks.forEach((track) => {
    if (!track.route_data) return;
    // サンプリング: 10点に1点取得してパフォーマンス最適化
    (track.route_data as number[][]).forEach(([lng, lat], i) => {
      if (i % 5 === 0) {
        features.push({
          type: 'Feature',
          properties: { weight: 1 },
          geometry: { type: 'Point', coordinates: [lng, lat] },
        });
      }
    });
  });
  return { type: 'FeatureCollection', features };
}

// ─── Odometer ─────────────────────────────────────────────────────────────────

function OdometerDigit({ target, delay }: { target: number; delay: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, target, delay]);

  return (
    <div ref={ref} className="inline-block w-[1ch] overflow-hidden">
      <span className="tabular-nums">{display}</span>
    </div>
  );
}

function Odometer({ value }: { value: number }) {
  const str = String(Math.floor(value));
  const digits = str.padStart(Math.max(6, str.length), '0').split('').map(Number);
  return (
    <div className="flex items-baseline gap-0 font-black tracking-[-0.05em] text-[clamp(3.5rem,9vw,8rem)] text-gray-900 leading-none">
      {digits.map((d, i) => (
        <OdometerDigit key={i} target={d} delay={i * 0.08} />
      ))}
      <span className="ml-3 text-2xl font-bold text-gray-400 self-end mb-2">km</span>
    </div>
  );
}

// ─── Elevation Profile from route_data ───────────────────────────────────────

function ElevationProfile({ routeData, color = '#3b82f6' }: {
  routeData: [number, number, number][] | [number, number][] | null;
  color?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-40px' });
  const [pathLength, setPathLength] = useState(0);

  const W = 300; const H = 60;

  // elevation: routeData の3番目の値 (ele)。なければフラット
  const elevations = useMemo(() => {
    if (!routeData || routeData.length === 0) return [0];
    const raw = (routeData as number[][]).map((p) => p[2] ?? 0);
    // ダウンサンプリング (max 100点)
    const step = Math.max(1, Math.floor(raw.length / 100));
    return raw.filter((_, i) => i % step === 0);
  }, [routeData]);

  const max = Math.max(...elevations, 1);
  const min = Math.min(...elevations, 0);
  const range = max - min || 1;

  const coords = elevations.map((v, i) => {
    const x = (i / (elevations.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 8);
    return `${x},${y}`;
  });
  const d = `M ${coords.join(' L ')}`;
  const fill = `${d} L ${W},${H} L 0,${H} Z`;
  const gradId = `grad-${color.replace('#', '')}`;

  useEffect(() => {
    if (ref.current) setPathLength(ref.current.getTotalLength());
  }, [d]);

  return (
    <div ref={containerRef} className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={fill} fill={`url(#${gradId})`} />
        <path
          ref={ref}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength || 0,
            strokeDashoffset: inView ? 0 : pathLength || 0,
            transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}
        />
      </svg>
      {max > 0 && (
        <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-0.5">
          <span>{Math.round(min)}m</span>
          <span>↑ {Math.round(max)}m</span>
        </div>
      )}
    </div>
  );
}

// ─── Mapbox Map ───────────────────────────────────────────────────────────────

type MapMode = 'heatmap' | 'routes';

function LogisticsMap({ tracks, activeTrackId, onTrackClick }: {
  tracks: ArchiveTrack[];
  activeTrackId: number | null;
  onTrackClick: (id: number | null) => void;
}) {
  const [viewState, setViewState] = useState({
    longitude: 133.5,
    latitude: 33.5,
    zoom: 5,
    pitch: 30,
    bearing: 0,
  });
  const [mapMode, setMapMode] = useState<MapMode>('heatmap');

  // ヒートマップ用ポイント (全tracks)
  const heatmapData = useMemo(() => toHeatmapPoints(tracks), [tracks]);

  // 全ルートのラインGeoJSON
  const allLinesGeoJSON = useMemo((): FeatureCollection<LineString> => ({
    type: 'FeatureCollection',
    features: tracks
      .map(toLineString)
      .filter((f): f is Feature<LineString> => f !== null),
  }), [tracks]);

  // アクティブルート
  const activeLineGeoJSON = useMemo((): FeatureCollection<LineString> => {
    if (!activeTrackId) return { type: 'FeatureCollection', features: [] };
    const track = tracks.find((t) => t.id === activeTrackId);
    const f = track ? toLineString(track) : null;
    return { type: 'FeatureCollection', features: f ? [f] : [] };
  }, [tracks, activeTrackId]);


  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-red-400 font-mono text-sm gap-2">
        <span className="text-2xl animate-pulse">SYSTEM OFFLINE</span>
        <span className="text-gray-500 text-xs">MAPBOX_TOKEN not found</span>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      {...viewState}
      onMove={(evt: { viewState: typeof viewState }) => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      attributionControl={false}
      reuseMaps
    >
      {/* ── Heatmap mode ──────────────────────────────────────────── */}
      {mapMode === 'heatmap' && tracks.length > 0 && (
        <Source id="heatmap-pts" type="geojson" data={heatmapData}>
          <Layer
            id="travel-heatmap"
            type="heatmap"
            maxzoom={12}
            paint={{
              'heatmap-weight': 1,
              'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 12, 4],
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0,   'rgba(0,0,80,0)',
                0.1, 'rgba(0,60,200,0.5)',
                0.3, 'rgba(0,200,200,0.8)',
                0.5, 'rgba(255,200,0,0.9)',
                0.7, 'rgba(255,100,0,1)',
                1,   'rgba(255,0,0,1)',
              ],
              'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 4, 8, 8, 20, 12, 40],
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.9, 12, 0],
            }}
          />
          {/* 高ズームでの軌跡ライン表示 */}
          <Layer
            id="track-circle"
            type="circle"
            minzoom={10}
            paint={{
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 5],
              'circle-color': '#f97316',
              'circle-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0, 11, 0.8],
              'circle-stroke-width': 0,
            }}
          />
        </Source>
      )}

      {/* ── Routes mode ───────────────────────────────────────────── */}
      {mapMode === 'routes' && (
        <>
          <Source id="all-lines" type="geojson" data={allLinesGeoJSON}>
            <Layer
              id="all-lines-glow"
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#3b82f6',
                'line-width': 6,
                'line-blur': 5,
                'line-opacity': activeTrackId ? 0.1 : 0.4,
              }}
            />
            <Layer
              id="all-lines-stroke"
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#60a5fa',
                'line-width': 1.5,
                'line-opacity': activeTrackId ? 0.2 : 0.8,
              }}
            />
          </Source>

          {/* アクティブトラック（ハイライト）*/}
          {activeTrackId && (
            <Source id="active-line" type="geojson" data={activeLineGeoJSON}>
              <Layer
                id="active-glow"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#f97316',
                  'line-width': 14,
                  'line-blur': 10,
                  'line-opacity': 0.7,
                }}
              />
              <Layer
                id="active-line"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{
                  'line-color': '#fb923c',
                  'line-width': 3,
                  'line-opacity': 1,
                }}
              />
            </Source>
          )}
        </>
      )}

      {/* HQ Marker */}
      <Marker longitude={131.61} latitude={33.23} anchor="bottom">
        <div className="flex flex-col items-center pointer-events-none">
          <div className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded mb-0.5 whitespace-nowrap shadow-lg">
            HQ 大分
          </div>
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        </div>
      </Marker>

      {/* ── UI Overlay ─────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={() => setMapMode('heatmap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all border ${
            mapMode === 'heatmap'
              ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
              : 'bg-black/60 backdrop-blur-md text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          <Flame size={11} /> Heatmap
        </button>
        <button
          onClick={() => setMapMode('routes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all border ${
            mapMode === 'routes'
              ? 'bg-blue-500 text-white border-blue-400 shadow-lg'
              : 'bg-black/60 backdrop-blur-md text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          <Layers size={11} /> Routes
        </button>
        {activeTrackId && (
          <button
            onClick={() => onTrackClick(null)}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-black/60 backdrop-blur-md text-gray-400 border border-white/10 hover:text-white transition-all"
          >
            ✕ 解除
          </button>
        )}
      </div>

      {/* 凡例 */}
      {mapMode === 'heatmap' && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">走行頻度</p>
            <div className="w-24 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #003cb4, #00c8c8, #ffc800, #ff6400, #ff0000)' }} />
            <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
              <span>低</span><span>高</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md text-[10px] font-mono text-gray-400 px-3 py-1.5 rounded-xl border border-white/10">
          {tracks.length} TRACKS · LAT {viewState.latitude.toFixed(2)} LNG {viewState.longitude.toFixed(2)}
        </div>
      </div>
    </Map>
  );
}

// ─── Activity Card (Strava-like) ──────────────────────────────────────────────

function ActivityCard({ track, index, color, isActive, onClick }: {
  track: ArchiveTrack;
  index: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
      onClick={onClick}
      className={`bg-white rounded-3xl p-5 shadow-sm border-2 flex flex-col gap-3 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'border-orange-400 shadow-orange-100 shadow-md scale-[1.01]'
          : 'border-gray-100/80 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5 font-mono">
              {track.date}
            </p>
            <h3 className="text-sm font-bold text-gray-900 truncate">{track.title}</h3>
          </div>
        </div>
        {track.distance_km && (
          <span className="text-xs font-black text-gray-900 tabular-nums flex-shrink-0">
            {track.distance_km.toFixed(1)}<span className="text-gray-400 font-normal ml-0.5">km</span>
          </span>
        )}
      </div>

      {/* Elevation Profile from real GPX data */}
      {track.route_data && (track.route_data as number[][])[0]?.[2] !== undefined && (
        <ElevationProfile routeData={track.route_data} color={color} />
      )}

      {/* Location */}
      {track.location_name && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="truncate">{track.location_name}</span>
        </div>
      )}
    </m.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyTracks() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
      <Route className="w-8 h-8 mx-auto mb-3 text-gray-300" />
      <p className="text-sm font-bold text-gray-400">GPX軌跡データなし</p>
      <p className="text-xs text-gray-400 mt-1">作戦記録にGPXファイルをアップロードすると<br />地図上に走行軌跡が表示されます</p>
      <Link
        href="/archives"
        className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
      >
        作戦記録へ <ChevronRight size={12} />
      </Link>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Logistics({ tracks }: { tracks: ArchiveTrack[] }) {
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  const handleTrackClick = useCallback((id: number | null) => {
    setActiveTrackId((prev) => (prev === id ? null : id));
  }, []);

  // 集計
  const totalDistanceKm = useMemo(
    () => tracks.reduce((sum, t) => sum + (t.distance_km ?? 0), 0),
    [tracks]
  );

  const totalPoints = useMemo(
    () => tracks.reduce((sum, t) => sum + (t.route_data?.length ?? 0), 0),
    [tracks]
  );

  return (
    <ClientMotionWrapper>
      <div className="bg-[#F5F5F7] min-h-screen font-sans">

        {/* ── Hero / Odometer ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
              MIENO CORP. — STRATEGIC LOGISTICS DIVISION
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-2">
              広域兵站
            </h1>
            <p className="text-lg text-gray-500 font-light mb-12">LOGISTICS & FIELD OPERATIONS</p>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100/80 mb-4">
              <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase mb-6 flex items-center gap-2">
                <Route size={14} />
                累積走破距離
              </p>
              <Odometer value={totalDistanceKm || 24530} />
              <div className="mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">記録作戦数</p>
                  <p className="text-2xl font-black text-gray-900">
                    {tracks.length}<span className="text-sm font-normal text-gray-400 ml-1">ops</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">GPS記録点数</p>
                  <p className="text-2xl font-black text-gray-900">
                    {totalPoints > 0 ? (totalPoints / 1000).toFixed(1) : '—'}
                    <span className="text-sm font-normal text-gray-400 ml-1">K pts</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">稼働機体数</p>
                  <p className="text-2xl font-black text-gray-900">
                    4<span className="text-sm font-normal text-gray-400 ml-1">units</span>
                  </p>
                </div>
              </div>
            </div>
          </m.div>
        </section>

        {/* ── Mapbox Map（フル幅）────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-8">
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-900 rounded-[2rem] overflow-hidden shadow-xl border border-gray-800"
            style={{ height: '560px' }}
          >
            <LogisticsMap
              tracks={tracks}
              activeTrackId={activeTrackId}
              onTrackClick={handleTrackClick}
            />
          </m.div>

          {tracks.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-3 font-mono">
              GPXデータが記録された作戦がありません — 作戦記録からGPXをアップロードしてください
            </p>
          )}
        </section>

        {/* ── Activity Cards ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-none">走行ログ</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest mt-0.5">
                GPS ACTIVITY RECORDS · {tracks.length} ops
              </p>
            </div>
          </m.div>

          {tracks.length === 0 ? (
            <EmptyTracks />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tracks.map((track, i) => (
                <ActivityCard
                  key={track.id}
                  track={track}
                  index={i}
                  color={TRACK_COLORS[i % TRACK_COLORS.length]}
                  isActive={activeTrackId === track.id}
                  onClick={() => handleTrackClick(track.id)}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link
              href="/archives"
              className="flex items-center justify-between bg-gray-900 text-white rounded-3xl px-6 py-5 hover:bg-gray-800 transition-colors group"
            >
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">OPERATION RECORDS</p>
                <p className="font-bold">作戦記録・GPXアップロード</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/units"
              className="flex items-center justify-between bg-white border border-gray-200 text-gray-900 rounded-3xl px-6 py-5 hover:shadow-md transition-all group"
            >
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">DATABASE LINK</p>
                <p className="font-bold">機体データベース</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </m.div>
        </section>

      </div>
    </ClientMotionWrapper>
  );
}
