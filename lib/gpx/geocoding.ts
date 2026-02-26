export const getLocationName = async (
  lng: number,
  lat: number,
  mapboxToken: string
): Promise<string> => {
  try {
    // Reverse Geocoding API
    // We request types: 'place', 'locality', 'road' to get meaningful names like "Shinjuku", "Route 246", etc.
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality,road&limit=1&access_token=${mapboxToken}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // Return the most relevant name (usually the first feature)
      return data.features[0].text;
    }

    return "Unknown Location";
  } catch (error) {
    console.error("Geocoding failed:", error);
    return "Unknown Location";
  }
};
