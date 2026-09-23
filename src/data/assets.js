/**
 * AssetProvider - Vector illustrations and stickers for Emma Aprende
 * High-definition SVGs: colorful, kawaii/storybook style, zero transparent artifacts, instant loading
 */
const AssetProvider = (function () {
    // Helper to generate clean SVG data URIs
    function createSvgUri(svgContent) {
        const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">${svgContent}</svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
    }

    const stickers = {
        // --- FAMILIA ---
        'mamá': createSvgUri(`
            <circle cx="60" cy="60" r="52" fill="#FFE5D9"/>
            <path d="M22 65 C20 30 40 15 60 15 C80 15 100 30 98 65 C85 45 75 42 60 42 C45 42 35 45 22 65 Z" fill="#8D5B4C"/>
            <circle cx="46" cy="62" r="5" fill="#3D261D"/>
            <circle cx="74" cy="62" r="5" fill="#3D261D"/>
            <circle cx="48" cy="60" r="1.5" fill="#FFF"/>
            <circle cx="76" cy="60" r="1.5" fill="#FFF"/>
            <circle cx="36" cy="70" r="7" fill="#FFB4A2" opacity="0.6"/>
            <circle cx="84" cy="70" r="7" fill="#FFB4A2" opacity="0.6"/>
            <path d="M52 74 Q60 82 68 74" stroke="#E07A5F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <circle cx="60" cy="20" r="8" fill="#F4A261"/>
        `),
        'papá': createSvgUri(`
            <circle cx="60" cy="62" r="50" fill="#FFE5D9"/>
            <path d="M20 50 C22 24 40 18 60 18 C80 18 98 24 100 50 C88 38 75 35 60 35 C45 35 32 38 20 50 Z" fill="#3D312A"/>
            <circle cx="46" cy="60" r="5" fill="#264653"/>
            <circle cx="74" cy="60" r="5" fill="#264653"/>
            <circle cx="48" cy="58" r="1.5" fill="#FFF"/>
            <circle cx="76" cy="58" r="1.5" fill="#FFF"/>
            <circle cx="36" cy="68" r="6" fill="#FFB4A2" opacity="0.6"/>
            <circle cx="84" cy="68" r="6" fill="#FFB4A2" opacity="0.6"/>
            <path d="M50 74 Q60 84 70 74" stroke="#D06A4C" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <!-- Cute friendly mustache -->
            <path d="M52 70 Q56 66 60 70 Q64 66 68 70" stroke="#3D312A" stroke-width="3" fill="none" stroke-linecap="round"/>
        `),
        'emma': createSvgUri(`
            <circle cx="60" cy="60" r="50" fill="#FFE8D6"/>
            <!-- Pigtails -->
            <circle cx="18" cy="40" r="14" fill="#6A4E42"/>
            <circle cx="102" cy="40" r="14" fill="#6A4E42"/>
            <path d="M24 55 C25 25 42 20 60 20 C78 20 95 25 96 55 C82 42 72 40 60 40 C48 40 38 42 24 55 Z" fill="#6A4E42"/>
            <circle cx="46" cy="62" r="5.5" fill="#2F3E46"/>
            <circle cx="74" cy="62" r="5.5" fill="#2F3E46"/>
            <circle cx="48" cy="60" r="2" fill="#FFF"/>
            <circle cx="76" cy="60" r="2" fill="#FFF"/>
            <circle cx="36" cy="70" r="8" fill="#FF9F1C" opacity="0.3"/>
            <circle cx="84" cy="70" r="8" fill="#FF9F1C" opacity="0.3"/>
            <path d="M52 74 Q60 84 68 74" stroke="#E76F51" stroke-width="4" fill="none" stroke-linecap="round"/>
            <!-- Bows -->
            <circle cx="24" cy="32" r="6" fill="#E63946"/>
            <circle cx="96" cy="32" r="6" fill="#E63946"/>
        `),

        // --- ANIMALES / MASCOTAS ---
        'perro': createSvgUri(`
            <circle cx="60" cy="65" r="45" fill="#E0A96D"/>
            <!-- Ears -->
            <path d="M20 40 C10 60 15 85 28 85 C35 85 35 60 26 40 Z" fill="#774936"/>
            <path d="M100 40 C110 60 105 85 92 85 C85 85 85 60 94 40 Z" fill="#774936"/>
            <!-- Eyes -->
            <circle cx="46" cy="60" r="6" fill="#2B2D42"/>
            <circle cx="74" cy="60" r="6" fill="#2B2D42"/>
            <circle cx="48" cy="58" r="2" fill="#FFF"/>
            <circle cx="76" cy="58" r="2" fill="#FFF"/>
            <!-- Snout & Nose -->
            <ellipse cx="60" cy="76" rx="16" ry="12" fill="#FDF0D5"/>
            <ellipse cx="60" cy="72" rx="7" ry="5" fill="#2B2D42"/>
            <path d="M60 76 L60 82 M54 81 Q60 86 66 81" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Blush -->
            <circle cx="34" cy="72" r="6" fill="#FF8882" opacity="0.5"/>
            <circle cx="86" cy="72" r="6" fill="#FF8882" opacity="0.5"/>
        `),
        'gato': createSvgUri(`
            <circle cx="60" cy="65" r="45" fill="#F4A261"/>
            <!-- Cat Ears -->
            <polygon points="25,48 40,15 55,42" fill="#F4A261"/>
            <polygon points="30,44 40,22 50,40" fill="#FFCAD4"/>
            <polygon points="95,48 80,15 65,42" fill="#F4A261"/>
            <polygon points="90,44 80,22 70,40" fill="#FFCAD4"/>
            <!-- Eyes -->
            <circle cx="45" cy="62" r="6" fill="#264653"/>
            <circle cx="75" cy="62" r="6" fill="#264653"/>
            <circle cx="47" cy="59" r="2" fill="#FFF"/>
            <circle cx="77" cy="59" r="2" fill="#FFF"/>
            <!-- Little pink nose -->
            <polygon points="56,72 64,72 60,77" fill="#E76F51"/>
            <path d="M54 79 Q60 84 66 79" stroke="#264653" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Whiskers -->
            <line x1="22" y1="70" x2="38" y2="72" stroke="#264653" stroke-width="2" stroke-linecap="round"/>
            <line x1="22" y1="78" x2="38" y2="76" stroke="#264653" stroke-width="2" stroke-linecap="round"/>
            <line x1="98" y1="70" x2="82" y2="72" stroke="#264653" stroke-width="2" stroke-linecap="round"/>
            <line x1="98" y1="78" x2="82" y2="76" stroke="#264653" stroke-width="2" stroke-linecap="round"/>
        `),
        'conejo': createSvgUri(`
            <!-- Long Ears -->
            <ellipse cx="44" cy="28" rx="10" ry="25" fill="#E8ECEF"/>
            <ellipse cx="44" cy="28" rx="6" ry="18" fill="#FFCAD4"/>
            <ellipse cx="76" cy="28" rx="10" ry="25" fill="#E8ECEF"/>
            <ellipse cx="76" cy="28" rx="6" ry="18" fill="#FFCAD4"/>
            <!-- Face -->
            <circle cx="60" cy="72" r="42" fill="#F8F9FA"/>
            <!-- Eyes -->
            <circle cx="45" cy="68" r="5" fill="#2B2D42"/>
            <circle cx="75" cy="68" r="5" fill="#2B2D42"/>
            <circle cx="47" cy="66" r="1.5" fill="#FFF"/>
            <circle cx="77" cy="66" r="1.5" fill="#FFF"/>
            <!-- Nose & mouth -->
            <polygon points="56,77 64,77 60,81" fill="#FF8882"/>
            <path d="M55 83 Q60 88 65 83" stroke="#2B2D42" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Cheeks -->
            <circle cx="34" cy="78" r="7" fill="#FFB4A2" opacity="0.6"/>
            <circle cx="86" cy="78" r="7" fill="#FFB4A2" opacity="0.6"/>
        `),
        'pollito': createSvgUri(`
            <circle cx="60" cy="65" r="44" fill="#FFD166"/>
            <!-- Little tuft -->
            <path d="M56 22 Q60 12 64 22" stroke="#FFD166" stroke-width="6" stroke-linecap="round" fill="none"/>
            <!-- Big Cute Eyes -->
            <circle cx="44" cy="58" r="6.5" fill="#1D3557"/>
            <circle cx="76" cy="58" r="6.5" fill="#1D3557"/>
            <circle cx="46" cy="55" r="2.5" fill="#FFF"/>
            <circle cx="78" cy="55" r="2.5" fill="#FFF"/>
            <!-- Beak -->
            <polygon points="52,68 68,68 60,82" fill="#F77F00"/>
            <!-- Cheeks -->
            <circle cx="34" cy="70" r="7" fill="#FF9F1C" opacity="0.4"/>
            <circle cx="86" cy="70" r="7" fill="#FF9F1C" opacity="0.4"/>
        `),
        'jirafa': createSvgUri(`
            <circle cx="60" cy="65" r="44" fill="#F4A261"/>
            <!-- Little horns -->
            <line x1="48" y1="26" x2="48" y2="14" stroke="#E76F51" stroke-width="5" stroke-linecap="round"/>
            <circle cx="48" cy="12" r="5" fill="#9A031E"/>
            <line x1="72" y1="26" x2="72" y2="14" stroke="#E76F51" stroke-width="5" stroke-linecap="round"/>
            <circle cx="72" cy="12" r="5" fill="#9A031E"/>
            <!-- Ears -->
            <ellipse cx="26" cy="38" rx="10" ry="6" fill="#F4A261"/>
            <ellipse cx="94" cy="38" rx="10" ry="6" fill="#F4A261"/>
            <!-- Spots -->
            <circle cx="38" cy="46" r="6" fill="#B56576"/>
            <circle cx="80" cy="48" r="7" fill="#B56576"/>
            <!-- Eyes -->
            <circle cx="46" cy="62" r="5" fill="#2B2D42"/>
            <circle cx="74" cy="62" r="5" fill="#2B2D42"/>
            <!-- Muzzle -->
            <ellipse cx="60" cy="78" rx="18" ry="12" fill="#FFD166"/>
            <circle cx="53" cy="76" r="2.5" fill="#774936"/>
            <circle cx="67" cy="76" r="2.5" fill="#774936"/>
            <path d="M54 82 Q60 87 66 82" stroke="#774936" stroke-width="2" fill="none" stroke-linecap="round"/>
        `),
        'tigre': createSvgUri(`
            <circle cx="60" cy="65" r="45" fill="#F77F00"/>
            <!-- Ears -->
            <circle cx="28" cy="30" r="14" fill="#F77F00"/>
            <circle cx="28" cy="30" r="8" fill="#FFE3A8"/>
            <circle cx="92" cy="30" r="14" fill="#F77F00"/>
            <circle cx="92" cy="30" r="8" fill="#FFE3A8"/>
            <!-- Stripes -->
            <polygon points="60,25 56,38 64,38" fill="#2B2D42"/>
            <polygon points="22,60 36,63 22,66" fill="#2B2D42"/>
            <polygon points="98,60 84,63 98,66" fill="#2B2D42"/>
            <!-- Eyes -->
            <circle cx="45" cy="58" r="6" fill="#2B2D42"/>
            <circle cx="75" cy="58" r="6" fill="#2B2D42"/>
            <circle cx="47" cy="56" r="2" fill="#FFF"/>
            <circle cx="77" cy="56" r="2" fill="#FFF"/>
            <!-- Muzzle -->
            <ellipse cx="60" cy="75" rx="16" ry="12" fill="#FFF"/>
            <polygon points="56,70 64,70 60,75" fill="#D62828"/>
            <path d="M53 78 Q60 84 67 78" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        `),

        // --- OBJETOS / NATURALEZA ---
        'sol': createSvgUri(`
            <!-- Golden Rays -->
            <g stroke="#F4A261" stroke-width="7" stroke-linecap="round">
                <line x1="60" y1="10" x2="60" y2="20"/>
                <line x1="60" y1="100" x2="60" y2="110"/>
                <line x1="10" y1="60" x2="20" y2="60"/>
                <line x1="100" y1="60" x2="110" y2="60"/>
                <line x1="25" y1="25" x2="33" y2="33"/>
                <line x1="87" y1="87" x2="95" y2="95"/>
                <line x1="25" y1="95" x2="33" y2="87"/>
                <line x1="87" y1="33" x2="95" y2="25"/>
            </g>
            <circle cx="60" cy="60" r="36" fill="#FFD166"/>
            <!-- Smiling face -->
            <circle cx="48" cy="56" r="4.5" fill="#E76F51"/>
            <circle cx="72" cy="56" r="4.5" fill="#E76F51"/>
            <circle cx="38" cy="64" r="5" fill="#F4A261" opacity="0.6"/>
            <circle cx="82" cy="64" r="5" fill="#F4A261" opacity="0.6"/>
            <path d="M50 68 Q60 78 70 68" stroke="#E76F51" stroke-width="4" fill="none" stroke-linecap="round"/>
        `),
        'flor': createSvgUri(`
            <!-- Petals -->
            <circle cx="60" cy="34" r="18" fill="#FF758F"/>
            <circle cx="84" cy="50" r="18" fill="#FF758F"/>
            <circle cx="76" cy="80" r="18" fill="#FF758F"/>
            <circle cx="44" cy="80" r="18" fill="#FF758F"/>
            <circle cx="36" cy="50" r="18" fill="#FF758F"/>
            <!-- Center -->
            <circle cx="60" cy="60" r="18" fill="#FFD166"/>
            <!-- Face -->
            <circle cx="53" cy="58" r="3" fill="#6A4E42"/>
            <circle cx="67" cy="58" r="3" fill="#6A4E42"/>
            <path d="M55 65 Q60 70 65 65" stroke="#6A4E42" stroke-width="2" fill="none" stroke-linecap="round"/>
        `),
        'pelota': createSvgUri(`
            <circle cx="60" cy="60" r="48" fill="#48CAE4"/>
            <!-- Swirl stripes -->
            <path d="M22 36 Q60 50 98 36" stroke="#FF5A5F" stroke-width="12" fill="none"/>
            <path d="M22 84 Q60 70 98 84" stroke="#FFD166" stroke-width="12" fill="none"/>
            <!-- Cute highlight -->
            <circle cx="42" cy="38" r="8" fill="#FFF" opacity="0.6"/>
        `),
        'manzana': createSvgUri(`
            <!-- Apple Body -->
            <path d="M60 42 C40 25 18 45 22 75 C25 98 52 106 60 95 C68 106 95 98 98 75 C102 45 80 25 60 42 Z" fill="#E63946"/>
            <!-- Stem -->
            <path d="M60 40 Q62 20 72 15" stroke="#6A4E42" stroke-width="5" fill="none" stroke-linecap="round"/>
            <!-- Green Leaf -->
            <path d="M62 28 Q80 18 84 32 Q68 36 62 28 Z" fill="#52B788"/>
            <!-- Cheerful smile -->
            <circle cx="46" cy="65" r="4" fill="#641220"/>
            <circle cx="74" cy="65" r="4" fill="#641220"/>
            <path d="M52 74 Q60 82 68 74" stroke="#641220" stroke-width="3" fill="none" stroke-linecap="round"/>
        `),
        'huevo': createSvgUri(`
            <ellipse cx="60" cy="65" rx="36" ry="46" fill="#F4E8C1"/>
            <!-- Cute face -->
            <circle cx="50" cy="62" r="4" fill="#6A4E42"/>
            <circle cx="70" cy="62" r="4" fill="#6A4E42"/>
            <circle cx="42" cy="68" r="5" fill="#FFB4A2" opacity="0.6"/>
            <circle cx="78" cy="68" r="5" fill="#FFB4A2" opacity="0.6"/>
            <path d="M54 70 Q60 76 66 70" stroke="#6A4E42" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        `),
        'leche': createSvgUri(`
            <!-- Milk Bottle / Carton -->
            <rect x="36" y="40" width="48" height="65" rx="10" fill="#E0FBFC"/>
            <polygon points="36,40 44,22 76,22 84,40" fill="#98C1D9"/>
            <rect x="50" y="14" width="20" height="10" rx="3" fill="#EE6C4D"/>
            <!-- Label -->
            <rect x="42" y="55" width="36" height="26" rx="6" fill="#FFF"/>
            <circle cx="54" cy="68" r="3" fill="#293241"/>
            <circle cx="66" cy="68" r="3" fill="#293241"/>
            <path d="M57 73 Q60 76 63 73" stroke="#293241" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        `),
        'pan': createSvgUri(`
            <!-- Bread Loaf -->
            <ellipse cx="60" cy="65" rx="46" ry="32" fill="#DDA15E"/>
            <path d="M22 62 C25 45 42 42 60 42 C78 42 95 45 98 62 Z" fill="#BC6C25"/>
            <!-- Scoring marks -->
            <line x1="42" y1="48" x2="48" y2="58" stroke="#FEFAE0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="57" y1="46" x2="63" y2="58" stroke="#FEFAE0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="72" y1="48" x2="78" y2="58" stroke="#FEFAE0" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Face -->
            <circle cx="50" cy="72" r="3.5" fill="#403D39"/>
            <circle cx="70" cy="72" r="3.5" fill="#403D39"/>
            <path d="M55 78 Q60 83 65 78" stroke="#403D39" stroke-width="2" fill="none" stroke-linecap="round"/>
        `),
        'orejas': createSvgUri(`
            <circle cx="60" cy="60" r="38" fill="#FFE5D9"/>
            <!-- Big Cute Ears -->
            <ellipse cx="18" cy="60" rx="14" ry="18" fill="#FFE5D9"/>
            <ellipse cx="18" cy="60" rx="8" ry="11" fill="#FFCAD4"/>
            <ellipse cx="102" cy="60" rx="14" ry="18" fill="#FFE5D9"/>
            <ellipse cx="102" cy="60" rx="8" ry="11" fill="#FFCAD4"/>
            <!-- Smiling face -->
            <circle cx="48" cy="56" r="4.5" fill="#4A4E69"/>
            <circle cx="72" cy="56" r="4.5" fill="#4A4E69"/>
            <path d="M52 68 Q60 76 68 68" stroke="#4A4E69" stroke-width="3" fill="none" stroke-linecap="round"/>
        `),
        'guantes': createSvgUri(`
            <!-- Mittens -->
            <g transform="translate(15, 25) rotate(-15 25 35)">
                <rect x="10" y="20" width="30" height="40" rx="15" fill="#E63946"/>
                <circle cx="10" cy="38" r="9" fill="#E63946"/>
                <rect x="8" y="55" width="34" height="12" rx="4" fill="#FFF"/>
            </g>
            <g transform="translate(55, 25) rotate(15 25 35)">
                <rect x="15" y="20" width="30" height="40" rx="15" fill="#457B9D"/>
                <circle cx="45" cy="38" r="9" fill="#457B9D"/>
                <rect x="13" y="55" width="34" height="12" rx="4" fill="#FFF"/>
            </g>
        `),
        'bote': createSvgUri(`
            <!-- Little Paper / Wooden Boat -->
            <path d="M20 75 L30 100 L90 100 L100 75 Z" fill="#E07A5F"/>
            <rect x="57" y="25" width="6" height="55" fill="#3D405B"/>
            <polygon points="63,28 100,55 63,55" fill="#F4F1DE"/>
            <polygon points="57,35 25,60 57,60" fill="#81B29A"/>
            <!-- Wave -->
            <path d="M10 102 Q35 92 60 102 Q85 112 110 102" stroke="#3D5A80" stroke-width="5" fill="none" stroke-linecap="round"/>
        `),
        'mesa': createSvgUri(`
            <rect x="20" y="45" width="80" height="16" rx="6" fill="#BC6C25"/>
            <rect x="28" y="60" width="10" height="42" rx="4" fill="#99582A"/>
            <rect x="82" y="60" width="10" height="42" rx="4" fill="#99582A"/>
            <!-- Flower vase on table -->
            <ellipse cx="60" cy="40" rx="9" ry="12" fill="#A8DADC"/>
            <circle cx="60" cy="24" r="7" fill="#E63946"/>
        `),
        'sofá': createSvgUri(`
            <!-- Soft cozy sofa -->
            <rect x="15" y="45" width="90" height="45" rx="12" fill="#70A9A1"/>
            <rect x="25" y="30" width="70" height="35" rx="8" fill="#40798C"/>
            <rect x="10" y="52" width="18" height="35" rx="9" fill="#31263E"/>
            <rect x="92" y="52" width="18" height="35" rx="9" fill="#31263E"/>
            <circle cx="20" cy="95" r="4" fill="#1F2421"/>
            <circle cx="100" cy="95" r="4" fill="#1F2421"/>
        `),
        'lámpara': createSvgUri(`
            <polygon points="35,55 85,55 75,25 45,25" fill="#F4A261"/>
            <rect x="57" y="55" width="6" height="42" fill="#E76F51"/>
            <ellipse cx="60" cy="98" rx="20" ry="6" fill="#2B2D42"/>
            <!-- Light glow rays -->
            <path d="M30 65 L20 75 M90 65 L100 75" stroke="#FFE3A8" stroke-width="4" stroke-linecap="round"/>
        `),
        'jabón': createSvgUri(`
            <rect x="25" y="40" width="70" height="45" rx="18" fill="#BEE1E6"/>
            <!-- Soap Bubbles -->
            <circle cx="75" cy="30" r="10" fill="#E2ECE9" opacity="0.8"/>
            <circle cx="90" cy="20" r="6" fill="#E2ECE9" opacity="0.8"/>
            <circle cx="35" cy="28" r="8" fill="#E2ECE9" opacity="0.8"/>
            <!-- Face on soap -->
            <circle cx="50" cy="58" r="3.5" fill="#5C6B73"/>
            <circle cx="70" cy="58" r="3.5" fill="#5C6B73"/>
            <path d="M55 66 Q60 71 65 66" stroke="#5C6B73" stroke-width="2" fill="none" stroke-linecap="round"/>
        `),
        'caracol': createSvgUri(`
            <!-- Shell spiral -->
            <circle cx="52" cy="58" r="30" fill="#E07A5F"/>
            <circle cx="52" cy="58" r="20" fill="#F4F1DE"/>
            <circle cx="52" cy="58" r="10" fill="#3D405B"/>
            <!-- Body -->
            <ellipse cx="68" cy="82" rx="40" ry="12" fill="#F2CC8F"/>
            <!-- Head & Antennas -->
            <circle cx="95" cy="65" r="14" fill="#F2CC8F"/>
            <line x1="94" y1="55" x2="90" y2="40" stroke="#F2CC8F" stroke-width="4" stroke-linecap="round"/>
            <circle cx="90" cy="38" r="4" fill="#E07A5F"/>
            <line x1="102" y1="55" x2="106" y2="40" stroke="#F2CC8F" stroke-width="4" stroke-linecap="round"/>
            <circle cx="106" cy="38" r="4" fill="#E07A5F"/>
            <!-- Eyes on face -->
            <circle cx="98" cy="64" r="2.5" fill="#3D405B"/>
        `),
        'gallo': createSvgUri(`
            <circle cx="60" cy="68" r="38" fill="#F4A261"/>
            <!-- Crest (red) -->
            <circle cx="52" cy="24" r="9" fill="#E63946"/>
            <circle cx="64" cy="20" r="10" fill="#E63946"/>
            <circle cx="76" cy="26" r="8" fill="#E63946"/>
            <!-- Eye & Beak -->
            <circle cx="68" cy="56" r="4" fill="#1D3557"/>
            <polygon points="76,60 96,66 76,72" fill="#FFB703"/>
            <circle cx="50" cy="74" r="14" fill="#E76F51"/>
        `)
    };

    // Add accent-agnostic aliases
    stickers['mama'] = stickers['mamá'];
    stickers['papa'] = stickers['papá'];
    stickers['sofa'] = stickers['sofá'];
    stickers['lampara'] = stickers['lámpara'];
    stickers['jabon'] = stickers['jabón'];

    // Set of rich illustrated PNGs available in images/elements/
    const availablePngs = new Set([
        'amigos', 'avion', 'barco', 'barrer', 'bebe', 'bicicleta', 'bote', 'brocoli', 'calabaza',
        'cansado', 'caracol', 'carro', 'cebolla', 'cepillar', 'comer', 'conejo', 'dormir', 'emma',
        'empujar', 'escuela', 'flor', 'fresa', 'galleta', 'gallo', 'gato', 'globo', 'guantes',
        'helado', 'huevo', 'jabon', 'jardin', 'jirafa', 'lampara', 'leche', 'libros', 'lobo',
        'mama', 'manzana', 'medico', 'mesa', 'negro', 'orejas', 'oso', 'pan', 'papa', 'pelota',
        'perro', 'platano', 'pollito', 'robot', 'sofa', 'sol', 'tambor', 'televisor', 'tigre',
        'tren', 'uvas', 'vestir', 'yogur'
    ]);

    return {
        /**
         * Get asset image: prioritizes rich storybook PNG illustrations, falls back to SVG sticker
         * @param {string} word 
         * @returns {string} - Image src
         */
        getAsset(word) {
            if (!word) return '';
            const lower = word.toLowerCase().trim();
            const normalized = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");

            // 1. Prioritize rich PNG illustrations if available
            if (availablePngs.has(normalized)) {
                return `images/elements/${normalized}.png`;
            }

            // 2. High-quality SVG sticker
            if (stickers[lower]) {
                return stickers[lower];
            }
            if (stickers[normalized]) {
                return stickers[normalized];
            }

            return `images/elements/${normalized}.png`;
        }
    };
})();

// Export for Node / Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetProvider;
}
if (typeof window !== 'undefined') {
    window.AssetProvider = AssetProvider;
}
