const fs = require('fs');
const path = require('path');

const MASTER_CURRICULUM_PATH = path.join(__dirname, '../src/data/master_curriculum.json');
const APPROVED_PATH = path.join(__dirname, 'approved_assets.json');
const OUTPUT_PATH = path.join(__dirname, '../src/data/active_curriculum.json');

function normalizeWord(word) {
    return word.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n")
        .replace(/\s+/g, "_");
}

console.log("🚀 Updating Game Content...");

if (!fs.existsSync(APPROVED_PATH)) {
    console.error("❌ Approved assets file not found.");
    process.exit(1);
}

const approvedWords = JSON.parse(fs.readFileSync(APPROVED_PATH, 'utf8'));
const approvedSet = new Set(approvedWords.map(w => normalizeWord(w)));

const curriculum = JSON.parse(fs.readFileSync(MASTER_CURRICULUM_PATH, 'utf8'));
let wordCount = 0;

// Filter the curriculum
if (curriculum.familyMembers) {
    if (curriculum.familyMembers.core) {
        curriculum.familyMembers.core = curriculum.familyMembers.core.filter(w => approvedSet.has(normalizeWord(w)));
    }
    if (curriculum.familyMembers.extended) {
        curriculum.familyMembers.extended = curriculum.familyMembers.extended.filter(w => approvedSet.has(normalizeWord(w)));
    }
}

// Filter Word Sets
for (const [levelKey, level] of Object.entries(curriculum.wordSets)) {
    for (const [groupKey, group] of Object.entries(level)) {
        if (group.words) {
            // Filter words in this group
            const originalLength = group.words.length;
            group.words = group.words.filter(w => approvedSet.has(normalizeWord(w)));
            wordCount += group.words.length;

            // Log if words were removed
            if (group.words.length < originalLength) {
                // console.log(`  Filtered ${groupKey}: ${originalLength} -> ${group.words.length}`);
            }
        }
    }
}

// Remove empty groups or levels if needed (optional, keeping structure for now)
// We might want to remove groups that have 0 words to avoid empty levels in game
for (const [levelKey, level] of Object.entries(curriculum.wordSets)) {
    for (const [groupKey, group] of Object.entries(level)) {
        if (group.words && group.words.length === 0) {
            delete level[groupKey];
        }
    }
    if (Object.keys(level).length === 0) {
        delete curriculum.wordSets[levelKey];
    }
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(curriculum, null, 2));

console.log(`✅ Active curriculum generated with ${wordCount} words.`);
console.log(`📂 Saved to: ${OUTPUT_PATH}`);
