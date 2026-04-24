import { useEffect, useState } from "react";
import API from "../../services/api";
import MapView from "../../components/MapView";

function Admin({ setUser }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    API.get("/admin/clusters").then((res) => setClusters(res.data));
  }, []);

  const handleSignOut = () => {
    setUser(null); // clears the user, returning to Login
  };

  const statusStyle = (status) => {
    if (status === "resolved") return styles.badgeResolved;
    if (status === "in_progress") return styles.badgeProgress;
    return styles.badgeOpen;
  };

  const statusLabel = (status) => {
    if (status === "resolved") return "Resolved";
    if (status === "in_progress") return "In progress";
    return "Open";
  };

  const openCount = clusters.filter((c) => c.status === "open").length;
  const resolvedCount = clusters.filter((c) => c.status === "resolved").length;

  return (
    <div style={styles.pg}>

      {/* Top bar */}
      <div style={styles.topbar}>
        <div>
          <p style={styles.greeting}>Admin panel</p>
          <h2 style={styles.title}>Dashboard</h2>
        </div>
        <div style={styles.topbarRight}>
          <button style={styles.signoutBtn} onClick={handleSignOut}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3M9 9l3-2.5L9 4M4 6.5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
          <div style={styles.avatar}>AD</div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total clusters", val: clusters.length },
          { label: "Open", val: openCount },
          { label: "Resolved", val: resolvedCount },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <p style={styles.statLabel}>{s.label}</p>
            <p style={styles.statVal}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={styles.mapCard}>
        <div style={styles.mapHeader}>
          <span style={styles.mapTitle}>Complaint map</span>
          <span style={styles.liveBadge}>
            <span style={styles.liveDot} />
            Live
          </span>
        </div>
        <div style={styles.mapBody}>
          <MapView />
        </div>
      </div>

      {/* Clusters */}
      <p style={styles.sectionLabel}>Cluster insights</p>
      {clusters.map((c, i) => (
        <div key={i} style={styles.clusterCard}>
          <div style={styles.clusterLeft}>
            <div style={styles.clusterIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5l1.5 3h3l-2.5 2 1 3L8 8l-3 1.5 1-3-2.5-2h3z" stroke="#0C447C" strokeWidth="1.1" fill="none"/>
              </svg>
            </div>
            <div>
              <p style={styles.clusterId}>{c.id}</p>
              <p style={styles.clusterMeta}>Assigned to {c.assigned_to} · {c.count} reports</p>
            </div>
          </div>
          <div style={styles.clusterRight}>
            <span style={{ ...styles.badge, ...statusStyle(c.status) }}>
              {statusLabel(c.status)}
            </span>
            <span style={{ ...styles.timeVal, color: c.hours_since_created > 24 ? "#A32D2D" : "#085041" }}>
              {c.hours_since_created} hrs
            </span>
          </div>
        </div>
      ))}

      <div style={styles.footerTags}>
        {["Real-time clustering", "Smart assignment", "Time analytics"].map((t) => (
          <span key={t} style={styles.tag}>{t}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pg: { background: "#f5f5f3", minHeight: "100vh", padding: "1.5rem", fontFamily: "sans-serif" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" },
  greeting: { fontSize: "12px", color: "#aaa", marginBottom: "3px" },
  title: { fontSize: "18px", fontWeight: 500, color: "#111", margin: 0 },
  topbarRight: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "34px", height: "34px", borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500, color: "#633806", border: "0.5px solid #FAC775" },
  signoutBtn: { display: "flex", alignItems: "center", gap: "5px", padding: "7px 11px", fontSize: "12px", fontWeight: 500, borderRadius: "8px", border: "0.5px solid rgba(0,0,0,0.15)", background: "#f5f5f3", color: "#666", cursor: "pointer", fontFamily: "sans-serif" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", marginBottom: "1.5rem" },
  statCard: { background: "rgba(0,0,0,0.04)", borderRadius: "8px", padding: "0.9rem 1rem" },
  statLabel: { fontSize: "12px", color: "#aaa", marginBottom: "4px" },
  statVal: { fontSize: "22px", fontWeight: 500, color: "#111" },
  mapCard: { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" },
  mapHeader: { padding: "0.85rem 1.1rem", borderBottom: "0.5px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  mapTitle: { fontSize: "13px", fontWeight: 500, color: "#111" },
  liveBadge: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#085041", background: "#E1F5EE", padding: "3px 8px", borderRadius: "20px" },
  liveDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75" },
  mapBody: { padding: "12px" },
  sectionLabel: { fontSize: "11px", color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" },
  clusterCard: { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "1rem 1.1rem", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" },
  clusterLeft: { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 },
  clusterIcon: { width: "36px", height: "36px", borderRadius: "8px", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  clusterId: { fontSize: "14px", fontWeight: 500, color: "#111", margin: 0 },
  clusterMeta: { fontSize: "12px", color: "#aaa", marginTop: "2px" },
  clusterRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 },
  badge: { fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "20px" },
  badgeOpen: { background: "#FAEEDA", color: "#633806" },
  badgeProgress: { background: "#E6F1FB", color: "#0C447C" },
  badgeResolved: { background: "#E1F5EE", color: "#085041" },
  timeVal: { fontSize: "13px", fontWeight: 500 },
  footerTags: { display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.25rem", flexWrap: "wrap" },
  tag: { fontSize: "11px", color: "#aaa", padding: "3px 8px", borderRadius: "20px", border: "0.5px solid rgba(0,0,0,0.1)" },
};

export default Admin;