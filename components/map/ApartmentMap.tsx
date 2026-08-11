"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import type { Apartment } from "@/types/apartment";

type ApartmentMapProps = {
  apartments: Apartment[];
  className?: string;
};

type MapStatus = "loading" | "ready" | "error";

const DEFAULT_CENTER = { lat: 47.6062, lng: -122.3321 };
const DEFAULT_ZOOM = 11;
const MAP_ID = "DEMO_MAP_ID";

let googleMapsLoadPromise: Promise<void> | null = null;
let AdvancedMarkerElementClass: typeof google.maps.marker.AdvancedMarkerElement | null =
  null;

function loadGoogleMaps(apiKey: string) {
  if (!googleMapsLoadPromise) {
    setOptions({ key: apiKey, v: "weekly" });
    googleMapsLoadPromise = Promise.all([
      importLibrary("maps"),
      importLibrary("marker"),
    ]).then(([, markerLibrary]) => {
      AdvancedMarkerElementClass = markerLibrary.AdvancedMarkerElement;
    });
  }
  return googleMapsLoadPromise;
}

function formatRent(rent: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rent);
}

function formatBedrooms(bedrooms: number) {
  return bedrooms === 0 ? "Studio" : `${bedrooms} bed`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildInfoWindowContent(apartment: Apartment) {
  const title = escapeHtml(apartment.title);
  const neighborhood = escapeHtml(apartment.neighborhood);
  const rent = escapeHtml(formatRent(apartment.rent));
  const beds = escapeHtml(formatBedrooms(apartment.bedrooms));
  const baths = escapeHtml(String(apartment.bathrooms));
  const squareFeet = escapeHtml(apartment.squareFeet.toLocaleString());

  return `
    <div style="max-width:220px;font-family:system-ui,sans-serif;line-height:1.4;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#18181b;">${title}</p>
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#18181b;">${rent}<span style="font-weight:400;color:#71717a;"> /mo</span></p>
      <p style="margin:0 0 4px;font-size:12px;color:#52525b;">${beds} · ${baths} bath · ${squareFeet} sq ft</p>
      <p style="margin:0;font-size:12px;color:#71717a;">${neighborhood}</p>
    </div>
  `;
}

export function ApartmentMap({ apartments, className }: ApartmentMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const missingApiKey = !apiKey;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [status, setStatus] = useState<MapStatus>(
    missingApiKey ? "error" : "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    missingApiKey
      ? "Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local."
      : null,
  );

  useEffect(() => {
    if (missingApiKey) {
      return;
    }

    let cancelled = false;

    void loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !mapContainerRef.current) {
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(mapContainerRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            mapId: MAP_ID,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
          infoWindowRef.current = new google.maps.InfoWindow();
        }

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            "Unable to load Google Maps. Check your API key and billing settings.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, missingApiKey]);

  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;

    if (!map || !infoWindow || status !== "ready" || !AdvancedMarkerElementClass) {
      return;
    }

    for (const marker of markersRef.current) {
      marker.map = null;
    }
    markersRef.current = [];
    infoWindow.close();

    if (apartments.length === 0) {
      map.setCenter(DEFAULT_CENTER);
      map.setZoom(DEFAULT_ZOOM);
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    for (const apartment of apartments) {
      const position = {
        lat: apartment.latitude,
        lng: apartment.longitude,
      };

      const marker = new AdvancedMarkerElementClass({
        map,
        position,
        title: apartment.title,
        gmpClickable: true,
      });

      marker.addEventListener("gmp-click", () => {
        infoWindow.setContent(buildInfoWindowContent(apartment));
        infoWindow.open({ map, anchor: marker });
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    }

    if (apartments.length === 1) {
      map.setCenter(bounds.getCenter()!);
      map.setZoom(14);
      return;
    }

    map.fitBounds(bounds, 48);
  }, [apartments, status]);

  const shellClassName = [
    "flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:min-h-[480px]",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section aria-label="Apartment map" className={shellClassName}>
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">Map</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          {apartments.length === 0
            ? "No listings to plot"
            : `${apartments.length} listing${apartments.length === 1 ? "" : "s"} on the map`}
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

        {status === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/90">
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-900">Loading map…</p>
              <p className="mt-1 text-sm text-zinc-500">
                Initializing Google Maps
              </p>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 px-6 text-center">
            <div>
              <p className="text-sm font-medium text-red-900">
                Map unavailable
              </p>
              <p className="mt-2 text-sm text-red-800">
                {errorMessage ??
                  "Unable to load Google Maps. Try again later."}
              </p>
            </div>
          </div>
        ) : null}

        {status === "ready" && apartments.length === 0 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-white/95 px-4 py-3 text-center ring-1 ring-inset ring-zinc-200">
            <p className="text-sm text-zinc-600">
              Adjust your filters to see apartment locations on the map.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
