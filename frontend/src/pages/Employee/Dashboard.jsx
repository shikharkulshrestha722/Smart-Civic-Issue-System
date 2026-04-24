import { useEffect, useState } from "react";
import API from "../../services/api";

function Employee({ user, setUser }) {
  const [clusters, setClusters] = useState([]);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState({});
  const [details, setDetails] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    API.get(`/employee/${user.id}`)
      .then((res) => setClusters(res.data))
      .catch(console.log);
  };

  const handleFileChange = (id, file) => {
    setFiles({ ...files, [id]: file });
  };

  const completeTask = async (clusterId) => {
    if (!files[clusterId]) {
      alert("Upload proof first");
      return;
    }

    setLoading({ ...loading, [clusterId]: true });

    const formData = new FormData();
    formData.append("file", files[clusterId]);

    try {
      await API.post(`/complete/${clusterId}`, formData);
      fetchData();
    } catch {
      alert("Error completing task");
    } finally {
      setLoading({ ...loading, [clusterId]: false });
    }
  };

  const loadDetails = async (clusterId) => {
    if (details[clusterId]) {
      setDetails({ ...details, [clusterId]: null });
      return;
    }

    const res = await API.get(`/cluster/${clusterId}`);

    setDetails({
      ...details,
      [clusterId]: res.data
    });
  };

  const statusStyle = (s) =>
    s === "resolved"
      ? styles.badgeDone
      : s === "in_progress"
      ? styles.badgeProgress
      : styles.badgeOpen;

  const statusLabel = (s) =>
    s === "resolved"
      ? "Resolved"
      : s === "in_progress"
      ? "In progress"
      : "Open";

  return (
    <div style={styles.pg}>
      {/* HEADER */}
      <div style={styles.topbar}>
        <div>
          <p style={styles.greeting}>Field worker</p>
          <h2 style={styles.title}>Assigned tasks</h2>
        </div>

        <div style={styles.topbarRight}>
          <button style={styles.signoutBtn} onClick={() => setUser(null)}>
            Sign out
          </button>

          <div style={styles.avatar}>
            {user.name?.slice(0, 2).toUpperCase() || "EW"}
          </div>
        </div>
      </div>

      {/* TASKS */}
      {clusters.map((c, i) => (
        <div key={i} style={styles.card}>
          <div style={styles.row}>
            <div>
              <p style={styles.id}>{c.id}</p>
              <p style={styles.meta}>
                📍 {c.lat?.toFixed(3)}, {c.lon?.toFixed(3)} · {c.count} reports
              </p>
            </div>

            <span style={{ ...styles.badge, ...statusStyle(c.status) }}>
              {statusLabel(c.status)}
            </span>
          </div>

          {/* VIEW DETAILS */}
          <button
            style={styles.viewBtn}
            onClick={() => loadDetails(c.id)}
          >
            {details[c.id] ? "Hide details" : "View details"}
          </button>

          {/* DETAILS PANEL */}
          {details[c.id] && (
            <div style={styles.details}>
              {details[c.id].map((d, idx) => (
                <div key={idx} style={styles.detailItem}>
                  <p>{d.text}</p>
                  <span style={styles.small}>
                    📍 {d.lat.toFixed(3)}, {d.lon.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ACTION */}
          {c.status !== "resolved" && (
            <div style={styles.actions}>
              <label style={styles.uploadBtn}>
                Upload proof
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleFileChange(c.id, e.target.files[0])
                  }
                />
              </label>

              <span style={styles.fileName}>
                {files[c.id]?.name || "No file"}
              </span>

              <button
                style={styles.completeBtn}
                onClick={() => completeTask(c.id)}
              >
                {loading[c.id] ? "Submitting..." : "Complete"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  pg: {
    background: "#f5f5f3",
    minHeight: "100vh",
    padding: "20px"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  greeting: { fontSize: "12px", color: "#aaa" },
  title: { fontSize: "18px" },

  topbarRight: { display: "flex", gap: "10px" },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#E1F5EE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  signoutBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "12px"
  },

  row: {
    display: "flex",
    justifyContent: "space-between"
  },

  id: { fontWeight: "bold" },

  meta: { fontSize: "12px", color: "#aaa" },

  badge: {
    fontSize: "11px",
    padding: "4px 8px",
    borderRadius: "20px"
  },

  badgeOpen: { background: "#FAEEDA" },
  badgeProgress: { background: "#E6F1FB" },
  badgeDone: { background: "#E1F5EE" },

  viewBtn: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#555",
    background: "none",
    border: "none",
    cursor: "pointer"
  },

  details: {
    marginTop: "10px",
    background: "#fafafa",
    padding: "10px",
    borderRadius: "8px"
  },

  detailItem: {
    marginBottom: "8px"
  },

  small: {
    fontSize: "11px",
    color: "#aaa"
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px"
  },

  uploadBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    cursor: "pointer"
  },

  fileName: {
    fontSize: "12px",
    color: "#aaa"
  },

  completeBtn: {
    padding: "6px 12px",
    background: "#085041",
    color: "#9FE1CB",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  }
};

export default Employee;