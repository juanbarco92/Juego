const fs = require('fs');
const path = require('path');

const CURRICULUM_PATH = path.join(__dirname, '../src/data/master_curriculum.json');

if (!fs.existsSync(CURRICULUM_PATH)) {
    console.error("❌ Curriculum file not found");
    process.exit(1);
}

const curriculum = JSON.parse(fs.readFileSync(CURRICULUM_PATH, 'utf8'));

// Classification Rules
function classifyGroup(groupName) {
    // 1) BODY_PART
    if (groupName.includes('my_body')) {
        return { category: 'BODY_PART', renderMode: 'ICON', promptProfile: 'flat_icon_body_no_anthro' };
    }

    // 2) FOOD
    if (['kitchen_fruits', 'kitchen_vegetables', 'kitchen_food'].includes(groupName)) {
        return { category: 'FOOD', renderMode: 'ICON', promptProfile: 'flat_icon_food_no_anthro' };
    }

    // 3) OBJECT (Explicit list + Transport inferred)
    if (['kitchen_utensils', 'bedroom_furniture', 'living_room', 'school_items', 'bathroom_objects'].includes(groupName) || groupName.startsWith('toys_') || groupName.startsWith('transport_')) {
        return { category: 'OBJECT', renderMode: 'ICON', promptProfile: 'flat_icon_object_no_anthro' };
    }

    // 4) PLACE
    if (['house_parts', 'city_places'].includes(groupName) || groupName === 'park_nature') {
        // 'park_nature' usually contains 'park', 'mountain', etc, which fit PLACE. Elements like 'flower' fit too as flat icons.
        return { category: 'PLACE', renderMode: 'ICON', promptProfile: 'flat_icon_place_no_anthro' };
    }

    // 5) CLOTHING
    if (groupName.startsWith('clothing_')) {
        return { category: 'CLOTHING', renderMode: 'ICON', promptProfile: 'flat_icon_clothing_no_anthro' };
    }

    // 6) ANIMAL
    if (groupName.startsWith('pets_') || ['farm_animals', 'wild_animals', 'insects'].includes(groupName)) {
        return { category: 'ANIMAL', renderMode: 'ICON', promptProfile: 'flat_icon_animal_no_anthro' };
    }

    // 7) VERB
    if (groupName.startsWith('verbs_')) {
        return { category: 'VERB', renderMode: 'CHARACTER', promptProfile: 'flat_character_action' };
    }

    // 8) ADJECTIVE
    if (groupName.startsWith('adjectives_')) {
        return { category: 'ADJECTIVE', renderMode: 'CHARACTER', promptProfile: 'flat_character_concept' };
    }

    // 9) PROFESSION
    if (groupName === 'professions') {
        return { category: 'PROFESSION', renderMode: 'CHARACTER', promptProfile: 'flat_character_profession' };
    }

    // Fallback/Special Cases
    if (groupName === 'family_extended') {
        // Treating Family as Profession/Role for now as it fits "Character" best among options
        return { category: 'PROFESSION', renderMode: 'CHARACTER', promptProfile: 'flat_character_profession' };
    }

    return null; // Unknown
}

let modifiedCount = 0;

// Iterate Levels and Groups
for (const [levelKey, levelData] of Object.entries(curriculum.wordSets)) {
    for (const [groupKey, groupData] of Object.entries(levelData)) {
        const metadata = classifyGroup(groupKey);
        if (metadata) {
            groupData.category = metadata.category;
            groupData.renderMode = metadata.renderMode;
            groupData.promptProfile = metadata.promptProfile;
            modifiedCount++;
        } else {
            console.warn(`⚠️ Warning: Could not classify group '${groupKey}'`);
        }
    }
}

fs.writeFileSync(CURRICULUM_PATH, JSON.stringify(curriculum, null, 4), 'utf8');
console.log(`✅ Update Complete. Modified ${modifiedCount} groups.`);
