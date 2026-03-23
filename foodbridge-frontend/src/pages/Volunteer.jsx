import { useDonations } from "../context/DonationContext";
import MapContainer from "../components/MapContainer";

const Volunteer = () => {
  const { donations, removeDonation } = useDonations();

  const handleAccept = (id) => {
    removeDonation(id);
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{ width: "30%", padding: "10px" }}>
        <h2>Available Tasks</h2>

        {donations.map((t) => (
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
        <MapContainer tasks={donations} onAccept={handleAccept} />
      </div>
    </div>
  );
};

export default Volunteer;