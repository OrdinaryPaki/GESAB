"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { contactInfo, siteConfig } from "../site-config";
import styles from "./contact-info.module.css";

const MAP_CENTER = [contactInfo.map.lat, contactInfo.map.lng];
const MAP_TITLE = `${siteConfig.shortName} – ${contactInfo.streetAddress}`;

export function ContactMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (isCancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: MAP_CENTER,
        zoom: contactInfo.map.zoom,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      const customIcon = L.divIcon({
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

      L.marker(MAP_CENTER, { icon: customIcon, title: MAP_TITLE }).addTo(map);

      mapRef.current = map;
      setIsReady(true);

      // Force recalculation of map size a few times to ensure tiles fill the space properly
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 500);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleResetMap = () => {
    mapRef.current?.setView(MAP_CENTER, contactInfo.map.zoom, { animate: true });
  };

  return (
    <div className={styles.map}>
      <div
        ref={containerRef}
        className={styles.mapFrame}
        role="img"
        aria-label={`Karta till ${siteConfig.shortName} på ${contactInfo.addressLine}`}
      />
      <button
        type="button"
        className={styles.resetButton}
        onClick={handleResetMap}
        disabled={!isReady}
        aria-label={`Återställ kartan till ${siteConfig.shortName}`}
      >
        Återställ
      </button>
    </div>
  );
}
