import { useDonations } from "../context/DonationContext";

const Receiver = () => {
  const { donations } = useDonations();

  const incoming = donations.filter(d => d.status === "picked");
  const completed = donations.filter(d => d.status === "delivered");

  return (
    <div>
      <h1>Receiver Dashboard</h1>

      <h2>Incoming Food 🍱</h2>
      {incoming.map(d => (
        <div key={d.id}>
          {d.food_type} (on the way 🚚)
        </div>
      ))}

      <h2>Received ✅</h2>
      {completed.map(d => (
        <div key={d.id}>
          {d.food_type} (delivered)
        </div>
      ))}
    </div>
  );
};

export default Receiver;