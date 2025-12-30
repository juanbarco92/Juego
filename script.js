// Game State
let gameState = {
    currentLevel: 1,
    score: 0,
    matches: 0,
    totalMatches: 0
};

// DOM Elements
const gameContainer = document.querySelector('.game-container');
const wordsContainer = document.getElementById('words-container');
const scenarioContainer = document.getElementById('scenario-container');
const scenarioBackground = document.getElementById('scenario-background');
const scenarioTitle = document.getElementById('scenario-title');
const currentLevelSpan = document.getElementById('current-level');
const currentScoreSpan = document.getElementById('current-score');
const restartBtn = document.getElementById('restart-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const successModal = document.getElementById('success-modal');
const successMessage = document.getElementById('success-message');
const continueBtn = document.getElementById('continue-btn');
const celebration = document.getElementById('celebration');

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    registerServiceWorker();
    debugImageLoading();
});

// Register Service Worker for offline functionality
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(function(error) {
                console.log('Error al registrar Service Worker:', error);
            });
    }
}

function initializeGame() {
    updateUI();
    loadLevel(gameState.currentLevel);
}

// Función auxiliar para mezclar un array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function setupEventListeners() {
    restartBtn.addEventListener('click', restartGame);
    nextLevelBtn.addEventListener('click', nextLevel);
    continueBtn.addEventListener('click', hideSuccessModal);
}

function updateUI() {
    currentLevelSpan.textContent = gameState.currentLevel;
    currentScoreSpan.textContent = gameState.score;
    gameContainer.className = `game-container level-${gameState.currentLevel}`;
}

function loadLevel(level) {
    // Clear containers
    wordsContainer.innerHTML = '';
    scenarioBackground.innerHTML = '';
    
    // Get scenario configuration for this level
    const scenarioConfig = scenarioLevelConfig[level];
    if (!scenarioConfig) return;

    const scenario = gameScenarios[scenarioConfig.scenario];
    if (!scenario) return;

    // Set scenario background and title
    scenarioBackground.style.backgroundImage = `url('${scenario.background}')`;
    scenarioTitle.textContent = `${getScenarioEmoji(scenarioConfig.scenario)} ${scenario.name}`;

    // Get elements for this level
    const availableElements = scenario.elements.filter(el => el.level <= level);
    const selectedElements = shuffleArray(availableElements).slice(0, scenarioConfig.elements);

    // Set total matches for this level
    gameState.totalMatches = selectedElements.length;
    gameState.matches = 0;

    // Create word cards
    const shuffledWords = shuffleArray([...selectedElements]);
    shuffledWords.forEach(item => {
        const wordCard = createWordCard(item);
        wordsContainer.appendChild(wordCard);
    });

    // 🎯 CREAR DROPZONES CENTRADAS AUTOMÁTICAMENTE
    selectedElements.forEach(item => {
        if (item.dropZone) {
            createDropZone(item, scenarioBackground);
        }
    });

    // 🖼️ MOSTRAR IMÁGENES DE ELEMENTOS EN EL ESCENARIO
    createScenarioElements(selectedElements, scenarioBackground);

    // Hide next level button
    nextLevelBtn.style.display = 'none';
    
    console.log(`Nivel ${level} cargado - ${scenario.name} con ${selectedElements.length} elementos`);
}

function getScenarioEmoji(scenarioKey) {
    const emojis = {
        casa: '🏠',
        parque: '🌳', 
        cocina: '👩‍🍳'
    };
    return emojis[scenarioKey] || '🎮';
}

function createWordCard(item) {
    const wordCard = document.createElement('div');
    wordCard.className = 'word-card';
    wordCard.textContent = item.word;
    wordCard.dataset.id = item.id;
    wordCard.draggable = true;

    // Touch events for mobile/iPad
    wordCard.addEventListener('touchstart', handleTouchStart, { passive: false });
    wordCard.addEventListener('touchmove', handleTouchMove, { passive: false });
    wordCard.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events for desktop
    wordCard.addEventListener('dragstart', handleDragStart);
    wordCard.addEventListener('dragend', handleDragEnd);

    return wordCard;
}

// 🎯 NUEVA FUNCIÓN PARA CREAR DROPZONES CENTRADAS
function createDropZone(element, gameArea) {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.dataset.elementId = element.id;
    
    // 📐 CALCULAR TAMAÑO DE LA IMAGEN VISUAL
    const sizeMultiplier = element.displaySize || 2.5;
    const imageVisualWidth = element.position.width * sizeMultiplier;
    const imageVisualHeight = element.position.height * sizeMultiplier;
    
    // 🎯 CALCULAR TAMAÑO DE LA DROPZONE (% de la imagen)
    const dropWidthPercent = element.dropZone.widthPercent || 0.6;
    const dropHeightPercent = element.dropZone.heightPercent || 0.6;
    
    const dropZoneWidth = imageVisualWidth * dropWidthPercent;
    const dropZoneHeight = imageVisualHeight * dropHeightPercent;
    
    // 📍 CALCULAR CENTRO DE LA IMAGEN (mismo que la crucecita roja)
    const imageOffsetX = (imageVisualWidth - element.position.width) / 2;
    const imageOffsetY = (imageVisualHeight - element.position.height) / 2;
    const imageCenterX = element.position.x - imageOffsetX + (imageVisualWidth / 2);
    const imageCenterY = element.position.y - imageOffsetY + (imageVisualHeight / 2);
    
    // 🎯 POSICIONAR DROPZONE CENTRADA EN LA IMAGEN
    const dropZoneX = imageCenterX - (dropZoneWidth / 2);
    const dropZoneY = imageCenterY - (dropZoneHeight / 2);
    
    // 🎨 APLICAR ESTILOS
    dropZone.style.position = 'absolute';
    dropZone.style.left = `${dropZoneX}%`;
    dropZone.style.top = `${dropZoneY}%`;
    dropZone.style.width = `${dropZoneWidth}%`;
    dropZone.style.height = `${dropZoneHeight}%`;
    dropZone.style.zIndex = '50'; // Entre imagen (10) y crucecita (100)
    
    // 🔧 DEBUG: DROPZONES DESACTIVADO
    // dropZone.style.border = '3px dashed #2196F3';
    // dropZone.style.backgroundColor = 'rgba(33, 150, 243, 0.2)';
    // dropZone.style.borderRadius = '8px';
    // dropZone.style.boxSizing = 'border-box';
    
    // 🔧 DEBUG: TOOLTIP DESACTIVADO
    // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('192.168')) {
    //     dropZone.title = `DROPZONE ${element.word}: ${(dropWidthPercent*100).toFixed(0)}% x ${(dropHeightPercent*100).toFixed(0)}% de imagen`;
    // }
    
    // 🎮 EVENTOS DE DRAG & DROP
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    
    gameArea.appendChild(dropZone);
    return dropZone;
}

// Touch Events for iPad/Mobile
let currentDragElement = null;
let touchOffset = { x: 0, y: 0 };

function handleTouchStart(e) {
    e.preventDefault();
    currentDragElement = e.target;
    currentDragElement.classList.add('dragging');
    
    const touch = e.touches[0];
    const rect = currentDragElement.getBoundingClientRect();
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;

    // Create a clone for visual feedback
    const clone = currentDragElement.cloneNode(true);
    clone.classList.add('dragging');
    clone.style.position = 'fixed';
    clone.style.zIndex = '1000';
    clone.style.pointerEvents = 'none';
    clone.style.left = touch.clientX - touchOffset.x + 'px';
    clone.style.top = touch.clientY - touchOffset.y + 'px';
    clone.id = 'drag-clone';
    document.body.appendChild(clone);

    currentDragElement.style.opacity = '0.5';
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!currentDragElement) return;

    const touch = e.touches[0];
    const clone = document.getElementById('drag-clone');
    if (clone) {
        clone.style.left = touch.clientX - touchOffset.x + 'px';
        clone.style.top = touch.clientY - touchOffset.y + 'px';
    }

    // Check for drag over
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.drop-zone');
    
    // Remove drag-over class from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });

    // Add drag-over class to current target
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!currentDragElement) return;

    const touch = e.changedTouches[0];
    const clone = document.getElementById('drag-clone');
    if (clone) {
        clone.remove();
    }

    currentDragElement.style.opacity = '1';
    currentDragElement.classList.remove('dragging');

    // Check drop target
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = elementBelow?.closest('.drop-zone');

    // Remove drag-over class from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });

    if (dropTarget) {
        handleMatchAttempt(currentDragElement, dropTarget);
    }

    currentDragElement = null;
}

// Mouse Drag Events
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

// 🎮 FUNCIONES DE DRAG & DROP
function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const dropZone = e.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone) return;
    
    dropZone.classList.remove('drag-over');
    
    const wordId = e.dataTransfer.getData('text/plain');
    const wordCard = document.querySelector(`[data-id="${wordId}"]`);
    
    handleMatchAttempt(wordCard, dropZone);
}

// 🎯 FUNCIONES DE MATCH
function handleMatchAttempt(wordCard, dropZone) {
    const wordId = wordCard.dataset.id;
    const zoneId = dropZone.dataset.elementId;

    if (wordId === zoneId && !dropZone.classList.contains('matched')) {
        // ✅ Correct match!
        handleCorrectMatch(wordCard, dropZone);
    } else {
        // ❌ Wrong match - shake animation
        handleWrongMatch(wordCard);
    }
}

function handleCorrectMatch(wordCard, dropZone) {
    // Mark as matched
    dropZone.classList.add('matched');
    
    // Hide word card with animation
    wordCard.style.transform = 'scale(0)';
    wordCard.style.opacity = '0';
    
    setTimeout(() => {
        wordCard.style.display = 'none';
    }, 300);

    // Update score and matches
    gameState.score += 10;
    gameState.matches++;
    updateUI();

    // Celebration effect
    createCelebrationEffect(dropZone);

    // Check if level is complete
    if (gameState.matches >= gameState.totalMatches) {
        setTimeout(() => {
            handleLevelComplete();
        }, 1000);
    }
}

function handleWrongMatch(wordCard) {
    // Shake animation
    wordCard.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        wordCard.style.animation = '';
    }, 500);
}

function createCelebrationEffect(target) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const confettiEmojis = ['🎉', '✨', '🌟', '🎊', '💫'];
    
    for (let i = 0; i < 8; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.animationDelay = (i * 0.1) + 's';
        celebration.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function handleLevelComplete() {
    let message = '';
    let showNextButton = false;

    if (gameState.currentLevel === 5) {
        message = '🎉 ¡Felicidades! ¡Has completado todos los niveles! ¡Eres increíble! 🌟\n\n⏰ El juego se reiniciará en unos segundos...';
        gameState.isGameComplete = true;
        
        // Cambiar el texto del botón para el último nivel
        continueBtn.textContent = '🔄 Jugar de Nuevo';
        
        // Reiniciar automáticamente después de 5 segundos
        setTimeout(() => {
            hideSuccessModal();
            restartGame();
        }, 5000);
        
    } else {
        message = `🎊 ¡Excelente! ¡Has completado el nivel ${gameState.currentLevel}! 🎊`;
        showNextButton = true;
        nextLevelBtn.style.display = 'block';
        
        // Restaurar el texto original del botón para niveles intermedios
        continueBtn.textContent = 'Continuar';
    }

    successMessage.textContent = message;
    successModal.style.display = 'flex';

    // Big celebration
    createBigCelebration();
}

function createBigCelebration() {
    const confettiEmojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎁', '🏆'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-50px';
            confetti.style.animationDelay = '0s';
            celebration.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

function hideSuccessModal() {
    successModal.style.display = 'none';
    
    // Si el juego está completo y se presiona continuar, reiniciar
    if (gameState.isGameComplete) {
        restartGame();
    }
}

function nextLevel() {
    if (gameState.currentLevel < 5) {
        gameState.currentLevel++;
        updateUI();
        loadLevel(gameState.currentLevel);
        hideSuccessModal();
    }
}

function restartGame() {
    gameState = {
        currentLevel: 1,
        score: 0,
        matches: 0,
        totalMatches: 0,
        isGameComplete: false
    };
    
    hideSuccessModal();
    updateUI();
    loadLevel(1);
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Prevent default drag behavior on images
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Prevent context menu on long press (iOS)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable text selection on touch devices
document.addEventListener('selectstart', function(e) {
    if (e.target.closest('.word-card')) {
        e.preventDefault();
    }
});

// 🔧 FUNCIÓN DE DEBUG PARA IMÁGENES
function debugImageLoading() {
    console.log("🔍 DEBUGGING IMAGE LOADING:");
    
    // Verificar que los escenarios se carguen
    console.log("📁 Scenarios loaded:", Object.keys(gameScenarios));
    
    // Verificar elementos del escenario casa
    const casaElements = gameScenarios.casa.elements;
    console.log("🏠 Casa elements:", casaElements.length);
    
    // Probar carga de cada imagen
    casaElements.forEach(element => {
        const img = new Image();
        img.onload = function() {
            console.log(`✅ ${element.word} image loaded successfully:`, element.image);
        };
        img.onerror = function() {
            console.error(`❌ ${element.word} image failed to load:`, element.image);
            console.log(`🔄 Using emoji fallback: ${element.emoji}`);
        };
        img.src = element.image;
    });
}

// Función para crear elementos visuales en el escenario
function createScenarioElements(elements, gameArea) {
    elements.forEach(element => {
        // Skip crear imagen si displaySize es 0 (para elementos que comparten imagen base)
        if (element.displaySize === 0) return;
        
        const elementDiv = document.createElement('div');
        elementDiv.className = 'scenario-element';
        elementDiv.dataset.elementId = element.id;
        
        // 🎯 TAMAÑO VISUAL PERSONALIZADO
        // Usa displaySize del elemento o un multiplicador por defecto
        const sizeMultiplier = element.displaySize || 2.5;
        const visualWidth = element.position.width * sizeMultiplier;
        const visualHeight = element.position.height * sizeMultiplier;
        
        // Centrar la imagen en la posición original
        const offsetX = (visualWidth - element.position.width) / 2;
        const offsetY = (visualHeight - element.position.height) / 2;
        
        // Posición del elemento visual (centrada en la zona de drop)
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.position.x - offsetX}%`;
        elementDiv.style.top = `${element.position.y - offsetY}%`;
        elementDiv.style.width = `${visualWidth}%`;
        elementDiv.style.height = `${visualHeight}%`;
        elementDiv.style.zIndex = '10';
        elementDiv.style.pointerEvents = 'none'; // No interfiere con el drag & drop
        
        // 🔧 DEBUG MODE: DESACTIVADO
        // elementDiv.style.border = '2px solid #4CAF50';
        // elementDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        // elementDiv.style.boxSizing = 'border-box';
        
        // 🎯 DEBUG: CRUCECITA DESACTIVADA
        // const centerCross = document.createElement('div');
        // centerCross.style.position = 'absolute';
        // centerCross.style.top = '50%';
        // centerCross.style.left = '50%';
        // centerCross.style.width = '20px';
        // centerCross.style.height = '20px';
        // centerCross.style.transform = 'translate(-50%, -50%)';
        // centerCross.style.pointerEvents = 'none';
        // centerCross.style.zIndex = '100';
        // centerCross.innerHTML = `
        //     <div style="
        //         position: absolute;
        //         top: 50%;
        //         left: 0;
        //         right: 0;
        //         height: 2px;
        //         background: #FF5722;
        //         transform: translateY(-50%);
        //     "></div>
        //     <div style="
        //         position: absolute;
        //         left: 50%;
        //         top: 0;
        //         bottom: 0;
        //         width: 2px;
        //         background: #FF5722;
        //         transform: translateX(-50%);
        //     "></div>
        // `;
        // elementDiv.appendChild(centerCross);
        
        // Crear imagen del elemento
        const img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'; // Sombra para mejor visibilidad
        img.alt = element.word;
        
        // Manejar carga de imagen
        img.onload = function() {
            console.log(`✅ ${element.word} cargada: ${visualWidth.toFixed(1)}% x ${visualHeight.toFixed(1)}% (multiplicador: ${sizeMultiplier}x)`);
        };
        
        // 🔧 DEBUG: TOOLTIP DESACTIVADO
        // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('192.168')) {
        //     elementDiv.title = `IMAGEN ${element.word}: ${visualWidth.toFixed(1)}% x ${visualHeight.toFixed(1)}% (displaySize: ${sizeMultiplier}x)`;
        // }
        
        img.onerror = function() {
            console.warn(`⚠️ Image failed for ${element.word}, using emoji fallback`);
            // Fallback a emoji si la imagen no carga - también más grande
            const emojiSize = Math.min(visualWidth, visualHeight) * 1.5;
            elementDiv.innerHTML = `<div style="font-size: ${emojiSize}px; display: flex; align-items: center; justify-content: center; height: 100%; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${element.emoji}</div>`;
        };
        
        img.src = element.image;
        elementDiv.appendChild(img);
        gameArea.appendChild(elementDiv);
    });
} 

// ======================================
// 🔧 SISTEMA DE DEBUG
// ======================================

// Variables de debug
let debugMode = false;
let debugPanel = null;
let debugToggle = null;

// Extender la inicialización para incluir debug
const originalInitialize = setupEventListeners;
setupEventListeners = function() {
    originalInitialize();
    initializeDebug();
};

function initializeDebug() {
    debugPanel = document.getElementById('debug-panel');
    debugToggle = document.getElementById('debug-toggle');
    
    if (!debugPanel || !debugToggle) return;
    
    // Event listeners para el panel de debug
    debugToggle.addEventListener('click', toggleDebugPanel);
    document.getElementById('debug-close').addEventListener('click', closeDebugPanel);
    
    // Event listeners para botones de nivel
    document.querySelectorAll('.debug-level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.dataset.level);
            jumpToLevel(level);
        });
    });
    
    // Event listeners para checkboxes
    document.getElementById('debug-show-dropzones').addEventListener('change', toggleDebugDropzones);
    document.getElementById('debug-show-positions').addEventListener('change', toggleDebugPositions);
    
    // Keyboard shortcut: Ctrl+D para abrir/cerrar debug
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            toggleDebugPanel();
        }
    });
    
    // Actualizar info de debug al inicializar
    updateDebugInfo();
}

function toggleDebugPanel() {
    debugMode = !debugMode;
    
    if (debugMode) {
        debugPanel.style.display = 'block';
        updateDebugInfo();
    } else {
        debugPanel.style.display = 'none';
    }
}

function closeDebugPanel() {
    debugMode = false;
    debugPanel.style.display = 'none';
}

function jumpToLevel(level) {
    // Verificar que el nivel existe
    if (!scenarioLevelConfig[level]) {
        console.error(`Nivel ${level} no existe en la configuración`);
        return;
    }
    
    // Cambiar al nivel sin restricciones
    gameState.currentLevel = level;
    gameState.matches = 0;
    gameState.totalMatches = 0;
    
    // Cargar el nivel
    updateUI();
    loadLevel(level);
    
    // Actualizar información de debug
    updateDebugInfo();
    
    // Mensaje de debug
    console.log(`🔧 DEBUG: Saltando al nivel ${level}`);
}

function updateDebugInfo() {
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    
    if (!scenarioConfig) return;
    
    const scenario = gameScenarios[scenarioConfig.scenario];
    
    // Actualizar información básica
    document.getElementById('debug-current-level').textContent = currentLevel;
    document.getElementById('debug-current-scenario').textContent = scenario.name;
    document.getElementById('debug-current-elements').textContent = scenarioConfig.elements;
    
    // Actualizar botón activo
    document.querySelectorAll('.debug-level-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.level) === currentLevel) {
            btn.classList.add('active');
        }
    });
    
    // Actualizar lista de elementos disponibles
    updateDebugElementsList();
}

function updateDebugElementsList() {
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    
    if (!scenarioConfig) return;
    
    const scenario = gameScenarios[scenarioConfig.scenario];
    const availableElements = scenario.elements.filter(el => el.level <= currentLevel);
    
    const elementsList = document.getElementById('debug-elements-list');
    elementsList.innerHTML = '';
    
    availableElements.forEach(element => {
        const div = document.createElement('div');
        div.className = 'debug-element';
        div.innerHTML = `
            <strong>${element.word}</strong> ${element.emoji} 
            <span style="color: #666;">(Nivel ${element.level})</span>
            <br>
            <span style="font-size: 0.7rem; color: #999;">
                Pos: ${element.position.x}%, ${element.position.y}% | 
                Tamaño: ${element.position.width}% × ${element.position.height}%
                ${element.dropZone ? ' | DropZone: ✓' : ' | DropZone: ✗'}
            </span>
        `;
        elementsList.appendChild(div);
    });
}

function toggleDebugDropzones() {
    const showDropzones = document.getElementById('debug-show-dropzones').checked;
    const dropzones = document.querySelectorAll('.drop-zone');
    
    dropzones.forEach(zone => {
        if (showDropzones) {
            zone.classList.add('debug-dropzone-visible');
        } else {
            zone.classList.remove('debug-dropzone-visible');
        }
    });
    
    console.log(`🔧 DEBUG: DropZones ${showDropzones ? 'mostradas' : 'ocultadas'}`);
}

function toggleDebugPositions() {
    const showPositions = document.getElementById('debug-show-positions').checked;
    const scenarioBackground = document.getElementById('scenario-background');
    
    // Limpiar marcadores existentes
    scenarioBackground.querySelectorAll('.debug-position-marker, .debug-position-label').forEach(el => {
        el.remove();
    });
    
    if (showPositions) {
        const currentLevel = gameState.currentLevel;
        const scenarioConfig = scenarioLevelConfig[currentLevel];
        
        if (!scenarioConfig) return;
        
        const scenario = gameScenarios[scenarioConfig.scenario];
        const availableElements = scenario.elements.filter(el => el.level <= currentLevel);
        
        availableElements.forEach(element => {
            // Crear marcador de posición
            const marker = document.createElement('div');
            marker.className = 'debug-position-marker';
            marker.style.left = `${element.position.x}%`;
            marker.style.top = `${element.position.y}%`;
            
            // Crear etiqueta con información
            const label = document.createElement('div');
            label.className = 'debug-position-label';
            label.textContent = `${element.word} (${element.position.x}%, ${element.position.y}%)`;
            label.style.left = `${element.position.x}%`;
            label.style.top = `${element.position.y - 5}%`;
            
            scenarioBackground.appendChild(marker);
            scenarioBackground.appendChild(label);
        });
    }
    
    console.log(`🔧 DEBUG: Posiciones ${showPositions ? 'mostradas' : 'ocultadas'}`);
}

// Extender la función loadLevel para actualizar debug info
const originalLoadLevel = loadLevel;
loadLevel = function(level) {
    originalLoadLevel(level);
    if (debugMode) {
        updateDebugInfo();
    }
};

// Mensaje de debug en consola
console.log('🔧 Sistema de Debug inicializado');
console.log('💡 Presiona Ctrl+D para abrir el panel de debug');
console.log('💡 O haz clic en el botón 🔧 en la esquina superior derecha');

// ========================================
// 🎨 MÓDULO EDITOR VISUAL AVANZADO
// ========================================

let visualEditor = {
    enabled: false,
    selectedElement: null,
    isDragging: false,
    isResizing: false,
    dragOffset: { x: 0, y: 0 },
    resizeHandle: null,
    changedPositions: new Map()
};

// Inicializar el editor visual
function initializeVisualEditor() {
    // Crear botón de modo edición
    const editButton = document.createElement('button');
    editButton.id = 'edit-mode-toggle';
    editButton.className = 'edit-mode-toggle';
    editButton.innerHTML = '✏️';
    editButton.title = 'Modo Editor Visual (Ctrl+E)';
    editButton.addEventListener('click', toggleEditMode);
    
    // Insertar después del botón de debug
    const debugToggle = document.getElementById('debug-toggle');
    if (debugToggle) {
        debugToggle.parentNode.insertBefore(editButton, debugToggle.nextSibling);
    }
    
    // Shortcut Ctrl+E para editor
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            toggleEditMode();
        }
    });
    
    // Agregar controles al panel de debug
    addEditorControlsToDebugPanel();
    
    console.log('🎨 Editor Visual inicializado');
    console.log('💡 Presiona Ctrl+E para entrar en modo edición');
}

// Alternar modo de edición
function toggleEditMode() {
    visualEditor.enabled = !visualEditor.enabled;
    
    const editButton = document.getElementById('edit-mode-toggle');
    const scenarioBackground = document.getElementById('scenario-background');
    
    if (visualEditor.enabled) {
        editButton.classList.add('active');
        scenarioBackground.classList.add('edit-mode');
        enableElementEditing();
        console.log('🎨 Modo Editor ACTIVADO');
        
        // Debug: Verificar elementos encontrados
        const elements = document.querySelectorAll('.scenario-element');
        console.log(`🔍 Elementos encontrados para edición: ${elements.length}`);
        elements.forEach(element => {
            console.log(`  - ${element.dataset.elementId}: pointerEvents=${element.style.pointerEvents}`);
        });
    } else {
        editButton.classList.remove('active');
        scenarioBackground.classList.remove('edit-mode');
        disableElementEditing();
        console.log('🎨 Modo Editor DESACTIVADO');
    }
    
    updateEditModeUI();
}

// Habilitar edición de elementos
function enableElementEditing() {
    const elements = document.querySelectorAll('.scenario-element');
    
    elements.forEach(element => {
        makeElementEditable(element);
    });
}

// Deshabilitar edición de elementos
function disableElementEditing() {
    const elements = document.querySelectorAll('.scenario-element');
    
    elements.forEach(element => {
        makeElementNonEditable(element);
    });
    
    // Limpiar selección
    if (visualEditor.selectedElement) {
        visualEditor.selectedElement.classList.remove('selected');
        visualEditor.selectedElement = null;
    }
}

// Hacer un elemento editable
function makeElementEditable(element) {
    console.log(`🎨 Haciendo editable: ${element.dataset.elementId}`);
    element.classList.add('editable');
    element.style.pointerEvents = 'auto'; // Habilitar eventos del mouse
    element.addEventListener('mousedown', startElementDrag);
    element.addEventListener('click', selectElement);
    
    // Crear handles de redimensionamiento
    createResizeHandles(element);
    
    console.log(`✅ Elemento ${element.dataset.elementId} ahora es editable`);
}

// Hacer un elemento no editable
function makeElementNonEditable(element) {
    element.classList.remove('editable', 'selected');
    element.style.pointerEvents = 'none'; // Deshabilitar eventos del mouse
    element.removeEventListener('mousedown', startElementDrag);
    element.removeEventListener('click', selectElement);
    
    // Remover handles de redimensionamiento
    removeResizeHandles(element);
}

// Crear handles de redimensionamiento
function createResizeHandles(element) {
    const handles = ['nw', 'ne', 'sw', 'se'];
    
    handles.forEach(handle => {
        const handleElement = document.createElement('div');
        handleElement.className = `resize-handle resize-${handle}`;
        handleElement.addEventListener('mousedown', (e) => startResize(e, handle));
        element.appendChild(handleElement);
    });
}

// Remover handles de redimensionamiento
function removeResizeHandles(element) {
    const handles = element.querySelectorAll('.resize-handle');
    handles.forEach(handle => handle.remove());
}

// Seleccionar elemento
function selectElement(e) {
    if (!visualEditor.enabled) return;
    
    e.stopPropagation();
    
    // Deseleccionar elemento anterior
    if (visualEditor.selectedElement) {
        visualEditor.selectedElement.classList.remove('selected');
    }
    
    // Seleccionar nuevo elemento
    visualEditor.selectedElement = e.currentTarget;
    visualEditor.selectedElement.classList.add('selected');
    
    // Actualizar panel de información
    updateElementInfo();
}

// Iniciar arrastre de elemento
function startElementDrag(e) {
    if (!visualEditor.enabled || visualEditor.isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    visualEditor.isDragging = true;
    visualEditor.selectedElement = e.currentTarget;
    
    const rect = visualEditor.selectedElement.getBoundingClientRect();
    const containerRect = document.getElementById('scenario-background').getBoundingClientRect();
    
    visualEditor.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopElementDrag);
    
    visualEditor.selectedElement.classList.add('dragging');
}

// Arrastrar elemento
function dragElement(e) {
    if (!visualEditor.isDragging || !visualEditor.selectedElement) return;
    
    const container = document.getElementById('scenario-background');
    const containerRect = container.getBoundingClientRect();
    
    let newX = ((e.clientX - containerRect.left - visualEditor.dragOffset.x) / containerRect.width) * 100;
    let newY = ((e.clientY - containerRect.top - visualEditor.dragOffset.y) / containerRect.height) * 100;
    
    // Aplicar snap to grid si está activado
    newX = snapToGrid(newX);
    newY = snapToGrid(newY);
    
    // Limitar a los bordes del contenedor
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));
    
    visualEditor.selectedElement.style.left = `${clampedX}%`;
    visualEditor.selectedElement.style.top = `${clampedY}%`;
    
    // Actualizar información en tiempo real
    updateElementInfo();
}

// Detener arrastre de elemento
function stopElementDrag() {
    if (!visualEditor.isDragging) return;
    
    visualEditor.isDragging = false;
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', stopElementDrag);
    
    if (visualEditor.selectedElement) {
        visualEditor.selectedElement.classList.remove('dragging');
        saveElementPosition(visualEditor.selectedElement);
    }
}

// Iniciar redimensionamiento
function startResize(e, handle) {
    if (!visualEditor.enabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    visualEditor.isResizing = true;
    visualEditor.resizeHandle = handle;
    visualEditor.selectedElement = e.target.parentElement;
    
    document.addEventListener('mousemove', resizeElement);
    document.addEventListener('mouseup', stopResize);
}

// Redimensionar elemento
function resizeElement(e) {
    if (!visualEditor.isResizing || !visualEditor.selectedElement) return;
    
    const container = document.getElementById('scenario-background');
    const containerRect = container.getBoundingClientRect();
    const elementRect = visualEditor.selectedElement.getBoundingClientRect();
    
    const mouseX = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const mouseY = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    const currentLeft = parseFloat(visualEditor.selectedElement.style.left);
    const currentTop = parseFloat(visualEditor.selectedElement.style.top);
    const currentWidth = parseFloat(visualEditor.selectedElement.style.width);
    const currentHeight = parseFloat(visualEditor.selectedElement.style.height);
    
    let newLeft = currentLeft;
    let newTop = currentTop;
    let newWidth = currentWidth;
    let newHeight = currentHeight;
    
    // Calcular nuevas dimensiones según el handle
    switch (visualEditor.resizeHandle) {
        case 'se': // Esquina inferior derecha
            newWidth = mouseX - currentLeft;
            newHeight = mouseY - currentTop;
            break;
        case 'sw': // Esquina inferior izquierda
            newLeft = mouseX;
            newWidth = currentLeft + currentWidth - mouseX;
            newHeight = mouseY - currentTop;
            break;
        case 'ne': // Esquina superior derecha
            newTop = mouseY;
            newWidth = mouseX - currentLeft;
            newHeight = currentTop + currentHeight - mouseY;
            break;
        case 'nw': // Esquina superior izquierda
            newLeft = mouseX;
            newTop = mouseY;
            newWidth = currentLeft + currentWidth - mouseX;
            newHeight = currentTop + currentHeight - mouseY;
            break;
    }
    
    // Aplicar límites mínimos
    newWidth = Math.max(5, newWidth);
    newHeight = Math.max(5, newHeight);
    
    // Aplicar cambios
    visualEditor.selectedElement.style.left = `${newLeft}%`;
    visualEditor.selectedElement.style.top = `${newTop}%`;
    visualEditor.selectedElement.style.width = `${newWidth}%`;
    visualEditor.selectedElement.style.height = `${newHeight}%`;
    
    // Actualizar información en tiempo real
    updateElementInfo();
}

// Detener redimensionamiento
function stopResize() {
    if (!visualEditor.isResizing) return;
    
    visualEditor.isResizing = false;
    document.removeEventListener('mousemove', resizeElement);
    document.removeEventListener('mouseup', stopResize);
    
    if (visualEditor.selectedElement) {
        saveElementPosition(visualEditor.selectedElement);
    }
}

// Guardar posición del elemento
function saveElementPosition(element) {
    const elementId = element.dataset.elementId;
    if (!elementId) return;
    
    const position = {
        x: parseFloat(element.style.left),
        y: parseFloat(element.style.top),
        width: parseFloat(element.style.width),
        height: parseFloat(element.style.height)
    };
    
    // Guardar en el mapa de cambios
    visualEditor.changedPositions.set(elementId, position);
    
    // Marcar elemento como modificado
    element.setAttribute('data-modified', 'true');
    
    console.log(`🎨 Posición guardada para ${elementId}:`, position);
}

// Función para actualizar indicadores visuales de elementos modificados
function updateElementModifiedIndicators() {
    const elements = document.querySelectorAll('.scenario-element');
    
    elements.forEach(element => {
        const elementId = element.dataset.elementId;
        if (visualEditor.changedPositions.has(elementId)) {
            element.setAttribute('data-modified', 'true');
        } else {
            element.removeAttribute('data-modified');
        }
    });
}

// Actualizar información del elemento seleccionado
function updateElementInfo() {
    const infoPanel = document.getElementById('element-info-panel');
    if (!infoPanel || !visualEditor.selectedElement) return;
    
    const elementId = visualEditor.selectedElement.dataset.elementId;
    const position = {
        x: parseFloat(visualEditor.selectedElement.style.left).toFixed(1),
        y: parseFloat(visualEditor.selectedElement.style.top).toFixed(1),
        width: parseFloat(visualEditor.selectedElement.style.width).toFixed(1),
        height: parseFloat(visualEditor.selectedElement.style.height).toFixed(1)
    };
    
    // Encontrar elemento original para comparar
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    const originalElement = scenario.elements.find(el => el.id === elementId);
    
    // Calcular diferencias
    const differences = originalElement ? {
        x: (position.x - originalElement.position.x).toFixed(1),
        y: (position.y - originalElement.position.y).toFixed(1),
        width: (position.width - originalElement.position.width).toFixed(1),
        height: (position.height - originalElement.position.height).toFixed(1)
    } : null;
    
    // Determinar si ha cambiado
    const hasChanged = visualEditor.changedPositions.has(elementId);
    
    infoPanel.innerHTML = `
        <h4>🎯 ${hasChanged ? '✏️' : '📍'} ${elementId}</h4>
        <div class="position-info">
            <div class="position-row">
                <span>X: <strong>${position.x}%</strong></span>
                ${differences ? `<span class="diff ${differences.x > 0 ? 'positive' : differences.x < 0 ? 'negative' : 'neutral'}">${differences.x > 0 ? '+' : ''}${differences.x}</span>` : ''}
            </div>
            <div class="position-row">
                <span>Y: <strong>${position.y}%</strong></span>
                ${differences ? `<span class="diff ${differences.y > 0 ? 'positive' : differences.y < 0 ? 'negative' : 'neutral'}">${differences.y > 0 ? '+' : ''}${differences.y}</span>` : ''}
            </div>
            <div class="position-row">
                <span>Ancho: <strong>${position.width}%</strong></span>
                ${differences ? `<span class="diff ${differences.width > 0 ? 'positive' : differences.width < 0 ? 'negative' : 'neutral'}">${differences.width > 0 ? '+' : ''}${differences.width}</span>` : ''}
            </div>
            <div class="position-row">
                <span>Alto: <strong>${position.height}%</strong></span>
                ${differences ? `<span class="diff ${differences.height > 0 ? 'positive' : differences.height < 0 ? 'negative' : 'neutral'}">${differences.height > 0 ? '+' : ''}${differences.height}</span>` : ''}
            </div>
        </div>
        <div class="element-actions">
            <button onclick="resetElementPosition('${elementId}')" class="btn-small ${hasChanged ? '' : 'disabled'}" ${hasChanged ? '' : 'disabled'}>🔄 Restaurar</button>
            <button onclick="previewElementChange('${elementId}')" class="btn-small">👁️ Vista previa</button>
        </div>
        ${hasChanged ? '<div class="change-indicator">✅ Modificado</div>' : '<div class="change-indicator neutral">Sin cambios</div>'}
    `;
    
    // Actualizar clase del panel
    if (hasChanged) {
        infoPanel.classList.add('has-selection', 'has-changes');
    } else {
        infoPanel.classList.add('has-selection');
        infoPanel.classList.remove('has-changes');
    }
    
    // Actualizar contador de cambios
    updateChangesCount();
    
    // Actualizar vista previa en tiempo real
    updateRealtimePreview();
}

// Vista previa en tiempo real
function updateRealtimePreview() {
    // Actualizar dropzones si están visibles
    if (document.getElementById('debug-show-dropzones')?.checked) {
        updateDropzonesPreview();
    }
    
    // Actualizar información global
    updateGlobalPositionInfo();
}

// Actualizar dropzones en tiempo real
function updateDropzonesPreview() {
    if (!visualEditor.selectedElement) return;
    
    const elementId = visualEditor.selectedElement.dataset.elementId;
    const dropzone = document.querySelector(`[data-element-id="${elementId}"].drop-zone`);
    
    if (dropzone) {
        // Recalcular posición de dropzone basada en la nueva posición del elemento
        const element = visualEditor.selectedElement;
        const currentLevel = gameState.currentLevel;
        const scenarioConfig = scenarioLevelConfig[currentLevel];
        const scenario = gameScenarios[scenarioConfig.scenario];
        const originalElement = scenario.elements.find(el => el.id === elementId);
        
        if (originalElement && originalElement.dropZone) {
            const sizeMultiplier = originalElement.displaySize || 2.5;
            const currentWidth = parseFloat(element.style.width);
            const currentHeight = parseFloat(element.style.height);
            
            const imageVisualWidth = currentWidth * sizeMultiplier;
            const imageVisualHeight = currentHeight * sizeMultiplier;
            
            const dropWidthPercent = originalElement.dropZone.widthPercent || 0.6;
            const dropHeightPercent = originalElement.dropZone.heightPercent || 0.6;
            
            const dropZoneWidth = imageVisualWidth * dropWidthPercent;
            const dropZoneHeight = imageVisualHeight * dropHeightPercent;
            
            // Calcular nueva posición centrada
            const imageOffsetX = (imageVisualWidth - currentWidth) / 2;
            const imageOffsetY = (imageVisualHeight - currentHeight) / 2;
            const currentX = parseFloat(element.style.left);
            const currentY = parseFloat(element.style.top);
            const imageCenterX = currentX - imageOffsetX + (imageVisualWidth / 2);
            const imageCenterY = currentY - imageOffsetY + (imageVisualHeight / 2);
            
            const dropZoneX = imageCenterX - (dropZoneWidth / 2);
            const dropZoneY = imageCenterY - (dropZoneHeight / 2);
            
            // Aplicar nueva posición
            dropzone.style.left = `${dropZoneX}%`;
            dropzone.style.top = `${dropZoneY}%`;
            dropzone.style.width = `${dropZoneWidth}%`;
            dropzone.style.height = `${dropZoneHeight}%`;
        }
    }
}

// Actualizar información global de posiciones
function updateGlobalPositionInfo() {
    const globalInfo = document.getElementById('global-position-info');
    if (!globalInfo) return;
    
    const totalElements = document.querySelectorAll('.scenario-element').length;
    const changedElements = visualEditor.changedPositions.size;
    const selectedId = visualEditor.selectedElement?.dataset.elementId || 'ninguno';
    
    globalInfo.innerHTML = `
        <div class="global-stats">
            <div class="stat-item">
                <span class="stat-label">Total elementos:</span>
                <span class="stat-value">${totalElements}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Modificados:</span>
                <span class="stat-value ${changedElements > 0 ? 'has-changes' : ''}">${changedElements}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Seleccionado:</span>
                <span class="stat-value">${selectedId}</span>
            </div>
        </div>
    `;
}

// Vista previa temporal de un elemento específico
function previewElementChange(elementId) {
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (!element) return;
    
    // Efecto visual de vista previa
    element.style.transition = 'all 0.3s ease';
    element.style.boxShadow = '0 0 30px rgba(255, 193, 7, 0.8)';
    element.style.transform = 'scale(1.1)';
    
    // Mostrar tooltip con información
    const tooltip = document.createElement('div');
    tooltip.className = 'preview-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">Vista previa: ${elementId}</div>
        <div class="tooltip-content">
            <div>Posición: ${element.style.left}, ${element.style.top}</div>
            <div>Tamaño: ${element.style.width} × ${element.style.height}</div>
        </div>
    `;
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top}px`;
    
    document.body.appendChild(tooltip);
    
    // Remover efectos después de 2 segundos
    setTimeout(() => {
        element.style.transition = '';
        element.style.boxShadow = '';
        element.style.transform = '';
        tooltip.remove();
    }, 2000);
}

// Agregar información global al panel de debug
function addGlobalInfoToDebugPanel() {
    const debugContent = document.querySelector('.debug-content');
    if (!debugContent) return;
    
    const globalInfoSection = document.createElement('div');
    globalInfoSection.className = 'debug-section';
    globalInfoSection.innerHTML = `
        <h4>📊 Información Global:</h4>
        <div id="global-position-info" style="background: #f0f0f0; padding: 10px; border-radius: 5px; font-size: 0.8rem;">
            <div class="global-stats">
                <div class="stat-item">
                    <span class="stat-label">Total elementos:</span>
                    <span class="stat-value">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Modificados:</span>
                    <span class="stat-value">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Seleccionado:</span>
                    <span class="stat-value">ninguno</span>
                </div>
            </div>
        </div>
    `;
    
    // Insertar antes de la sección de elementos disponibles
    const elementsSection = debugContent.querySelector('#debug-elements-list')?.parentElement;
    if (elementsSection) {
        debugContent.insertBefore(globalInfoSection, elementsSection);
    }
}

// Modo de comparación antes/después
function toggleComparisonMode() {
    const comparisonMode = document.getElementById('comparison-mode')?.checked;
    const elements = document.querySelectorAll('.scenario-element');
    
    elements.forEach(element => {
        if (comparisonMode) {
            element.classList.add('comparison-mode');
            showOriginalPosition(element);
        } else {
            element.classList.remove('comparison-mode');
            hideOriginalPosition(element);
        }
    });
}

// Mostrar posición original como sombra
function showOriginalPosition(element) {
    const elementId = element.dataset.elementId;
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    const originalElement = scenario.elements.find(el => el.id === elementId);
    
    if (originalElement && visualEditor.changedPositions.has(elementId)) {
        const originalShadow = document.createElement('div');
        originalShadow.className = 'original-position-shadow';
        originalShadow.style.position = 'absolute';
        originalShadow.style.left = `${originalElement.position.x}%`;
        originalShadow.style.top = `${originalElement.position.y}%`;
        originalShadow.style.width = `${originalElement.position.width}%`;
        originalShadow.style.height = `${originalElement.position.height}%`;
        originalShadow.style.border = '2px dashed #ff6b6b';
        originalShadow.style.background = 'rgba(255, 107, 107, 0.1)';
        originalShadow.style.zIndex = '5';
        originalShadow.style.pointerEvents = 'none';
        originalShadow.style.borderRadius = '5px';
        
        const label = document.createElement('div');
        label.textContent = 'Original';
        label.style.position = 'absolute';
        label.style.top = '-20px';
        label.style.left = '0';
        label.style.fontSize = '0.7rem';
        label.style.color = '#ff6b6b';
        label.style.fontWeight = 'bold';
        
        originalShadow.appendChild(label);
        document.getElementById('scenario-background').appendChild(originalShadow);
    }
}

// Ocultar posición original
function hideOriginalPosition(element) {
    const shadows = document.querySelectorAll('.original-position-shadow');
    shadows.forEach(shadow => shadow.remove());
}

// Extender función de inicialización del editor
const originalInitializeVisualEditor = initializeVisualEditor;
initializeVisualEditor = function() {
    originalInitializeVisualEditor();
    
    // Agregar información global
    setTimeout(() => {
        addGlobalInfoToDebugPanel();
        updateGlobalPositionInfo();
    }, 100);
    
    // Inicializar vista previa en tiempo real
    setInterval(() => {
        if (visualEditor.enabled) {
            updateRealtimePreview();
        }
    }, 1000);
};

// Actualizar UI del modo edición
function updateEditModeUI() {
    const editButton = document.getElementById('edit-mode-toggle');
    const editModeText = document.getElementById('edit-mode-text');
    const debugPanel = document.getElementById('debug-panel');
    
    if (visualEditor.enabled) {
        editButton.classList.add('active');
        if (editModeText) {
            editModeText.textContent = '🎨 Desactivar Editor';
        }
        
        // Abrir automáticamente el panel de debug y mostrar controles del editor
        if (debugPanel) {
            debugPanel.style.display = 'block';
            debugMode = true;
            showEditorControls();
            updateDebugInfo(); // Actualizar información del panel
            updateGlobalPositionInfo(); // Actualizar información global
        }
        updateGridDisplay();
    } else {
        editButton.classList.remove('active');
        if (editModeText) {
            editModeText.textContent = '✏️ Activar Editor';
        }
        hideEditorControls();
        // Ocultar grid
        const grid = document.getElementById('scenario-background').querySelector('.editor-grid');
        if (grid) {
            grid.remove();
        }
    }
}

// Mostrar controles del editor
function showEditorControls() {
    const editorControls = document.getElementById('editor-controls');
    if (editorControls) {
        editorControls.style.display = 'block';
    }
}

// Ocultar controles del editor
function hideEditorControls() {
    const editorControls = document.getElementById('editor-controls');
    if (editorControls) {
        editorControls.style.display = 'none';
    }
}

// Agregar controles del editor al panel de debug
function addEditorControlsToDebugPanel() {
    const debugContent = document.querySelector('.debug-content');
    if (!debugContent) return;
    
    const editorSection = document.createElement('div');
    editorSection.className = 'debug-section';
    editorSection.id = 'editor-controls';
    editorSection.style.display = 'none';
    
    editorSection.innerHTML = `
        <h4>🎨 Editor Visual:</h4>
        <div style="margin-bottom: 10px;">
            <button onclick="toggleEditMode()" class="debug-level-btn" style="width: 100%;">
                <span id="edit-mode-text">✏️ Activar Editor</span>
            </button>
        </div>
        
        <div class="editor-grid-controls" style="margin-bottom: 10px;">
            <label class="debug-checkbox">
                <input type="checkbox" id="editor-snap-grid" onchange="toggleSnapGrid()"> 
                Snap to Grid
            </label>
            <div style="margin-top: 5px;">
                <label>Grid Size: </label>
                <input type="range" id="grid-size" min="1" max="10" value="5" style="width: 60px;" onchange="updateGridSize()">
                <span id="grid-size-value">5</span>%
            </div>
            <label class="debug-checkbox">
                <input type="checkbox" id="show-grid" onchange="toggleGrid()"> 
                Show Grid
            </label>
        </div>
        
        <div class="precision-controls" style="margin-bottom: 10px;">
            <h5>🎯 Controles de Precisión:</h5>
            <div class="precision-buttons">
                <button onclick="nudgeSelected('up')" class="precision-btn">⬆️</button>
                <button onclick="nudgeSelected('down')" class="precision-btn">⬇️</button>
                <button onclick="nudgeSelected('left')" class="precision-btn">⬅️</button>
                <button onclick="nudgeSelected('right')" class="precision-btn">➡️</button>
            </div>
            <div style="margin-top: 5px;">
                <label>Precisión: </label>
                <input type="range" id="nudge-precision" min="0.1" max="2" step="0.1" value="0.5" style="width: 60px;" onchange="updateNudgePrecision()">
                <span id="nudge-precision-value">0.5</span>%
            </div>
        </div>
        
        <div id="element-info-panel" style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <p style="color: #666; font-size: 0.8rem;">Selecciona un elemento para ver su información</p>
        </div>
        
        <div class="export-controls" style="margin-bottom: 10px;">
            <button onclick="exportPositions()" class="debug-level-btn" style="width: 100%; background: #4CAF50;">
                💾 Exportar Posiciones
            </button>
            <button onclick="exportFullElement()" class="debug-level-btn" style="width: 100%; background: #2196F3;">
                📋 Exportar Elemento
            </button>
            <button onclick="exportCompleteScenario()" class="debug-level-btn" style="width: 100%; background: #9C27B0;">
                🌟 Exportar Escenario
            </button>
        </div>
        
        <div style="margin-bottom: 10px;">
            <button onclick="resetAllPositions()" class="debug-level-btn" style="width: 100%; background: #f44336;">
                🔄 Resetear Todo
            </button>
        </div>
        
        <div id="changes-summary" style="font-size: 0.7rem; color: #666;">
            <p>Cambios realizados: <span id="changes-count">0</span></p>
        </div>
    `;
    
    debugContent.appendChild(editorSection);
}

// Agregar funcionalidad de snap to grid
let editorSettings = {
    snapToGrid: false,
    gridSize: 5,
    showGrid: false,
    nudgePrecision: 0.5
};

function toggleSnapGrid() {
    editorSettings.snapToGrid = document.getElementById('editor-snap-grid').checked;
    console.log(`🎯 Snap to Grid: ${editorSettings.snapToGrid ? 'ON' : 'OFF'}`);
}

function updateGridSize() {
    const gridSizeSlider = document.getElementById('grid-size');
    const gridSizeValue = document.getElementById('grid-size-value');
    editorSettings.gridSize = parseFloat(gridSizeSlider.value);
    gridSizeValue.textContent = editorSettings.gridSize;
    
    if (editorSettings.showGrid) {
        updateGridDisplay();
    }
}

function toggleGrid() {
    editorSettings.showGrid = document.getElementById('show-grid').checked;
    updateGridDisplay();
}

function updateGridDisplay() {
    const scenarioBackground = document.getElementById('scenario-background');
    
    // Remover grid existente
    const existingGrid = scenarioBackground.querySelector('.editor-grid');
    if (existingGrid) {
        existingGrid.remove();
    }
    
    if (editorSettings.showGrid && visualEditor.enabled) {
        const grid = document.createElement('div');
        grid.className = 'editor-grid';
        grid.style.position = 'absolute';
        grid.style.top = '0';
        grid.style.left = '0';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.pointerEvents = 'none';
        grid.style.zIndex = '5';
        
        // Crear líneas de grid
        const gridSize = editorSettings.gridSize;
        let gridPattern = '';
        
        for (let i = 0; i <= 100; i += gridSize) {
            // Líneas verticales
            gridPattern += `
                <div style="position: absolute; left: ${i}%; top: 0; width: 1px; height: 100%; background: rgba(0,0,0,0.1);"></div>
            `;
            // Líneas horizontales
            gridPattern += `
                <div style="position: absolute; top: ${i}%; left: 0; width: 100%; height: 1px; background: rgba(0,0,0,0.1);"></div>
            `;
        }
        
        grid.innerHTML = gridPattern;
        scenarioBackground.appendChild(grid);
    }
}

function snapToGrid(value) {
    if (!editorSettings.snapToGrid) return value;
    
    const gridSize = editorSettings.gridSize;
    return Math.round(value / gridSize) * gridSize;
}

// Controles de precisión
function updateNudgePrecision() {
    const precisionSlider = document.getElementById('nudge-precision');
    const precisionValue = document.getElementById('nudge-precision-value');
    editorSettings.nudgePrecision = parseFloat(precisionSlider.value);
    precisionValue.textContent = editorSettings.nudgePrecision;
}

function nudgeSelected(direction) {
    if (!visualEditor.selectedElement) {
        alert('Selecciona un elemento primero');
        return;
    }
    
    const element = visualEditor.selectedElement;
    const currentLeft = parseFloat(element.style.left);
    const currentTop = parseFloat(element.style.top);
    const precision = editorSettings.nudgePrecision;
    
    let newLeft = currentLeft;
    let newTop = currentTop;
    
    switch (direction) {
        case 'up':
            newTop = Math.max(0, currentTop - precision);
            break;
        case 'down':
            newTop = Math.min(100, currentTop + precision);
            break;
        case 'left':
            newLeft = Math.max(0, currentLeft - precision);
            break;
        case 'right':
            newLeft = Math.min(100, currentLeft + precision);
            break;
    }
    
    // Aplicar snap to grid si está activado
    newLeft = snapToGrid(newLeft);
    newTop = snapToGrid(newTop);
    
    element.style.left = `${newLeft}%`;
    element.style.top = `${newTop}%`;
    
    saveElementPosition(element);
    updateElementInfo();
}

// Exportar elemento completo con toda su configuración
function exportFullElement() {
    if (!visualEditor.selectedElement) {
        alert('Selecciona un elemento primero');
        return;
    }
    
    const elementId = visualEditor.selectedElement.dataset.elementId;
    
    // Encontrar elemento original
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    const originalElement = scenario.elements.find(el => el.id === elementId);
    
    if (!originalElement) return;
    
    // Crear elemento actualizado
    const updatedElement = {
        ...originalElement,
        position: {
            x: parseFloat(visualEditor.selectedElement.style.left),
            y: parseFloat(visualEditor.selectedElement.style.top),
            width: parseFloat(visualEditor.selectedElement.style.width),
            height: parseFloat(visualEditor.selectedElement.style.height)
        }
    };
    
    const output = `/* ==========================================
 * 🎯 ELEMENTO COMPLETO: ${elementId.toUpperCase()}
 * ==========================================
 * Escenario: ${scenario.name}
 * Fecha: ${new Date().toLocaleString()}
 */

// 📋 ELEMENTO ORIGINAL:
${JSON.stringify(originalElement, null, 2)}

// 🎨 ELEMENTO ACTUALIZADO:
${JSON.stringify(updatedElement, null, 2)}

// 🚀 CÓDIGO PARA APLICAR CAMBIO:
// Copia este código en la consola del navegador:

const updatedElement = ${JSON.stringify(updatedElement, null, 2)};

// Aplicar cambio
const scenario = gameScenarios['${scenarioConfig.scenario}'];
const elementIndex = scenario.elements.findIndex(el => el.id === '${elementId}');
if (elementIndex !== -1) {
    scenario.elements[elementIndex] = updatedElement;
    loadLevel(${currentLevel});
    console.log('✅ Elemento ${elementId} actualizado exitosamente!');
}`;
    
    showExportModal(output);
}

// Exportar posiciones modificadas
function exportPositions() {
    if (visualEditor.changedPositions.size === 0) {
        alert('No hay cambios para exportar');
        return;
    }
    
    const changes = {};
    visualEditor.changedPositions.forEach((position, elementId) => {
        changes[elementId] = position;
    });
    
    const output = generateExportOutput(changes);
    showExportModal(output);
    
    console.log('📤 Posiciones exportadas:', changes);
}

// Generar salida de exportación con diferentes formatos
function generateExportOutput(changes) {
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    
    // Generar código para aplicar cambios
    let output = `/* ==========================================
 * 🎨 CAMBIOS GENERADOS POR EDITOR VISUAL
 * ==========================================
 * Nivel: ${currentLevel} - ${scenario.name}
 * Elementos modificados: ${Object.keys(changes).length}
 * Fecha: ${new Date().toLocaleString()}
 */

// 📋 INSTRUCCIONES DE APLICACIÓN:
// 1. Abre el archivo scenarios.js
// 2. Busca cada elemento por su ID
// 3. Reemplaza la propiedad "position" con los nuevos valores
// 4. Guarda el archivo

// 🔄 CAMBIOS A APLICAR:
`;

    Object.keys(changes).forEach(elementId => {
        const newPosition = changes[elementId];
        const originalElement = scenario.elements.find(el => el.id === elementId);
        
        if (originalElement) {
            output += `
// ----------------------------------------
// 🎯 ${elementId.toUpperCase()} - "${originalElement.word}"
// ----------------------------------------
// ANTES: position: ${JSON.stringify(originalElement.position, null, 2)}
// DESPUÉS: 
position: {
    x: ${newPosition.x},
    y: ${newPosition.y},
    width: ${newPosition.width},
    height: ${newPosition.height}
}
`;
        }
    });
    
    output += `
// ==========================================
// 🚀 CÓDIGO JAVASCRIPT PARA APLICAR CAMBIOS
// ==========================================
// Copia este código en la consola del navegador para aplicar los cambios automáticamente:

const positionUpdates = ${JSON.stringify(changes, null, 2)};

// Aplicar cambios (puedes copiar y pegar esto en la consola)
Object.keys(positionUpdates).forEach(elementId => {
    const scenario = gameScenarios['${scenarioConfig.scenario}'];
    const element = scenario.elements.find(el => el.id === elementId);
    if (element) {
        element.position = positionUpdates[elementId];
        console.log('✅ Actualizado:', elementId, positionUpdates[elementId]);
    }
});

// Recargar nivel para ver cambios
loadLevel(${currentLevel});
console.log('🎉 Cambios aplicados exitosamente!');
`;
    
    return output;
}

// Exportar escenario completo
function exportCompleteScenario() {
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    
    // Crear escenario actualizado
    const updatedScenario = {
        ...scenario,
        elements: scenario.elements.map(element => {
            const changedPosition = visualEditor.changedPositions.get(element.id);
            if (changedPosition) {
                return {
                    ...element,
                    position: changedPosition
                };
            }
            return element;
        })
    };
    
    const output = `/* ==========================================
 * 🌟 ESCENARIO COMPLETO: ${scenario.name.toUpperCase()}
 * ==========================================
 * Elementos totales: ${scenario.elements.length}
 * Elementos modificados: ${visualEditor.changedPositions.size}
 * Fecha: ${new Date().toLocaleString()}
 */

// 🎨 ESCENARIO ACTUALIZADO:
const updated${scenarioConfig.scenario}Scenario = ${JSON.stringify(updatedScenario, null, 2)};

// 🚀 CÓDIGO PARA APLICAR CAMBIOS:
// Copia este código en la consola del navegador:

gameScenarios['${scenarioConfig.scenario}'] = updated${scenarioConfig.scenario}Scenario;
loadLevel(${currentLevel});
console.log('✅ Escenario ${scenarioConfig.scenario} actualizado exitosamente!');
`;
    
    showExportModal(output);
}

// Mejorar modal de exportación con pestañas
function showExportModal(content) {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
        <div class="export-modal-content">
            <div class="export-header">
                <h3>📤 Exportar Cambios</h3>
                <button onclick="closeExportModal()" class="debug-close">×</button>
            </div>
            <div class="export-tabs">
                <button class="export-tab active" onclick="switchExportTab('code')">💻 Código</button>
                <button class="export-tab" onclick="switchExportTab('json')">📋 JSON</button>
                <button class="export-tab" onclick="switchExportTab('instructions')">📖 Instrucciones</button>
            </div>
            <div class="export-body">
                <div id="export-tab-code" class="export-tab-content active">
                    <p><strong>Código generado:</strong></p>
                    <textarea id="export-textarea" readonly>${content}</textarea>
                </div>
                <div id="export-tab-json" class="export-tab-content">
                    <p><strong>Solo las posiciones (JSON):</strong></p>
                    <textarea id="export-json-textarea" readonly>${JSON.stringify(Object.fromEntries(visualEditor.changedPositions), null, 2)}</textarea>
                </div>
                <div id="export-tab-instructions" class="export-tab-content">
                    <div class="instructions">
                        <h4>📋 Cómo aplicar los cambios:</h4>
                        <ol>
                            <li><strong>Método Automático (Recomendado):</strong>
                                <ul>
                                    <li>Copia el código de la pestaña "Código"</li>
                                    <li>Abre la consola del navegador (F12)</li>
                                    <li>Pega el código y presiona Enter</li>
                                    <li>Los cambios se aplicarán automáticamente</li>
                                </ul>
                            </li>
                            <li><strong>Método Manual:</strong>
                                <ul>
                                    <li>Abre el archivo <code>scenarios.js</code></li>
                                    <li>Busca cada elemento por su ID</li>
                                    <li>Actualiza la propiedad "position"</li>
                                    <li>Guarda el archivo</li>
                                </ul>
                            </li>
                        </ol>
                        <div class="warning">
                            <strong>⚠️ Importante:</strong> Siempre haz una copia de seguridad del archivo <code>scenarios.js</code> antes de aplicar cambios.
                        </div>
                    </div>
                </div>
                <div class="export-buttons">
                    <button onclick="copyToClipboard('export-textarea')" class="btn btn-primary">📋 Copiar Código</button>
                    <button onclick="copyToClipboard('export-json-textarea')" class="btn">📋 Copiar JSON</button>
                    <button onclick="downloadExport()" class="btn">💾 Descargar</button>
                    <button onclick="closeExportModal()" class="btn">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Seleccionar todo el texto del textarea activo
    const textarea = document.getElementById('export-textarea');
    textarea.select();
}

// Cambiar pestañas en el modal de exportación
function switchExportTab(tabName) {
    // Remover active de todas las pestañas
    document.querySelectorAll('.export-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.export-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar pestaña seleccionada
    document.querySelector(`[onclick="switchExportTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`export-tab-${tabName}`).classList.add('active');
}

// Copiar al portapapeles mejorado
function copyToClipboard(textareaId = 'export-textarea') {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;
    
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Feedback visual
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '✅ Copiado!';
            button.style.background = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Error al copiar:', err);
        alert('Error al copiar al portapapeles');
    }
}

// Descargar archivo de exportación
function downloadExport() {
    const content = document.getElementById('export-textarea').value;
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    
    const filename = `posiciones_${scenarioConfig.scenario}_nivel${currentLevel}_${new Date().toISOString().slice(0, 10)}.js`;
    
    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log(`📁 Archivo descargado: ${filename}`);
}

// Cerrar modal de exportación
function closeExportModal() {
    const modal = document.querySelector('.export-modal');
    if (modal) {
        modal.remove();
    }
}

// Resetear posición de un elemento
function resetElementPosition(elementId) {
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (!element) return;
    
    // Encontrar posición original en scenarios
    const currentLevel = gameState.currentLevel;
    const scenarioConfig = scenarioLevelConfig[currentLevel];
    const scenario = gameScenarios[scenarioConfig.scenario];
    const originalElement = scenario.elements.find(el => el.id === elementId);
    
    if (originalElement) {
        element.style.left = `${originalElement.position.x}%`;
        element.style.top = `${originalElement.position.y}%`;
        element.style.width = `${originalElement.position.width}%`;
        element.style.height = `${originalElement.position.height}%`;
        
        // Remover de cambios
        visualEditor.changedPositions.delete(elementId);
        
        // Remover indicador de modificación
        element.removeAttribute('data-modified');
        
        updateElementInfo();
        updateElementModifiedIndicators();
        console.log(`🔄 Posición reseteada para ${elementId}`);
    }
}

// Resetear todas las posiciones
function resetAllPositions() {
    if (confirm('¿Estás seguro de que quieres resetear todas las posiciones?')) {
        visualEditor.changedPositions.clear();
        
        // Remover todos los indicadores de modificación
        document.querySelectorAll('.scenario-element').forEach(element => {
            element.removeAttribute('data-modified');
        });
        
        loadLevel(gameState.currentLevel);
        updateElementModifiedIndicators();
        console.log('🔄 Todas las posiciones reseteadas');
    }
}

// Actualizar contador de cambios
function updateChangesCount() {
    const changesCount = document.getElementById('changes-count');
    if (changesCount) {
        changesCount.textContent = visualEditor.changedPositions.size;
    }
}

// Extender la función createScenarioElements para soportar el editor
const originalCreateScenarioElements = createScenarioElements;
createScenarioElements = function(elements, gameArea) {
    originalCreateScenarioElements(elements, gameArea);
    
    // Si el editor está activo, hacer elementos editables
    if (visualEditor.enabled) {
        setTimeout(() => {
            enableElementEditing();
        }, 100);
    }
};

// Inicializar el editor al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeVisualEditor();
    }, 1000);
});

// Agregar estilos dinámicamente
const editorStyles = `
    .edit-mode-toggle {
        position: fixed;
        top: 20px;
        right: 120px;
        width: 50px;
        height: 50px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .edit-mode-toggle:hover {
        background: #1976D2;
        transform: scale(1.1);
    }
    
    .edit-mode-toggle.active {
        background: #4CAF50;
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
    }
    
    .scenario-background.edit-mode {
        outline: 2px dashed #2196F3;
        outline-offset: -2px;
    }
    
    .scenario-element.editable {
        outline: 2px solid transparent;
        cursor: move;
        transition: all 0.2s ease;
    }
    
    .scenario-element.editable:hover {
        outline-color: #2196F3;
        transform: scale(1.02);
    }
    
    .scenario-element.selected {
        outline-color: #4CAF50 !important;
        outline-width: 3px !important;
        box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
    }
    
    .scenario-element.dragging {
        opacity: 0.8;
        transform: scale(1.05);
        z-index: 1000;
    }
    
    .resize-handle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #4CAF50;
        border: 2px solid white;
        border-radius: 50%;
        cursor: nw-resize;
        z-index: 1001;
    }
    
    .resize-nw { top: -6px; left: -6px; cursor: nw-resize; }
    .resize-ne { top: -6px; right: -6px; cursor: ne-resize; }
    .resize-sw { bottom: -6px; left: -6px; cursor: sw-resize; }
    .resize-se { bottom: -6px; right: -6px; cursor: se-resize; }
    
    .export-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .export-modal-content {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 800px;
        max-height: 80%;
        display: flex;
        flex-direction: column;
    }
    
    .export-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .export-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        background: #f5f5f5;
    }
    
    .export-tab {
        flex: 1;
        padding: 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
    }
    
    .export-tab:hover {
        background: #e9ecef;
    }
    
    .export-tab.active {
        background: white;
        border-bottom-color: #2196F3;
        color: #2196F3;
        font-weight: bold;
    }
    
    .export-tab-content {
        display: none;
        padding: 20px;
        flex: 1;
        overflow: auto;
    }
    
    .export-tab-content.active {
        display: block;
    }
    
    .export-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }
    
    .instructions {
        line-height: 1.6;
    }
    
    .instructions h4 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .instructions ol {
        padding-left: 20px;
    }
    
    .instructions li {
        margin-bottom: 10px;
    }
    
    .instructions ul {
        margin-top: 5px;
        padding-left: 20px;
    }
    
    .instructions ul li {
        margin-bottom: 5px;
    }
    
    .warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 10px;
        border-radius: 5px;
        margin-top: 15px;
        color: #856404;
    }
    
    #export-textarea,
    #export-json-textarea {
        width: 100%;
        height: 300px;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        resize: vertical;
        background: #f8f9fa;
    }
    
    .export-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 15px;
    }
    
    .btn-small {
        padding: 5px 10px;
        font-size: 0.8rem;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        background: #2196F3;
        color: white;
    }
    
    .btn-small:hover {
        background: #1976D2;
    }
    
    /* Nuevos estilos para controles avanzados */
    .precision-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 5px;
        margin: 5px 0;
        max-width: 120px;
    }
    
    .precision-btn {
        padding: 5px;
        font-size: 0.8rem;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        background: #FFC107;
        color: #333;
        transition: all 0.2s ease;
    }
    
    .precision-btn:hover {
        background: #FFB300;
        transform: scale(1.05);
    }
    
    .precision-buttons .precision-btn:nth-child(1) { grid-column: 2; grid-row: 1; } /* Up */
    .precision-buttons .precision-btn:nth-child(2) { grid-column: 2; grid-row: 2; } /* Down */
    .precision-buttons .precision-btn:nth-child(3) { grid-column: 1; grid-row: 2; } /* Left */
    .precision-buttons .precision-btn:nth-child(4) { grid-column: 3; grid-row: 2; } /* Right */
    
    .editor-grid-controls {
        background: #f9f9f9;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ddd;
    }
    
    .editor-grid-controls label {
        font-size: 0.8rem;
        color: #555;
    }
    
    .editor-grid-controls input[type="range"] {
        vertical-align: middle;
        margin: 0 5px;
    }
    
    .precision-controls {
        background: #f0f8ff;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #cce7ff;
    }
    
    .precision-controls h5 {
        margin: 0 0 5px 0;
        font-size: 0.9rem;
        color: #333;
    }
    
    .export-controls {
        background: #f0fff0;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccffcc;
    }
    
    .export-controls .debug-level-btn {
        margin-bottom: 5px;
    }
    
    .editor-grid {
        opacity: 0.3;
        transition: opacity 0.3s ease;
    }
    
    .editor-grid:hover {
        opacity: 0.5;
    }
    
    /* Estilos para información en tiempo real */
    #element-info-panel {
        transition: all 0.3s ease;
    }
    
    #element-info-panel.has-selection {
        background: #e8f5e8 !important;
        border: 1px solid #4CAF50;
    }
    
    #changes-summary {
        background: #fff3cd;
        padding: 5px;
        border-radius: 3px;
        border: 1px solid #ffeaa7;
    }
    
    #changes-count {
        font-weight: bold;
        color: #d63031;
    }
    
    /* Estilos para vista previa en tiempo real */
    .position-info {
        margin: 10px 0;
    }
    
    .position-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        padding: 3px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
    }
    
    .diff {
        font-size: 0.7rem;
        font-weight: bold;
        padding: 2px 5px;
        border-radius: 3px;
        min-width: 30px;
        text-align: center;
    }
    
    .diff.positive {
        background: #ffebee;
        color: #c62828;
    }
    
    .diff.negative {
        background: #e8f5e8;
        color: #2e7d32;
    }
    
    .diff.neutral {
        background: #f5f5f5;
        color: #666;
    }
    
    .element-actions {
        display: flex;
        gap: 5px;
        margin: 10px 0;
    }
    
    .btn-small.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .change-indicator {
        font-size: 0.8rem;
        padding: 5px;
        border-radius: 3px;
        text-align: center;
        font-weight: bold;
        margin-top: 10px;
    }
    
    .change-indicator:not(.neutral) {
        background: #e8f5e8;
        color: #2e7d32;
        border: 1px solid #4caf50;
    }
    
    .change-indicator.neutral {
        background: #f5f5f5;
        color: #666;
        border: 1px solid #ccc;
    }
    
    #element-info-panel.has-changes {
        background: #f0fff4 !important;
        border: 2px solid #4CAF50 !important;
    }
    
    /* Estilos para información global */
    .global-stats {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3px 0;
    }
    
    .stat-label {
        font-weight: normal;
        color: #666;
    }
    
    .stat-value {
        font-weight: bold;
        color: #333;
    }
    
    .stat-value.has-changes {
        color: #d63031;
        background: #fff3cd;
        padding: 2px 6px;
        border-radius: 3px;
    }
    
    /* Estilos para tooltips de vista previa */
    .preview-tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 0.8rem;
        z-index: 2000;
        max-width: 200px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.3s ease;
    }
    
    .tooltip-header {
        font-weight: bold;
        margin-bottom: 5px;
        color: #FFC107;
    }
    
    .tooltip-content div {
        margin: 2px 0;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Estilos para modo de comparación */
    .original-position-shadow {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 0.3; }
        50% { opacity: 0.7; }
        100% { opacity: 0.3; }
    }
    
    .scenario-element.comparison-mode {
        position: relative;
        z-index: 20;
    }
    
    .scenario-element.comparison-mode::after {
        content: 'Actual';
        position: absolute;
        top: -15px;
        right: 0;
        font-size: 0.6rem;
        color: #4CAF50;
        background: rgba(76, 175, 80, 0.1);
        padding: 2px 5px;
        border-radius: 3px;
        font-weight: bold;
    }
    
    /* Mejoras responsivas para el editor */
    @media (max-width: 1200px) {
        .edit-mode-toggle {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
            right: 100px;
        }
        
        .precision-buttons {
            max-width: 100px;
        }
        
        .precision-btn {
            padding: 3px;
            font-size: 0.7rem;
        }
        
        .preview-tooltip {
            max-width: 150px;
            font-size: 0.7rem;
        }
    }
    
    @media (max-width: 900px) {
        .edit-mode-toggle {
            top: 15px;
            right: 80px;
        }
        
        .export-modal-content {
            width: 95%;
            max-height: 90%;
        }
        
        #export-textarea,
        #export-json-textarea {
            height: 200px;
        }
        
        .precision-buttons {
            max-width: 80px;
        }
        
        .position-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 3px;
        }
        
        .element-actions {
            flex-direction: column;
        }
        
        .preview-tooltip {
            max-width: 120px;
            font-size: 0.6rem;
        }
    }
    
    /* Animaciones para una mejor experiencia */
    .scenario-element {
        transition: all 0.2s ease;
    }
    
    .scenario-element:hover {
        animation: subtle-glow 1s ease-in-out;
    }
    
    @keyframes subtle-glow {
        0% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.3); }
        50% { box-shadow: 0 0 15px rgba(33, 150, 243, 0.6); }
        100% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.3); }
    }
    
    /* Estilos para mejorar la visualización en modo edición */
    .scenario-background.edit-mode .scenario-element {
        border: 1px solid rgba(33, 150, 243, 0.3);
        border-radius: 3px;
    }
    
    .scenario-background.edit-mode .scenario-element:hover {
        border-color: rgba(33, 150, 243, 0.8);
    }
    
    /* Mejoras visuales para el panel de información */
    #element-info-panel {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        border: 1px solid #ddd;
    }
    
    #element-info-panel h4 {
        margin: 0 0 10px 0;
        padding: 0;
        font-size: 1rem;
        color: #333;
    }
    
    /* Indicadores visuales para elementos modificados */
    .scenario-element[data-modified="true"] {
        position: relative;
    }
    
    .scenario-element[data-modified="true"]::before {
        content: '✏️';
        position: absolute;
        top: -10px;
        right: -10px;
        background: #4CAF50;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        z-index: 1002;
        animation: bounce 0.5s ease-in-out;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    /* Estilos mejorados para el export modal */
    .export-modal {
        animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
        from { opacity: 0; background: rgba(0, 0, 0, 0); }
        to { opacity: 1; background: rgba(0, 0, 0, 0.8); }
    }
    
    .export-modal-content {
        animation: modalSlideIn 0.3s ease;
    }
    
    @keyframes modalSlideIn {
        from { transform: translateY(-30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = editorStyles;
document.head.appendChild(styleSheet);

console.log('🎨 Módulo Editor Visual cargado'); 