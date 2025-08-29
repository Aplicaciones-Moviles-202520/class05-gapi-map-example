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
   - **Map Tiles API** (para usar Advanced Markers y Map ID vectorial)
   habilitadas en tu proyecto.
4. Una **API key de Google Maps** con facturación activada y restringida a tus orígenes.
5. Un **Map ID** configurado en Google Cloud para habilitar mapas vectoriales.

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

3. Configurar variables de entorno en la raíz del proyecto:

   ```bash
   echo "VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI" > .env
   echo "VITE_GOOGLE_MAPS_MAP_ID=TU_MAP_ID_AQUI" >> .env
   ```

   ⚠️ Reemplaza `TU_API_KEY_AQUI` por tu clave real y `TU_MAP_ID_AQUI` por el Map ID que generes en Google Cloud.

---

## ▶️ Creación de un Map ID en Google Cloud

1. Abre [Google Cloud Console → Map Management](https://console.cloud.google.com/google/maps-apis/studio/maps).
2. Haz clic en **Create Map ID** y selecciona estilo **Vector**.
3. Personaliza el estilo si lo deseas y publícalo.
4. Copia el **Map ID** (formato `abcd1234efgh5678`) y añádelo a tu archivo `.env` en la variable `VITE_GOOGLE_MAPS_MAP_ID`.
5. Verifica que la **Map Tiles API** esté habilitada en el mismo proyecto de tu API Key.

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
 ├─ App.jsx                # Envoltorio con <GeoProvider> y ThemeProvider
 ├─ state/
 │   ├─ geoContext.jsx     # Context + Provider
 │   └─ useGeoReducer.js   # Reducer + acciones
 ├─ components/
 │   ├─ Controls.jsx       # Barra de búsqueda, botones
 │   ├─ PlaceAutocomplete.jsx # Autocomplete de Google Places
 │   └─ MapView.jsx        # Componente del mapa con AdvancedMarker
 ├─ services/
 │   └─ geocoding.js       # Funciones de geocodificación
 └─ theme.js               # Definición del tema MUI
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
- Geocoding, Places y Map Tiles consumen cuota (ojo con la facturación).
- Para producción, considera mover las llamadas de geocodificación al backend para mayor seguridad.

---

## 🧪 Ejercicio sugerido

- Añadir soporte para **dibujar polígonos** en el mapa.
- Persistir la última ubicación y dirección en `localStorage`.
- Crear tests unitarios para `geoReducer` con [Vitest](https://vitest.dev/).

---
