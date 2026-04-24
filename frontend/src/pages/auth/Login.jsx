import { useState } from "react";
import API from "../../services/api";

function Login({ setUser }) {
  const [role, setRole] = useState("user");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !password) return;
    setLoading(true);
    try {
      let res;
      if (role === "user") res = await API.post("/login/user", { email: id, password });
      else if (role === "employee") res = await API.post("/login/employee", { emp_id: id, password });
      else res = await API.post("/login/admin", { admin_id: id, password });

      if (res.data.status === "success") setUser(res.data);
      else alert("Invalid credentials");
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  const roles = ["user", "employee", "admin"];
  const idLabel = { user: "Email address", employee: "Employee ID", admin: "Admin ID" };
  const idPlaceholder = { user: "you@example.com", employee: "EMP-XXXXXX", admin: "ADMIN-XXXXXX" };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="4" fill="#B5D4F4" />
              <path d="M10 2v3M10 15v3M2 10h3M15 10h3" stroke="#E6F1FB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="10" r="7" stroke="#B5D4F4" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <h1 style={styles.title}>Smart Civic AI</h1>
        </div>
        <p style={styles.subtitle}>AI-powered civic complaint system</p>

        {/* Role tabs */}
        <div style={styles.roleTabs}>
          {roles.map((r) => (
            <button
              key={r}
              style={{ ...styles.roleTab, ...(role === r ? styles.roleTabActive : {}) }}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* ID field */}
        <div style={styles.field}>
          <label style={styles.label}>{idLabel[role]}</label>
          <input
            style={styles.input}
            type="text"
            placeholder={idPlaceholder[role]}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        {/* Password field */}
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <hr style={styles.divider} />
        <p style={styles.footerNote}>Secure login — your data is protected</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f5f3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 1rem",
  },
  card: {
    background: "#ffffff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "360px",
  },
  logoRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "8px",
    background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: "20px", fontWeight: 500, color: "#111", margin: 0 },
  subtitle: { fontSize: "13px", color: "#888", marginBottom: "2rem", paddingLeft: "46px" },
  roleTabs: {
    display: "flex", gap: "6px", background: "#f1efe8",
    borderRadius: "8px", padding: "4px", marginBottom: "1.5rem",
  },
  roleTab: {
    flex: 1, padding: "7px 0", fontSize: "13px", border: "none",
    borderRadius: "6px", background: "transparent", color: "#888", cursor: "pointer",
  },
  roleTabActive: {
    background: "#fff", color: "#111", fontWeight: 500,
    border: "0.5px solid rgba(0,0,0,0.15)",
  },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "12px", color: "#888", marginBottom: "5px" },
  input: {
    width: "100%", padding: "9px 12px", fontSize: "14px",
    borderRadius: "8px", border: "0.5px solid rgba(0,0,0,0.15)",
    background: "#f5f5f3", color: "#111", outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%", padding: "10px", fontSize: "14px", fontWeight: 500,
    background: "#185FA5", color: "#E6F1FB", border: "none",
    borderRadius: "8px", cursor: "pointer", marginTop: "0.5rem",
  },
  divider: { border: "none", borderTop: "0.5px solid rgba(0,0,0,0.1)", margin: "1.5rem 0" },
  footerNote: { textAlign: "center", fontSize: "12px", color: "#aaa" },
};

export default Login;