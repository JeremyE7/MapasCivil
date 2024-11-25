/* eslint-disable no-undef */
// Crear el mapa centrado en Loja, Ecuador
const map = L.map('map').setView([-3.99313, -79.20422], 13) // Coordenadas y zoom inicial

// Agregar un mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map)

// Función para cargar capas GeoJSON
function cargarCapa (archivo, opciones = {}) {
  fetch(archivo)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, opciones).addTo(map)
    })
    .catch(err => console.error(`Error al cargar ${archivo}:`, err))
}

cargarCapa('geojson/DIVISIONBARRIAL/DivisionBarrialHatch.geojson', {
  style: feature => ({
    weight: 2,
    color: feature.properties.color,
    opacity: 1,
    fillOpacity: 0.5
  }),
  onEachFeature: (feature, layer) => {
    console.log(feature, layer)
    layer.bindTooltip(feature.properties.Nombres, { permanent: false, direction: 'left' })
    // Resaltar al pasar el ratón
    layer.on('mouseover', function () {
      layer.setStyle({
        fillOpacity: 1 // Incrementar opacidad
      })
    })

    // Restaurar estilo original al salir
    layer.on('mouseout', function () {
      layer.setStyle({
        fillOpacity: 0.5, // Restaurar opacidad original
        color: feature.properties.color // Restaurar color original
      })
    })
  }
})

cargarCapa('geojson/PerimetroUrbano.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/Hidrografia.geojson', {
  style: {
    color: 'blue',
    weight: 1
  }
})

// ESTO VA BIEN MAL JAJAJA
// cargarCapa('geojson/Predrial2015.geojson', {
//   style: {
//     color: 'black',
//     weight: 1,
//     opacity: 0.5
//   }
// });

cargarCapa('geojson/DIVISIONBARRIAL/DivisionBarrial.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

// cargarCapa('geojson/DIVISIONBARRIAL/Texto.geojson', {
//   style: {
//     color: 'red',
//     weight: 1
//   }
// });

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
