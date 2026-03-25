import { useDonations } from "../context/DonationContext";
import { useAuth } from "../context/AuthContext";
import "./Receiver.css";

const Receiver = () => {
  const { donations } = useDonations();
  const { user } = useAuth();

  const incoming = donations.filter(d => d.status === "picked");
  const completed = donations.filter(d => d.status === "delivered");
  const waiting = donations.filter(d => d.status === "available");

  return (
    <div className="receiver-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Receiver Dashboard</h1>
          <p className="page-sub">Welcome, {user?.email}</p>
        </div>
      </div>

      <div className="flow-banner">
        <div className="flow-step">
          <span className="flow-icon">🍱</span>
          <span className="flow-text">Donor Gives</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">
          <span className="flow-icon">🚚</span>
          <span className="flow-text">Volunteer Picks Up</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step active-flow">
          <span className="flow-icon">🏠</span>
          <span className="flow-text">You Receive</span>
        </div>
      </div>

      <div className="receiver-grid">
        {/* Incoming */}
        <div className="recv-card">
          <div className="recv-card-header">
            <div className="recv-dot amber-dot" />
            <h2 className="recv-title">On The Way</h2>
            {incoming.length > 0 && <span className="live-badge">LIVE</span>}
          </div>
          <div className="recv-list">
            {incoming.length === 0 ? (
              <div className="empty-state">
                <span>🚚</span>
                <p>No deliveries in progress yet</p>
              </div>
            ) : (
              incoming.map((d, i) => (
                <div key={d.id} className="recv-item incoming-item" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="recv-item-icon">🍱</div>
                  <div className="recv-item-info">
                    <div className="recv-item-name">{d.food_type}</div>
                    <div className="recv-item-meta">{d.quantity} {d.unit} · Volunteer en route</div>
                  </div>
                  <div className="pulse-dot" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed */}
        <div className="recv-card">
          <div className="recv-card-header">
            <div className="recv-dot green-dot" />
            <h2 className="recv-title">Received</h2>
            <span className="section-count-badge">{completed.length}</span>
          </div>
          <div className="recv-list">
            {completed.length === 0 ? (
              <div className="empty-state">
                <span>✅</span>
                <p>No deliveries completed yet</p>
              </div>
            ) : (
              completed.map((d, i) => (
                <div key={d.id} className="recv-item completed-item" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="recv-item-icon">✅</div>
                  <div className="recv-item-info">
                    <div className="recv-item-name">{d.food_type}</div>
                    <div className="recv-item-meta">{d.quantity} {d.unit} · Successfully delivered</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Waiting */}
        <div className="recv-card">
          <div className="recv-card-header">
            <div className="recv-dot muted-dot" />
            <h2 className="recv-title">Available Near You</h2>
            <span className="section-count-badge">{waiting.length}</span>
          </div>
          <div className="recv-list">
            {waiting.length === 0 ? (
              <div className="empty-state">
                <span>📍</span>
                <p>No donations available yet</p>
              </div>
            ) : (
              waiting.map((d, i) => (
                <div key={d.id} className="recv-item waiting-item" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="recv-item-icon">📍</div>
                  <div className="recv-item-info">
                    <div className="recv-item-name">{d.food_type}</div>
                    <div className="recv-item-meta">{d.quantity} {d.unit} · {d.distance} km · Awaiting volunteer</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receiver;
