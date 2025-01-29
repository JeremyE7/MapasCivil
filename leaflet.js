/* eslint-disable no-undef */
import { cargarCapa } from './script.js'

export const map = L.map('map').setView([-3.99313, -79.20422], 13) // Coordenadas y zoom inicial

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

// cargarCapa('geojson/DIVISIONBARRIAL/DivisionBarrialHatch.geojson', {
//   style: feature => ({
//     weight: 2,
//     color: feature.properties.color,
//     opacity: 1,
//     fillOpacity: 0.5
//   }),
//   onEachFeature: (feature, layer) => {
//     layer.bindTooltip(feature.properties.Nombres, { permanent: false, direction: 'left' })
//     layer.on('mouseover', function () {
//       layer.setStyle({
//         fillOpacity: 0.7
//       })
//     })

//     layer.on('mouseout', function () {
//       layer.setStyle({
//         fillOpacity: 0.5,
//         color: feature.properties.color
//       })
//     })
//   }
// })

// cargarCapa('geojson/PerimetroUrbano.geojson', {
//   style: {
//     color: 'black',
//     weight: 1
//   }
// })

const capas = [
  { nombre: 'Cantones.geojson', color: 'blue' },
  { nombre: 'CantonLoja.geojson', color: 'green' },
  { nombre: 'ConjuntoDeParroquias.geojson', color: 'purple' },
  { nombre: 'COS.geojson', color: 'orange' },
  { nombre: 'CUS.geojson', color: 'brown' },
  { nombre: 'DivisionParroquial.geojson', color: 'red' },
  { nombre: 'DivisionParroquiasUrbanas.geojson', color: 'cyan' },
  { nombre: 'DivisonBarrial.geojson', color: 'pink' },
  { nombre: 'GeoformologiaRegional.geojson', color: 'yellow' },
  { nombre: 'GeologiaRegional.geojson', color: 'teal' },
  { nombre: 'Hidrografia.geojson', color: 'blue' },
  { nombre: 'LimiteUrbano2009.geojson', color: 'black' },
  { nombre: 'LimiteUrbano2021.geojson', color: 'black' },
  { nombre: 'Parroquias.geojson', color: 'green' },
  { nombre: 'Predial2015.geojson', color: 'purple' },
  { nombre: 'ProvinciaDeLoja.geojson', color: 'orange' },
  { nombre: 'Provincias.geojson', color: 'brown' },
  { nombre: 'RedDeAlcantarillados.geojson', color: 'blue' },
  { nombre: 'SueloConsolidado.geojson', color: 'green' },
  { nombre: 'SueloDeProteccion.geojson', color: 'red' },
  { nombre: 'SueloNoConsolidado.geojson', color: 'yellow' },
  { nombre: 'Urbanizaciones.geojson', color: 'pink' },
  { nombre: 'UsoDeSueloGeneral.geojson', color: 'teal' }
];

capas.forEach(capa => {
  cargarCapa(`geojson/${capa.nombre}`, {
    style: {
      color: capa.color,
      weight: 1
    }
  });
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
