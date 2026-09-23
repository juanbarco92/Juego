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
            words: ["Mamá", "Papá", "Emma", "bebé", "tetero"]
        },
        {
            id: "mascotas",
            name: "Mis Mascotas",
            icon: "🐾",
            themeClass: "theme-pets",
            words: ["perro", "gato", "conejo", "pollito", "pato"]
        },
        {
            id: "frutas",
            name: "Frutas y Meriendas",
            icon: "🍓",
            themeClass: "theme-food",
            words: ["manzana", "fresa", "plátano", "uvas", "sandía", "helado"]
        },
        {
            id: "comida_mesa",
            name: "Rico en la Mesa",
            icon: "🥛",
            themeClass: "theme-food",
            words: ["pan", "leche", "huevo", "galleta", "brócoli"]
        },
        {
            id: "vehiculos",
            name: "¡A Viajar! Vehículos",
            icon: "🚗",
            themeClass: "theme-nature",
            words: ["carro", "avión", "tren", "barco", "bicicleta"]
        },
        {
            id: "juguetes",
            name: "Mis Juguetes",
            icon: "🧸",
            themeClass: "theme-pets",
            words: ["pelota", "oso", "robot", "tambor", "globo"]
        },
        {
            id: "naturaleza",
            name: "El Sol y el Parque",
            icon: "🌸",
            themeClass: "theme-nature",
            words: ["sol", "flor", "bote", "mariposa", "arcoíris"]
        },
        {
            id: "animales",
            name: "Animales Asombrosos",
            icon: "🦁",
            themeClass: "theme-animals",
            words: ["león", "elefante", "mono", "jirafa", "pez"]
        },
        {
            id: "casa",
            name: "En Mi Casita",
            icon: "🏠",
            themeClass: "theme-home",
            words: ["mesa", "sofá", "lámpara", "jabón", "televisor"]
        },
        {
            id: "rutinas",
            name: "Mis Rutinas Diarias",
            icon: "⭐",
            themeClass: "theme-body",
            words: ["comer", "dormir", "cepillar", "vestir", "libros"]
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
