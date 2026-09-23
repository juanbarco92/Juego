const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos con control estricto de caché
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        // Nunca cachear index.html ni sw.js para que las actualizaciones se reflejen de inmediato
        if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        }
    }
}));

// Fallback para cualquier otra ruta (no cache)
app.use((req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Emma Aprende corriendo en http://0.0.0.0:${PORT}`);
});
