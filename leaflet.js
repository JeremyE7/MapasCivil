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

cargarCapa('geojson/Cantones.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/CantonLoja.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/ConjuntoDeParroquias.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/DivisionParroquial.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/DivisionParroquiasUrbanas.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/DivisonBarrial.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/GeoformologiaRegional.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/GeologiaRegional.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/LimiteUrbano2009.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/LimiteUrbano2021.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/Parroquias.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/Predial2015.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/ProvinciaDeLoja.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/Provincias.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/RedDeAlcantarillados.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/SueloConsolidado.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/SueloDeProteccion.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/SueloNoConsolidado.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/Urbanizaciones.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/UsoDeSueloGeneral.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/COS.geojson', {
  style: {
    color: 'black',
    weight: 1
  }
})

cargarCapa('geojson/CUS.geojson', {
  style: {
    color: 'black',
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
