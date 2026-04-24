import { useState } from "react";
import API from "../../services/api";

function Report({ dept, user, setPage }) {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState("Type your address or autodetect your current location");
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [loading, setLoading] = useState(false);

  // 📍 AUTO DETECT LOCATION
  const autoDetect = () => {
    setDetecting(true);
    setDetected(false);
    setLocStatus("Requesting location access...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setCoords({ lat: latitude, lon: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          setAddress(
            data.display_name ||
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          );

          setLocStatus("Address filled from your current location — edit if needed");
        } catch {
          setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          setLocStatus("Could not resolve address — coordinates used instead");
        }

        setDetecting(false);
        setDetected(true);
      },
      () => {
        setAddress("Anna Salai, Chennai");
        setCoords({ lat: 13.08, lon: 80.27 });
        setLocStatus("Location denied. Default address used.");
        setDetecting(false);
        setDetected(true);
      }
    );
  };

  // 🚀 SUBMIT
  const submit = async () => {
    if (!file || !desc) {
      alert("Upload image and description");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", desc);
    formData.append("lat", coords ? coords.lat : 13.08);
    formData.append("lon", coords ? coords.lon : 80.27);
    formData.append("department", dept);
    formData.append("user_id", user.id);

    try {
      await API.post("/report", formData);
      alert("Complaint submitted 🚀");

      setPage({ type: "dashboard" }); // ✅ FIXED

    } catch (err) {
      console.log(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pg}>
      <button
        style={styles.back}
        onClick={() => setPage({ type: "dashboard" })}
      >
        ‹ Back to dashboard
      </button>

      <div style={styles.pageHeader}>
        <h2 style={styles.title}>Submit complaint</h2>
        <span style={styles.badge}>{dept}</span>
      </div>

      {/* Attachment */}
      <div style={styles.card}>
        <p style={styles.fieldLabel}>Attachment</p>
        <label style={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p style={styles.uploadText}>
            {file ? file.name : "Click to upload image"}
          </p>
          <p style={styles.uploadSub}>
            {file ? "Tap to change" : "JPG, PNG, WEBP up to 10MB"}
          </p>
        </label>
      </div>

      {/* Description */}
      <div style={styles.card}>
        <p style={styles.fieldLabel}>Description</p>
        <textarea
          style={styles.textarea}
          placeholder="Describe the issue..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* Location */}
      <div style={styles.card}>
        <p style={styles.fieldLabel}>Location</p>
        <div style={styles.locRow}>
          <input
            style={styles.addrInput}
            type="text"
            placeholder="Enter location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            style={{
              ...styles.autodetectBtn,
              ...(detecting ? styles.btnDetecting : {}),
              ...(detected ? styles.btnDone : {}),
            }}
            onClick={autoDetect}
            disabled={detecting}
          >
            {detecting ? "Detecting..." : detected ? "Located" : "Autodetect"}
          </button>
        </div>

        <p style={styles.locStatus}>{locStatus}</p>
      </div>

      {/* Submit */}
      <button
        type="button"
        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit complaint"}
      </button>

      <div style={styles.footerTags}>
        {["AI clustering", "Smart assignment", "Real-time tracking"].map((t) => (
          <span key={t} style={styles.tag}>{t}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pg: { background: "#f5f5f3", minHeight: "100vh", padding: "1.5rem", fontFamily: "sans-serif" },

  back: {
    fontSize: "13px",
    color: "#888",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginBottom: "1rem"
  },

  pageHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" },

  title: { fontSize: "18px", color: "#111" },

  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    background: "#E6F1FB",
    color: "#0C447C"
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "10px"
  },

  fieldLabel: { fontSize: "11px", color: "#aaa", marginBottom: "5px" },

  uploadArea: {
    border: "1px dashed #ccc",
    padding: "1rem",
    textAlign: "center",
    borderRadius: "8px",
    cursor: "pointer"
  },

  uploadText: { fontSize: "13px", color: "#555" },

  uploadSub: { fontSize: "11px", color: "#aaa" },

  textarea: {
    width: "100%",
    height: "80px",
    padding: "8px",
    borderRadius: "8px"
  },

  locRow: { display: "flex", gap: "8px" },

  addrInput: { flex: 1, padding: "8px", borderRadius: "8px" },

  autodetectBtn: {
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  btnDetecting: { background: "#E6F1FB" },

  btnDone: { background: "#E1F5EE" },

  locStatus: { fontSize: "11px", color: "#aaa" },

  submitBtn: {
    width: "100%",
    padding: "10px",
    background: "#185FA5",
    color: "white",
    border: "none",
    borderRadius: "8px"
  },

  footerTags: { display: "flex", justifyContent: "center", gap: "8px", marginTop: "1rem" },

  tag: { fontSize: "11px", color: "#aaa" }
};

export default Report;