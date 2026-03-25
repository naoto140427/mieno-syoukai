'use client';

import React from 'react';
import Map, { Source, Layer, LayerProps } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ArchiveMapProps {
  mapboxToken: string;
  initialView: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  geoJsonData: GeoJSON.Feature<GeoJSON.LineString> | null;
}

const routeLayerStyle: LayerProps = {
  id: 'route',
  type: 'line',
  paint: {
    'line-color': '#06b6d4',
    'line-width': 4,
    'line-opacity': 0.8,
  },
};

export default function ArchiveMap({ mapboxToken, initialView, geoJsonData }: ArchiveMapProps) {
  return (
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
  );
}
