// MapContainer.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapContainer.css";

const statusColor = {
  available: "#5aad5a",
  picked: "#e8a030",
  delivered: "#5a9fd4",
};

const createMarkerIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div class="map-marker" style="--mcolor:${color}"><span class="map-marker-icon">🍱</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });

const MapContainer = ({ tasks, onAccept }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Initialize map centered on Thrissur, Kerala
    mapInstance.current = L.map(mapRef.current, {
      center: [11.2588, 75.7804],
      zoom: 13,
      zoomControl: false, // We'll add it manually for positioning
    });

    // OpenStreetMap tile layer — no API key needed!
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Add zoom control to top-right (matches original)
    L.control.zoom({ position: "topright" }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    tasks.forEach((task) => {
      const color = statusColor[task.status] || statusColor.available;
      const icon = createMarkerIcon(color);

      const statusLabel =
        task.status === "available"
          ? "Available"
          : task.status === "picked"
          ? "En Route"
          : "Delivered";

      const popupHTML = `
        <div class="popup-inner">
          <div class="popup-title">${task.food_type}</div>
          <div class="popup-meta">${task.quantity} ${task.unit} · ${task.distance} km away</div>
          <div class="popup-status status-${task.status}">${statusLabel}</div>
          ${
            task.status === "available"
              ? `<button class="popup-accept-btn" id="popup-btn-${task.id}">Accept Task →</button>`
              : ""
          }
        </div>
      `;

      const marker = L.marker([task.lat, task.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(popupHTML, {
          maxWidth: 220,
          className: "fb-popup",
        });

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`popup-btn-${task.id}`);
          if (btn) {
            btn.onclick = () => {
              onAccept(task.id);
              marker.closePopup();
            };
          }
        }, 50);
      });

      markersRef.current[task.id] = marker;
    });
  }, [tasks, onAccept]);

  return (
    <div className="map-wrap">
      <div ref={mapRef} className="map-container" />
      <div className="map-legend">
        <div className="legend-item">
          <span style={{ background: statusColor.available }} className="legend-dot" />
          Available
        </div>
        <div className="legend-item">
          <span style={{ background: statusColor.picked }} className="legend-dot" />
          En Route
        </div>
        <div className="legend-item">
          <span style={{ background: statusColor.delivered }} className="legend-dot" />
          Delivered
        </div>
      </div>
    </div>
  );
};

export default MapContainer;