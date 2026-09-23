const fs = require('fs');
const path = require('path');

const APPROVED_PATH = path.join(__dirname, 'approved_assets.json');
const IMAGES_DIR = path.join(__dirname, '../images/elements');

function normalizeWord(word) {
    return word.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n")
        .replace(/\s+/g, "_");
}

if (!fs.existsSync(APPROVED_PATH)) {
    console.error("❌ approved_assets.json not found.");
    process.exit(1);
}

const approvedWords = JSON.parse(fs.readFileSync(APPROVED_PATH, 'utf8'));
const approvedFilenames = new Set(approvedWords.map(w => `${normalizeWord(w)}.png`));

if (!fs.existsSync(IMAGES_DIR)) {
    console.log("No images directory found.");
    process.exit(0);
}

const files = fs.readdirSync(IMAGES_DIR);
let deletedCount = 0;

console.log(`🔍 Checking ${files.length} files against ${approvedWords.length} approved assets...`);

files.forEach(file => {
    if (file.endsWith('.png')) {
        if (!approvedFilenames.has(file)) {
            console.log(`🗑️ Deleting unapproved: ${file}`);
            fs.unlinkSync(path.join(IMAGES_DIR, file));
            deletedCount++;
        } else {
            // console.log(`✅ Keeping: ${file}`);
        }
    }
});

console.log(`✨ Cleanup complete. Deleted ${deletedCount} files.`);
