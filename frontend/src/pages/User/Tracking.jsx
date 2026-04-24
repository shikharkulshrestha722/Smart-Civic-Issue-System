import { useEffect, useState } from "react";
import API from "../../services/api";

function Tracking({ setPage }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    API.get("/clusters").then((res) => setClusters(res.data));
  }, []);

  const statusStyle = (s) =>
    s === "resolved" ? styles.badgeResolved
    : s === "in_progress" ? styles.badgeProgress
    : styles.badgeOpen;

  const statusLabel = (s) =>
    s === "resolved" ? "Resolved"
    : s === "in_progress" ? "In progress"
    : "Open";

  // Timeline steps: which are "done" vs "active" vs "idle"
  const timelineSteps = ["Submitted", "Assigned", "In progress", "Resolved"];
  const stepIndex = { open: 1, in_progress: 2, resolved: 3 };

  const dotState = (stepIdx, clusterStatus) => {
    const active = stepIndex[clusterStatus] ?? 0;
    if (stepIdx < active) return styles.dotDone;
    if (stepIdx === active) return styles.dotActive;
    return styles.dotIdle;
  };

  const deptIcon = (dept) => {
    const icons = {
      Water: { bg: "#E6F1FB", stroke: "#0C447C", fill: "#B5D4F4" },
      Electricity: { bg: "#FAEEDA", stroke: "#854F0B", fill: "#FAC775" },
      Gas: { bg: "#FAEEDA", stroke: "#854F0B", fill: "#FAC775" },
      Transport: { bg: "#E1F5EE", stroke: "#085041", fill: "#9FE1CB" },
    };
    return icons[dept] || { bg: "#F1EFE8", stroke: "#5F5E5A", fill: "#D3D1C7" };
  };

  const submitted = clusters.length;
  const inProgress = clusters.filter((c) => c.status === "in_progress").length;
  const resolved = clusters.filter((c) => c.status === "resolved").length;

  return (
    <div style={styles.pg}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.greeting}>My activity</p>
          <h2 style={styles.title}>My complaints</h2>
        </div>
        <button style={styles.back} onClick={() => setPage({ type: "dashboard" })}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Submitted", val: submitted },
          { label: "In progress", val: inProgress },
          { label: "Resolved", val: resolved },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <p style={styles.statLabel}>{s.label}</p>
            <p style={styles.statVal}>{s.val}</p>
          </div>
        ))}
      </div>

      <p style={styles.sectionLabel}>Complaint history</p>

      {clusters.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            </svg>
          </div>
          <p style={styles.emptyText}>No complaints submitted yet</p>
          <p style={styles.emptySub}>Head back to the dashboard to report an issue</p>
        </div>
      )}

      {clusters.map((c, i) => {
        const icon = deptIcon(c.department);
        return (
          <div key={i} style={styles.card}>
            <div style={styles.cardLeft}>
              <div style={{ ...styles.cardIcon, background: icon.bg }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C8 2 4 6 4 9.5a4 4 0 0 0 8 0C12 6 8 2 8 2z"
                    stroke={icon.stroke} strokeWidth="1.2" fill={icon.fill} strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={styles.cardId}>{c.id}{c.department ? ` · ${c.department}` : ""}</p>
                <p style={styles.cardMeta}>
                  {c.assigned_to ? `Assigned to ${c.assigned_to}` : "Pending assignment"}
                </p>
                {/* Timeline */}
                <div style={styles.timeline}>
                  {timelineSteps.map((step, idx) => (
                    <div key={step} style={styles.tlStep}>
                      <div style={{ ...styles.tlDot, ...dotState(idx, c.status) }} />
                      <span style={styles.tlLabel}>{step}</span>
                      {idx < timelineSteps.length - 1 && <div style={styles.tlLine} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.cardRight}>
              <span style={{ ...styles.badge, ...statusStyle(c.status) }}>
                {statusLabel(c.status)}
              </span>
              <span style={styles.timeAgo}>{c.time_ago || "—"}</span>
            </div>
          </div>
        );
      })}

      <div style={styles.footerTags}>
        {["Real-time updates", "Smart assignment", "Verified completion"].map((t) => (
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
  back: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "10px", marginBottom: "1.5rem" },
  statCard: { background: "rgba(0,0,0,0.04)", borderRadius: "8px", padding: "0.9rem 1rem" },
  statLabel: { fontSize: "12px", color: "#aaa", marginBottom: "4px" },
  statVal: { fontSize: "22px", fontWeight: 500, color: "#111" },
  sectionLabel: { fontSize: "11px", color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" },
  card: { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "1rem 1.1rem", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" },
  cardLeft: { display: "flex", alignItems: "flex-start", gap: "12px", minWidth: 0 },
  cardIcon: { width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" },
  cardId: { fontSize: "14px", fontWeight: 500, color: "#111", margin: 0 },
  cardMeta: { fontSize: "12px", color: "#aaa", marginTop: "2px", marginBottom: "6px" },
  timeline: { display: "flex", alignItems: "center", gap: 0 },
  tlStep: { display: "flex", alignItems: "center", gap: "3px" },
  tlDot: { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
  dotDone: { background: "#1D9E75" },
  dotActive: { background: "#185FA5" },
  dotIdle: { background: "rgba(0,0,0,0.15)" },
  tlLine: { width: "14px", height: "1px", background: "rgba(0,0,0,0.1)", margin: "0 2px" },
  tlLabel: { fontSize: "10px", color: "#aaa" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 },
  badge: { fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "20px" },
  badgeOpen: { background: "#FAEEDA", color: "#633806" },
  badgeProgress: { background: "#E6F1FB", color: "#0C447C" },
  badgeResolved: { background: "#E1F5EE", color: "#085041" },
  timeAgo: { fontSize: "12px", color: "#aaa" },
  emptyState: { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "2.5rem 1rem", textAlign: "center" },
  emptyIcon: { width: "40px", height: "40px", margin: "0 auto 10px", background: "rgba(0,0,0,0.04)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: "14px", fontWeight: 500, color: "#111", margin: 0 },
  emptySub: { fontSize: "13px", color: "#aaa", marginTop: "3px" },
  footerTags: { display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.25rem", flexWrap: "wrap" },
  tag: { fontSize: "11px", color: "#aaa", padding: "3px 8px", borderRadius: "20px", border: "0.5px solid rgba(0,0,0,0.1)" },
};

export default Tracking;