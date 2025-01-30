/* eslint-disable no-undef */
import { handleZoomEnd, map } from './leaflet.js'

// Crear el mapa centrado en Loja, Ecuador
const $navLayers = document.querySelector('#layers')
let layers = []
let canDrop = false
let draggingLi = null
let previewElement = null
let handleZoom

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
    if (!layer.options.pointToLayer) {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer)
      }
    }
  })
  // Añadir todas las capas al mapa
  layers.reverse().forEach(layer => {
    if (!layer.options.pointToLayer) {
      console.log('Adding layer', layer, layer.options.pointToLayer)
      layer.addTo(map)
    }
  })
}

function addLayerOption (layer, opciones, displayName,zoom) {
  const layerAux = L.geoJSON(layer, opciones)
  const checkbox = document.createElement('input')
  const li = document.createElement('li')
  checkbox.type = 'checkbox'
  checkbox.checked = false
  checkbox.classList.add('ui-checkbox')
  checkbox.id = 'layer-' + layerAux._leaflet_id
  console.log("son", opciones)
  checkbox.onchange = function () {
    if (checkbox.checked) {
      $navLayers.removeChild(li)
      $navLayers.prepend(li)
      if (layers.find(l => ('layer-' + l._leaflet_id) === checkbox.id)) return
      console.log('adding layer', layerAux)
      layers.push(layerAux)
      if (!zoom) {
        layerAux.addTo(map)
      } else {
        console.log('adding zoom event')
        handleZoom = handleZoomEnd.bind(null, layerAux, zoom) // Guardar la referencia
        map.on('zoomend', handleZoom)
      }
    } else {
      $navLayers.removeChild(li)
      $navLayers.append(li)

      const layerDeleted = layers.find(l => 'layer-' + l._leaflet_id === checkbox.id)
      console.log('layer to be deleted', map.hasLayer(layerDeleted))

      if (handleZoom && zoom) {
        console.log('removing zoom event')
        map.off('zoomend', handleZoom) // Usar la referencia exacta
        layers.splice(layers.indexOf(layerDeleted), 1)
      }

      if (map.hasLayer(layerDeleted)) {
        map.removeLayer(layerDeleted)
        layers.splice(layers.indexOf(layerDeleted), 1)
        console.log('removing layer', layerDeleted, layers)
      }
    }
  }

  li.innerHTML = displayName || layer.name
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
export function cargarCapa (archivo, opciones = {}, displayName, zoom) {
  fetch(archivo)
    .then(response => response.json())
    .then(data => {
      addLayerOption(data, opciones, displayName, zoom)
    })
    .catch(err => console.error(`Error al cargar ${archivo}:`, err))
}

// Agregar barra de búsqueda
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Buscar capa...';
searchInput.id = 'layer-search';
searchInput.classList.add('layer-search');

// Insertar la barra de búsqueda en el nav
const layersContainer = document.getElementById('layers');
layersContainer.parentElement.insertBefore(searchInput, layersContainer);

// Evento para filtrar capas en tiempo real
searchInput.addEventListener('input', function () {
  const searchText = this.value.toLowerCase();
  const layerItems = document.querySelectorAll('#layers li');

  layerItems.forEach(item => {
    const layerName = item.textContent.toLowerCase();
    if (layerName.includes(searchText)) {
      item.style.display = 'block'; // Mostrar si coincide
    } else {
      item.style.display = 'none'; // Ocultar si no coincide
    }
  });

  // Mostrar u ocultar categorías según si tienen capas visibles
  const categoryLists = document.querySelectorAll('.category');
  categoryLists.forEach(category => {
    const items = category.querySelectorAll('.category-list li');
    const hasVisibleItems = Array.from(items).some(item => item.style.display !== 'none');
    
    category.style.display = hasVisibleItems ? 'block' : 'none';
  });
});
