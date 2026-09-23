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

// Home & Menu Elements
const homeMenuBtn = document.getElementById('home-menu-btn');
const welcomeParentsBtn = document.getElementById('welcome-parents-btn');

// Magic Chest Elements
const magicChestNavBtn = document.getElementById('magic-chest-nav-btn');
const startChestBtn = document.getElementById('start-chest-btn');
const magicChestModal = document.getElementById('magic-chest-modal');
const closeChestBtn = document.getElementById('close-chest-btn');
const chestThemeBadge = document.getElementById('chest-theme-badge');
const chestThemeIcon = document.getElementById('chest-theme-icon');
const chestThemeName = document.getElementById('chest-theme-name');
const chestCounter = document.getElementById('chest-counter');
const magicFlashcard = document.getElementById('magic-flashcard');
const chestWordFront = document.getElementById('chest-word-front');
const chestWordBack = document.getElementById('chest-word-back');
const chestImgBack = document.getElementById('chest-img-back');
const chestAudioFrontBtn = document.getElementById('chest-audio-front-btn');
const chestAudioBackBtn = document.getElementById('chest-audio-back-btn');
const chestPrevBtn = document.getElementById('chest-prev-btn');
const chestFlipBtn = document.getElementById('chest-flip-btn');
const chestNextBtn = document.getElementById('chest-next-btn');
const chestPlayNowBtn = document.getElementById('chest-play-now-btn');
const chestCardStage = document.getElementById('chest-card-stage');

let chestWords = [];
let currentChestIndex = 0;
let currentChestUnit = null;

// Parent Zone Elements
const parentGateChallenge = document.getElementById('parent-gate-challenge');
const mathProblem = document.getElementById('math-problem');
const mathAnswerInput = document.getElementById('math-answer-input');
const verifyMathBtn = document.getElementById('verify-math-btn');
const mathError = document.getElementById('math-error');
const parentDashboard = document.getElementById('parent-dashboard');
const statWordsSeen = document.getElementById('stat-words-seen');
const statWordsMastered = document.getElementById('stat-words-mastered');
const statAccuracy = document.getElementById('stat-accuracy');
const statAvgAttempts = document.getElementById('stat-avg-attempts');
const wordStatsList = document.getElementById('word-stats-list');
const parentWordFilters = document.getElementById('parent-word-filters');
let currentStatsFilter = 'all';
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

    // Home & Main Menu Return
    if (homeMenuBtn) {
        homeMenuBtn.addEventListener('click', () => {
            if (audioService) audioService.playPop();
            if (magicChestModal) magicChestModal.classList.remove('active');
            if (parentModal) parentModal.classList.remove('active');
            if (restModal) restModal.classList.remove('active');
            if (welcomeModal) {
                welcomeModal.classList.add('active');
                welcomeModal.style.display = 'flex';
            }
        });
    }

    if (welcomeParentsBtn) {
        welcomeParentsBtn.addEventListener('click', () => {
            openParentGate();
        });
    }

    // Magic Chest Launchers & Controls
    if (startChestBtn) {
        startChestBtn.addEventListener('click', () => openMagicChest());
    }
    if (magicChestNavBtn) {
        magicChestNavBtn.addEventListener('click', () => openMagicChest());
    }
    if (closeChestBtn) {
        closeChestBtn.addEventListener('click', closeMagicChest);
    }
    if (chestFlipBtn) {
        chestFlipBtn.addEventListener('click', flipChestCard);
    }
    if (magicFlashcard) {
        magicFlashcard.addEventListener('click', (e) => {
            if (e.target.closest('.card-audio-btn')) return;
            flipChestCard();
        });
    }
    if (chestPrevBtn) {
        chestPrevBtn.addEventListener('click', prevChestCard);
    }
    if (chestNextBtn) {
        chestNextBtn.addEventListener('click', nextChestCard);
    }
    if (chestPlayNowBtn) {
        chestPlayNowBtn.addEventListener('click', playNowFromChest);
    }
    if (chestAudioFrontBtn) {
        chestAudioFrontBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (chestWords[currentChestIndex] && audioService) {
                audioService.speakWord(chestWords[currentChestIndex]);
            }
        });
    }
    if (chestAudioBackBtn) {
        chestAudioBackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (chestWords[currentChestIndex] && audioService) {
                audioService.speakWord(chestWords[currentChestIndex]);
            }
        });
    }

    // iPad touch swipe support for flashcards
    if (chestCardStage) {
        let touchStartX = 0;
        let touchEndX = 0;
        chestCardStage.addEventListener('touchstart', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });
        chestCardStage.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches[0]) {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    nextChestCard();
                } else if (touchEndX - touchStartX > 50) {
                    prevChestCard();
                }
            }
        }, { passive: true });
    }

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

    // Parent Word Stats Filter Pills
    if (parentWordFilters) {
        parentWordFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-pill');
            if (!btn) return;

            parentWordFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');

            currentStatsFilter = btn.dataset.filter || 'all';
            renderWordStatsDashboard(currentStatsFilter);
            if (audioService) audioService.playPop();
        });
    }

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
    const elements = levelData.elements ? levelData.elements.filter(Boolean) : [];

    // Preload words in memory for instantaneous 0ms audio playback
    if (audioService && elements.length > 0) {
        audioService.preloadWords(elements.map(e => e.word));
    }

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
 * Create a Word Card (Tactile Button with Unified Touch & Mouse Drag-and-Drop)
 */
function createWordCard(element, colorClass = 'card-amber') {
    const card = document.createElement('div');
    card.className = `word-card ${colorClass}`;
    card.dataset.word = element.word.toLowerCase();
    card.textContent = element.word.toLowerCase();
    card.draggable = false; // Usamos nuestro motor táctil PointerEvents para soporte total en iPad

    setupCardDragAndDrop(card, element);
    return card;
}

/**
 * Unified Pointer / Touch Drag & Drop for iPad & Desktop
 */
function setupCardDragAndDrop(card, element) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let dragClone = null;
    let currentHoverSpot = null;

    const onPointerDown = (e) => {
        if (card.classList.contains('matched')) return;
        if (e.button !== undefined && e.button !== 0) return; // Solo clic principal o touch

        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;

        // Pronunciar palabra al tocarla
        audioService.playPop();
        audioService.speakWord(element.word);

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    };

    const onPointerMove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const distance = Math.hypot(deltaX, deltaY);

        if (!isDragging && distance > 8) {
            isDragging = true;
            card.classList.add('is-being-dragged');

            // Deseleccionar cualquier tarjeta previa de toque
            if (selectedWordCard) {
                selectedWordCard.classList.remove('selected');
                selectedWordCard = null;
            }

            // Crear clon táctil flotante que sigue el dedo
            dragClone = card.cloneNode(true);
            dragClone.classList.add('floating-drag-clone');
            dragClone.classList.remove('is-being-dragged', 'selected');
            dragClone.style.width = `${card.offsetWidth}px`;
            dragClone.style.height = `${card.offsetHeight}px`;
            dragClone.style.left = `${e.clientX}px`;
            dragClone.style.top = `${e.clientY}px`;
            document.body.appendChild(dragClone);
        }

        if (isDragging && dragClone) {
            if (e.cancelable) e.preventDefault(); // Evitar scroll elástico de Safari en iPad

            dragClone.style.left = `${e.clientX}px`;
            dragClone.style.top = `${e.clientY}px`;

            // Detectar spot debajo del dedo
            const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
            const spotCard = elemBelow ? elemBelow.closest('.spot-card:not(.matched)') : null;

            if (spotCard !== currentHoverSpot) {
                if (currentHoverSpot) currentHoverSpot.classList.remove('drag-over');
                currentHoverSpot = spotCard;
                if (currentHoverSpot) {
                    currentHoverSpot.classList.add('drag-over');
                    audioService.playPop();
                }
            }
        }
    };

    const onPointerUp = (e) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (isDragging) {
            card.classList.remove('is-being-dragged');

            if (currentHoverSpot) {
                currentHoverSpot.classList.remove('drag-over');
                const targetGridIndex = parseInt(currentHoverSpot.dataset.gridIndex, 10);
                const wordToMatch = card.dataset.word;

                // Procesar acierto o error en el motor
                gameEngine.handleMatch(targetGridIndex, wordToMatch);

                // Eliminar clon flotante
                if (dragClone) dragClone.remove();
            } else {
                // Animación de regreso suave si se suelta en el aire
                if (dragClone) {
                    dragClone.classList.add('returning');
                    const rect = card.getBoundingClientRect();
                    dragClone.style.left = `${rect.left + rect.width / 2}px`;
                    dragClone.style.top = `${rect.top + rect.height / 2}px`;
                    setTimeout(() => {
                        if (dragClone) dragClone.remove();
                    }, 260);
                    audioService.playGentleBounce();
                }
            }

            dragClone = null;
            currentHoverSpot = null;
            isDragging = false;
        } else {
            // Tap-to-Match fallback: El usuario dio un toque rápido sin arrastrar
            handleTapCard(card, element);
        }
    };

    card.addEventListener('pointerdown', onPointerDown);
}

function handleTapCard(card, element) {
    if (card.classList.contains('matched')) return;

    if (selectedWordCard === card) {
        card.classList.remove('selected');
        selectedWordCard = null;
        audioService.playPop();
    } else {
        if (selectedWordCard) selectedWordCard.classList.remove('selected');
        selectedWordCard = card;
        card.classList.add('selected');
        audioService.playPop();
        audioService.speakWord(element.word);
    }
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

        // Render comprehensive word-by-word analytics
        renderWordStatsDashboard(currentStatsFilter);
    } else {
        mathError.style.display = 'block';
        mathAnswerInput.value = '';
        mathAnswerInput.focus();
    }
}

/**
 * Render Detailed Word-by-Word Analytics Dashboard
 * Shows exact attempts, successes, errors, and average attempts per word
 * @param {string} filter - 'all' or statusClass
 */
function renderWordStatsDashboard(filter = 'all') {
    if (!gameEngine || !gameEngine.learningManager || !wordStatsList) return;

    const lm = gameEngine.learningManager;
    const progress = lm.getProgress();
    const allStats = lm.getDetailedWordStats();

    // Summary boxes
    if (statWordsMastered) statWordsMastered.textContent = progress.wordsMastered || 0;
    if (statWordsSeen) statWordsSeen.textContent = progress.wordsSeen || 0;
    if (statAccuracy) statAccuracy.textContent = `${progress.overallAccuracy || 0}%`;
    if (statAvgAttempts) statAvgAttempts.textContent = progress.avgAttemptsGlobal || '-';

    // Counts for filter pills
    const countAll = document.getElementById('count-all');
    const countMastered = document.getElementById('count-mastered');
    const countProgress = document.getElementById('count-progress');
    const countPractice = document.getElementById('count-practice');
    const countNew = document.getElementById('count-new');

    const masteredItems = allStats.filter(s => s.statusClass === 'status-mastered');
    const progressItems = allStats.filter(s => s.statusClass === 'status-progress');
    const practiceItems = allStats.filter(s => s.statusClass === 'status-practice');
    const newItems = allStats.filter(s => s.statusClass === 'status-new');

    if (countAll) countAll.textContent = allStats.length;
    if (countMastered) countMastered.textContent = masteredItems.length;
    if (countProgress) countProgress.textContent = progressItems.length;
    if (countPractice) countPractice.textContent = practiceItems.length;
    if (countNew) countNew.textContent = newItems.length;

    // Filter items
    let filtered = allStats;
    if (filter !== 'all') {
        filtered = allStats.filter(s => s.statusClass === filter);
    }

    wordStatsList.innerHTML = '';

    if (filtered.length === 0) {
        wordStatsList.innerHTML = `
            <div style="text-align: center; padding: 25px; color: #94A3B8; font-weight: 600;">
                No hay palabras en esta categoría todavía.
            </div>
        `;
        return;
    }

    filtered.forEach(stat => {
        const row = document.createElement('div');
        row.className = 'word-stat-row';

        const imgSrc = stat.asset || `images/elements/${stat.normKey}.png`;

        row.innerHTML = `
            <div class="word-info-left">
                <img src="${imgSrc}" alt="${stat.word}" class="word-stat-thumb" onerror="this.style.display='none'">
                <div class="word-text-group">
                    <span class="word-text-name">${stat.word}</span>
                    <span class="word-text-unit">${stat.unitIcon} ${stat.unitName}</span>
                </div>
            </div>

            <div class="word-metrics-center">
                <div class="metric-pill">
                    <span class="metric-value success">${stat.successes} ✓</span>
                    <span class="metric-tag">Aciertos</span>
                </div>
                <div class="metric-pill">
                    <span class="metric-value errors">${stat.errors} ✗</span>
                    <span class="metric-tag">Errores</span>
                </div>
                <div class="metric-pill">
                    <span class="metric-value attempts">${stat.avgAttempts}</span>
                    <span class="metric-tag">Intentos/Acierto</span>
                </div>
            </div>

            <span class="status-badge ${stat.statusClass}">
                ${stat.statusIcon} ${stat.status}
            </span>
        `;

        wordStatsList.appendChild(row);
    });
}

/**
 * ==========================================================================
 * Cofre Mágico (Flashcards 3D de Descubrimiento y Aprendizaje - Glenn Doman)
 * ==========================================================================
 */

/**
 * Open Magic Chest presentation mode
 * @param {Object|null} targetUnit - Specific unit to present, or current/first unit
 */
function openMagicChest(targetUnit = null) {
    if (audioService) audioService.playPop();

    // Close welcome modal if open
    if (welcomeModal) {
        welcomeModal.classList.remove('active');
        welcomeModal.style.display = 'none';
    }

    // Get units from curriculum
    let units = (window.ACTIVE_CURRICULUM && window.ACTIVE_CURRICULUM.units) ? window.ACTIVE_CURRICULUM.units : [];
    if (units.length === 0 && gameEngine && gameEngine.curriculum && gameEngine.curriculum.units) {
        units = gameEngine.curriculum.units;
    }

    if (targetUnit) {
        currentChestUnit = targetUnit;
    } else if (gameEngine && gameEngine.currentLevel && gameEngine.currentLevel.data) {
        const currentUnitId = gameEngine.currentLevel.data.unitId;
        currentChestUnit = units.find(u => u.id === currentUnitId) || units[0];
    } else {
        currentChestUnit = units[0] || {
            name: "Mi Familia",
            icon: "👨‍👩‍👧",
            words: ["Mamá", "Papá", "Emma"]
        };
    }

    chestWords = currentChestUnit.words ? [...currentChestUnit.words] : ["Mamá", "Papá", "Emma"];
    currentChestIndex = 0;

    // Preload words in memory for instantaneous 0ms audio playback
    if (audioService && chestWords.length > 0) {
        audioService.preloadWords(chestWords);
    }

    magicChestModal.classList.add('active');
    renderChestCard();
}

/**
 * Close Magic Chest
 */
function closeMagicChest() {
    if (audioService) audioService.playPop();
    magicChestModal.classList.remove('active');
}

/**
 * Render the current flashcard in the Magic Chest
 */
function renderChestCard() {
    if (!chestWords || chestWords.length === 0) return;
    const currentWord = chestWords[currentChestIndex];

    // Reset card to front face
    magicFlashcard.classList.remove('flipped');

    // Unit theme badge
    if (currentChestUnit) {
        chestThemeIcon.textContent = currentChestUnit.icon || "🌟";
        chestThemeName.textContent = currentChestUnit.name || "Aprende Palabras";
    }

    // Counter badge
    chestCounter.textContent = `${currentChestIndex + 1} / ${chestWords.length}`;

    // Front: Word
    chestWordFront.textContent = currentWord;

    // Back: Word + 3D Asset
    chestWordBack.textContent = currentWord;
    const assetUrl = (typeof AssetProvider !== 'undefined') 
        ? AssetProvider.getAsset(currentWord) 
        : `images/elements/${currentWord.toLowerCase()}.png`;
    chestImgBack.src = assetUrl;

    // Navigation button states
    chestPrevBtn.style.opacity = currentChestIndex === 0 ? '0.35' : '1';
    chestPrevBtn.style.pointerEvents = currentChestIndex === 0 ? 'none' : 'auto';

    if (currentChestIndex === chestWords.length - 1) {
        chestNextBtn.innerHTML = '<span>✨</span>';
        chestNextBtn.title = '¡Terminaste todas las palabras!';
    } else {
        chestNextBtn.innerHTML = '<span>➡️</span>';
        chestNextBtn.title = 'Siguiente palabra';
    }

    // Pronounce the word in studio-quality neural voice
    setTimeout(() => {
        if (audioService) {
            audioService.speakWord(currentWord);
        }
    }, 250);
}

/**
 * Flip card between word face and 3D illustration face
 */
function flipChestCard() {
    const isFlipped = magicFlashcard.classList.toggle('flipped');
    const currentWord = chestWords[currentChestIndex];

    if (audioService) {
        if (isFlipped) {
            audioService.playSuccess();
            setTimeout(() => {
                audioService.speakWord(currentWord);
            }, 300);
        } else {
            audioService.playPop();
        }
    }
}

/**
 * Navigate to next flashcard
 */
function nextChestCard() {
    if (currentChestIndex < chestWords.length - 1) {
        currentChestIndex++;
        renderChestCard();
    } else {
        // Last card: flip to reveal illustration or celebrate
        flipChestCard();
    }
}

/**
 * Navigate to previous flashcard
 */
function prevChestCard() {
    if (currentChestIndex > 0) {
        currentChestIndex--;
        renderChestCard();
    }
}

/**
 * Transition from discovery flashcards directly into the matching game
 */
async function playNowFromChest() {
    if (audioService) audioService.playFanfare();
    closeMagicChest();

    if (!gameEngine) {
        const curriculum = await loadCurriculum();
        gameEngine = new GameEngine(curriculum);
        setupGameCallbacks();
    }

    if (!gameEngine.sessionController || !gameEngine.sessionController.isActive) {
        await gameEngine.startSession();
    }
}

// 1-Click Forced Purge & Update in Parents Zone
const forceUpdateBtn = document.getElementById('force-update-btn');
if (forceUpdateBtn) {
    forceUpdateBtn.addEventListener('click', async () => {
        try {
            forceUpdateBtn.textContent = 'Actualizando... ⏳';
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
            }
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (let reg of regs) {
                    await reg.unregister();
                }
            }
            window.location.reload(true);
        } catch (e) {
            window.location.reload();
        }
    });
}

// Register Service Worker with proactive auto-refresh when updated
if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            console.log('🔄 Nueva versión detectada, recargando aplicación...');
            window.location.reload();
        }
    });

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=2.5').then((reg) => {
            reg.update();
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ action: 'skipWaiting' });
                        }
                    });
                }
            });
            console.log('📦 Service Worker activo y verificado');
        }).catch((err) => {
            console.debug('Service Worker:', err);
        });
    });
}