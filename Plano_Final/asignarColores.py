# Definir el diccionario con las categorías y colores
categories_colors = {
    '1.1. Barrio Central': '#30123b',
    '1.2. Santo Domingo': '#351e59',
    '1.3. 18 de Noviembre': '#392b75',
    '1.4. Juan de Salinas': '#3d368d',
    '1.5. 24 de Mayo': '#4142a5',
    '1.6. Orillas del Zamora': '#434db8',
    '1.7. Ramon Pinto': '#4558ca',
    '1.8. Perpetuo Socorro': '#4664da',
    '2.1. Maximo Agustin Rodri': '#476ee6',
    '2.2. Pucara': '#4778f0',
    '2.3. Pradera': '#4683f9',
    '2.4. Yaguarcuna': '#458dfd',
    '2.5. Los Geranios': '#4098ff',
    '2.6. El Rosal': '#3aa2fc',
    '2.7. Capuli': '#33adf7',
    '2.8. Zamora Huayco': '#2cb7f0',
    '3.1. San Juan del Valle': '#25c0e7',
    '3.10. Amable Maria': '#1fc9dc',
    '3.2. San Cayetano': '#1ad3d1',
    '3.3. Las Palmas': '#18dac7',
    '3.4. Santiago Fernandez': '#19e1bc',
    '3.5. Jipiro': '#1de7b3',
    '3.6. La Inmaculada': '#25eca7',
    '3.7. La Estancia': '#2ff19b',
    '3.8. Chinguilanchi': '#3cf58e',
    '3.9. La Paz': '#4bf87f',
    '4.1. Gran Colombia': '#5afb72',
    '4.10. Borja': '#6bfd64',
    '4.11. Obrapia': '#7bff57',
    '4.12. Menfis': '#8aff4c',
    '4.13. Chonta Cruz': '#99fe42',
    '4.14. Bolonia': '#a4fc3c',
    '4.16. Tierras Coloradas': '#affa37',
    '4.17. Celi Roman': '#baf635',
    '4.18. Alborada': '#c4f134',
    '4.19. Miraflores': '#cfeb34',
    '4.2. San Jose': '#d8e436',
    '4.3. San Vicente': '#e1dd37',
    '4.4. Capuli Loma': '#e9d539',
    '4.5. El Pedestal': '#efcd3a',
    '4.6. Clodoveo': '#f5c53a',
    '4.7. Turunuma': '#f9bb39',
    '4.8. Belen': '#fcb236',
    '4.9. Plateado': '#fea832',
    '5.1. La Argelia': '#fe9c2e',
    '5.10. Colinas Lojanas': '#fe9129',
    '5.11. Ciudad Alegria': '#fc8423',
    '5.12. Juan Jose Castillo': '#f9781e',
    '5.2. San Isidro': '#f66b19',
    '5.3. Heroes del Cenepa': '#f25f14',
    '5.4. Sol de los Andes': '#ed5410',
    '5.5. Santa Teresita': '#e74a0c',
    '5.6. Daniel Alvarez': '#e14209',
    '5.7. Tebaida': '#da3907',
    '5.8. Isidro Ayora': '#d23105',
    '5.9. San Pedro': '#ca2a04',
    '6.1. Pitas': '#c02302',
    '6.2. La Banda': '#b61c02',
    '6.3. Motupe': '#ab1701',
    '6.4. Sauces Norte': '#9f1101',
    '6.5. Salapa': '#930c01',
    '6.6. Carigan': '#850702'
}

# Cargar la capa activa
layer = iface.activeLayer()
if not layer:
    print("Error: No hay una capa activa.")

# Verificar si el campo 'color' existe, si no, crearlo
field_name = 'color'
if field_name not in [field.name() for field in layer.fields()]:
    layer.dataProvider().addAttributes([QgsField(field_name, QVariant.String)])
    layer.updateFields()

# Iterar sobre las características de la capa
for feature in layer.getFeatures():
    # Suponiendo que el campo de categoría se llama 'categoria'
    category_value = feature['Nombres']  # Cambia 'categoria' por el nombre correcto del campo
    print(category_value)
    color_value = categories_colors.get(category_value)

    if color_value:
        # Asignar el color al campo 'color'
        feature[field_name] = color_value
        layer.updateFeature(feature)

# Guardar los cambios
if not layer.commitChanges():
    print("Error al guardar los cambios en la capa.")
else:
    print("Colores actualizados exitosamente.")
