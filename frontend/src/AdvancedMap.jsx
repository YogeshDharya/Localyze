import React, { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 1. Your Custom Marker React Component
const AdvancedCustomPin = ({ label, color }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transform: 'translate(-50%, -100%)' 
    }}>
      <div style={{
        backgroundColor: color || '#ff4757',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        border: '2px solid white'
      }}>
        {label}
      </div>
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `8px solid ${color || '#ff4757'}`,
        marginTop: '-2px'
      }} />
    </div>
  );
};

// 2. Helper function for Leaflet divIcon
const createAdvancedIcon = (label, color) => {
  const htmlString = renderToString(<AdvancedCustomPin label={label} color={color} />);
  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [30, 42], // Adjust size as needed
    iconAnchor: [0, 0]
  });
};

// 3. NEW: Click Listener Component using Leaflet Hooks
function MapClickHandler({ setCoordinates }) {
  useMapEvents({
    click(e) {
      // e.latlng contains the clicked coordinates [lat, lng]
      setCoordinates([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null; // This component doesn't render visual elements, it only listens to events
}

export default function AdvancedMap() {
  // Use React state to store and dynamically update the pin's coordinates
  const [coordinates, setCoordinates] = useState([18.537026, 73.806788]); 

  return (
    <div style={{ height: '500px', width: '100%' }} className="border-spacing-7 rounded-xl border-orange-500">
      {/* Display coordinates outside the map to verify it updates */}
      {/* <div style={{ padding: '10px', background: '#f5f5f5', fontWeight: 'bold' }}>
        Current Pin Coordinates: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
      </div> */}

      <MapContainer className="rounded-xl bg-white/80 dark:bg-slate-800/80"
        center={coordinates} 
        zoom={13} 
        style={{ height: 'calc(100% - 40px)', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Wire up the click handler component inside MapContainer */}
        <MapClickHandler setCoordinates={setCoordinates} />
        
        <Marker 
          position={coordinates} 
          icon={createAdvancedIcon(" ", "#1e90ff")}
        >
          <Popup>
            <strong>Active Coordinates</strong> <br /> 
            Lat: {coordinates[0].toFixed(6)} <br />
            Lng: {coordinates[1].toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
