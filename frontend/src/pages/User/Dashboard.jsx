function Dashboard({ setPage }) {
  const departments = [
    {
      name: "Gas",
      meta: "Leak & supply issues",
      iconBg: "#FAEEDA",
      iconStroke: "#854F0B",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2C9 2 5 6.5 5 10a4 4 0 0 0 8 0C13 6.5 9 2 9 2z" stroke="#854F0B" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
          <path d="M7.5 11.5c0-1.5 1.5-3 1.5-3s1.5 1.5 1.5 3a1.5 1.5 0 0 1-3 0z" fill="#EF9F27"/>
        </svg>
      ),
    },
    {
      name: "Electricity",
      meta: "Outages & wiring faults",
      iconBg: "#FAEEDA",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 2L5 10h5l-1 6 7-9h-5l1-5z" stroke="#854F0B" strokeWidth="1.2" fill="#FAC775" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "Water",
      meta: "Supply & pipeline issues",
      iconBg: "#E6F1FB",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2C9 2 4 7.5 4 11a5 5 0 0 0 10 0C14 7.5 9 2 9 2z" stroke="#0C447C" strokeWidth="1.3" fill="#B5D4F4" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "Transport",
      meta: "Roads & public transit",
      iconBg: "#E1F5EE",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="5" width="14" height="8" rx="2" stroke="#085041" strokeWidth="1.2" fill="#9FE1CB"/>
          <circle cx="5.5" cy="13.5" r="1.5" fill="#085041"/>
          <circle cx="12.5" cy="13.5" r="1.5" fill="#085041"/>
          <path d="M2 9h14M7 5V3M11 5V3" stroke="#085041" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <p style={styles.greeting}>Good morning</p>
          <h2 style={styles.title}>Select department</h2>
        </div>
        <div style={styles.avatar}>SC</div>
      </div>

      <p style={styles.sectionLabel}>Departments</p>
      <div style={styles.grid}>
        {departments.map((d) => (
          <div
            key={d.name}
            style={styles.deptCard}
            onClick={() => setPage({ type: "report", dept: d.name })}
          >
            <div style={{ ...styles.deptIcon, background: d.iconBg }}>{d.icon}</div>
            <div>
              <p style={styles.deptName}>{d.name}</p>
              <p style={styles.deptMeta}>{d.meta}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={styles.sectionLabel}>My activity</p>
      <div style={styles.trackCard} onClick={() => setPage({ type: "tracking" })}>
        <div style={styles.trackLeft}>
          <div style={styles.trackIcon}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="6.5" stroke="#085041" strokeWidth="1.2"/>
              <path d="M9 5.5v4l2.5 1.5" stroke="#085041" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={styles.trackTitle}>Track complaints</p>
            <p style={styles.trackSub}>View status of submitted reports</p>
          </div>
        </div>
        <span style={styles.arrow}>›</span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { background: "#f5f5f3", minHeight: "100vh", padding: "2rem 1.5rem", fontFamily: "sans-serif" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" },
  greeting: { fontSize: "12px", color: "#aaa", marginBottom: "3px" },
  title: { fontSize: "18px", fontWeight: 500, color: "#111", margin: 0 },
  avatar: { width: "34px", height: "34px", borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 500, color: "#0C447C", border: "0.5px solid #B5D4F4" },
  sectionLabel: { fontSize: "11px", color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px", marginBottom: "1.5rem" },
  deptCard: { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "1.1rem 1rem", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px" },
  deptIcon: { width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  deptName: { fontSize: "14px", fontWeight: 500, color: "#111", margin: 0 },
  deptMeta: { fontSize: "12px", color: "#aaa", margin: 0 },
  trackCard: { background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "1rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" },
  trackLeft: { display: "flex", alignItems: "center", gap: "12px" },
  trackIcon: { width: "36px", height: "36px", borderRadius: "8px", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center" },
  trackTitle: { fontSize: "14px", fontWeight: 500, color: "#111", margin: 0 },
  trackSub: { fontSize: "12px", color: "#aaa", margin: 0 },
  arrow: { color: "#aaa", fontSize: "20px" },
};

export default Dashboard;