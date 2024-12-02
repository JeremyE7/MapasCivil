/* eslint-disable no-undef */
// Crear el mapa centrado en Loja, Ecuador
const $navLayers = document.querySelector('#layers')
const layers = []
let canDrop = false
let draggingLi = null

function dragoverHandler (ev) {
  ev.preventDefault()

  if (draggingLi === ev.target) {
    canDrop = false
  } else {
    ev.dataTransfer.dropEffect = 'move'
    canDrop = true
    // // Colocar una vista previa del elemento en donde se va a soltar
    // if (ev.target.tagName.toLowerCase() === 'li') {
    //   ev.target.parentElement.insertBefore(draggingLi, ev.target)
    // } else {
    //   $navLayers.appendChild(draggingLi)
    // }
  }
}

function dropHandler (ev) {
  ev.preventDefault()
  const data = ev.dataTransfer.getData('text/plain')
  const li = document.querySelector(`#${data}`).parentElement
  console.log(ev.target.nextSibling)
  const nextLi = ev.target.nextSibling

  if (ev.target.tagName.toLowerCase() === 'li' && canDrop) {
    console.log(ev.target.nextSibling)
    $navLayers.removeChild(li)

    if (nextLi === draggingLi) {
      console.log('inserting before', ev.target)
      $navLayers.insertBefore(li, ev.target)
    } else {
      console.log('appending', ev.target)
      $navLayers.insertBefore(li, ev.target.nextSibling)
    }

    if (!nextLi) {
      console.log('appending at the end', ev.target)
      $navLayers.appendChild(li)
      return
    }
  }
  draggingLi = null
  canDrop = false
  li.style.opacity = 1
}

$navLayers.addEventListener('dragover', dragoverHandler)
$navLayers.addEventListener('drop', dropHandler)

const map = L.map('map').setView([-3.99313, -79.20422], 13) // Coordenadas y zoom inicial

// Agregar un mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map)

function addLayerOption (layer, opciones) {
  const layerAux = L.geoJSON(layer, opciones)
  const checkbox = document.createElement('input')
  const li = document.createElement('li')
  checkbox.type = 'checkbox'
  checkbox.checked = false
  checkbox.id = 'layer-' + layerAux._leaflet_id
  checkbox.onchange = function () {
    if (checkbox.checked) {
      if (layers.find(l => ('layer-' + l._leaflet_id) === checkbox.id)) return
      console.log('adding layer', layerAux)
      layers.push(layerAux)
      layerAux.addTo(map)
    } else {
      const layerAux = layers.find(l => 'layer-' + l._leaflet_id === checkbox.id)
      console.log('removing layer', layerAux, layers)
      if (map.hasLayer(layerAux)) {
        map.removeLayer(layerAux)
        layers.splice(layers.indexOf(layerAux), 1)
      }
    }
  }

  li.innerHTML = layer.name
  li.draggable = true
  li.addEventListener('dragstart', function (e) {
    draggingLi = li
    e.dataTransfer.setData('text/plain', checkbox.id)
    e.dataTransfer.effectAllowed = 'move'
    li.style.opacity = 0.5
    e.dataTransfer.setDragImage(li, 0, 0)
  })

  li.addEventListener('dragend', function (e) {
    draggingLi = null
    li.style.opacity = 1
  })
  li.appendChild(checkbox)
  $navLayers.appendChild(li)
}

// Función para cargar capas GeoJSON
function cargarCapa (archivo, opciones = {}) {
  fetch(archivo)
    .then(response => response.json())
    .then(data => {
      addLayerOption(data, opciones)
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
    // console.log(feature, layer)
    layer.bindTooltip(feature.properties.Nombres, { permanent: false, direction: 'left' })
    layer.on('mouseover', function () {
      layer.setStyle({
        fillOpacity: 1
      })
    })

    layer.on('mouseout', function () {
      layer.setStyle({
        fillOpacity: 0.5,
        color: feature.properties.color
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
