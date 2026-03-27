import { useState } from "react";
import { useDonations } from "../context/DonationContext";
import { useAuth } from "../context/AuthContext";
import "./Donor.css";

const statusLabel = {
  available: { text: "Available", color: "#5aad5a" },
  picked: { text: "En Route", color: "#e8a030" },
  delivered: { text: "Delivered", color: "#5a9fd4" }
};

const Donor = () => {
  const { donations, addDonation } = useDonations();
  const { user } = useAuth();
  const [form, setForm] = useState({ food_type: "", quantity: "", unit: "plates" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.food_type || !form.quantity) return;

    setLoading(true);
    try {
      // Get user's geolocation
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await addDonation({
            food_type: form.food_type,
            quantity: parseFloat(form.quantity),
            unit: form.unit,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            hours_until_expiry: 4,
          });

          setForm({ food_type: "", quantity: "", unit: "plates" });
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 2500);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Please enable location access to create donation");
          setLoading(false);
        }
      );
    } catch (err) {
      alert(err.detail || "Failed to create donation");
      setLoading(false);
    }
  };

  const myDonations = donations;
  const totalPlates = donations.reduce((acc, d) => acc + Number(d.quantity), 0);

  return (
    <div className="donor-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Donor Dashboard</h1>
          <p className="page-sub">Welcome, {user?.email} — thank you for sharing 🙏</p>
        </div>
        <div className="stat-pill">
          <span className="stat-num">{totalPlates}</span>
          <span className="stat-label">meals shared</span>
        </div>
      </div>

      <div className="donor-layout">
        {/* Form card */}
        <div className="donor-form-card">
          <h2 className="card-title">New Donation</h2>
          <p className="card-sub">Add surplus food to the bridge</p>

          <form onSubmit={handleSubmit} className="donor-form">
            <div className="field-group">
              <label className="field-label">Food Type</label>
              <input
                className="field-input"
                placeholder="e.g. Rice & Curry, Bread, Fruits…"
                value={form.food_type}
                onChange={e => setForm({ ...form, food_type: e.target.value })}
                required
              />
            </div>

            <div className="qty-row">
              <div className="field-group" style={{ flex: 1 }}>
                <label className="field-label">Quantity</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="e.g. 10"
                  value={form.quantity}
                  min={1}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="field-group">
                <label className="field-label">Unit</label>
                <select
                  className="field-input"
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="plates">Plates</option>
                  <option value="kg">Kg</option>
                  <option value="boxes">Boxes</option>
                  <option value="packets">Packets</option>
                </select>
              </div>
            </div>

            <button type="submit" className={`submit-btn ${submitted ? "success" : ""}`} disabled={loading}>
              {loading ? "Creating..." : submitted ? "✓ Donation Added!" : "Add Donation →"}
            </button>
          </form>

          {submitted && (
            <div className="toast-success">
              🎉 Your donation is now visible to volunteers on the map!
            </div>
          )}
        </div>

        {/* Donations list */}
        <div className="donor-list-card">
          <h2 className="card-title">My Donations</h2>
          <p className="card-sub">{myDonations.length} donation{myDonations.length !== 1 ? "s" : ""} total</p>

          <div className="donation-list">
            {myDonations.length === 0 ? (
              <div className="empty-state">
                <span>🍱</span>
                <p>No donations yet — add your first one!</p>
              </div>
            ) : (
              myDonations.map((d, i) => {
                const s = statusLabel[d.status] || statusLabel.available;
                return (
                  <div key={d.id} className="donation-item" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="donation-left">
                      <div className="donation-icon">🍱</div>
                      <div>
                        <div className="donation-name">{d.food_type}</div>
                        <div className="donation-qty">{d.quantity} {d.unit} · {d.distance} km away</div>
                      </div>
                    </div>
                    <span className="status-badge" style={{ color: s.color, borderColor: `${s.color}44`, background: `${s.color}18` }}>
                      {s.text}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donor;
