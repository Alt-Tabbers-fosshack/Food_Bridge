import { useDonations } from "../context/DonationContext";
import { useAuth } from "../context/AuthContext";
import MapContainer from "../components/MapContainer";
import "./Volunteer.css";

const Volunteer = () => {
  const { donations, acceptDonation, completeDonation } = useDonations();
  const { user } = useAuth();

  const available = donations.filter(d => d.status === "available");
  const active = donations.filter(d => d.status === "picked");
  const delivered = donations.filter(d => d.status === "delivered");

  return (
    <div className="volunteer-page">
      <div className="volunteer-sidebar">
        <div className="sidebar-header">
          <h1 className="page-title">Volunteer Hub</h1>
          <p className="page-sub">{user?.email}</p>
        </div>

        <div className="stats-row">
          <div className="mini-stat">
            <span className="mini-num available-color">{available.length}</span>
            <span className="mini-label">Available</span>
          </div>
          <div className="mini-stat">
            <span className="mini-num amber-color">{active.length}</span>
            <span className="mini-label">Active</span>
          </div>
          <div className="mini-stat">
            <span className="mini-num blue-color">{delivered.length}</span>
            <span className="mini-label">Delivered</span>
          </div>
        </div>

        {/* Available tasks */}
        <section className="task-section">
          <div className="section-header">
            <div className="section-dot" style={{ background: "var(--green)" }} />
            <h2 className="section-title">Available Tasks</h2>
            <span className="section-count">{available.length}</span>
          </div>

          <div className="task-list">
            {available.length === 0 ? (
              <div className="empty-msg">No tasks right now — check the map!</div>
            ) : (
              available.map((d, i) => (
                <div key={d.id} className="task-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="task-info">
                    <span className="task-icon">🍱</span>
                    <div>
                      <div className="task-name">{d.food_type}</div>
                      <div className="task-meta">{d.quantity} {d.unit} · {d.distance} km</div>
                    </div>
                  </div>
                  <button className="task-btn accept-btn" onClick={() => acceptDonation(d.id)}>
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Active deliveries */}
        <section className="task-section">
          <div className="section-header">
            <div className="section-dot" style={{ background: "var(--amber)" }} />
            <h2 className="section-title">Active Delivery</h2>
            <span className="section-count">{active.length}</span>
          </div>

          <div className="task-list">
            {active.length === 0 ? (
              <div className="empty-msg">No active deliveries</div>
            ) : (
              active.map((d, i) => (
                <div key={d.id} className="task-card active-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="task-info">
                    <span className="task-icon">🚚</span>
                    <div>
                      <div className="task-name">{d.food_type}</div>
                      <div className="task-meta">{d.quantity} {d.unit} · En route</div>
                    </div>
                  </div>
                  <button className="task-btn deliver-btn" onClick={() => completeDonation(d.id)}>
                    Delivered ✓
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {delivered.length > 0 && (
          <section className="task-section">
            <div className="section-header">
              <div className="section-dot" style={{ background: "#5a9fd4" }} />
              <h2 className="section-title">Completed</h2>
              <span className="section-count">{delivered.length}</span>
            </div>
            <div className="task-list">
              {delivered.map(d => (
                <div key={d.id} className="task-card delivered-card">
                  <div className="task-info">
                    <span className="task-icon">✅</span>
                    <div>
                      <div className="task-name">{d.food_type}</div>
                      <div className="task-meta">Delivered successfully</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Map */}
      <div className="volunteer-map">
        <MapContainer tasks={donations} onAccept={acceptDonation} />
      </div>
    </div>
  );
};

export default Volunteer;
