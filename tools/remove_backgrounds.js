const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../images/elements');

if (!fs.existsSync(IMAGES_DIR)) {
    console.error("❌ Images directory not found.");
    process.exit(1);
}

const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));

console.log(`🚀 Starting background removal for ${files.length} images using Jimp...`);

async function processImage(file) {
    const inputPath = path.join(IMAGES_DIR, file);

    try {
        const image = await Jimp.read(inputPath);

        // Threshold for "white". 255 is pure white. 
        // We use slightly less to catch compression artifacts or anti-aliasing overlap.
        const THRESHOLD = 240;

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            // alpha is idx + 3

            // If pixel is sufficiently white, make it transparent
            if (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        // image.autocrop(); // Optional but can cut off things

        await image.write(inputPath);
        console.log(`✅ Processed: ${file}`);
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
}

async function main() {
    // Process serially to avoid memory issues with many images
    for (const file of files) {
        await processImage(file);
    }
    console.log("🏁 Background removal complete.");
}

main();
