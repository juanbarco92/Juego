# 🎨 Guía del Editor Visual de Escenarios

## 🚀 Cómo Acceder al Editor

1. **Abre el juego** en tu navegador
2. Verás un **botón verde flotante** en la esquina inferior derecha: `🎨 Abrir Editor`
3. Haz clic en el botón para iniciar el modo editor

---

## 📋 Interfaz del Editor

### **Panel de Control** (Derecha de la pantalla)

```
┌─────────────────────────────┐
│  🎨 Modo Editor         [×] │
├─────────────────────────────┤
│ 📍 Escenario: [Casa ▼]     │
├─────────────────────────────┤
│ [📐 Grid] [🏷️ Labels] [💾]│
├─────────────────────────────┤
│ 🎯 Elemento: [mamá ▼]      │
├─────────────────────────────┤
│ X: [10.0]  Y: [25.0]       │
│ Ancho: [12]  Alto: [18]     │
│ Tamaño Visual: [2.5]        │
│ DropZone W: [0.7] H: [0.8] │
├─────────────────────────────┤
│ 📋 Código Generado:         │
│ [código javascript aquí]    │
│ [📋 Copiar al Portapapeles] │
└─────────────────────────────┘
```

---

## 🎯 Funciones Principales

### **1. Mover Elementos (Drag & Drop)**
- **Click y arrastra** el elemento sobre el escenario
- La posición se actualiza automáticamente
- El **punto central rojo** (cruz) marca el centro del elemento

### **2. Redimensionar Elementos**
- Usa los **círculos verdes** en las 4 esquinas del elemento
- Arrastra hacia afuera para **agrandar**
- Arrastra hacia adentro para **reducir**
- El tamaño base se ajusta automáticamente

### **3. Ajustes Precisos con Inputs Numéricos**

| Campo | Descripción | Rango |
|-------|-------------|-------|
| **X** | Posición horizontal del centro (%) | 0-100 |
| **Y** | Posición vertical del centro (%) | 0-100 |
| **Ancho** | Ancho base del elemento (%) | 1-50 |
| **Alto** | Alto base del elemento (%) | 1-50 |
| **Tamaño Visual** | Multiplicador de visualización | 0.5-5.0 |
| **DropZone W** | % del ancho clickable | 0.1-1.0 |
| **DropZone H** | % del alto clickable | 0.1-1.0 |

### **4. Herramientas del Editor**

#### 📐 **Grid (Cuadrícula)**
- Muestra una cuadrícula del 10% para alinear elementos
- Útil para posicionar varios elementos a la misma altura

#### 🏷️ **Labels (Etiquetas)**
- Oculta/muestra las etiquetas de los elementos
- Útil cuando tienes muchos elementos superpuestos

#### 💾 **Copiar**
- Copia el código generado al portapapeles
- Puedes pegarlo directamente en `scenarios.js`

---

## 🔄 Flujo de Trabajo Recomendado

### **Paso 1: Seleccionar Escenario**
```
1. Abre el editor
2. Selecciona el escenario en el dropdown: Casa / Parque / Cocina
```

### **Paso 2: Ajustar Elementos**
```
Para cada elemento (mamá, papá, gato, etc.):
1. Selecciona el elemento en "🎯 Elemento activo"
2. Arrastra el elemento a su posición correcta
3. Redimensiona si es necesario con las esquinas
4. Ajusta "Tamaño Visual" si se ve muy grande/pequeño
```

### **Paso 3: Verificar DropZones**
```
1. Ajusta "DropZone W" y "DropZone H" para definir el área clickable
2. Valores típicos:
   - 0.7-0.8 para elementos normales
   - 0.8-0.9 para elementos pequeños (más tolerancia)
   - 0.6-0.7 para elementos grandes (menos tolerancia)
```

### **Paso 4: Copiar el Código**
```
1. Revisa el código generado en el panel inferior
2. Haz clic en "📋 Copiar al Portapapeles"
3. Abre scenarios.js
4. Busca la sección del escenario correspondiente
5. Reemplaza el array "elements: [...]" con el código copiado
6. Guarda el archivo
7. Recarga el juego para ver los cambios
```

---

## 💡 Tips y Trucos

### **Posicionamiento Perfecto**
✅ **Activa el Grid** para alinear elementos horizontalmente
✅ **Usa la cruz roja** como referencia del centro del elemento
✅ **Ajusta displaySize** antes de posicionar (cambiar displaySize mueve el elemento)

### **Tamaños Recomendados**

| Tipo de Elemento | Ancho | Alto | displaySize |
|------------------|-------|------|-------------|
| Personas (mamá, papá) | 10-12% | 15-18% | 2.2-2.5 |
| Animales (gato, perro) | 8-10% | 10-12% | 1.8-2.0 |
| Objetos grandes (sofá, mesa) | 12-15% | 10-12% | 1.8-2.0 |
| Objetos pequeños (teléfono, pelota) | 5-8% | 6-8% | 1.8-2.0 |

### **Troubleshooting**

❌ **"El elemento se ve muy grande"**
   → Reduce `displaySize` a 1.5-2.0

❌ **"El elemento es difícil de clickear en el juego"**
   → Aumenta `dropZone.widthPercent` y `dropZone.heightPercent` a 0.8-0.9

❌ **"El elemento está cortado en los bordes"**
   → Ajusta la posición X/Y para alejarlo de los bordes (mínimo 5%, máximo 95%)

❌ **"Los elementos se superponen"**
   → Revisa las posiciones X/Y y sepáralos más

---

## 🎨 Ejemplo Práctico: Ajustar "Mamá"

### **Problema:** Mamá está flotando en el aire

### **Solución paso a paso:**

```
1. Abrir Editor → Click en "🎨 Abrir Editor"

2. Seleccionar Mamá → En "🎯 Elemento activo" elegir "👩 mamá"

3. Activar Grid → Click en "📐 Grid" para ver cuadrícula

4. Mover Mamá → Arrastra la imagen de mamá hacia abajo 
   hasta que sus pies toquen el suelo del escenario

5. Verificar valores → Deberías ver algo como:
   - X: 10.0 (posición horizontal)
   - Y: 65.0 (más abajo = número mayor)
   
6. Ajustar tamaño si es necesario → Si se ve muy grande:
   - Reduce "Tamaño Visual" de 2.5 a 2.0

7. Copiar código → Click en "📋 Copiar al Portapapeles"

8. Pegar en scenarios.js → Reemplaza el código del elemento "mamá"

9. Guardar y recargar → Verifica que mamá esté bien posicionada
```

---

## ⌨️ Atajos Rápidos

| Acción | Método |
|--------|--------|
| **Seleccionar elemento** | Click sobre el elemento |
| **Mover elemento** | Arrastra el centro del elemento |
| **Redimensionar** | Arrastra las esquinas verdes |
| **Copiar código** | Click en "💾 Copiar" o botón inferior |
| **Cambiar escenario** | Dropdown "📍 Escenario" |
| **Cerrar editor** | Click en [×] o recargar página |

---

## 📝 Formato del Código Generado

El editor genera código en este formato:

```javascript
elements: [
    {
        id: "mama",
        word: "mamá",
        emoji: "👩",
        position: { x: 10, y: 25, width: 12, height: 18 },
        displaySize: 2.5,
        dropZone: { widthPercent: 0.7, heightPercent: 0.8 },
        image: "images/elements/mama.png",
        level: 1
    },
    // ... más elementos
]
```

### **Explicación de cada campo:**

- **x, y**: Posición del centro del elemento (%)
- **width, height**: Tamaño base del elemento (%)
- **displaySize**: Multiplicador visual (el tamaño real = base × displaySize)
- **dropZone**: Área clickable como % del tamaño visual
- **widthPercent, heightPercent**: 0.7 = 70% del área es clickable

---

## 🎯 Casos de Uso Comunes

### **Caso 1: Ajustar todos los elementos del escenario Casa**
1. Abrir editor → Escenario: Casa
2. Para cada elemento (mamá, papá, gato, bebé, sofá, etc.):
   - Seleccionar en dropdown
   - Posicionar visualmente
   - Ajustar tamaño si es necesario
3. Copiar código completo
4. Pegar en scenarios.js sección "casa"

### **Caso 2: Crear un nuevo elemento**
1. Agrega manualmente el elemento en scenarios.js con valores aproximados
2. Recarga el editor
3. Ajusta visualmente la posición y tamaño
4. Copia el código generado y actualiza scenarios.js

### **Caso 3: Ajustar dropZones (áreas clickables)**
1. Selecciona el elemento
2. Juega con "DropZone W" y "DropZone H"
3. Valores más altos = área más grande (más fácil de clickear)
4. Prueba en el juego real para verificar

---

## 🔒 Guardar Cambios

⚠️ **IMPORTANTE:** El editor **NO guarda automáticamente** los cambios.

### **Para aplicar los cambios:**
1. ✅ Copiar el código generado
2. ✅ Pegar en `scenarios.js`
3. ✅ Guardar el archivo
4. ✅ Recargar el juego

### **Para descartar cambios:**
- Simplemente cierra el editor o recarga la página

---

## 🐛 Solución de Problemas

### **"No veo el botón del editor"**
- Verifica que `editor.js` esté incluido en `index.html`
- Abre la consola del navegador y busca errores

### **"Los cambios no se aplican"**
- Asegúrate de copiar TODO el código generado
- Verifica que pegaste en la sección correcta de scenarios.js
- Guarda el archivo y haz "hard refresh" (Ctrl+Shift+R)

### **"El editor se ve mal"**
- Los estilos están incluidos en editor.js
- Verifica que no haya errores de JavaScript en consola

### **"No puedo arrastrar elementos"**
- Asegúrate de hacer click en el centro del elemento, no en las esquinas
- Las esquinas son para redimensionar, el centro es para mover

---

## 🎓 Mejores Prácticas

1. ✅ **Trabaja escenario por escenario** - No mezcles cambios de varios escenarios
2. ✅ **Usa el Grid** - Te ayuda a mantener elementos alineados
3. ✅ **Guarda copias de seguridad** - Copia el código original antes de hacer cambios
4. ✅ **Prueba en el juego** - Después de cada cambio, prueba que funcione
5. ✅ **Ajusta dropZones** - Haz que sean generosas para facilitar el juego a niños pequeños

---

## 🚀 ¡Listo para Usar!

Ahora tienes un editor visual completo para ajustar todos los elementos de tu juego sin tener que calcular coordenadas manualmente.

**¿Necesitas ayuda?** Revisa esta guía o experimenta - el editor es intuitivo y no puede romper nada (los cambios solo se aplican si los copias a scenarios.js).

¡Diviértete editando! 🎨✨
