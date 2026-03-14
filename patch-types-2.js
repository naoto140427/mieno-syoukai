const fs = require('fs');

// components/ArchiveDetailClient.tsx
let clientCode = fs.readFileSync('components/ArchiveDetailClient.tsx', 'utf8');
clientCode = clientCode.replace(
  /const result = await generateTacticalReport\(archive\);/,
  'const result = await generateTacticalReport(archive as unknown as Record<string, unknown>);'
);
clientCode = clientCode.replace(
  /const geoJsonData: GeoJSON.Feature<GeoJSON.LineString> \| null = hasRoute \? \{/,
  'const routeCoords = (archive.route_data as [number, number][]) || [];\n  const geoJsonData: GeoJSON.Feature<GeoJSON.LineString> | null = hasRoute ? {'
);
clientCode = clientCode.replace(
  /coordinates: archive.route_data/,
  'coordinates: routeCoords'
);
clientCode = clientCode.replace(
  /longitude: archive.route_data\[0\]\[0\],/,
  'longitude: routeCoords[0]?.[0] || 139.6917,'
);
clientCode = clientCode.replace(
  /latitude: archive.route_data\[0\]\[1\],/,
  'latitude: routeCoords[0]?.[1] || 35.6895,'
);
clientCode = clientCode.replace(
  /\{hasRoute && archive.route_data\[0\]\.length >= 3 && \(/,
  '{hasRoute && (archive.route_data as any[])[0]?.length >= 3 && ('
);
clientCode = clientCode.replace(
  /<ElevationChart routeData=\{archive.route_data\} \/>/,
  '<ElevationChart routeData={archive.route_data as [number, number, number][]} />'
);
fs.writeFileSync('components/ArchiveDetailClient.tsx', clientCode);

// components/Archives.tsx
let archivesCode = fs.readFileSync('components/Archives.tsx', 'utf8');
archivesCode = archivesCode.replace(
  /const geoJsonData: GeoJSON.Feature<GeoJSON.LineString> \| null = hasRoute \? \{/,
  'const routeCoords = (archive.route_data as [number, number][]) || [];\n    const geoJsonData: GeoJSON.Feature<GeoJSON.LineString> | null = hasRoute ? {'
);
archivesCode = archivesCode.replace(
  /coordinates: archive.route_data/,
  'coordinates: routeCoords'
);
archivesCode = archivesCode.replace(
  /longitude: archive.route_data\[0\]\[0\],/,
  'longitude: routeCoords[0]?.[0] || 139.6917,'
);
archivesCode = archivesCode.replace(
  /latitude: archive.route_data\[0\]\[1\],/,
  'latitude: routeCoords[0]?.[1] || 35.6895,'
);
fs.writeFileSync('components/Archives.tsx', archivesCode);

// lib/gpx/parser.ts
let parserCode = fs.readFileSync('lib/gpx/parser.ts', 'utf8');
parserCode = parserCode.replace(/let minTime: Date \| null = null;/g, 'let minTime: Date | any = null;');
parserCode = parserCode.replace(/let maxTime: Date \| null = null;/g, 'let maxTime: Date | any = null;');
fs.writeFileSync('lib/gpx/parser.ts', parserCode);
