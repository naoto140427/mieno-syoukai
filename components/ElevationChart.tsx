'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

interface Props {
  routeData: [number, number, number][]; // [lng, lat, elevation]
}

export default function ElevationChart({ routeData }: Props) {
  if (!routeData || routeData.length === 0) {
    return null;
  }

  // Check if we have elevation data (third element)
  const hasElevation = routeData[0].length >= 3;
  if (!hasElevation) {
    return null;
  }

  // Prepare data for recharts
  const data = routeData.map((point, index) => ({
    index,
    elevation: Math.max(0, point[2] || 0), // Use 0 if elevation is missing or negative (optional)
  }));

  // Find min and max for y-axis domain to make it look nicer
  const minElev = Math.min(...data.map(d => d.elevation));
  const maxElev = Math.max(...data.map(d => d.elevation));

  // Add some padding
  const yDomain = [Math.max(0, Math.floor(minElev - 50)), Math.ceil(maxElev + 50)];

  return (
    <div className="w-full h-64 mt-8 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        Elevation Profile
      </h3>
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="index" hide={true} />
            <YAxis
              domain={yDomain}
              hide={true}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 p-2 rounded-lg shadow-sm">
                      <p className="text-xs font-bold text-gray-900">{`${Math.round(payload[0].value as number)} m`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorElevation)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
