import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
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

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
}

export default function AdvancedMap({ latitude, longitude, radius = 2, services = [] }) {
  // Use React state to store and dynamically update the pin's coordinates
  const [coordinates, setCoordinates] = useState([latitude || 18.537026, longitude || 73.806788]);

  useEffect(() => {
    if (latitude != null && longitude != null) {
      setCoordinates([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div style={{ height: '500px', width: '100%' }} className="relative border-spacing-7 rounded-xl border-orange-500">
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
        
        <RecenterMap center={coordinates} />
        <MapClickHandler setCoordinates={setCoordinates} />
        
        <Marker 
          position={coordinates} 
          icon={createAdvancedIcon("O", "#1e90ff")}
        >
          <Popup>
            <strong>Active Coordinates</strong> <br /> 
            Lat: {coordinates[0].toFixed(6)} <br />
            Lng: {coordinates[1].toFixed(6)}
          </Popup>
        </Marker>

        <Circle
          center={coordinates}
          radius={radius * 1000}
          pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.2, weight: 2 }}
        />

        {services.map((service) => {
          const serviceLat = service.latitude ?? service.lat ?? service.location?.lat;
          const serviceLng = service.longitude ?? service.lng ?? service.location?.lng;
          if (serviceLat == null || serviceLng == null) return null;

          return (
            <Marker
              key={service.id || `${serviceLat}-${serviceLng}`}
              position={[serviceLat, serviceLng]}
              icon={createAdvancedIcon(service.title?.charAt(0) || 'S', '#ef4444')}
            >
              <Popup>
                <strong>{service.title || 'Service'}</strong>
                <div className="text-sm">
                  {service.categoryName ? `${service.categoryName}` : ''}
                </div>
                <div className="text-xs text-slate-500">
                  {service.distance != null ? `Distance: ${service.distance.toFixed(1)} km` : ''}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
