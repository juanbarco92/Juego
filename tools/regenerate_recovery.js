require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CURRICULUM_PATH = path.join(__dirname, '../src/data/master_curriculum.json');
const IMAGES_DIR = path.join(__dirname, '../images/elements');
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

const MODEL_NAME = 'models/imagen-4.0-ultra-generate-001';
const APPROVED_ASSETS_PATH = path.join(__dirname, 'approved_assets.json');

if (!API_KEY) {
    console.error("❌ API KEY not found");
    process.exit(1);
}

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

function normalizeWord(word) {
    return word.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n")
        .replace(/\s+/g, "_");
}

function loadCurriculum() {
    return JSON.parse(fs.readFileSync(CURRICULUM_PATH, 'utf8'));
}

function loadApprovedAssets() {
    if (fs.existsSync(APPROVED_ASSETS_PATH)) {
        return JSON.parse(fs.readFileSync(APPROVED_ASSETS_PATH, 'utf8'));
    }
    return [];
}

function saveBase64Image(base64Data, filepath) {
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);
}

function callApi(postDataObj) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(postDataObj);
        const method = 'predict';
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/${MODEL_NAME}:${method}?key=${API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    let errMsg = data;
                    try { const json = JSON.parse(data); errMsg = JSON.stringify(json.error || json); } catch (e) { }
                    return reject(new Error(`API ${res.statusCode}: ${errMsg}`));
                }
                try {
                    const response = JSON.parse(data);
                    if (response.predictions && response.predictions[0]) {
                        const pred = response.predictions[0];
                        resolve(pred.bytesBase64Encoded || pred.image64 || pred);
                    } else if (response.images && response.images[0]) {
                        resolve(response.images[0].image64);
                    } else {
                        reject(new Error(`Unexpected response: ${JSON.stringify(response).substring(0, 200)}`));
                    }
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

const PROMPT_TEMPLATES = {
    flat_icon_body_no_anthro: "Ilustración original, plana y minimalista, estilo cartoon suave y amigable. Representación visual clara y simple de [PALABRA]. Representación como parte del cuerpo, tipo ilustración educativa infantil. Formas redondeadas, colores suaves, contornos limpios. Sin rasgos faciales ni elementos humanos añadidos. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_icon_object_no_anthro: "Ilustración original, plana y minimalista, estilo cartoon simple y bonito. Representación visual clara y simple de un/una [PALABRA]. Representación como objeto inanimado. Formas suaves, colores agradables, diseño limpio tipo sticker. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_icon_food_no_anthro: "Ilustración original, plana y minimalista, estilo cartoon simple y agradable. Representación visual clara y simple de [PALABRA]. Representación como comida, con colores naturales suavizados. Diseño limpio y apetitoso, sin rasgos faciales. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_icon_clothing_no_anthro: "Ilustración original, plana y minimalista, estilo cartoon suave. Representación visual clara y simple de [PALABRA]. Representación como prenda de vestir infantil. Colores agradables, forma simple, prenda aislada. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_icon_place_no_anthro: "Ilustración original, plana y minimalista, estilo cartoon limpio. Representación visual clara y simple de [PALABRA]. Representación como lugar o espacio. Formas básicas, colores suaves, composición clara. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_icon_animal_no_anthro: "Ilustración original, plana y minimalista, estilo cartoon tierno. Representación visual clara y simple de un/a [PALABRA]. Representado como animal simple y amigable, con postura natural. Rasgos suaves, sin ropa ni objetos humanos. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_character_action: "Ilustración original, plana y minimalista, estilo cartoon infantil. Representación visual clara y simple de [PALABRA]. Personaje simple realizando claramente la acción. Postura fácil de reconocer, expresión suave y amigable. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_character_concept: "Ilustración original, plana y minimalista, estilo cartoon infantil. Representación visual clara y simple de [PALABRA]. Personaje simple representando el concepto o emoción. Expresión clara pero suave, diseño amigable y comprensible. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_character_profession: "Ilustración original, plana y minimalista, estilo cartoon infantil. Representación visual clara y simple de [PALABRA]. Personaje simple representando la profesión, con atuendo característico claro y diseño amable. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.",
    flat_character_relation: "Ilustración original, plana y minimalista, estilo cartoon infantil. Dos o tres personajes infantiles simples representando [PALABRA]. Interacción clara entre ellos (juntos, compartiendo, sonriendo). Diseño tierno y amigable, escena mínima. Fondo blanco completamente liso, sin texto."
};

function generate_prompt(word, metadata) {
    if (!metadata || !metadata.promptProfile) return `Ilustración vectorial plana de ${word}. Representación visual clara y simple de ${word}. SIN TEXTO, sin letras, sin palabras. Fondo blanco completamente liso (sin degradados), objeto centrado y aislado.`;

    let template = PROMPT_TEMPLATES[metadata.promptProfile] || PROMPT_TEMPLATES['flat_icon_object_no_anthro'];
    let templateString = template.replace(/\[PALABRA\]/g, word);
    const neg = generate_negative_prompt(metadata.renderMode);
    templateString += ` (Excluir: ${neg})`;
    return templateString;
}

function generate_negative_prompt(renderMode) {
    let neg = "photorealistic, 3d render, realistic lighting, detailed shading, complex gradients, background clutter, text, watermark, extra limbs, blur, noisy, sketchy";
    if (renderMode === 'ICON') {
        neg += ", eyes, face, mouth, smile, character, humanoid, anthropomorphic, clothes, accessories, person, man, woman, child";
    }
    return neg;
}

function getWordMetadata(curriculum, targetWord) {
    const nTarget = normalizeWord(targetWord);
    const relationalWords = ["amigos", "familia", "compañeros", "amigos_del_colegio", "amigos_jugando"];
    if (relationalWords.includes(nTarget)) {
        return {
            category: "RELATION",
            renderMode: "CHARACTER",
            promptProfile: "flat_character_relation",
            theme: "relaciones"
        };
    }
    for (const level of Object.values(curriculum.wordSets)) {
        for (const group of Object.values(level)) {
            if (group.words) {
                const found = group.words.find(w => normalizeWord(w) === nTarget);
                if (found) {
                    return {
                        category: group.category,
                        renderMode: group.renderMode,
                        promptProfile: group.promptProfile,
                        theme: group.theme
                    };
                }
            }
        }
    }
    return null;
}

async function generateImage(prompt) {
    const MAX_RETRIES = 5;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const payload = {
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1 }
            };
            return await callApi(payload);
        } catch (e) {
            attempt++;
            console.error(`❌ Attempt ${attempt} failed: ${e.message}`);
            if (e.message.includes("429") || e.message.includes("Quota exceeded")) {
                const waitTime = Math.pow(2, attempt) * 2000;
                console.log(`⏳ Rate Limit Hit. Waiting ${waitTime / 1000}s before retry...`);
                await new Promise(r => setTimeout(r, waitTime));
            } else {
                if (e.message.includes("400")) throw e;
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }
    throw new Error(`Failed to generate image after ${MAX_RETRIES} attempts.`);
}

async function main() {
    console.log("🚀 Starting Recovery Regeneration...");
    const curriculum = loadCurriculum();
    const approvedAssets = loadApprovedAssets();

    // Original git assets (SAFE)
    const safeAssets = [
        "bebe", "flor", "gato", "lampara", "libros",
        "mama", "papa", "pelota", "perro", "sofa", "televisor"
    ];

    // Filter approved assets that are NOT in safeAssets
    const missingAssets = approvedAssets.filter(w => !safeAssets.includes(normalizeWord(w)));

    console.log(`📋 Found ${missingAssets.length} assets to regenerate.`);
    console.log(`Targets: ${missingAssets.join(", ")}`);

    const targetBatch = missingAssets.map(w => ({
        word: w,
        normalized: normalizeWord(w),
        filepath: path.join(IMAGES_DIR, `${normalizeWord(w)}.png`)
    }));

    for (const item of targetBatch) {
        console.log(`\n🎨 Generating: "${item.word}"...`);
        const meta = getWordMetadata(curriculum, item.word);
        if (!meta) {
            console.warn(`⚠️ Skipped ${item.word}: Metadata not found`);
            continue;
        }

        const prompt = generate_prompt(item.word, meta);
        console.log(`   📝 Prompt: "${prompt.substring(0, 100)}..."`);

        try {
            const b64 = await generateImage(prompt);
            saveBase64Image(b64, item.filepath);
            console.log(`✅ Saved: ${item.normalized}.png`);

            // 5 second delay to stay under typical quota
            await new Promise(r => setTimeout(r, 5000));
        } catch (e) {
            console.error(`❌ Failed "${item.word}":`, e.message);
        }
    }
    console.log("🏁 Regeneration Complete.");
}

main().catch(console.error);
