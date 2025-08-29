import React, { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { TextField } from "@mui/material";
import { useGeo } from "../state/geoContext.jsx";

// Muestra un segundo input con sugerencias de Google Places.
// Al elegir una sugerencia, centra el mapa y coloca marcador.
export default function PlaceAutocomplete() {
  const acRef = useRef(null);
  const { actions } = useGeo();

  const onLoad = (ac) => { acRef.current = ac; };
  const onUnmount = () => { acRef.current = null; };

  const onPlaceChanged = () => {
    const place = acRef.current?.getPlace();
    if (!place || !place.geometry) return;
    const loc = place.geometry.location;
    const latLng = { lat: loc.lat(), lng: loc.lng() };
    actions.setCenter(latLng);
    actions.setMarker({ position: latLng });
    actions.setResolvedAddress(place.formatted_address || place.name || "");
  };

  return (
    <Autocomplete onLoad={onLoad} onUnmount={onUnmount} onPlaceChanged={onPlaceChanged}>
      <TextField label="Autocomplete" placeholder="Escribe y elige…" sx={{ minWidth: 240 }} />
    </Autocomplete>
  );
}