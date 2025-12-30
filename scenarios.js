// Definición de escenarios del juego
// 
// 📍 SISTEMA DE COORDENADAS RESPONSIVE (100% PORCENTUAL):
// - x: 0 = extremo izquierdo, 100 = extremo derecho (% del contenedor)
// - y: 0 = parte superior, 100 = parte inferior (% del contenedor)
// - width: porcentaje del ancho del contenedor (típicamente 8-15%)
// - height: porcentaje del alto del contenedor (típicamente 10-20%)
//
// 🎯 CÓMO CALCULAR POSICIONES PERFECTAS:
// 1. Abre tu imagen de fondo en un editor (Photoshop, GIMP, etc.)
// 2. Identifica donde quieres el elemento (ej: sobre la mesa)
// 3. Calcula porcentajes:
//    - Si la mesa está en pixel 300 de una imagen de 800px de ancho:
//      x = (300 / 800) * 100 = 37.5%
//    - Si está en pixel 200 de una imagen de 600px de alto:
//      y = (200 / 600) * 100 = 33.3%
//
// 💡 TIPS PARA RESPONSIVE PERFECTO:
// - width/height entre 8-15% para objetos normales
// - displaySize controla el tamaño visual (1.5-3.0x recomendado)
// - dropZone.widthPercent/heightPercent definen el área clickable (0.5-0.9)
// - Coloca elementos importantes en el centro (20%-80% tanto x como y)
// - Deja márgenes de seguridad (nunca uses 0% o 100% exacto)
// - Prueba en diferentes tamaños: iPad Mini, Air, Pro
//
// ✅ SISTEMA 100% PORCENTUAL - Sin píxeles fijos

// 🔧 FUNCIÓN HELPER PARA CALCULAR COORDENADAS:
// Usa esta función para convertir coordenadas de tu imagen a porcentajes
function calculatePosition(imageWidth, imageHeight, elementX, elementY, elementWidth, elementHeight) {
    return {
        x: Math.round((elementX / imageWidth) * 100 * 10) / 10,      // Redondeado a 1 decimal
        y: Math.round((elementY / imageHeight) * 100 * 10) / 10,
        width: Math.round((elementWidth / imageWidth) * 100 * 10) / 10,
        height: Math.round((elementHeight / imageHeight) * 100 * 10) / 10
    };
}

// 📝 EJEMPLO DE USO:
// Si tu imagen casa-bg.jpg es 1200x800px y quieres poner MAMÁ en:
// - Posición: x=540px, y=280px
// - Tamaño zona: 180px ancho, 200px alto
// 
// Usa: calculatePosition(1200, 800, 540, 280, 180, 200)
// Resultado: { x: 45.0, y: 35.0, width: 15.0, height: 25.0 }

const gameScenarios = {
    casa: {
        name: "La Casa",
        background: "images/scenarios/casa-bg.jpg",
        elements: [
            {
                id: "mama",
                word: "mamá",
                emoji: "👩",
                position: {
                    x: 10,        // % desde la izquierda
                    y: 25,        // % desde arriba
                    width: 12,    // % del ancho del contenedor
                    height: 18    // % del alto del contenedor
                },
                displaySize: 2.5,     // Multiplicador para el tamaño visual
                dropZone: {
                    widthPercent: 0.7,   // 70% del ancho de la imagen visual
                    heightPercent: 0.8   // 80% del alto de la imagen visual
                },
                image: "images/elements/mama.png",
                level: 1
            },
            {
                id: "papa", 
                word: "papá",
                emoji: "👨",
                position: {
                    x: 55,        // % desde la izquierda
                    y: 25,        // % desde arriba
                    width: 12,    // % del ancho del contenedor
                    height: 18    // % del alto del contenedor
                },
                displaySize: 2.5,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.8
                },
                image: "images/elements/papa.png",
                level: 1
            },
            {
                id: "gato",
                word: "gato", 
                emoji: "🐱",
                position: { 
                    x: 15, 
                    y: 70, 
                    width: 10, 
                    height: 12 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.7
                },
                image: "images/elements/gato.png",
                level: 2
            },
            {
                id: "bebe",
                word: "bebé",
                emoji: "👶",
                position: { 
                    x: 75, 
                    y: 65, 
                    width: 8, 
                    height: 12 
                },
                displaySize: 2.2,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.8
                },
                image: "images/elements/bebe.png", 
                level: 2
            },
            {
                id: "sofa",
                word: "sofá",
                emoji: "🛋️",
                position: { 
                    x: 30, 
                    y: 65, 
                    width: 15, 
                    height: 12 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.6,
                    heightPercent: 0.7
                },
                image: "images/elements/sofa.png",
                level: 2
            },
            {
                id: "mesa",
                word: "mesa",
                emoji: "🪑",
                position: { 
                    x: 70, 
                    y: 25, 
                    width: 12, 
                    height: 10 
                },
                displaySize: 1.8,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.7
                },
                image: "images/elements/mesa.png",
                level: 2
            },
            {
                id: "ventana",
                word: "ventana",
                emoji: "🪟",
                position: { 
                    x: 40, 
                    y: 10, 
                    width: 12, 
                    height: 10 
                },
                displaySize: 1.5,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.8
                },
                image: "images/elements/ventana.png",
                level: 2
            },
            {
                id: "libros",
                word: "libros",
                emoji: "📚", 
                position: { 
                    x: 8, 
                    y: 45, 
                    width: 8, 
                    height: 12 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.7
                },
                image: "images/elements/libros.png",
                level: 2
            },
            {
                id: "television",
                word: "televisión",
                emoji: "📺",
                position: { 
                    x: 82, 
                    y: 20, 
                    width: 10, 
                    height: 8 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.8
                },
                image: "images/elements/television.png",
                level: 2
            },
            {
                id: "telefono",
                word: "teléfono", 
                emoji: "📱",
                position: { 
                    x: 25, 
                    y: 30, 
                    width: 5, 
                    height: 7 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.9
                },
                image: "images/elements/telefono.png",
                level: 2
            },
            {
                id: "lampara",
                word: "lámpara",
                emoji: "💡",
                position: { 
                    x: 50, 
                    y: 15, 
                    width: 6, 
                    height: 10 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.7
                },
                image: "images/elements/lampara.png", 
                level: 2
            }
        ]
    },
    
    parque: {
        name: "El Parque",
        background: "images/scenarios/parque-bg.jpg",
        elements: [
            {
                id: "arbol",
                word: "árbol",
                emoji: "🌳",
                position: { 
                    x: 20, 
                    y: 20, 
                    width: 10, 
                    height: 18 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.6,
                    heightPercent: 0.6
                },
                image: "images/elements/arbol.png",
                level: 3
            },
            {
                id: "perro",
                word: "perro",
                emoji: "🐶",
                position: { 
                    x: 50, 
                    y: 70, 
                    width: 10, 
                    height: 12 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.7
                },
                image: "images/elements/perro.png",
                level: 3
            },
            {
                id: "pelota",
                word: "pelota",
                emoji: "⚽",
                position: { 
                    x: 70, 
                    y: 75, 
                    width: 8, 
                    height: 8 
                },
                displaySize: 1.8,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.8
                },
                image: "images/elements/pelota.png",
                level: 3
            },
            {
                id: "flor",
                word: "flor",
                emoji: "🌸",
                position: { 
                    x: 80, 
                    y: 60, 
                    width: 8, 
                    height: 10 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.8
                },
                image: "images/elements/flor.png",
                level: 4
            },
            {
                id: "banco",
                word: "banco",
                emoji: "🪑",
                position: { 
                    x: 40, 
                    y: 50, 
                    width: 12, 
                    height: 10 
                },
                displaySize: 1.8,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.7
                },
                image: "images/elements/banco.png",
                level: 4
            }
        ]
    },

    cocina: {
        name: "La Cocina", 
        background: "images/scenarios/cocina-bg.jpg",
        elements: [
            {
                id: "nevera",
                word: "nevera",
                emoji: "❄️",
                position: { 
                    x: 75, 
                    y: 30, 
                    width: 10, 
                    height: 16 
                },
                displaySize: 2.0,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.6
                },
                image: "images/elements/nevera.png", 
                level: 5
            },
            {
                id: "estufa",
                word: "estufa",
                emoji: "🔥",
                position: { 
                    x: 45, 
                    y: 45, 
                    width: 12, 
                    height: 10 
                },
                displaySize: 1.8,
                dropZone: {
                    widthPercent: 0.7,
                    heightPercent: 0.7
                },
                image: "images/elements/estufa.png",
                level: 5
            },
            {
                id: "manzana",
                word: "manzana", 
                emoji: "🍎",
                position: { 
                    x: 30, 
                    y: 35, 
                    width: 6, 
                    height: 6 
                },
                displaySize: 1.8,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.8
                },
                image: "images/elements/manzana.png",
                level: 5
            },
            {
                id: "leche",
                word: "leche",
                emoji: "🥛",
                position: { 
                    x: 80, 
                    y: 50, 
                    width: 5, 
                    height: 8 
                },
                displaySize: 1.8,
                dropZone: {
                    widthPercent: 0.8,
                    heightPercent: 0.8
                },
                image: "images/elements/leche.png",
                level: 5
            }
        ]
    }
};

// Configuración de niveles por escenario
const scenarioLevelConfig = {
    1: { scenario: "casa", elements: 2 },
    2: { scenario: "casa", elements: 4 },
    3: { scenario: "parque", elements: 3 },
    4: { scenario: "parque", elements: 5 },
    5: { scenario: "cocina", elements: 4 }
}; 