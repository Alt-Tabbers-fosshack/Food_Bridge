import { useState } from "react";
import { useDonations } from "../context/DonationContext";

const Donor = () => {
  const { donations, addDonation } = useDonations();

  const [form, setForm] = useState({
    food_type: "",
    quantity: "",
    unit: "plates"
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDonation = {
      id: Date.now(),
      ...form,
      lat: 11.2588 + Math.random() * 0.01,
      lng: 75.7804 + Math.random() * 0.01,
      distance: (Math.random() * 5).toFixed(1)
    };

    addDonation(newDonation);

    setForm({ food_type: "", quantity: "", unit: "plates" });
  };

  return (
    <div>
      <h1>Donor Dashboard</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Food type"
          value={form.food_type}
          onChange={(e) => setForm({ ...form, food_type: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <select
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        >
          <option value="plates">Plates</option>
          <option value="kg">Kg</option>
        </select>

        <button type="submit">Add Donation</button>
      </form>

      {/* List */}
      <h2>My Donations</h2>
      {donations.map((d) => (
        <div key={d.id}>
          {d.food_type} - {d.quantity} {d.unit}
        </div>
      ))}
    </div>
  );
};

export default Donor;