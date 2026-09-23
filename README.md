# 👧✨ Emma Aprende (Global Reading & Speech Game)

Un juego educativo interactivo diseñado especialmente para **Emma (~4 años)**, basado en el **Método de Lectura Global** (asociación directa de grafía, concepto y fonema), potenciado con **repetición espaciada adaptativa** y estímulos multimodales.

---

## 🌟 Características Principales

### 1. Estimulación Multimodal (Voz y Oído)
- **Pronunciación instantánea:** Al tocar o interactuar con cualquier palabra, el juego la lee en voz alta en español claro y cálido utilizando la Web Speech API (`SpeechSynthesis`).
- **Efectos sonoros lúdicos:** Burbujas suaves al seleccionar, campanas de armonía mayor al acertar y fanfarrias alegres al completar niveles, sintetizados sin latencia con la Web Audio API (100% offline).
- **Refuerzo positivo verbal:** Felicitaciones cariñosas (*"¡Muy bien, gato!"*, *"¡Excelente!"*).

### 2. Ergonomía Infantil Calibrada (4 Años)
- **Interacción Dual:** Soporta tanto arrastrar y soltar (**Drag & Drop**) como tocar la palabra y luego la imagen (**Tap-to-Match**).
- **Dificultad Óptima:** Niveles calibrados en **3 a 4 elementos activos**, garantizando foco y evitando sobrecarga cognitiva.
- **Tipografía Redondeada y Clara:** Diseñado con fuentes de alta legibilidad infantil (*Fredoka* y *Quicksand*).
- **Ilustraciones Vectoriales SVG (Stickers):** Diseños limpios, coloridos y amigables con fondo transparente nativo, nítidos en pantallas Retina de iPad.

### 3. Metáforas Visuales de Progreso y Tiempo
- **El Cielo de Emma (Control de Tiempo Saludable):** En lugar de un cronómetro numérico abstracto, un **solecito sonriente ☀️** recorre el cielo a lo largo de los 15 minutos de la sesión hasta dar paso a la luna 🌙.
- **Frasco de Estrellas ⭐:** Colección tangible de estrellas ganadas en cada nivel.

### 4. Cerebro Pedagógico Adaptativo
- **Algoritmo de Repetición Espaciada:** Registra aciertos, fallos y tiempo transcurrido por palabra para reforzar las que presentan dificultad y espaciar las ya dominadas.
- **Anclajes Afectivos:** Integra automáticamente figuras familiares ("Mamá", "Papá", "Emma") en las sesiones para generar seguridad emocional.

### 5. Zona de Papás (Control Parental)
- Acceso protegido mediante un reto matemático simple.
- Visualización de estadísticas de vocabulario (palabras vistas y dominadas).
- Configuración de duración de sesión y sonido.

---

## 📂 Arquitectura del Proyecto

```
Juego/
├── index.html                  # Punto de entrada y estructura PWA
├── styles.css                  # Estilos visuales, animaciones y diseño táctil
├── script.js                   # Controlador de vista y eventos táctiles
├── manifest.json               # Configuración para instalación en iPad / Safari
├── BACKLOG.md                  # Hoja de ruta y backlog pedagógico
├── src/
│   ├── core/
│   │   └── GameEngine.js       # Orquestador del bucle y lógica de niveles
│   ├── data/
│   │   ├── assets.js           # Proveedor de ilustraciones vectoriales SVG
│   │   ├── active_curriculum.json # Vocabulario activo y categorías
│   │   └── master_curriculum.json # Currículum pedagógico completo
│   ├── managers/
│   │   ├── LearningManager.js  # Motor pedagógico y repetición espaciada
│   │   └── SessionController.js# Control de tiempo y duración de sesión
│   ├── services/
│   │   └── AudioService.js     # Motor de síntesis de voz y efectos Web Audio
│   └── utils/
│       ├── StorageManager.js   # Persistencia local con versionado
│       └── RateLimiter.js      # Utilidad de control de flujo
```

---

## 🚀 Cómo Ejecutar e Instalar en iPad

1. **Abrir en el navegador:**
   - Puedes abrir directamente el archivo `index.html` o servirlo con cualquier servidor local (por ejemplo `npx serve .` o Live Server).
2. **Instalar en iPad como App Nativa:**
   - Abre la URL del juego en **Safari** en el iPad.
   - Toca el botón **Compartir** (📤).
   - Selecciona **"Añadir a pantalla de inicio"** (Add to Home Screen).
   - ¡Listo! Se abrirá a pantalla completa sin barras de navegador como una app nativa.

---

## 💖 Dedicatoria

Creado con amor para acompañar el crecimiento, la curiosidad y el descubrimiento de la lectura de Emma. 🎉