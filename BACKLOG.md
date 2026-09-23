# 📋 Backlog de Desarrollo - Emma Aprende (Global Reading Game)

> **Contexto del Usuario:**
> Emma tiene actualmente ~3 años y 8 meses (cumple 4 años en 4 meses).
> En esta etapa de desarrollo cognitivo:
> - Maneja mucho mejor la coordinación mano-ojo y el arrastre (*drag & drop*).
> - Puede procesar entre 4 y 6 estímulos simultáneos sin sobrecarga visual.
> - Se beneficia enormemente de la conexión fonológica y visual (escuchar el sonido de la palabra mientras la ve).
> - Se motiva con recompensas visuales tangibles (estrellas, colecciones, progreso perceptible) más que con números o cronómetros abstractos.

---

## 🎯 Épicas y Tareas Prioritarias

### 1. Calibración Cognitiva y Progresión Visual (Idea B)
- [ ] **Ajustar el rango de elementos por nivel:**
  - Redefinir la dificultad en `LearningManager.js`: pasar del rango genérico (2 a 8) a un rango calibrado para 4 años (3 a 5-6 elementos activos por nivel).
  - Evitar sobrecarga o dispersión visual en pantalla.
- [ ] **Diseño de Grid y Espaciado:**
  - Mejorar el tamaño de las tarjetas de palabras y las celdas de imágenes para maximizar contraste y legibilidad con tipografías infantiles claras.
- [ ] **Modo Híbrido de Interacción:**
  - Mantener *Drag & Drop*, pero añadir soporte *Tap-to-Select* (tocar palabra y luego tocar imagen) para momentos de juego en movimiento o pantallas más pequeñas.

---

### 2. Sistema Multimodal de Audio y Pronunciación (Idea C)
- [ ] **Módulo de Audio (`AudioManager` / Web Speech API):**
  - Implementar síntesis de voz en español neutro / latino usando `window.speechSynthesis`.
  - Alternativa: clips pregrabados o generados con TTS de alta calidad para las palabras clave del currículum.
- [ ] **Disparadores de Audio en la Experiencia:**
  - **Al tocar o iniciar arrastre de la palabra:** Pronunciar la palabra claramente (ej. *"perro"*).
  - **Al acertar el emparejamiento:** Refuerzo positivo con voz cariñosa (ej. *"¡Muy bien, perro!"*).
  - **Al completar nivel:** Fanfarria breve y mensaje de celebración vocal.
- [ ] **Control de Sonido para Padres:**
  - Botón sutil de mute/unmute en la barra superior.

---

### 3. Metáforas Visuales de Progreso y Tiempo (Idea D)
- [ ] **Reemplazo del Cronómetro Numérico Abstracto:**
  - Transformar el `15:00` en un indicador visual intuitivo para un niño de 4 años (ejemplo: un sol sonriente que recorre el cielo de izquierda a derecha, o una flor que florece).
  - El tiempo numérico puede permanecer en un modo discreto o accesible solo para los padres.
- [ ] **Contador de Niveles y Recompensas:**
  - Reemplazar "Nivel X" por un camino de estrellas, gemas o un tren donde cada nivel completado agrega un vagón o una estrella dorada.
  - Pantalla final de sesión lúdica: resumen con las "estampas/stickers" aprendidos hoy en lugar de un `alert()` de navegador.

---

### 4. Optimización de Assets, Escenografías e Imágenes
- [ ] **Estandarización del Pipeline de Generación:**
  - Superar la fragilidad del borrado de fondo por umbral RGB (que corrompe blancos interiores).
  - Evaluar alternativas técnicas modernas: segmentación por IA, SVG vectoriales, o modelos con canal alfa nativo.
- [ ] **Concepto de Escenografías vs. Grid Temático:**
  - Definir si se mantienen fondos contextuales (ej. la cocina, el parque, la habitación) con elementos integrados o cuadrículas limpias con temática visual por nivel.
