import { showDialog } from "./script.js";

export const capas = [
    {
        nombre: 'Cantones.geojson', displayName: 'Cantones', config: {
            style: {
                color: 'blue',
                weight: 1
            }
        }
    },
    {
        nombre: 'CantonLoja.geojson', displayName: 'Cantón Loja', config: {
            style: {
                color: 'green',
                weight: 1
            }
        }
    },
    {
        nombre: 'ConjuntoDeParroquias.geojson', displayName: 'Conjunto de Parroquias', config: {
            style: {
                color: 'purple',
                weight: 1
            }
        }
    },
    {
        nombre: 'COS.geojson', displayName: 'COS', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    alert(`COS: ${feature.properties['COS%']}`)
                })
                layer.on('mouseover', function () {
                    this.setStyle({ weight: 3, fillOpacity: 1 }); // Aumenta el grosor del borde
                });
        
                layer.on('mouseout', function () {
                    this.setStyle({ weight: 2, fillOpacity: 0.5 }); // Vuelve al tamaño normal
                });
            },
        }
    },
    {
        nombre: 'CUS.geojson', displayName: 'CUS', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    },
    {
        nombre: 'DivisionParroquial.geojson', displayName: 'División Parroquial', config: {
            style: {
                color: 'red',
                weight: 1
            }
        }
    },
    {
        nombre: 'DivisionParroquiasUrbanas.geojson', displayName: 'División de Parroquias Urbanas', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    },
    {
        nombre: 'DivisonBarrial.geojson', displayName: 'División Barrial', config: {
            style: {
                color: 'cyan',
                weight: 2
            }
        }
    },
    {
        nombre: 'GeoformologiaRegional.geojson', displayName: 'Geoformología Regional', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    },
    {
        nombre: 'GeologiaRegional.geojson', displayName: 'Geología Regional', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    },
    {
        nombre: 'Hidrografia.geojson', displayName: 'Hidrografía', config: {
            style: {
                color: 'blue',
                weight: 1
            }
        }
    },
    {
        nombre: 'LimiteUrbano2009.geojson', displayName: 'Límite Urbano 2009', config: {
            style: {
                color: 'black',
                weight: 1
            }
        }
    },
    {
        nombre: 'LimiteUrbano2021.geojson', displayName: 'Límite Urbano 2021', config: {
            style: {
                color: 'blue',
                weight: 1
            }
        }
    },
    {
        nombre: 'Parroquias.geojson', displayName: 'Parroquias', config: {
            style: {
                color: 'green',
                weight: 1
            }
        }
    },
    {
        nombre: 'Predial2015.geojson', displayName: 'Predial 2015', config: {
            style: {
                color: 'purple',
                weight: 1
            }
        }
    },
    {
        nombre: 'ProvinciaDeLoja.geojson', displayName: 'Provincia de Loja', config: {
            style: {
                color: 'orange',
                weight: 1
            }
        }
    },
    {
        nombre: 'Provincias.geojson', displayName: 'Provincias', config: {
            style: {
                color: 'brown',
                weight: 1
            }
        }
    },
    {
        nombre: 'RedDeAlcantarillados.geojson', displayName: 'Red de Alcantarillados', config: {
            style: {
                color: 'blue',
                weight: 1
            }
        }
    },
    {
        nombre: 'SueloConsolidado.geojson', displayName: 'Suelo Consolidado', config: {
            style: {
                color: 'green',
                weight: 1,
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    showDialog(feature.properties)
                })
                layer.on('mouseover', function () {
                    this.setStyle({ weight: 3, fillOpacity: 1 }); // Aumenta el grosor del borde
                });
        
                layer.on('mouseout', function () {
                    this.setStyle({ weight: 1, fillOpacity: 0.3 }); // Vuelve al tamaño normal
                });
            },
        }
    },
    {
        nombre: 'SueloDeProteccion.geojson', displayName: 'Suelo de Protección', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    },
    {
        nombre: 'SueloNoConsolidado.geojson', displayName: 'Suelo No Consolidado', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    },
    {
        nombre: 'Urbanizaciones.geojson', displayName: 'Urbanizaciones', config: {
            pointToLayer: (feature, latlng) => {                
                return L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'custom-text-icon', // Clase personalizada para estilizar el texto
                        html: feature.properties.Nombre, // Contenido del texto
                        iconSize: [0, 0] // Sin tamaño adicional para el ícono
                    })
                })
            }
        }, zoom: 17
    },
    {
        nombre: 'UsoDeSueloGeneral.geojson', displayName: 'Uso de Suelo General', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
        }
    }
];
