# 🎮 Juego de Palabras para Niños

Un juego educativo interactivo diseñado especialmente para niños de 2 años. El objetivo es ayudar a los pequeños a aprender palabras mediante la asociación con imágenes usando la técnica de arrastrar y soltar.

## 🌟 Características

- **Interfaz táctil optimizada** para iPad y dispositivos móviles
- **Progresión de dificultad** con 3 niveles:
  - Nivel 1: 3 palabras y 3 imágenes
  - Nivel 2: 5 palabras y 5 imágenes  
  - Nivel 3: 10 palabras y 10 imágenes
- **Animaciones y efectos** de celebración
- **Diseño colorido y atractivo** para mantener la atención
- **Fuente Comic Sans** fácil de leer para niños
- **Sonidos visuales** con emojis y confeti

## 🚀 Cómo usar

1. **Abrir el juego**: Abre `index.html` en tu navegador web
2. **Arrastrar palabras**: Toca y arrastra las palabras desde la parte superior
3. **Soltar en imágenes**: Suelta cada palabra sobre la imagen correspondiente
4. **Completar niveles**: Completa todos los emparejamientos para avanzar al siguiente nivel
5. **Celebrar**: ¡Disfruta de las animaciones de celebración!

## 📱 Instalación en iPad

Para instalar el juego como una app en tu iPad:

1. Abre Safari en tu iPad
2. Navega a la página del juego
3. Toca el botón de "Compartir" 📤
4. Selecciona "Añadir a pantalla de inicio"
5. ¡Listo! Ahora tienes el juego como una app independiente

## 🎨 Personalización

### Agregar nuevas palabras

Para agregar más palabras al juego, edita el archivo `script.js` y modifica el objeto `gameData`:

```javascript
const gameData = {
    level1: [
        { word: 'NUEVA_PALABRA', emoji: '🆕', id: 'nueva' },
        // ... más palabras
    ],
    // ... otros niveles
};
```

### Cambiar colores

Para personalizar los colores, modifica el archivo `styles.css`:

```css
/* Cambiar color de fondo principal */
body {
    background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
}

/* Cambiar color de las tarjetas de palabras */
.word-card {
    background: linear-gradient(135deg, #TU_COLOR_3, #TU_COLOR_4);
}
```

## 🎯 Objetivos Educativos

- **Reconocimiento de palabras**: Asociar texto con imágenes
- **Motricidad fina**: Desarrollar habilidades de arrastrar y soltar
- **Coordinación ojo-mano**: Mejorar la precisión táctil
- **Vocabulario**: Aprender nuevas palabras de forma visual
- **Autoestima**: Celebrar logros con animaciones positivas

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica del juego
- **CSS3**: Diseño responsivo y animaciones
- **JavaScript**: Lógica del juego y interactividad
- **PWA**: Aplicación web progresiva para instalación

## 🐛 Solución de Problemas

### El drag and drop no funciona en iPad
- Asegúrate de usar Safari (es el navegador recomendado)
- Verifica que JavaScript esté habilitado
- Intenta reiniciar el navegador

### Las animaciones van lentas
- Cierra otras aplicaciones en el iPad
- Verifica que tengas suficiente memoria disponible
- Usa la última versión de Safari

### No se escuchan sonidos
- Este juego usa efectos visuales en lugar de sonidos
- Los efectos de celebración aparecen como confeti en pantalla

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Puedes:

1. Agregar nuevas palabras e imágenes
2. Mejorar las animaciones
3. Añadir nuevos niveles de dificultad
4. Optimizar el rendimiento
5. Traducir a otros idiomas

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

## 💝 Agradecimientos

Creado con amor para fomentar el aprendizaje temprano y la diversión educativa. ¡Esperamos que tu pequeña disfrute del juego!

---

**¡Que comience la diversión del aprendizaje! 🎉** 