const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos del juego
app.use(express.static(path.join(__dirname), {
    maxAge: '1h'
}));

// Fallback para cualquier otra ruta
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Emma Aprende corriendo en http://0.0.0.0:${PORT}`);
});
