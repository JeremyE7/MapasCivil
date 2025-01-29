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
const categorias = {
  'Límites': ['LimiteUrbano2009', 'LimiteUrbano2021'],
  'Divisiones Administrativas': ['Cantones', 'CantonLoja', 'Parroquias', 'ProvinciaDeLoja', 'Provincias'],
  'Geología': ['GeologiaRegional', 'GeoformologiaRegional'],
  'Hidrografía': ['Hidrografia'],
  'Uso del Suelo': ['SueloConsolidado', 'SueloDeProteccion', 'SueloNoConsolidado', 'UsoDeSueloGeneral'],
  'Infraestructura': ['RedDeAlcantarillados', 'Urbanizaciones'],
};

function addLayerOption(layer, opciones, zoom) {
  const layerAux = L.geoJSON(layer, opciones);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = false;
  checkbox.id = 'layer-' + layerAux._leaflet_id;

  // 🔍 Obtener nombre desde properties
  const feature = layer.name;
  const nombreCapa = feature || 'Capa sin nombre';

  checkbox.onchange = function () {
    if (checkbox.checked) {
      layers.push(layerAux);
      layerAux.addTo(map);
    } else {
      map.removeLayer(layerAux);
      layers = layers.filter(l => l !== layerAux);
    }
  };

  const label = document.createElement('label');
  label.textContent = nombreCapa;
  label.prepend(checkbox);

  const li = document.createElement('li');
  li.appendChild(label);

  // 📌 Buscar en qué categoría está la capa
  let categoriaEncontrada = null;
  for (const [categoria, capas] of Object.entries(categorias)) {
    if (capas.includes(nombreCapa)) {
      categoriaEncontrada = categoria;
      break;
    }
  }

  // 📌 Si pertenece a una categoría, agrupar en un <div> específico
  if (categoriaEncontrada) {
    let categoryDiv = document.getElementById(`category-${categoriaEncontrada.replace(/\s+/g, '-')}`);
    
    if (!categoryDiv) {
      categoryDiv = document.createElement('div');
      categoryDiv.id = `category-${categoriaEncontrada.replace(/\s+/g, '-')}`;
      categoryDiv.classList.add('category');

      const categoryHeader = document.createElement('div');
      categoryHeader.classList.add('category-header');
      categoryHeader.textContent = categoriaEncontrada;
      categoryHeader.onclick = function () {
        const list = categoryDiv.querySelector('.category-list');
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
      };

      const categoryList = document.createElement('ul');
      categoryList.classList.add('category-list');
      categoryList.style.display = 'none'; // Iniciar oculto

      categoryDiv.appendChild(categoryHeader);
      categoryDiv.appendChild(categoryList);
      document.getElementById('layers').appendChild(categoryDiv);
    }

    categoryDiv.querySelector('.category-list').appendChild(li);
  } else {
    document.getElementById('layers').appendChild(li);
  }
}


// Función para cargar capas GeoJSON
export function cargarCapa (archivo, opciones = {}, zoom) {
  fetch(archivo)
    .then(response => response.json())
    .then(data => {
      addLayerOption(data, opciones, zoom)
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
