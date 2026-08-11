"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "./contact-info.module.css";

const CENTER = [57.7377438, 11.8965335];
const DEFAULT_ZOOM = 13.5;

export function ContactMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      const icon = L.divIcon({
        className: styles.markerWrap,
        html: `
          <span class="${styles.markerPulse}" aria-hidden="true"></span>
          <span class="${styles.markerPin}" aria-hidden="true">
            <span class="${styles.markerDot}"></span>
          </span>
        `,
        iconSize: [48, 58],
        iconAnchor: [24, 56],
      });

      L.marker(CENTER, { icon, title: "GESAB – Solstrålegatan 6" }).addTo(map);

      mapRef.current = map;
      setReady(true);

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  function resetMap() {
    mapRef.current?.setView(CENTER, DEFAULT_ZOOM, { animate: true });
  }

  return (
    <div className={styles.map}>
      <div
        ref={containerRef}
        className={styles.mapFrame}
        role="img"
        aria-label="Karta till GESAB på Solstrålegatan 6, Göteborg"
      />
      <button
        type="button"
        className={styles.resetButton}
        onClick={resetMap}
        disabled={!ready}
        aria-label="Återställ kartan till GESAB"
      >
        Återställ
      </button>
    </div>
  );
}
