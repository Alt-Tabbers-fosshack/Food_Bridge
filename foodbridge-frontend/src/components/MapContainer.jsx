import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapContainer.css";

mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

const statusColor = {
  available: "#5aad5a",
  picked: "#e8a030",
  delivered: "#5a9fd4"
};

const MapContainer = ({ tasks, onAccept }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [75.7804, 11.2588],
      zoom: 13
    });

    mapInstance.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (mapInstance.current) mapInstance.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    tasks.forEach((task) => {
      // Custom marker element
      const el = document.createElement("div");
      el.className = "map-marker";
      el.style.setProperty("--mcolor", statusColor[task.status] || statusColor.available);
      el.innerHTML = `<span class="map-marker-icon">🍱</span>`;

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: true,
        maxWidth: "220px",
        className: "fb-popup"
      }).setHTML(`
        <div class="popup-inner">
          <div class="popup-title">${task.food_type}</div>
          <div class="popup-meta">${task.quantity} ${task.unit} · ${task.distance} km away</div>
          <div class="popup-status status-${task.status}">${task.status === "available" ? "Available" : task.status === "picked" ? "En Route" : "Delivered"}</div>
          ${task.status === "available" ? `<button class="popup-accept-btn" id="popup-btn-${task.id}">Accept Task →</button>` : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([task.lng, task.lat])
        .setPopup(popup)
        .addTo(mapInstance.current);

      popup.on("open", () => {
        setTimeout(() => {
          const btn = document.getElementById(`popup-btn-${task.id}`);
          if (btn) btn.onclick = () => { onAccept(task.id); popup.remove(); };
        }, 50);
      });

      markersRef.current[task.id] = marker;
    });
  }, [tasks, onAccept]);

  return (
    <div className="map-wrap">
      <div ref={mapRef} className="map-container" />
      <div className="map-legend">
        <div className="legend-item"><span style={{ background: statusColor.available }} className="legend-dot" />Available</div>
        <div className="legend-item"><span style={{ background: statusColor.picked }} className="legend-dot" />En Route</div>
        <div className="legend-item"><span style={{ background: statusColor.delivered }} className="legend-dot" />Delivered</div>
      </div>
    </div>
  );
};

export default MapContainer;