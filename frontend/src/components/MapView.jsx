import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import API from "../services/api";
import "leaflet/dist/leaflet.css";

function MapView() {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    API.get("/clusters").then((res) => {
      setClusters(res.data);
    });
  }, []);

  return (
    <MapContainer
      center={[13.08, 80.27]}
      zoom={13}
      style={{ height: "500px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {clusters.map((c, i) => (
        <Circle
          key={i}
          center={[c.lat, c.lon]}
          radius={c.count * 50}
        >
          <Popup>
            <b>{c.id}</b><br />
            Reports: {c.count}<br />
            Assigned: {c.assigned_to}<br />
            Status: {c.status}
          </Popup>
        </Circle>
      ))}
    </MapContainer>

  );
}

export default MapView;