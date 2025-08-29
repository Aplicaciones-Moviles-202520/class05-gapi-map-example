import React, { useMemo } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Box, Typography } from "@mui/material";

const containerStyle = { width: "100%", height: "60vh", borderRadius: "16px" };

export default function MapView({ center, marker, loading, onMapLoad, onMapUnmount, onClick, resolvedAddress }) {
  const mapOptions = useMemo(
    () => ({ mapTypeControl: false, streetViewControl: false, fullscreenControl: true, clickableIcons: true }),
    []
  );

  if (loading) {
    return (
      <Box sx={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2">Cargando mapa…</Typography>
      </Box>
    );
  }

  return (
    <GoogleMap
      onLoad={onMapLoad}
      onUnmount={onMapUnmount}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={mapOptions}
      onClick={onClick}
    >
      {marker && (
        <Marker position={marker.position} title="Marcador de ejemplo">
          {resolvedAddress && (
            <InfoWindow position={marker.position}>
              <Box sx={{ maxWidth: 260 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Dirección</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{resolvedAddress}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Coordenadas</Typography>
                <Typography variant="body2">
                  {marker.position.lat.toFixed(6)}, {marker.position.lng.toFixed(6)}
                </Typography>
              </Box>
            </InfoWindow>
          )}
        </Marker>
      )}
    </GoogleMap>
  );
}