import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationMarker({ setPosition }) {
    const [position, setLocalPosition] = useState(null);

    useMapEvents({
        click(e) {
            setLocalPosition(e.latlng);
            setPosition(e.latlng);
        },
    });

    return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({ onLocationSelect }) {
    const defaultPosition = [20.5937, 78.9629]; // India center (change if needed)

    return (
        <MapContainer
            center={defaultPosition}
            zoom={5}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setPosition={onLocationSelect} />
        </MapContainer>
    );
}