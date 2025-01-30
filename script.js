/* eslint-disable no-undef */
import { handleZoomEnd, map } from './leaflet.js'

// Crear el mapa centrado en Loja, Ecuador
const $navLayers = document.querySelector('#layers')
const searchInput = document.querySelector('#layer-search')
const $loader = document.querySelector(".loader-container"); 

let layers = []
let canDrop = false
let draggingLi = null
let previewElement = null
let handleZoom

function debounce(func, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}

export function showLoader() {
  $loader.style.display = "flex";
  searchInput.disabled = true
}

export function hideLoader() {
  $loader.style.display = "none";
  searchInput.disabled = false
}

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
      previewElement.style.animation = 'none' // Detener animaciones
      //Desactivar el checkbox de la vista previa
      previewElement.querySelector('input').disabled = true
      previewElement.querySelector('.checkmark').style.animation = 'none'
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

const exclusiveLayers = [
  'DivisonBarrial',
  'DivisionParroquiasUrbanas',
  'GeoformologiaRegional',
  'GeologiaRegional',
  'COS',
  'CUS',
  'UsoDeSueloGeneral',
  'SueloConsolidado',
  'SueloNoConsolidado',
  'SueloDeProteccion'
];

const soilLayers = [
  'SueloConsolidado',
  'SueloNoConsolidado',
  'SueloDeProteccion'
];

// Función para desactivar otras capas exclusivas
function disableExclusiveLayers(selectedLayerName) {
  exclusiveLayers.forEach(layerName => {
      if (layerName !== selectedLayerName && !soilLayers.includes(layerName)) {
          const checkbox = document.querySelector(`input[data-layer-name="${layerName}"]`);
          if (checkbox) {
              checkbox.checked = false;
              checkbox.disabled = true;
              checkbox.parentElement.style.opacity = 0.5;
          }
      }
  });
}

// Función para reactivar las capas exclusivas
function enableExclusiveLayers() {
  exclusiveLayers.forEach(layerName => {
      const checkbox = document.querySelector(`input[data-layer-name="${layerName}"]`);
      if (checkbox && !checkbox.checked) { 
          checkbox.disabled = false;
          checkbox.parentElement.style.opacity = 1;
      }
  });
}
function addLayerOption(layer, opciones, displayName, zoom) {
  const layerAux = L.geoJSON(layer, opciones);
  const checkbox = document.createElement('input');
  const li = document.createElement('li');
  checkbox.type = 'checkbox';
  checkbox.checked = false;
  const label = document.createElement('label')
  label.classList.add('container')
  label.appendChild(checkbox)
  checkbox.id = 'layer-' + layerAux._leaflet_id; 
  checkbox.setAttribute('data-layer-name', layer.name); 
  console.log("son", opciones);

  checkbox.onchange = function () {
      if (checkbox.checked) {
          $navLayers.removeChild(li);
          $navLayers.prepend(li);
          if (layers.find(l => ('layer-' + l._leaflet_id) === checkbox.id)) return;
          console.log('adding layer', layerAux);
          layers.push(layerAux);

          if (!zoom) {
              layerAux.addTo(map);
          } else {
              console.log('adding zoom event');
              handleZoom = handleZoomEnd.bind(null, layerAux, zoom); // Guardar la referencia
              map.on('zoomend', handleZoom);
          }

          // Desactivar otras capas exclusivas si se selecciona una capa exclusiva
          if (exclusiveLayers.includes(layer.name)) {
              disableExclusiveLayers(layer.name);
          }
      } else {
          $navLayers.removeChild(li);
          $navLayers.append(li);

          // Encontrar la capa a eliminar usando _leaflet_id
          const layerDeleted = layers.find(l => 'layer-' + l._leaflet_id === checkbox.id);
          console.log('layer to be deleted', layerDeleted);

          if (layerDeleted) { // Verificar que layerDeleted no sea undefined
              if (handleZoom && zoom) {
                  console.log('removing zoom event');
                  map.off('zoomend', handleZoom); // Usar la referencia exacta
                  layers.splice(layers.indexOf(layerDeleted), 1);
              }

              if (map.hasLayer(layerDeleted)) {
                  map.removeLayer(layerDeleted);
                  layers.splice(layers.indexOf(layerDeleted), 1);
                  console.log('removing layer', layerDeleted, layers);
              }
          } else {
              console.error('Layer not found:', checkbox.id);
          }

          // Reactivar las capas exclusivas si se deselecciona una capa exclusiva
          if (exclusiveLayers.includes(layer.name)) {
              enableExclusiveLayers();
          }
      }
  };

  li.innerHTML = displayName || layer.name;
  li.draggable = true;
  li.addEventListener('dragstart', function (e) {
      draggingLi = li;
      e.dataTransfer.setData('text/plain', checkbox.id);
      e.dataTransfer.effectAllowed = 'move';
      li.style.opacity = 0.5;
      e.dataTransfer.setDragImage(li, 0, 0);
  });

  li.addEventListener('dragend', function (e) {
      li.style.opacity = 1;

      if (previewElement) {
          draggingLi.style.display = 'flex';
          draggingLi = null;
          previewElement.remove();
          previewElement = null;
      }
  });
  label.appendChild(checkbox)
  const div = document.createElement('div')
  div.classList.add('checkmark')
  label.appendChild(div)
  li.appendChild(label)
  $navLayers.appendChild(li);
}

// Función para cargar capas GeoJSON
export async function cargarCapa(archivo, opciones = {}, displayName, zoom) {
  try {
    const response = await fetch(archivo);
    const data = await response.json();
    addLayerOption(data, opciones, displayName, zoom);
  } catch (err) {
    return console.error(`Error al cargar ${archivo}:`, err);
  }
}

// Evento para filtrar capas en tiempo real
searchInput.addEventListener('input', debounce(searchLayer, 300)) 

function searchLayer () {
  const searchText = this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const layerItems = document.querySelectorAll('#layers li')

  if(this.value === '') {
    layerItems.forEach(item => {
      item.style.display = 'flex' // Mostrar si no hay texto
    })
    updateListLayer()
    return
  }

  layerItems.forEach(item => {
    const layerName = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (layerName.includes(searchText)) {
      item.style.display = 'flex' // Mostrar si coincide
    } else {
      item.style.display = 'none' // Ocultar si no coincide
    }
  })
}
