/**
 * Master Thematic Curriculum for Emma Aprende
 * Structured in coherent, pedagogically isolated thematic units (No mixed categories)
 */
const ACTIVE_CURRICULUM = {
    version: "2.1",
    description: "Curriculum temático coherente para Emma (Método de Lectura Global)",
    units: [
        {
            id: "familia",
            name: "Mi Familia",
            icon: "👨‍👩‍👧",
            themeClass: "theme-family",
            words: ["Mamá", "Papá", "Emma"]
        },
        {
            id: "mascotas",
            name: "Mis Mascotas",
            icon: "🐾",
            themeClass: "theme-pets",
            words: ["perro", "gato", "conejo", "pollito"]
        },
        {
            id: "comida",
            name: "Comida Rica",
            icon: "🍎",
            themeClass: "theme-food",
            words: ["manzana", "leche", "pan", "huevo"]
        },
        {
            id: "naturaleza",
            name: "El Sol y la Naturaleza",
            icon: "🌸",
            themeClass: "theme-nature",
            words: ["sol", "flor", "pelota", "bote"]
        },
        {
            id: "animales",
            name: "Animales Curiosos",
            icon: "🦁",
            themeClass: "theme-animals",
            words: ["jirafa", "tigre", "caracol", "gallo"]
        },
        {
            id: "casa",
            name: "En Casa",
            icon: "🏠",
            themeClass: "theme-home",
            words: ["mesa", "sofá", "lámpara", "jabón"]
        },
        {
            id: "cuerpo_ropa",
            name: "Mi Carita y Ropa",
            icon: "🧤",
            themeClass: "theme-body",
            words: ["orejas", "guantes", "pelota"]
        }
    ],
    // Backwards compatibility dictionary
    familyMembers: {
        core: ["Mamá", "Papá", "Emma"]
    },
    learningRules: {
        minWordsPerSession: 2,
        maxWordsPerSession: 4
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ACTIVE_CURRICULUM;
}
if (typeof window !== 'undefined') {
    window.ACTIVE_CURRICULUM = ACTIVE_CURRICULUM;
}
