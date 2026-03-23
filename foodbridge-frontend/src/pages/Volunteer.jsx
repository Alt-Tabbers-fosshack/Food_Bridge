import { useDonations } from "../context/DonationContext";
import MapContainer from "../components/MapContainer";

const Volunteer = () => {
  const { donations, acceptDonation, completeDonation } = useDonations();

  const available = donations.filter(d => d.status === "available");
  const active = donations.filter(d => d.status === "picked");

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{ width: "30%", padding: "10px" }}>
        <h2>Available Tasks</h2>
        {available.map(d => (
          <div key={d.id}>
            {d.food_type}
            <button onClick={() => acceptDonation(d.id)}>Accept</button>
          </div>
        ))}

        <h2>Active Delivery 🚚</h2>
        {active.map(d => (
          <div key={d.id}>
            {d.food_type}
            <button onClick={() => completeDonation(d.id)}>
              Mark Delivered
            </button>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ width: "70%" }}>
        <MapContainer 
          tasks={donations} 
          onAccept={acceptDonation} 
        />
      </div>

    </div>
  );
};

export default Volunteer;