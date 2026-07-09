import GpxParser from "gpxparser";
import { getSpeed } from "geolib";

export interface ParsedGPXData {
  distance: number; // km
  maxElevation: number; // m
  minElevation: number; // m
  maxSpeed: number; // km/h
  durationTime: string; // HH:MM:SS
  movingTime: string; // HH:MM:SS
  stoppedTime: string; // HH:MM:SS
  avgSpeed: number; // km/h
  movingAvgSpeed: number; // km/h
  elevationGain: number; // m
  routeData: [number, number, number][]; // [lng, lat]
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

  // 2. Extract Points, Max/Min Elevation, Duration & Elevation Gain
  let maxElevation = -Infinity;
  let minElevation = Infinity;
  let elevationGain = 0;
  let minTime: Date | null = null;
  let maxTime: Date | null = null;
  const allPoints: { lat: number; lon: number; ele: number; time?: Date }[] = [];

  gpx.tracks.forEach((track) => {
    let previousPoint: { ele: number } | null = null;
    track.points.forEach((point) => {
      // Update max/min elevation
      if (point.ele > maxElevation) {
        maxElevation = point.ele;
      }
      if (point.ele < minElevation) {
        minElevation = point.ele;
      }

      // Calculate elevation gain
      if (previousPoint && point.ele > previousPoint.ele) {
        elevationGain += (point.ele - previousPoint.ele);
      }
      previousPoint = point;

      // Update min/max time
      if (point.time) {
        if (!minTime || point.time.getTime() < minTime.getTime()) minTime = point.time;
        if (!maxTime || point.time.getTime() > maxTime.getTime()) maxTime = point.time;
      }

      allPoints.push({
        lat: point.lat,
        lon: point.lon,
        ele: point.ele,
        time: point.time,
      });
    });
  });

  // Calculate Duration Time (HH:MM:SS)
  let durationTime = "00:00:00";
  let durationHours = 0;
  if (minTime && maxTime) {
    const diffMs = (maxTime as Date).getTime() - (minTime as Date).getTime();
    if (diffMs > 0) {
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      durationTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      durationHours = diffMs / (1000 * 60 * 60);
    }
  }

  // Calculate Average Speed
  let avgSpeed = 0;
  if (durationHours > 0) {
    avgSpeed = distanceKm / durationHours;
  }

  if (maxElevation === -Infinity) maxElevation = 0;
  if (minElevation === Infinity) minElevation = 0;

  // 3. Calculate Max Speed (km/h) and Telemetry
  let maxSpeedKmh = 0;
  let movingSeconds = 0;
  let stoppedSeconds = 0;
  const WINDOW_SECONDS = 3; // Sliding window for speed smoothing to avoid GPS drift spikes

  if (allPoints.length > 1) {
    for (let i = 0; i < allPoints.length - 1; i++) {
      const p1 = allPoints[i];
      const p2 = allPoints[i+1];

      if (p1.time && p2.time) {
        const timeDiffSeconds = (p2.time.getTime() - p1.time.getTime()) / 1000;
        
        // Instantaneous speed to classify as moving/stopped
        try {
            const instSpeedMs = getSpeed(
                { latitude: p1.lat, longitude: p1.lon, time: p1.time.getTime() },
                { latitude: p2.lat, longitude: p2.lon, time: p2.time.getTime() }
            );
            const instSpeedKmh = instSpeedMs * 3.6;
            
            // Assume < 3km/h is stopped
            if (instSpeedKmh > 3) {
                movingSeconds += timeDiffSeconds;
            } else {
                stoppedSeconds += timeDiffSeconds;
            }
        } catch (e) {
            // Ignore calc errors
        }

        // Sliding window max speed calculation
        let j = i + 1;
        while (j < allPoints.length && allPoints[j].time && ((allPoints[j].time!.getTime() - p1.time.getTime()) < WINDOW_SECONDS * 1000)) {
            j++;
        }
        
        if (j < allPoints.length && allPoints[j].time) {
             const pw = allPoints[j];
             try {
                 const windowSpeedMs = getSpeed(
                     { latitude: p1.lat, longitude: p1.lon, time: p1.time.getTime() },
                     { latitude: pw.lat, longitude: pw.lon, time: pw.time!.getTime() }
                 );
                 const windowSpeedKmh = windowSpeedMs * 3.6;
                 
                 // Realistic motorcycle max speed limit is around 300km/h
                 if (windowSpeedKmh > maxSpeedKmh && windowSpeedKmh < 300) {
                     maxSpeedKmh = windowSpeedKmh;
                 }
             } catch (e) {}
        }
      }
    }
  }

  const formatTime = (totalSeconds: number) => {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const movingTime = formatTime(movingSeconds);
  const stoppedTime = formatTime(stoppedSeconds);
  const movingHours = movingSeconds / 3600;
  let movingAvgSpeed = 0;
  if (movingHours > 0) {
      movingAvgSpeed = distanceKm / movingHours;
  }

  // 4. Generate Route Data for Mapbox ([lng, lat])
  const routeData: [number, number, number][] = allPoints.map((p) => [p.lon, p.lat, p.ele || 0]);

  // 5. Determine Center Point (Middle of the route)
  let centerPoint: [number, number] = [0, 0];
  if (allPoints.length > 0) {
      const midIndex = Math.floor(allPoints.length / 2);
      centerPoint = [allPoints[midIndex].lon, allPoints[midIndex].lat];
  }

  return {
    distance: parseFloat(distanceKm.toFixed(2)),
    maxElevation: parseFloat(maxElevation.toFixed(1)),
    minElevation: parseFloat(minElevation.toFixed(1)),
    maxSpeed: parseFloat(maxSpeedKmh.toFixed(1)),
    durationTime,
    movingTime,
    stoppedTime,
    avgSpeed: parseFloat(avgSpeed.toFixed(1)),
    movingAvgSpeed: parseFloat(movingAvgSpeed.toFixed(1)),
    elevationGain: parseFloat(elevationGain.toFixed(1)),
    routeData,
    centerPoint,
  };
};
