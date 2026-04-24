function Navbar({ setPage }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#111827",
      color: "white"
    }}>
      <h2>Smart Civic AI</h2>

      <div>
        <button className="button" onClick={() => setPage("user")}>User</button>
        <button className="button" onClick={() => setPage("admin")}>Admin</button>
        <button className="button" onClick={() => setPage("employee")}>Employee</button>
      </div>
    </div>
  );
}
export default Navbar;