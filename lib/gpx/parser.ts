import GpxParser from "gpxparser";
import { getSpeed } from "geolib";

export interface ParsedGPXData {
  distance: number; // km
  maxElevation: number; // m
  maxSpeed: number; // km/h
  routeData: [number, number][]; // [lng, lat]
  centerPoint: [number, number]; // [lng, lat]
}

export const parseGPX = (gpxString: string): ParsedGPXData => {
  const gpx = new GpxParser();
  gpx.parse(gpxString);

  // 1. Calculate Total Distance (km)
  // gpxparser calculates total distance in meters.
  // We sum up distances of all tracks.
  const totalDistanceMeters = gpx.tracks.reduce((acc, track) => acc + track.distance.total, 0);
  const distanceKm = totalDistanceMeters / 1000;

  // 2. Extract Points & Max Elevation
  let maxElevation = 0;
  const allPoints: { lat: number; lon: number; ele: number; time?: Date }[] = [];

  gpx.tracks.forEach((track) => {
    track.points.forEach((point) => {
      // Update max elevation
      if (point.ele > maxElevation) {
        maxElevation = point.ele;
      }

      allPoints.push({
        lat: point.lat,
        lon: point.lon,
        ele: point.ele,
        time: point.time,
      });
    });
  });

  // 3. Calculate Max Speed (km/h)
  let maxSpeedKmh = 0;

  // Only calculate if we have time data and at least 2 points
  if (allPoints.length > 1) {
    for (let i = 0; i < allPoints.length - 1; i++) {
      const p1 = allPoints[i];
      const p2 = allPoints[i+1];

      if (p1.time && p2.time) {
        try {
            // geolib.getSpeed returns meters/second based on coordinates and timestamps
            // We need to convert Dates to timestamps (number)
            const speedMs = getSpeed(
                { latitude: p1.lat, longitude: p1.lon, time: p1.time.getTime() },
                { latitude: p2.lat, longitude: p2.lon, time: p2.time.getTime() }
            );

            // Convert to km/h
            const speedKmh = speedMs * 3.6;

            // Filter unrealistic speeds (e.g., GPS drift > 300km/h)
            if (speedKmh > maxSpeedKmh && speedKmh < 300) {
                maxSpeedKmh = speedKmh;
            }
        } catch (e) {
            // In case of any calculation error, skip point
            console.warn("Speed calculation error", e);
        }
      }
    }
  }

  // 4. Generate Route Data for Mapbox ([lng, lat])
  const routeData: [number, number][] = allPoints.map((p) => [p.lon, p.lat]);

  // 5. Determine Center Point (Middle of the route)
  let centerPoint: [number, number] = [0, 0];
  if (allPoints.length > 0) {
      const midIndex = Math.floor(allPoints.length / 2);
      centerPoint = [allPoints[midIndex].lon, allPoints[midIndex].lat];
  }

  return {
    distance: parseFloat(distanceKm.toFixed(2)),
    maxElevation: parseFloat(maxElevation.toFixed(1)),
    maxSpeed: parseFloat(maxSpeedKmh.toFixed(1)),
    routeData,
    centerPoint,
  };
};
