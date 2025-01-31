import { showDialog } from "./script.js";

export const capas = [
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
        nombre: 'CUS.geojson', displayName: 'CUS', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
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
        nombre: 'DivisionParroquial.geojson', displayName: 'División Parroquial (Sin relleno)', config: {
            style: {
                color: 'red',
                weight: 1
            }
        }
    },
    {
        nombre: 'DivisionParroquiasUrbanas.geojson', displayName: 'División Parroquial', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
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
        nombre: 'DivisonBarrial.geojson', displayName: 'División Barrial (Sin Relleno)', config: {
            style: {
                color: 'cyan',
                weight: 2
            }
        }
    },
    {
        nombre: 'DivisionBarrialRelleno.geojson', displayName: 'División Barrial', config: {
            style: feature => ({
                color: feature.properties.color,
                weight: 2
            }),
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
        nombre: 'GeoformologiaRegional.geojson', displayName: 'Geoformología Regional', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
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
        nombre: 'GeologiaRegional.geojson', displayName: 'Geología Regional', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
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
        nombre: 'Predial2015.geojson', displayName: 'División Catastral', config: {
            style: {
                color: 'purple',
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
        nombre: 'SueloNoConsolidado.geojson', displayName: 'Suelo No Consolidado', config: {
            style: feature => ({
                weight: 2,
                color: feature.properties.color,
                opacity: 1,
                fillOpacity: 0.5
            }),
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
    }
];
