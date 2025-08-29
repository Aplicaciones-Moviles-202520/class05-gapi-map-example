import React, { useEffect, useRef } from "react";
import { Box, Paper, Stack, Typography, Divider, CircularProgress, Snackbar, Alert } from "@mui/material";
import Controls from "./components/Controls.jsx";
import MapView from "./components/MapView.jsx";
import { GeoProvider, useGeo } from "./state/geoContext.jsx";
import { geocodeAddress, reverseGeocode } from "./services/geocoding.js";
import { useJsApiLoader } from "@react-google-maps/api";

function AppInner() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
  const { state, actions } = useGeo();
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places", "marker"],
  });

  // Boot: geolocalización del navegador. No llamar reverse hasta que isLoaded sea true.
  useEffect(() => {
    if (!apiKey) { actions.setError("Falta VITE_GOOGLE_MAPS_API_KEY en tu .env"); }
    if (!navigator.geolocation) { actions.setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        actions.setCenter(c);
        actions.setMarker({ position: c });
        actions.setSnack("Ubicación actual detectada");
        actions.setLoading(false);
      },
      () => {
        actions.setSnack("No se otorgaron permisos de ubicación. Usando Santiago, CL.");
        actions.setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando el script esté listo, si ya hay marcador, hacemos reverse.
  useEffect(() => {
    if (isLoaded && state.marker?.position) {
      handleReverse(state.marker.position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, state.marker?.position]);

  if (loadError) return <Alert severity="error">Error cargando Google Maps</Alert>;
  if (!apiKey) return <Alert severity="warning">Agrega VITE_GOOGLE_MAPS_API_KEY a tu .env</Alert>;
  if (!isLoaded) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: "60vh" }}>
        <CircularProgress />
        <Typography sx={{ mt: 1 }} variant="body2">Cargando Google Maps…</Typography>
      </Stack>
    );
  }

  const handleMapLoad = (m) => { mapRef.current = m; };
  const handleMapUnmount = () => { mapRef.current = null; };
  const panTo = (latLng) => { if (mapRef.current) mapRef.current.panTo(latLng); };

  // Commands (UI → state + services)
  const handleGeocode = async () => {
    if (!state.addressInput) return;
    actions.setBusy(true);
    try {
      const { latLng, formatted } = await geocodeAddress(state.addressInput);
      actions.setCenter(latLng);
      actions.setMarker({ position: latLng });
      actions.setResolvedAddress(formatted);
      panTo(latLng);
    } catch (e) {
      actions.setError(`No se pudo geocodificar la dirección: ${e.message}`);
    } finally {
      actions.setBusy(false);
    }
  };

  const handleReverse = async (latLng) => {
    if (!latLng) return;
    actions.setBusy(true);
    try {
      const formatted = await reverseGeocode(latLng);
      actions.setResolvedAddress(formatted);
    } catch (e) {
      actions.setError(`No se pudo obtener dirección para estas coordenadas: ${e.message}`);
    } finally {
      actions.setBusy(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { actions.setError("Geolocation no disponible"); return; }
    actions.setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        actions.setCenter(c);
        actions.setMarker({ position: c });
        panTo(c);
        handleReverse(c);
        actions.setBusy(false);
      },
      () => { actions.setBusy(false); actions.setError("No se pudo obtener la ubicación actual"); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    actions.setMarker({ position: pos });
    actions.setCenter(pos);
    handleReverse(pos);
  };

  return (
    <>
      <Controls
        addressInput={state.addressInput}
        busy={state.busy}
        onChangeAddress={actions.setAddressInput}
        onGeocode={handleGeocode}
        onUseMyLocation={handleUseMyLocation}
        onClearMarker={actions.clearMarker}
      />
      <Divider sx={{ my: 2 }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Box sx={{ flex: 1 }}>
          <MapView
            center={state.center}
            marker={state.marker}
            resolvedAddress={state.resolvedAddress}
            loading={state.loading}
            onMapLoad={handleMapLoad}
            onMapUnmount={handleMapUnmount}
            onClick={handleMapClick}
          />
        </Box>

        <Paper variant="outlined" sx={{ p: 2, minWidth: 320 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Estado actual</Typography>
          <Typography variant="body2"><b>Centro:</b> {state.center.lat.toFixed(6)}, {state.center.lng.toFixed(6)}</Typography>
          <Typography variant="body2"><b>Dirección resuelta:</b> {state.resolvedAddress || "—"}</Typography>
          {state.busy && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <CircularProgress size={18} />
              <Typography variant="caption">Consultando geocodificador…</Typography>
            </Stack>
          )}
        </Paper>
      </Stack>
      <Snackbar open={!!state.snack} autoHideDuration={4000} onClose={() => actions.setSnack("")}> 
        <Alert onClose={() => actions.setSnack("")} severity="info" variant="filled">{state.snack}</Alert>
      </Snackbar>
      <Snackbar open={!!state.error} autoHideDuration={6000} onClose={() => actions.setError("")}> 
        <Alert onClose={() => actions.setError("")} severity="error" variant="filled">{state.error}</Alert>
      </Snackbar>
    </>
  );
}

export default function App() {
  // ⬇️ Envolver AppInner con GeoProvider para que useGeo tenga contexto
  return (
    <GeoProvider>
      <AppInner />
    </GeoProvider>
  );
}