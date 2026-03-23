import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

const MapContainer = ({ tasks, onAccept }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [75.7804, 11.2588],
      zoom: 12
    });

    return () => mapInstance.current.remove();
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    tasks.forEach((task) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([task.lng, task.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <h3>${task.food_type}</h3>
            <p>${task.quantity} ${task.unit}</p>
            <button id="btn-${task.id}">Accept</button>
          `)
        )
        .addTo(mapInstance.current);

      // Attach event AFTER popup renders
      setTimeout(() => {
        const btn = document.getElementById(`btn-${task.id}`);
        if (btn) {
          btn.onclick = () => onAccept(task.id);
        }
      }, 500);
    });
  }, [tasks]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MapContainer;