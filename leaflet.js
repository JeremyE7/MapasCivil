/* eslint-disable no-undef */
import { cargarCapa } from './script.js'
export const map = L.map('map').setView([-3.99313, -79.20422], 13) // Coordenadas y zoom inicial
import { capas } from './layers.js'
// Agregar un mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map)

export function handleZoomEnd (layer, zoom) {
  if (map.getZoom() >= zoom) {
    if (!map.hasLayer(layer)) {
      map.addLayer(layer)
    }
  } else {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer)
    }
  }
}


capas.forEach(capa => {
  cargarCapa(`geojson/${capa.nombre}`, capa.config, capa.displayName);
});

// ESTO VA BIEN MAL JAJAJA
// cargarCapa('geojson/Predrial2015.geojson', {
//   style: {
//     color: 'black',
//     weight: 1,
//     opacity: 0.5
//   }
// });

// cargarCapa('geojson/DIVISIONBARRIAL/DivisionBarrial.geojson', {
//   style: {
//     color: 'black',
//     weight: 1
//   }
// })

// cargarCapa('geojson/DIVISIONBARRIAL/Texto.geojson', {
//   pointToLayer: (feature, latlng) => {
//     return L.marker(latlng, {
//       icon: L.divIcon({
//         className: 'custom-text-icon', // Clase personalizada para estilizar el texto
//         html: feature.properties.text, // Contenido del texto
//         iconSize: [0, 0] // Sin tamaño adicional para el ícono
//       })
//     })
//   }
// }, 15)


// cargarCapa('geojson/NOMBRES/NombreCalles.geojson', {
//   pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
//     radius: 5,
//     fillColor: 'yellow',
//     color: 'black',
//     weight: 1,
//     fillOpacity: 0.8
//   }),
//   onEachFeature: (feature, layer) => {
//     console.log(feature);

//     layer.bindPopup(`<strong>Calle:</strong> ${feature.properties.text}`);
//   }
// });

/* Evento para mostrar nombre al pasar raton por encima */
