"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MyLocationOutlined, PlaceOutlined, Search } from "@mui/icons-material";
import styles from "./checkout.module.css";

export interface PickedLocation {
  lat: number;
  lng: number;
  /** From OpenStreetMap, when the pin falls on a known street. */
  street?: string;
  area?: string;
}

interface LocationPickerProps {
  value?: { lat: number; lng: number };
  onPick: (location: PickedLocation) => void;
}

// Central Beirut, where the map opens before the shopper places a pin.
const START: [number, number] = [33.8938, 35.5018];
const NOMINATIM = "https://nominatim.openstreetmap.org";
const PIN = `<svg width="34" height="44" viewBox="0 0 24 31" aria-hidden="true"><path d="M12 30S1 19 1 11.5a11 11 0 0 1 22 0C23 19 12 30 12 30Z" fill="#2a231e"/><circle cx="12" cy="11.5" r="4" fill="#f6f2eb"/></svg>`;

interface NominatimAddress {
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  village?: string;
  town?: string;
  city?: string;
}

/** Street and area names for a point, from OpenStreetMap's free geocoder. */
async function describe(
  lat: number,
  lng: number,
): Promise<Pick<PickedLocation, "street" | "area">> {
  try {
    const response = await fetch(
      `${NOMINATIM}/reverse?format=jsonv2&accept-language=en&zoom=18&lat=${lat}&lon=${lng}`,
    );
    if (!response.ok) return {};
    const { address = {} } = (await response.json()) as { address?: NominatimAddress };
    const district = address.neighbourhood ?? address.suburb ?? address.quarter;
    const place = address.city ?? address.town ?? address.village;
    return {
      street: address.road,
      area: [place, district].filter(Boolean).join(", ") || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * The delivery pin. Shoppers search for an area, use their current location, or tap the
 * map; the pin can be dragged. Leaflet and OpenStreetMap need no API key.
 */
export default function LocationPicker({ value, onPick }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const placeRef = useRef<(lat: number, lng: number) => void>(() => undefined);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  // Keep the latest callback without rebuilding the map.
  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  });

  useEffect(() => {
    let cancelled = false;
    // Leaflet touches `window` on import, so it loads in the browser only.
    import("leaflet").then((L) => {
      const container = containerRef.current;
      if (cancelled || !container) return;
      const map = L.map(container, { scrollWheelZoom: false }).setView(
        value ? [value.lat, value.lng] : START,
        value ? 17 : 14,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      const icon = L.divIcon({
        className: "",
        html: PIN,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
      });

      const place = (lat: number, lng: number) => {
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else {
          markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
          markerRef.current.on("dragend", () => {
            const point = markerRef.current?.getLatLng();
            if (point) placeRef.current(point.lat, point.lng);
          });
        }
        onPickRef.current({ lat, lng });
        describe(lat, lng).then((names) => {
          if (!cancelled) onPickRef.current({ lat, lng, ...names });
        });
      };
      placeRef.current = place;
      map.on("click", (event) => place(event.latlng.lat, event.latlng.lng));
      if (value) place(value.lat, value.lng);
      mapRef.current = map;
      // The container can still be settling when Leaflet measures it; measure again.
      requestAnimationFrame(() => map.invalidateSize());
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // The map is built once; later pins move the marker instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveTo = (lat: number, lng: number) => {
    mapRef.current?.setView([lat, lng], 17);
    placeRef.current(lat, lng);
  };

  const search = async () => {
    if (!query.trim()) return;
    setStatus("Searching…");
    try {
      const response = await fetch(
        `${NOMINATIM}/search?format=jsonv2&countrycodes=lb&limit=1&accept-language=en&q=${encodeURIComponent(query)}`,
      );
      const [result] = response.ok
        ? ((await response.json()) as { lat: string; lon: string }[])
        : [];
      if (!result) {
        setStatus("We couldn’t find that place. Try an area or a street name.");
        return;
      }
      setStatus("");
      moveTo(Number(result.lat), Number(result.lon));
    } catch {
      setStatus("Search is unavailable right now. Tap the map to place the pin.");
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Your browser can’t share your location. Tap the map to place the pin.");
      return;
    }
    setStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setStatus("");
        moveTo(coords.latitude, coords.longitude);
      },
      () => setStatus("We couldn’t get your location. Tap the map to place the pin."),
    );
  };

  return (
    <div className={styles.picker}>
      <div className={styles.mapBar}>
        <div className={styles.mapSearch} role="search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              // The picker sits inside the delivery form: Enter searches instead of submitting it.
              if (event.key !== "Enter") return;
              event.preventDefault();
              search();
            }}
            placeholder="Search for an area or street"
            aria-label="Search for an area or street"
          />
        </div>
        <button type="button" className={styles.locate} onClick={useMyLocation}>
          <MyLocationOutlined aria-hidden="true" /> Use my location
        </button>
      </div>
      <div
        ref={containerRef}
        className={styles.map}
        aria-label="Map: tap to place the delivery pin"
      />
      <p className={styles.pinned} role="status">
        <PlaceOutlined aria-hidden="true" />
        {status ||
          (value
            ? `Pin placed at ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}. Drag it to adjust.`
            : "Tap the map to place the pin on your building.")}
      </p>
    </div>
  );
}
