"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Polyline } from "leaflet";

type MapPoint = {
  latitude: number;
  longitude: number;
  label: string;
  tone: "user" | "office";
};

type PostalMapProps = {
  userPoint?: MapPoint | null;
  officePoint?: MapPoint | null;
};

export function PostalMap({ userPoint, officePoint }: PostalMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const lineRef = useRef<Polyline | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderMap() {
      const L = await import("leaflet");

      if (!isMounted || !mapElementRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapElementRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([20.5937, 78.9629], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);
      }

      const map = mapRef.current;
      map.eachLayer((layer) => {
        if ("options" in layer && layer.options.pane === "markerPane") {
          layer.removeFrom(map);
        }
      });

      if (lineRef.current) {
        lineRef.current.removeFrom(map);
        lineRef.current = null;
      }

      const points = [userPoint, officePoint].filter(
        (point): point is MapPoint => Boolean(point),
      );

      points.forEach((point) => {
        const color = point.tone === "user" ? "#4f46e5" : "#0f172a";
        L.marker([point.latitude, point.longitude], {
          icon: L.divIcon({
            className: "",
            html: `<span style="display:block;width:14px;height:14px;border-radius:999px;background:${color};border:3px solid white;box-shadow:0 4px 12px rgba(15,23,42,.18)"></span>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          }),
        })
          .addTo(map)
          .bindPopup(point.label);
      });

      if (userPoint && officePoint) {
        lineRef.current = L.polyline(
          [
            [userPoint.latitude, userPoint.longitude],
            [officePoint.latitude, officePoint.longitude],
          ],
          {
            color: "#4f46e5",
            weight: 2,
            opacity: 0.6,
            dashArray: "6 6",
          },
        ).addTo(map);
      }

      if (points.length === 1) {
        map.setView([points[0].latitude, points[0].longitude], 12);
      }

      if (points.length > 1) {
        const bounds = L.latLngBounds(
          points.map((point) => [point.latitude, point.longitude]),
        );
        map.fitBounds(bounds, { padding: [34, 34], maxZoom: 13 });
      }

      window.setTimeout(() => map.invalidateSize(), 50);
    }

    void renderMap();

    return () => {
      isMounted = false;
    };
  }, [officePoint, userPoint]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div ref={mapElementRef} className="h-[300px] w-full sm:h-[360px]" />
    </div>
  );
}
