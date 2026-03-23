import { useEffect, useState } from "react";
import { fetchDonations } from "../api/donations.api";
import MapContainer from "../components/MapContainer";

const Volunteer = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await fetchDonations();
    setTasks(res.data);
  };

  const handleAccept = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{ width: "30%", padding: "10px" }}>
        <h2>Available Tasks</h2>

        {tasks.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ccc", marginBottom: "10px" }}>
            <p>{t.food_type}</p>
            <p>{t.quantity} {t.unit}</p>
            <p>{t.distance} km</p>
            <button onClick={() => handleAccept(t.id)}>Accept</button>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ width: "70%" }}>
        <MapContainer tasks={tasks} onAccept={handleAccept} />
      </div>
    </div>
  );
};

export default Volunteer;