import React from "react";
import { Stack, TextField, Button } from "@mui/material";
import PlaceAutocomplete from "./PlaceAutocomplete.jsx";

export default function Controls({ addressInput, busy, onChangeAddress, onGeocode, onUseMyLocation, onClearMarker }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
      {/* Text search */}
      <TextField
        label="Buscar dirección"
        placeholder="Ej. Moneda 1201, Santiago, Chile"
        fullWidth
        value={addressInput}
        onChange={(e) => onChangeAddress(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onGeocode(); }}
        sx={{ flex: 1 }}
      />

      {/* Google Places Autocomplete */}
      <PlaceAutocomplete />

      <Button variant="contained" disabled={!addressInput || busy} onClick={onGeocode}>
        Geocodificar
      </Button>
      <Button variant="outlined" disabled={busy} onClick={onUseMyLocation}>
        Usar mi ubicación
      </Button>
      <Button variant="text" color="secondary" disabled={busy} onClick={onClearMarker}>
        Borrar marcador
      </Button>
    </Stack>
  );
}