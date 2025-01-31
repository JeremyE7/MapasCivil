/* eslint-disable no-undef */
import { handleZoomEnd, map } from './leaflet.js'

// Crear el mapa centrado en Loja, Ecuador
const $navLayers = document.querySelector('#layers')
const searchInput = document.querySelector('#layer-search')
const $loader = document.querySelector('.loader-container')
const $buttonHelper = document.querySelector('.helper button')
const $spanHelper = document.querySelector('.helper article')
const $buttonCleaner = document.querySelector('.input-container button')
const $dialog = document.querySelector('.dialog')
const $buttonCloseDialog = document.querySelector('.dialog .close-dialog')
const $alcantarillado = document.querySelector('.RedDeAlcantarillados')
const $geologia = document.querySelector('.GeologiaRegional')
const $geoformologia = document.querySelector('.GeoformologiaRegional')

const sueloConsolidadoResponse = await fetch('table/SueloConsolidado.json')
const sueloConsolidado = await sueloConsolidadoResponse.json()

const SueloNoConsolidadoResponse = await fetch('table/SueloNoConsolidado.json')
const SueloNoConsolidado = await SueloNoConsolidadoResponse.json()

let layers = []
let canDrop = false
let draggingLi = null
let previewElement = null
let handleZoom

function changeCursorPointerCheckbox(checkbox, type) {
  checkbox.style.cursor = type
  checkbox.nextElementSibling.style.cursor = type
  checkbox.parentElement.style.cursor = type
  checkbox.parentElement.previousSibling.style.cursor = type
}


document.addEventListener('keydown', function (e) {
  //Hacer que haga focus en el input cuando se presione CTRL + F
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault()
    searchInput.focus()
  }
})

$buttonHelper.addEventListener('click', function () {
  $spanHelper.style.display =  $spanHelper.style.display == 'flex' ? 'none' : 'flex'
})

$buttonCleaner.addEventListener('click', function () {
  $navLayers.scrollTop = 0
  //Resetear checkboxs
  const checkboxes = document.querySelectorAll('#layers input')
  checkboxes.forEach(checkbox => {
    checkbox.checked = false
    const parent = checkbox.parentElement.parentElement
    //Poner estilos de desactivado al componente
    parent.style.opacity = 1
    checkbox.disabled = false
    parent.removeAttribute('data-tooltip')
    //Quitar el icono del puntero al checkbox
    changeCursorPointerCheckbox(checkbox, 'pointer')
  })
  $buttonCleaner.style.pointerEvents = 'none'
  $buttonCleaner.style.opacity = 0.5    
  removeAllLayers()
  updateListLayer()
  renderAllLayers()
  addTextHelpers()
})

function debounce(func, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}
function clearDialogContent() {
  $dialog.querySelector('section').innerHTML = ''
}

$buttonCloseDialog.addEventListener('click', function () {
  $dialog.close()
  setTimeout(clearDialogContent, 200)
})

export function showDialog(properties) {
  console.log('Showing dialog', properties);
  const keys = Object.keys(properties)
  keys.forEach(key => {
    let keyAux = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    if(keyAux === 'Color' || keyAux === 'Fid' || keyAux === 'Uso_genera') return
    if(keyAux === 'Descripcio') keyAux = 'Descripción'
    if(keyAux === 'Pit'){
      const soil = getInfoCodeSuelo(properties[key])
      if(soil){
        const keys = Object.keys(soil)
        keys.forEach(key => {
          const keyAux = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
          const value = soil[key]
          const div = document.createElement('div')
          const span = document.createElement('span')
          const span2 = document.createElement('span')
          span.textContent = keyAux
          span2.textContent = value
          div.appendChild(span)
          div.appendChild(span2)
          $dialog.querySelector('section').appendChild(div)
        })
        return
      }
    }
    const value = properties[key]
    const div = document.createElement('div')
    const span = document.createElement('span')
    const span2 = document.createElement('span')
    span.textContent = keyAux
    span2.textContent = value
    div.appendChild(span)
    div.appendChild(span2)
    $dialog.querySelector('section').appendChild(div)
  })
  $dialog.showModal();
}

export function showLoader() {
  $loader.style.display = 'flex'
  searchInput.disabled = true
}

export function hideLoader() {
  $loader.style.display = 'none'
  searchInput.disabled = false
}

function dragoverHandler(ev) {
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
      // Desactivar el checkbox de la vista previa
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

function addTextHelpers() {
  //Recuperar solo los checkbox activados
  const checkboxes = document.querySelectorAll('#layers input:checked')
  console.log('checkboxes', checkboxes);
  checkboxes.forEach(checkbox => {
    if(checkbox.getAttribute('data-layer-name') === 'GeologiaRegional'){
      $geologia.style.display = 'flex'
    }
    if(checkbox.getAttribute('data-layer-name') === 'RedDeAlcantarillados'){
      $alcantarillado.style.display = 'flex'
    }
    if(checkbox.getAttribute('data-layer-name') === 'GeoformologiaRegional'){
      $geoformologia.style.display = 'flex'
    }
  })
  
  //Recuperar solo los checkbox desactivados
  const checkboxesDisabled = document.querySelectorAll('#layers input:not(:checked)')
  checkboxesDisabled.forEach(checkbox => {
    if(checkbox.getAttribute('data-layer-name') === 'GeologiaRegional'){
      $geologia.style.display = 'none'
    }
    if(checkbox.getAttribute('data-layer-name') === 'RedDeAlcantarillados'){
      $alcantarillado.style.display = 'none'
    }
    if(checkbox.getAttribute('data-layer-name') === 'GeoformologiaRegional'){
      $geoformologia.style.display = 'none'
    }
  })

}

function dropHandler(ev) {
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
  if(originalLi.querySelector('input').disabled){
    console.log('disabled');
    return
  }
  originalLi.style.opacity = 1 // Restaura opacidad
}

$navLayers.addEventListener('dragover', dragoverHandler)
$navLayers.addEventListener('drop', dropHandler)

function updateListLayer() {
  // Verificar que orden tienen las capas en el dom y actualizar el orden de la lista
  const layersDOM = document.querySelectorAll('#layers li')
  const layersChecked = Array.from(layersDOM).filter(l => l.querySelector('input').checked)
  const layersId = layersChecked.map(l => l.querySelector('input').id)
  const layersAux = layersId.map(id => {
    console.log(id)

    return layers.find(l => 'layer-' + l._leaflet_id === id)
  })
  console.log(layersId, layersDOM, layersAux)
  layers = layersAux
}

function renderAllLayers() {
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

function removeAllLayers() {
  layers.forEach(layer => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer)
    }
  })
}

const exclusiveLayers = [
  'DivisionBarrialRelleno',
  'DivisionParroquiasUrbanas',
  'GeoformologiaRegional',
  'GeologiaRegional',
  'COS',
  'CUS',
  'UsoDeSueloGeneral',
  'SueloConsolidado',
  'SueloNoConsolidado',
  'SueloDeProteccion'
]

const soilLayers = [
  'SueloConsolidado',
  'SueloNoConsolidado',
  'SueloDeProteccion'
]

// Función para desactivar otras capas exclusivas
function disableExclusiveLayers(selectedLayer) {
  console.log('Disabling exclusive layers for', selectedLayer);

  exclusiveLayers.forEach(layerName => {
    if (layerName == selectedLayer.name || soilLayers.includes(layerName)) return

    const checkbox = document.querySelector(`input[data-layer-name="${layerName}"]`)
    
    if (!checkbox) return

    const parent = checkbox.parentElement.parentElement
    parent.setAttribute('data-tooltip', 'Solo puede seleccionar una capa de este tipo')
    //Poner estilos de desactivado al componente
    parent.style.opacity = 0.5
    checkbox.checked = false
    checkbox.disabled = true

    //Quitar el icono del puntero al checkbox
    changeCursorPointerCheckbox(checkbox, 'auto')

    // Eliminar capa del array de capas
    console.log('layers', layers, checkbox.id.split('-')[1]);
    
    const layerDeleted = layers.find(l => l._leaflet_id.toString() === checkbox.id.split('-')[1])
    console.log('layer to be disable', layerDeleted);
    
    if (!layerDeleted) return
    if (!map.hasLayer(layerDeleted)) return

    map.removeLayer(layerDeleted)
    layers.splice(layers.indexOf(layerDeleted), 1)
  })
}

// Función para reactivar las capas exclusivas
function enableExclusiveLayers() {
  exclusiveLayers.forEach(layerName => {
    const checkbox = document.querySelector(`input[data-layer-name="${layerName}"]`)
    if (checkbox && !checkbox.checked) {
      checkbox.disabled = false
      checkbox.parentElement.parentElement.style.opacity = 1
      checkbox.style.cursor = 'auto'
      checkbox.parentElement.parentElement.removeAttribute('data-tooltip')
      changeCursorPointerCheckbox(checkbox, 'pointer')
    }
  })
}
function addLayerOption(layer, opciones, displayName, zoom) {
  const layerAux = L.geoJSON(layer, opciones)
  const checkbox = document.createElement('input')
  const li = document.createElement('li')
  checkbox.type = 'checkbox'
  checkbox.checked = false
  const label = document.createElement('label')
  label.classList.add('container')
  label.appendChild(checkbox)
  checkbox.id = 'layer-' + layerAux._leaflet_id
  checkbox.setAttribute('data-layer-name', layer.name)

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

      // Desactivar otras capas exclusivas si se selecciona una capa exclusiva
      if (exclusiveLayers.includes(layer.name)) {
        disableExclusiveLayers(layer)
      }
    } else {
      $navLayers.removeChild(li)
      $navLayers.append(li)

      // Encontrar la capa a eliminar usando _leaflet_id
      console.log('layers', layers)

      const layerDeleted = layers.find(l => 'layer-' + l._leaflet_id === checkbox.id)
      console.log('layer to be deleted', layerDeleted)

      if (layerDeleted) { // Verificar que layerDeleted no sea undefined
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
      } else {
        console.error('Layer not found:', checkbox.id)
      }

      // Reactivar las capas exclusivas si se deselecciona una capa exclusiva
      if (exclusiveLayers.includes(layer.name)) {
        enableExclusiveLayers()
      }
    }
    if(layers.length > 0) {
      $buttonCleaner.style.pointerEvents = 'auto'
      $buttonCleaner.style.opacity = 1
    }else{
      $buttonCleaner.style.pointerEvents = 'none'
      $buttonCleaner.style.opacity = 0.5
    }
    console.log('Layers:', layers);
    addTextHelpers()
  }

  li.innerHTML = `<label for="${checkbox.id}">${displayName || layer.name}</label>`
  li.draggable = true
  li.addEventListener('dragstart', function (e) {
    draggingLi = li
    e.dataTransfer.setData('text/plain', checkbox.id)
    e.dataTransfer.effectAllowed = 'move'
    li.style.opacity = 0.5
    e.dataTransfer.setDragImage(li, 0, 0)
  })

  li.addEventListener('dragend', function (e) {
    if(!li.querySelector('input').disabled){
      li.style.opacity = 1
    }

    if (previewElement) {
      draggingLi.style.display = 'flex'
      draggingLi = null
      previewElement.remove()
      previewElement = null
    }
  })
  label.appendChild(checkbox)
  const div = document.createElement('div')
  div.classList.add('checkmark')
  label.appendChild(div)
  li.appendChild(label)
  $navLayers.appendChild(li)
}

// Función para cargar capas GeoJSON
export async function cargarCapa(archivo, opciones = {}, displayName, zoom) {
  try {
    const response = await fetch(archivo)
    const data = await response.json()
    addLayerOption(data, opciones, displayName, zoom)
  } catch (err) {
    return console.error(`Error al cargar ${archivo}:`, err)
  }
}

// Evento para filtrar capas en tiempo real
searchInput.addEventListener('input', debounce(searchLayer, 300))

function searchLayer() {
  const searchText = this.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const layerItems = document.querySelectorAll('#layers li')

  if (this.value === '') {
    layerItems.forEach(item => {
      item.style.display = 'flex' // Mostrar si no hay texto
    })
    updateListLayer()
    return
  }

  layerItems.forEach(item => {
    const layerName = item.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (layerName.includes(searchText)) {
      item.style.display = 'flex' // Mostrar si coincide
      item.style.animation = 'none'
      item.style.animation = 'appear 0.5s forwards'
    } else {
      item.style.display = 'none' // Ocultar si no coincide
    }
  })
}

export function decodificarCodigo(codigo) {
  // Caso especial: SCEU00000
  if (codigo === "SCEU00000") {
      return {
          subclasificacion: "Suelo Consolidado",
          usoGeneral: "Equipamiento Urbano",
          sumaAreaAltura: "No requiere",
          areaMinimaLote: "No requiere",
          explicacion: "El polígono tiene un tipo de suelo consolidado destinado a equipamiento urbano. No requiere la determinación de características de ocupación referidas al lote mínimo, altura ni área de lote por vivienda."
      };
  }

  const subclasificacionCodigo = codigo.substring(0, 1);
  const usoGeneralCodigo = codigo.substring(2, 4);
  const sumaAreaAlturaCodigo = codigo.substring(4, 7); 
  const areaMinimaCodigo = codigo.substring(8, 10);

  // Decodificar la subclasificación del suelo
  let subclasificacion;
  switch (subclasificacionCodigo) {
      case "SC":
          subclasificacion = "Suelo Consolidado";
          break;
      case "NC":
          subclasificacion = "Suelo No Consolidado";
          break;
      case "SP":
          subclasificacion = "Suelo de Protección";
          break;
      default:
          subclasificacion = "Desconocido";
  }

  // Decodificar el uso general del suelo
  let usoGeneral;
  switch (usoGeneralCodigo) {
      case "R1":
          usoGeneral = "Residencial Tipo 1 (vivienda unifamiliar, bifamiliar y comercio de giro primario)";
          break;
      case "R2":
          usoGeneral = "Residencial Tipo 2 (vivienda unifamiliar, bifamiliar, multifamiliar y comercio de giro primario, secundario)";
          break;
      case "R3":
          usoGeneral = "Residencial Tipo 3 (vivienda unifamiliar, bifamiliar, multifamiliar y comercio todos los giros)";
          break;
      case "IS":
          usoGeneral = "Vivienda de Interés Social";
          break;
      case "EU":
          usoGeneral = "Equipamiento Urbano";
          break;
      case "AU":
          usoGeneral = "Agricultura Urbana";
          break;
      case "ST":
          usoGeneral = "Servicios Turísticos";
          break;
      default:
          usoGeneral = "Desconocido";
  }

  // Decodificar la suma del área del lote mínimo y la altura de la edificación
  const sumaAreaAltura = parseInt(sumaAreaAlturaCodigo, 10);

  // Decodificar el área mínima del lote por vivienda
  const areaMinimaLote = parseInt(areaMinimaCodigo, 10);

  // Crear la explicación descriptiva
  const explicacion = `El polígono tiene un tipo de suelo ${subclasificacion.toLowerCase()} destinado a ${usoGeneral.toLowerCase()}. ` +
      `En este caso, la suma del área del lote mínimo y la altura de la edificación es ${sumaAreaAltura}. ` +
      `El área mínima del lote por vivienda es de ${areaMinimaLote} m².`;
  return {
      subclasificacion,
      usoGeneral,
      sumaAreaAltura,
      areaMinimaLote,
      explicacion
  };
}

function getInfoCodeSuelo (code) {
  const soil = sueloConsolidado.find(soil => soil.PIT === code)
  if(soil) return soil
  const soilN = SueloNoConsolidado.find(soil => soil.PIT === code)
  return soilN
} 