# 🎨 Editor Visual - Guía Rápida

## 🚀 Inicio Rápido

1. Abre `index.html` en tu navegador
2. Click en el botón verde: **🎨 Abrir Editor**
3. ¡Empieza a editar!

---

## 🎯 Funciones Básicas

### **Mover Elementos**
- 🖱️ Click y arrastra el elemento

### **Redimensionar**
- 🔵 Usa los círculos verdes en las esquinas

### **Ajustar Valores**
- 🔢 Usa los inputs numéricos en el panel derecho

### **Copiar Código**
- 💾 Click en "Copiar al Portapapeles"
- 📋 Pega el código en `scenarios.js`

---

## ⚡ Atajos Visuales

| Elemento Visual | Función |
|----------------|---------|
| 🟢 **Borde verde punteado** | Elemento normal |
| 🟡 **Borde amarillo sólido** | Elemento al pasar mouse |
| 🔴 **Borde rojo sólido** | Elemento seleccionado |
| ✖️ **Cruz roja** | Centro del elemento (punto de referencia) |
| 🟢 **Círculos verdes** | Handles para redimensionar |

---

## 📐 Valores Típicos

| Elemento | Ancho | Alto | displaySize |
|----------|-------|------|-------------|
| Personas | 10-12% | 15-18% | 2.2-2.5 |
| Animales | 8-10% | 10-12% | 1.8-2.0 |
| Objetos | 8-15% | 8-15% | 1.8-2.5 |

---

## 💾 Guardar Cambios

```bash
1. Click "💾 Copiar" en el editor
2. Abre scenarios.js
3. Busca el escenario (casa/parque/cocina)
4. Reemplaza el array "elements: [...]"
5. Guarda el archivo
6. Recarga el navegador (Ctrl+R)
```

---

## 🐛 Solución Rápida

**Elemento muy grande** → Reduce `displaySize`
**Difícil clickear** → Aumenta `dropZone W/H` a 0.8-0.9
**Elemento cortado** → Aleja de bordes (X/Y: 5-95%)

---

## 📚 Documentación Completa

Ver: [`GUIA_EDITOR.md`](GUIA_EDITOR.md)
