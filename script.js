// Crear el mapa centrado en Loja, Ecuador
const map = L.map('map').setView([-3.99313, -79.20422], 13); // Coordenadas y zoom inicial

// Agregar un mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para cargar capas GeoJSON
function cargarCapa(archivo, opciones = {}) {
  fetch(archivo)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, opciones).addTo(map);
    })
    .catch(err => console.error(`Error al cargar ${archivo}:`, err));
}

// Estilos y configuración para cada capa
cargarCapa('geojson/perimetro_urbano.geojson', {
  style: {
    color: 'red',
    weight: 2
  }
});

cargarCapa('geojson/parroquias_urbanas.geojson', {
  style: {
    color: 'blue',
    fillOpacity: 0.4
  },
  onEachFeature: (feature, layer) => {
    layer.bindPopup(`<strong>Parroquia:</strong> ${feature.properties.nombre}`);
  }
});

cargarCapa('geojson/nombre_calles.geojson', {
  pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
    radius: 5,
    fillColor: 'yellow',
    color: 'black',
    weight: 1,
    fillOpacity: 0.8
  }),
  onEachFeature: (feature, layer) => {
    layer.bindPopup(`<strong>Calle:</strong> ${feature.properties.nombre}`);
  }
});
