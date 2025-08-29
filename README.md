# Clase 5: Demo React + Google Maps API + MUI

Este proyecto demuestra cómo integrar en una aplicación **React 19** (con Vite + Yarn):

- **Web Geolocation API** del navegador (para detectar la ubicación actual).
- **Google Maps JavaScript API** con un mapa interactivo.
- **Marcadores (placemarks)** y ventanas de información.
- **Geocoding / Reverse Geocoding** (dirección ↔ coordenadas).
- **Google Places Autocomplete** para sugerencias de direcciones.
- **Material UI (MUI)** para la interfaz.

El código está estructurado con **componentes cohesivos**, un **estado centralizado con reducer** y un **Context Provider** (`GeoProvider`).

---

## 🚀 Requisitos

1. **Node.js 18+** (se recomienda instalar con [nvm](https://github.com/nvm-sh/nvm)).
2. **Yarn** como gestor de dependencias.
3. Una cuenta en [Google Cloud Console](https://console.cloud.google.com/), con:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Places API**
   habilitadas en tu proyecto.
4. Una **API key de Google Maps** con facturación activada y restringida a tus orígenes.

---

## ⚙️ Instalación

1. Crear un nuevo proyecto con Vite:

   ```bash
   yarn create vite my-geo-demo --template react-swc
   cd my-geo-demo
   ```

2. Instalar dependencias:

   ```bash
   yarn add react@latest react-dom@latest
   yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled
   yarn add @react-google-maps/api
   ```

3. Configurar variable de entorno en la raíz del proyecto:

   ```bash
   echo "VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI" > .env
   ```

   ⚠️ Reemplaza `TU_API_KEY_AQUI` por tu clave real.

---

## ▶️ Ejecución

Levanta el servidor de desarrollo con:

```bash
yarn dev
```

El proyecto estará disponible normalmente en:

```
http://localhost:5173
```

---

## 📂 Estructura principal

```
src/
 ├─ App.jsx                # Envoltorio con <GeoProvider>
 ├─ state/
 │   ├─ geoContext.jsx     # Context + Provider
 │   └─ useGeoReducer.js   # Reducer + acciones
 ├─ components/
 │   ├─ Controls.jsx       # Barra de búsqueda, botones
 │   ├─ PlaceAutocomplete.jsx # Autocomplete de Google Places
 │   └─ MapView.jsx        # Componente del mapa
 └─ services/
     └─ geocoding.js       # Funciones de geocodificación
```

---

## ✨ Funcionalidades

- Al iniciar, la app solicita permiso de geolocalización:
  - Si se concede → centra el mapa en tu ubicación.
  - Si no → usa Santiago de Chile como fallback.
- Puedes:
  - Buscar una dirección manualmente.
  - Usar **autocomplete** de Google Places.
  - Hacer click en el mapa para mover el marcador.
  - Obtener la dirección correspondiente (reverse geocoding).
  - Usar el botón **“Usar mi ubicación”** para centrar el mapa en tu posición actual.

---

## 🔒 Notas docentes

- La **Geolocation API** solo funciona sobre `https://` o `http://localhost`.
- La **API Key** debe estar restringida por dominios en Google Cloud.
- Geocoding y Places consumen cuota (ojo con la facturación).
- Para producción, considera mover las llamadas de geocodificación al backend para mayor seguridad.

---

## 🧪 Ejercicio sugerido

- Añadir soporte para **dibujar polígonos** en el mapa.
- Persistir la última ubicación y dirección en `localStorage`.
- Crear tests unitarios para `geoReducer` con [Vitest](https://vitest.dev/).

---
