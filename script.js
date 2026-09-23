/**
 * Emma Aprende - UI Controller v2.0
 * Features:
 * - Dual Interaction: Tap-to-Match + Drag-and-Drop
 * - Multimodal Audio: Speech synthesis + Web Audio SFX
 * - The Sky Metaphor: Animated sun tracking 15-min session
 * - Star Jar & Gentle Celebrations
 * - Parental Zone with Math Gate
 */

// Global Instances
let gameEngine = null;
let audioService = null;
let selectedWordCard = null;
let totalStarsCollected = 0;
let parentMathResult = 5;

// DOM Elements
const appContainer = document.getElementById('app-container');
const spotsGrid = document.getElementById('spots-grid');
const wordBank = document.getElementById('word-bank');
const themeTitle = document.getElementById('theme-title');
const sunMarker = document.getElementById('sun-marker');
const starCount = document.getElementById('star-count');
const audioToggleBtn = document.getElementById('audio-toggle-btn');
const parentGateBtn = document.getElementById('parent-gate-btn');

// Modals
const welcomeModal = document.getElementById('welcome-modal');
const startGameBtn = document.getElementById('start-game-btn');
const levelCompleteBanner = document.getElementById('level-complete-banner');
const restModal = document.getElementById('rest-modal');
const restCloseBtn = document.getElementById('rest-close-btn');
const sessionStatsSummary = document.getElementById('session-stats-summary');
const parentModal = document.getElementById('parent-modal');
const closeParentBtn = document.getElementById('close-parent-btn');

// Parent Zone Elements
const parentGateChallenge = document.getElementById('parent-gate-challenge');
const mathProblem = document.getElementById('math-problem');
const mathAnswerInput = document.getElementById('math-answer-input');
const verifyMathBtn = document.getElementById('verify-math-btn');
const mathError = document.getElementById('math-error');
const parentDashboard = document.getElementById('parent-dashboard');
const statWordsSeen = document.getElementById('stat-words-seen');
const statWordsMastered = document.getElementById('stat-words-mastered');
const statSessions = document.getElementById('stat-sessions');
const parentAudioToggle = document.getElementById('parent-audio-toggle');
const resetHistoryBtn = document.getElementById('reset-history-btn');

/**
 * Initialize on DOM Load or immediately if already loaded
 */
async function initApp() {
    console.log('🌟 Inicializando Emma Aprende v2.0...');
    setupUIEventListeners(); // Registrar clics de inmediato

    try {
        // 1. Initialize Audio Service
        audioService = new AudioService();

        // 2. Load Curriculum
        const curriculum = await loadCurriculum();

        // 3. Initialize Game Engine
        gameEngine = new GameEngine(curriculum);

        // 4. Setup Callbacks
        setupGameCallbacks();

        console.log('✅ Emma Aprende inicializado con éxito');
    } catch (error) {
        console.error('❌ Error al inicializar el motor:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/**
 * Load curriculum data from JSON
 */
async function loadCurriculum() {
    if (typeof ACTIVE_CURRICULUM !== 'undefined') {
        return ACTIVE_CURRICULUM;
    }
    if (typeof window !== 'undefined' && window.ACTIVE_CURRICULUM) {
        return window.ACTIVE_CURRICULUM;
    }
    try {
        const response = await fetch('src/data/active_curriculum.json');
        return await response.json();
    } catch (e) {
        console.warn('⚠️ Error al cargar active_curriculum, intentando fallback...', e);
        try {
            const fallback = await fetch('src/data/master_curriculum.json');
            return await fallback.json();
        } catch (err) {
            console.error('Fallback falló también:', err);
            throw err;
        }
    }
}

/**
 * Register GameEngine callbacks
 */
function setupGameCallbacks() {
    gameEngine.on('levelReady', onLevelReady);
    gameEngine.on('matchSuccess', onMatchSuccess);
    gameEngine.on('matchError', onMatchError);
    gameEngine.on('levelComplete', onLevelComplete);
    gameEngine.on('sessionUpdate', onSessionUpdate);
    gameEngine.on('sessionEnd', onSessionEnd);
}

/**
 * Setup UI Event Listeners
 */
function setupUIEventListeners() {
    // Start Game from Welcome Modal
    startGameBtn.addEventListener('click', async () => {
        try {
            if (audioService) audioService.playPop();
            welcomeModal.classList.remove('active');
            welcomeModal.style.display = 'none';

            if (!gameEngine) {
                const curriculum = await loadCurriculum();
                gameEngine = new GameEngine(curriculum);
                setupGameCallbacks();
            }

            await gameEngine.startSession();
        } catch (err) {
            console.error('❌ Error al iniciar sesión:', err);
        }
    });

    // Audio Toggle
    audioToggleBtn.addEventListener('click', () => {
        const enabled = audioService.toggleMute();
        audioToggleBtn.textContent = enabled ? '🔊' : '🔇';
        parentAudioToggle.textContent = enabled ? 'Activo 🔊' : 'Silenciado 🔇';
        if (enabled) audioService.playPop();
    });

    // Parent Zone Gate
    parentGateBtn.addEventListener('click', openParentGate);
    closeParentBtn.addEventListener('click', () => parentModal.classList.remove('active'));
    verifyMathBtn.addEventListener('click', verifyMathGate);
    mathAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verifyMathGate();
    });

    // Parent Audio Toggle
    parentAudioToggle.addEventListener('click', () => {
        const enabled = audioService.toggleMute();
        audioToggleBtn.textContent = enabled ? '🔊' : '🔇';
        parentAudioToggle.textContent = enabled ? 'Activo 🔊' : 'Silenciado 🔇';
    });

    // Reset Progress
    resetHistoryBtn.addEventListener('click', () => {
        if (confirm('¿Deseas reiniciar todo el historial de aprendizaje de Emma?')) {
            localStorage.clear();
            alert('Progreso reiniciado.');
            location.reload();
        }
    });

    // Close Bedtime / Rest Modal
    restCloseBtn.addEventListener('click', () => {
        restModal.classList.remove('active');
        welcomeModal.classList.add('active');
    });
}

/**
 * Render a new level (Spots Grid + Word Bank)
 */
function onLevelReady(levelData) {
    console.log('🎨 Nivel listo para mostrar:', levelData);

    selectedWordCard = null;
    spotsGrid.innerHTML = '';
    wordBank.innerHTML = '';

    // Update Storybook Theme Scenery
    const skyBg = document.getElementById('sky-background');
    if (skyBg && levelData.themeClass) {
        skyBg.className = `sky-background ${levelData.themeClass}`;
    }

    // Update Theme Title with cute storybook styling
    if (levelData.theme) {
        themeTitle.textContent = `${levelData.theme}`;
    }

    const elements = levelData.elements.filter(Boolean);

    // 1. Render Target Image Spots
    elements.forEach((element) => {
        const spotCard = createSpotCard(element);
        spotsGrid.appendChild(spotCard);
    });

    // 2. Render Word Cards with playful candy colors
    const colors = ['card-coral', 'card-teal', 'card-amber', 'card-purple'];
    const shuffledElements = [...elements].sort(() => Math.random() - 0.5);
    shuffledElements.forEach((element, idx) => {
        const colorClass = colors[idx % colors.length];
        const wordCard = createWordCard(element, colorClass);
        wordBank.appendChild(wordCard);
    });
}

/**
 * Create a Spot Card (Image bubble)
 */
function createSpotCard(element) {
    const card = document.createElement('div');
    card.className = 'spot-card';
    card.dataset.gridIndex = element.gridIndex;
    card.dataset.word = element.word.toLowerCase();

    // Image wrapper with soft circular medallion
    const imgWrap = document.createElement('div');
    imgWrap.className = 'spot-image-wrap';

    if (element.image) {
        const img = document.createElement('img');
        img.src = element.image;
        img.alt = element.word;
        img.loading = 'eager';
        imgWrap.appendChild(img);
    } else if (element.emoji) {
        imgWrap.innerHTML = `<span style="font-size: 5rem;">${element.emoji}</span>`;
    }

    // Word Drop/Match Slot
    const slot = document.createElement('div');
    slot.className = 'spot-slot';
    slot.textContent = '🎀 ¿Cuál es?';

    card.appendChild(imgWrap);
    card.appendChild(slot);

    // --- Tap-to-Match Listener ---
    card.addEventListener('click', () => {
        if (card.classList.contains('matched')) return;

        if (selectedWordCard) {
            const chosenWord = selectedWordCard.dataset.word;
            const targetWord = card.dataset.word;
            const gridIndex = parseInt(card.dataset.gridIndex);

            const isCorrect = gameEngine.handleMatch(gridIndex, chosenWord);
            if (!isCorrect) {
                // Deselect after miss
                selectedWordCard.classList.remove('selected');
                selectedWordCard = null;
            }
        } else {
            // Tapping image directly speaks its name for gentle prompt
            audioService.playPop();
            audioService.speakWord(element.word);
        }
    });

    // --- Drag & Drop Listeners ---
    card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!card.classList.contains('matched')) {
            card.classList.add('drag-over');
        }
    });

    card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');

        if (card.classList.contains('matched')) return;

        const droppedWord = e.dataTransfer.getData('text/plain');
        const gridIndex = parseInt(card.dataset.gridIndex);
        gameEngine.handleMatch(gridIndex, droppedWord);
    });

    return card;
}

/**
 * Create a Word Card (Tactile Button)
 */
function createWordCard(element, colorClass = 'card-amber') {
    const card = document.createElement('div');
    card.className = `word-card ${colorClass}`;
    card.dataset.word = element.word.toLowerCase();
    card.textContent = element.word.toLowerCase();
    card.draggable = true;

    // --- Tap to Select & Pronounce ---
    card.addEventListener('click', () => {
        if (card.classList.contains('matched')) return;

        // Toggle selection
        if (selectedWordCard === card) {
            card.classList.remove('selected');
            selectedWordCard = null;
            audioService.playPop();
        } else {
            if (selectedWordCard) selectedWordCard.classList.remove('selected');
            selectedWordCard = card;
            card.classList.add('selected');

            // Play tactile pop & Pronounce immediately
            audioService.playPop();
            audioService.speakWord(element.word);
        }
    });

    // --- Drag & Drop Events ---
    card.addEventListener('dragstart', (e) => {
        if (card.classList.contains('matched')) {
            e.preventDefault();
            return;
        }

        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.dataset.word);
        e.dataTransfer.effectAllowed = 'move';

        // Pronounce when picked up
        audioService.speakWord(element.word);
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    return card;
}

/**
 * Callback: Correct Match
 */
function onMatchSuccess(word, gridIndex) {
    console.log('✅ Acierto:', word);

    // Audio Celebration
    audioService.playSuccess();
    audioService.speakPraise(word);

    // Update Spot Card UI
    const spot = document.querySelector(`.spot-card[data-grid-index="${gridIndex}"]`);
    if (spot) {
        spot.classList.add('matched');
        const slot = spot.querySelector('.spot-slot');
        if (slot) {
            slot.textContent = `⭐ ${word.toUpperCase()}`;
        }
    }

    // Hide matched word card
    const wordCard = document.querySelector(`.word-card[data-word="${word.toLowerCase()}"]`);
    if (wordCard) {
        wordCard.classList.add('matched');
    }

    selectedWordCard = null;
}

/**
 * Callback: Wrong Match
 */
function onMatchError(draggedWord) {
    console.log('❌ Intento fallido para:', draggedWord);

    audioService.playGentleBounce();

    // Wiggle cards gently
    const spots = document.querySelectorAll('.spot-card:not(.matched)');
    spots.forEach(s => {
        s.classList.add('wrong');
        setTimeout(() => s.classList.remove('wrong'), 500);
    });
}

/**
 * Callback: Level Complete
 */
function onLevelComplete(data) {
    console.log('🎉 Nivel completado:', data);

    // Joyful Fanfare
    audioService.playFanfare();

    // Increment Star Jar
    totalStarsCollected++;
    starCount.textContent = totalStarsCollected;

    // Show Level Complete Banner
    levelCompleteBanner.classList.add('active');
    setTimeout(() => {
        levelCompleteBanner.classList.remove('active');
    }, 1800);
}

/**
 * Callback: Session Timer Update (Metáfora del Sol)
 */
function onSessionUpdate(state) {
    if (!state) return;

    // Calculate percentage of 15 min elapsed (0% to 100%)
    const maxMs = 15 * 60 * 1000;
    const remainingMs = state.remaining || 0;
    const elapsedMs = Math.max(0, maxMs - remainingMs);
    const progressPercent = Math.min(100, Math.max(0, (elapsedMs / maxMs) * 100));

    // Move the sun across the sky track
    if (sunMarker) {
        sunMarker.style.left = `${progressPercent}%`;
    }
}

/**
 * Callback: Session Ended (Bedtime / Rest Metaphor)
 */
function onSessionEnd(summary) {
    console.log('🌙 Sesión finalizada:', summary);

    // Show gentle bedtime modal
    sessionStatsSummary.innerHTML = `
        <p>🌟 Estrellas coleccionadas: <strong>${totalStarsCollected}</strong></p>
        <p>📚 Niveles completados: <strong>${summary.levelsCompleted || 0}</strong></p>
    `;
    restModal.classList.add('active');
}

/**
 * Parent Zone Security Gate
 */
function openParentGate() {
    // Generate simple math challenge (e.g. 2 + 3)
    const n1 = Math.floor(Math.random() * 5) + 2;
    const n2 = Math.floor(Math.random() * 4) + 1;
    parentMathResult = n1 + n2;

    mathProblem.textContent = `${n1} + ${n2} = ?`;
    mathAnswerInput.value = '';
    mathError.style.display = 'none';

    parentGateChallenge.style.display = 'block';
    parentDashboard.style.display = 'none';
    parentModal.classList.add('active');
    mathAnswerInput.focus();
}

function verifyMathGate() {
    const inputVal = parseInt(mathAnswerInput.value, 10);
    if (inputVal === parentMathResult) {
        // Unlock dashboard
        parentGateChallenge.style.display = 'none';
        parentDashboard.style.display = 'block';

        // Load statistics
        if (gameEngine && gameEngine.learningManager) {
            const progress = gameEngine.learningManager.getProgress();
            const history = gameEngine.learningManager.learningHistory;
            statWordsSeen.textContent = progress.wordsSeen || 0;
            statWordsMastered.textContent = progress.wordsMastered || 0;
            statSessions.textContent = history?.sessions?.length || 0;
        }
    } else {
        mathError.style.display = 'block';
        mathAnswerInput.value = '';
        mathAnswerInput.focus();
    }
}