# 🖼️ Guía para Agregar Imágenes Personalizadas

## 📁 Estructura de Archivos

El juego ahora soporta imágenes personalizadas. Aquí está la estructura que necesitas:

```
Juego/
├── index.html
├── styles.css
├── script.js
├── images/              ← Nueva carpeta para tus imágenes
│   ├── gato.jpg
│   ├── perro.jpg
│   ├── casa.jpg
│   ├── coche.jpg
│   ├── arbol.jpg
│   ├── sol.jpg
│   ├── luna.jpg
│   ├── flor.jpg
│   ├── pajaro.jpg
│   └── pez.jpg
└── README_IMAGENES.md
```

## 🚀 Cómo Agregar Tus Imágenes

### Paso 1: Preparar las Imágenes
1. **Tamaño recomendado**: 300x300 píxeles o similar (cuadradas)
2. **Formatos soportados**: JPG, PNG, GIF, WebP
3. **Nombres de archivo**: Usa nombres descriptivos sin espacios

### Paso 2: Guardar las Imágenes
1. Coloca todas tus imágenes en la carpeta `images/`
2. Usa nombres que coincidan con los definidos en el código

### Paso 3: Configurar en el Código
Las rutas de imágenes ya están configuradas en `script.js`:

```javascript
// Ejemplo de configuración actual
{ word: 'GATO', emoji: '🐱', image: 'images/gato.jpg', id: 'cat' }
```

## 🎨 Lista de Imágenes Necesarias

Para que el juego funcione completamente, necesitas estas imágenes:

### Nivel 1 (3 imágenes):
- `images/gato.jpg` - Imagen de un gato
- `images/perro.jpg` - Imagen de un perro  
- `images/casa.jpg` - Imagen de una casa

### Nivel 2 (5 imágenes):
- Las 3 anteriores más:
- `images/coche.jpg` - Imagen de un coche
- `images/arbol.jpg` - Imagen de un árbol

### Nivel 3 (10 imágenes):
- Las 5 anteriores más:
- `images/sol.jpg` - Imagen del sol
- `images/luna.jpg` - Imagen de la luna
- `images/flor.jpg` - Imagen de una flor
- `images/pajaro.jpg` - Imagen de un pájaro
- `images/pez.jpg` - Imagen de un pez

## 🔄 Sistema de Respaldo

El juego incluye un sistema inteligente de respaldo:

- **Si la imagen existe**: Se muestra la imagen personalizada
- **Si la imagen no existe**: Se muestra el emoji automáticamente
- **Sin errores**: El juego siempre funcionará

## ➕ Agregar Nuevas Palabras con Imágenes

Para agregar una nueva palabra, edita el archivo `script.js`:

```javascript
// Ejemplo: Agregar "PELOTA"
const gameData = {
    level1: [
        { word: 'GATO', emoji: '🐱', image: 'images/gato.jpg', id: 'cat' },
        { word: 'PERRO', emoji: '🐶', image: 'images/perro.jpg', id: 'dog' },
        { word: 'CASA', emoji: '🏠', image: 'images/casa.jpg', id: 'house' },
        { word: 'PELOTA', emoji: '⚽', image: 'images/pelota.jpg', id: 'ball' } // Nueva
    ],
    // ... resto de niveles
};
```

Luego coloca la imagen `pelota.jpg` en la carpeta `images/`.

## 💡 Consejos para Mejores Resultados

### Calidad de Imágenes:
- **Usa imágenes claras y coloridas**
- **Evita fondos complicados**
- **Prefiere imágenes simples y reconocibles**

### Optimización:
- **Comprime las imágenes** para carga más rápida
- **Usa formatos web** como WebP cuando sea posible
- **Mantén tamaños razonables** (menos de 500KB por imagen)

### Para Niños:
- **Imágenes reales** son más educativas que dibujos
- **Colores vibrantes** captan mejor la atención
- **Objetos familiares** facilitan el reconocimiento

## 🔧 Ejemplo de Configuración Personalizada

Si quieres usar solo emojis para algunos elementos y imágenes para otros:

```javascript
const gameData = {
    level1: [
        // Usar imagen personalizada
        { word: 'GATO', emoji: '🐱', image: 'images/gato.jpg', id: 'cat' },
        // Usar solo emoji (sin 'image')
        { word: 'PERRO', emoji: '🐶', id: 'dog' },
        // Usar imagen personalizada
        { word: 'CASA', emoji: '🏠', image: 'images/casa.jpg', id: 'house' }
    ]
};
```

## 📱 Consideraciones para iPad

- Las imágenes se optimizan automáticamente para pantalla táctil
- El juego mantiene la velocidad de carga
- Las imágenes se redimensionan automáticamente

## 🚨 Solución de Problemas

### La imagen no aparece:
1. Verifica que el archivo existe en `images/`
2. Comprueba que el nombre coincide exactamente
3. Asegúrate de que el formato es soportado

### El juego va lento:
1. Reduce el tamaño de las imágenes
2. Comprime las imágenes antes de usarlas
3. Usa formatos optimizados como WebP

### Imágenes distorsionadas:
- El juego ajusta automáticamente el tamaño
- Las imágenes cuadradas funcionan mejor
- Se mantiene la proporción original

---

**¡Ahora puedes personalizar completamente el juego con las fotos favoritas de tu hija!** 📸✨ 