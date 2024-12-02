/* eslint-disable no-undef */
// Crear el mapa centrado en Loja, Ecuador
const $navLayers = document.querySelector('#layers')
let layers = []
let canDrop = false
let draggingLi = null
let previewElement = null

function dragoverHandler (ev) {
  ev.preventDefault()

  if (draggingLi === ev.target) {
    canDrop = false
  } else {
    ev.dataTransfer.dropEffect = 'move'
    canDrop = true

    // Colocar la vista previa del elemento
    if (!previewElement) {
      previewElement = draggingLi.cloneNode(true) // Crear la copia del elemento
      previewElement.style.opacity = 0.5 // Vista previa semi-transparente
      previewElement.style.pointerEvents = 'none' // Sin interactividad
      previewElement.id = `preview-${draggingLi.id}` // ID único
    }

    // Asegurarse de que no haya múltiples vistas previas
    if (ev.target.tagName.toLowerCase() === 'li') {
      draggingLi.style.display = 'none'
      if (ev.target.nextSibling) {
        $navLayers.insertBefore(previewElement, ev.target.nextSibling)
      } else {
        $navLayers.appendChild(previewElement)
      }
    }
  }
}

function dropHandler (ev) {
  ev.preventDefault()
  console.log('Drop')

  const data = ev.dataTransfer.getData('text/plain')
  const originalLi = document.querySelector(`#${data}`).parentElement
  draggingLi.style.display = 'flex'

  if (!canDrop || !draggingLi) return

  if (previewElement) {
    console.log('Dropped', draggingLi, 'before', previewElement.nextSibling)

    previewElement.after(draggingLi) // Inserta el elemento arrastrado
    previewElement.remove() // Elimina la vista previa
    previewElement = null
  }
  updateListLayer()
  renderAllLayers()
  draggingLi = null
  canDrop = false
  originalLi.style.opacity = 1 // Restaura opacidad
}

$navLayers.addEventListener('dragover', dragoverHandler)
$navLayers.addEventListener('drop', dropHandler)

function updateListLayer () {
  // Verificar que orden tienen las capas en el dom y actualizar el orden de la lista
  const layersDOM = document.querySelectorAll('#layers li')
  const layersChecked = Array.from(layersDOM).filter(l => l.lastChild.checked)
  const layersId = layersChecked.map(l => l.lastChild.id)
  const layersAux = layersId.map(id => {
    console.log(id)

    return layers.find(l => 'layer-' + l._leaflet_id === id)
  })
  console.log(layersId, layersDOM, layersAux)
  layers = layersAux
}

function renderAllLayers () {
  console.log('Rendering all layers', layers)

  // Eliminar todas las capas del mapa
  layers.forEach(layer => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer)
    }
  })
  // Añadir todas las capas al mapa
  layers.reverse().forEach(layer => {
    layer.addTo(map)
  })
}

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
    li.style.opacity = 1

    if (previewElement) {
      draggingLi.style.display = 'flex'
      draggingLi = null
      previewElement.remove()
      previewElement = null
    }
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
