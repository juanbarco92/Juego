// 🎨 EDITOR VISUAL INTERACTIVO DE ESCENARIOS
// Permite ajustar posiciones, tamaños y propiedades de elementos de forma visual
// 
// Uso: Haz clic en el botón "🎨 Abrir Editor" y arrastra los elementos sobre el escenario

class ScenarioEditor {
    constructor() {
        this.currentScenario = null;
        this.currentScenarioKey = null;
        this.isDragging = false;
        this.isResizing = false;
        this.currentElement = null;
        this.container = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.resizeCorner = null;
    }

    // Inicializar el editor con un escenario específico
    init(scenarioKey) {
        this.currentScenarioKey = scenarioKey;
        this.currentScenario = gameScenarios[scenarioKey];
        
        if (!this.currentScenario) {
            alert('❌ Escenario no encontrado: ' + scenarioKey);
            return;
        }

        this.setupEditorUI();
        this.loadScenarioForEditing();
        this.updateGeneratedCode();
    }

    // Crear la interfaz del editor
    setupEditorUI() {
        // Crear panel de control del editor
        const editorPanel = document.createElement('div');
        editorPanel.id = 'editor-panel';
        editorPanel.innerHTML = `
            <div class="editor-controls">
                <div class="editor-header">
                    <h3>🎨 Modo Editor</h3>
                    <button id="editor-close-btn" class="editor-close-btn" title="Cerrar editor">×</button>
                </div>
                
                <div class="editor-scenario-selector">
                    <label>📍 Escenario:</label>
                    <select id="scenario-select">
                        <option value="casa">🏠 La Casa</option>
                        <option value="parque">🌳 El Parque</option>
                        <option value="cocina">👩‍🍳 La Cocina</option>
                    </select>
                </div>

                <div class="editor-buttons">
                    <button id="toggle-grid" class="editor-btn">📐 Grid</button>
                    <button id="toggle-labels" class="editor-btn">🏷️ Labels</button>
                    <button id="save-positions" class="editor-btn">💾 Copiar</button>
                </div>

                <div class="element-selector">
                    <label>🎯 Elemento activo:</label>
                    <select id="element-select"></select>
                </div>

                <div class="position-display">
                    <div class="coord-info">
                        <label>X:</label>
                        <input type="number" id="pos-x" step="0.1" min="0" max="100" />
                        <label>Y:</label>
                        <input type="number" id="pos-y" step="0.1" min="0" max="100" />
                    </div>
                    <div class="size-info">
                        <label>Ancho:</label>
                        <input type="number" id="size-w" step="0.1" min="1" max="50" />
                        <label>Alto:</label>
                        <input type="number" id="size-h" step="0.1" min="1" max="50" />
                    </div>
                    <div class="display-size-info">
                        <label>Tamaño Visual:</label>
                        <input type="number" id="display-size" step="0.1" min="0.5" max="5" />
                    </div>
                    <div class="dropzone-info">
                        <label>DropZone W:</label>
                        <input type="number" id="dropzone-w" step="0.1" min="0.1" max="1" />
                        <label>DropZone H:</label>
                        <input type="number" id="dropzone-h" step="0.1" min="0.1" max="1" />
                    </div>
                </div>

                <div class="editor-info">
                    <p>💡 <strong>Tip:</strong> Arrastra para mover, usa las esquinas para redimensionar</p>
                </div>

                <div class="code-output">
                    <h4>📋 Código Generado:</h4>
                    <textarea id="generated-code" readonly></textarea>
                    <button id="copy-code-btn" class="editor-btn-primary">📋 Copiar al Portapapeles</button>
                </div>
            </div>
        `;
        document.body.appendChild(editorPanel);

        // Agregar estilos del editor si no existen
        if (!document.getElementById('editor-styles')) {
            this.addEditorStyles();
        }

        // Configurar eventos
        this.attachEditorEvents();
    }

    // Cargar escenario para edición
    loadScenarioForEditing() {
        // Obtener o crear el contenedor
        this.container = document.getElementById('scenario-background');
        
        if (!this.container) {
            alert('❌ No se encontró el contenedor del escenario');
            return;
        }

        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Aplicar background del escenario
        this.container.style.backgroundImage = `url('${this.currentScenario.background}')`;
        this.container.style.backgroundSize = 'cover';
        this.container.style.backgroundPosition = 'center';

        // Agregar grid opcional (oculto por defecto)
        const grid = document.createElement('div');
        grid.id = 'editor-grid';
        grid.className = 'editor-grid hidden';
        this.container.appendChild(grid);

        // Crear elementos editables
        this.currentScenario.elements.forEach((element, index) => {
            this.createEditableElement(element, index);
        });

        // Poblar selector de elementos
        this.populateElementSelector();
        
        // Seleccionar el primer elemento por defecto
        document.getElementById('element-select').value = '0';
        this.selectElement(0);

        // Actualizar selector de escenario
        document.getElementById('scenario-select').value = this.currentScenarioKey;
    }

    // Crear elemento editable visual
    createEditableElement(element, index) {
        const editableEl = document.createElement('div');
        editableEl.className = 'editable-element';
        editableEl.dataset.elementId = element.id;
        editableEl.dataset.elementIndex = index;

        // Calcular tamaño visual (con displaySize)
        const sizeMultiplier = element.displaySize || 2.0;
        const visualWidth = element.position.width * sizeMultiplier;
        const visualHeight = element.position.height * sizeMultiplier;

        // Calcular offset para centrar
        const offsetX = (visualWidth - element.position.width) / 2;
        const offsetY = (visualHeight - element.position.height) / 2;

        // Posicionar según datos actuales
        editableEl.style.left = `${element.position.x - offsetX}%`;
        editableEl.style.top = `${element.position.y - offsetY}%`;
        editableEl.style.width = `${visualWidth}%`;
        editableEl.style.height = `${visualHeight}%`;

        // Agregar imagen
        const img = document.createElement('img');
        img.src = element.image;
        img.alt = element.word;
        img.draggable = false;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.pointerEvents = 'none';
        editableEl.appendChild(img);

        // Agregar label
        const label = document.createElement('div');
        label.className = 'element-label';
        label.textContent = `${element.word.toUpperCase()} (${element.emoji})`;
        editableEl.appendChild(label);

        // Agregar punto central (cruz roja)
        const centerPoint = document.createElement('div');
        centerPoint.className = 'center-point';
        centerPoint.innerHTML = `
            <div class="center-cross-h"></div>
            <div class="center-cross-v"></div>
        `;
        editableEl.appendChild(centerPoint);

        // Agregar handles de redimensionamiento
        ['nw', 'ne', 'sw', 'se'].forEach(corner => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${corner}`;
            handle.dataset.corner = corner;
            editableEl.appendChild(handle);
        });

        // Eventos de click para seleccionar
        editableEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('resize-handle')) {
                this.selectElement(index);
            }
        });

        // Eventos de arrastre
        editableEl.addEventListener('mousedown', (e) => this.startDrag(e, editableEl, element, index));
        
        // Eventos de redimensionamiento
        editableEl.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startResize(e, editableEl, element, index, handle.dataset.corner);
            });
        });

        this.container.appendChild(editableEl);
    }

    // Iniciar arrastre de elemento
    startDrag(e, element, data, index) {
        // Ignorar si es un handle de resize
        if (e.target.classList.contains('resize-handle')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.currentElement = { el: element, data: data, index: index };
        this.selectElement(index);

        const rect = this.container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        const offsetX = e.clientX - elementRect.left;
        const offsetY = e.clientY - elementRect.top;

        const onMouseMove = (e) => {
            if (!this.isDragging) return;

            const x = ((e.clientX - rect.left - offsetX) / rect.width) * 100;
            const y = ((e.clientY - rect.top - offsetY) / rect.height) * 100;

            // Limitar a los bordes del contenedor
            const maxX = 100 - parseFloat(element.style.width);
            const maxY = 100 - parseFloat(element.style.height);
            const boundedX = Math.max(0, Math.min(maxX, x));
            const boundedY = Math.max(0, Math.min(maxY, y));

            element.style.left = `${boundedX}%`;
            element.style.top = `${boundedY}%`;

            // Actualizar posición del centro (teniendo en cuenta el displaySize)
            const sizeMultiplier = data.displaySize || 2.0;
            const visualWidth = data.position.width * sizeMultiplier;
            const visualHeight = data.position.height * sizeMultiplier;
            const offsetX = (visualWidth - data.position.width) / 2;
            const offsetY = (visualHeight - data.position.height) / 2;

            data.position.x = Math.round((boundedX + offsetX) * 10) / 10;
            data.position.y = Math.round((boundedY + offsetY) * 10) / 10;

            this.updatePositionDisplay(data);
            this.updateGeneratedCode();
        };

        const onMouseUp = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            element.classList.remove('dragging');
        };

        element.classList.add('dragging');
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Iniciar redimensionamiento
    startResize(e, element, data, index, corner) {
        e.preventDefault();
        e.stopPropagation();

        this.isResizing = true;
        this.currentElement = { el: element, data: data, index: index };
        this.resizeCorner = corner;
        this.selectElement(index);

        const rect = this.container.getBoundingClientRect();
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = parseFloat(element.style.width);
        this.startHeight = parseFloat(element.style.height);
        this.startLeft = parseFloat(element.style.left);
        this.startTop = parseFloat(element.style.top);

        const onMouseMove = (e) => {
            if (!this.isResizing) return;

            const deltaX = ((e.clientX - this.startX) / rect.width) * 100;
            const deltaY = ((e.clientY - this.startY) / rect.height) * 100;

            let newWidth = this.startWidth;
            let newHeight = this.startHeight;
            let newLeft = this.startLeft;
            let newTop = this.startTop;

            // Aplicar cambios según la esquina
            if (corner.includes('e')) {
                newWidth = Math.max(5, this.startWidth + deltaX);
            }
            if (corner.includes('w')) {
                newWidth = Math.max(5, this.startWidth - deltaX);
                newLeft = this.startLeft + (this.startWidth - newWidth);
            }
            if (corner.includes('s')) {
                newHeight = Math.max(5, this.startHeight + deltaY);
            }
            if (corner.includes('n')) {
                newHeight = Math.max(5, this.startHeight - deltaY);
                newTop = this.startTop + (this.startHeight - newHeight);
            }

            // Aplicar límites
            if (newLeft < 0) {
                newWidth += newLeft;
                newLeft = 0;
            }
            if (newTop < 0) {
                newHeight += newTop;
                newTop = 0;
            }
            if (newLeft + newWidth > 100) {
                newWidth = 100 - newLeft;
            }
            if (newTop + newHeight > 100) {
                newHeight = 100 - newTop;
            }

            element.style.width = `${newWidth}%`;
            element.style.height = `${newHeight}%`;
            element.style.left = `${newLeft}%`;
            element.style.top = `${newTop}%`;

            // Actualizar datos del elemento (recalcular position base)
            const sizeMultiplier = data.displaySize || 2.0;
            data.position.width = Math.round((newWidth / sizeMultiplier) * 10) / 10;
            data.position.height = Math.round((newHeight / sizeMultiplier) * 10) / 10;

            const offsetX = (newWidth - data.position.width) / 2;
            const offsetY = (newHeight - data.position.height) / 2;
            data.position.x = Math.round((newLeft + offsetX) * 10) / 10;
            data.position.y = Math.round((newTop + offsetY) * 10) / 10;

            this.updatePositionDisplay(data);
            this.updateGeneratedCode();
        };

        const onMouseUp = () => {
            this.isResizing = false;
            this.resizeCorner = null;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Seleccionar elemento visualmente
    selectElement(index) {
        // Quitar selección anterior
        document.querySelectorAll('.editable-element').forEach(el => el.classList.remove('selected'));
        
        // Seleccionar nuevo elemento
        const element = document.querySelector(`[data-element-index="${index}"]`);
        if (element) {
            element.classList.add('selected');
        }

        // Actualizar selector
        document.getElementById('element-select').value = index;

        // Actualizar display de posiciones
        const data = this.currentScenario.elements[index];
        this.updatePositionDisplay(data);
    }

    // Actualizar el display de posiciones en el panel
    updatePositionDisplay(element) {
        document.getElementById('pos-x').value = element.position.x;
        document.getElementById('pos-y').value = element.position.y;
        document.getElementById('size-w').value = element.position.width;
        document.getElementById('size-h').value = element.position.height;
        document.getElementById('display-size').value = element.displaySize || 2.0;
        document.getElementById('dropzone-w').value = element.dropZone.widthPercent;
        document.getElementById('dropzone-h').value = element.dropZone.heightPercent;
    }

    // Generar código JavaScript del escenario actual
    updateGeneratedCode() {
        const scenario = this.currentScenario;
        let code = `// 📍 Código generado para: ${scenario.name}\n`;
        code += `// Escenario: ${this.currentScenarioKey}\n\n`;
        code += `elements: [\n`;

        scenario.elements.forEach((el, idx) => {
            code += `    {\n`;
            code += `        id: "${el.id}",\n`;
            code += `        word: "${el.word}",\n`;
            code += `        emoji: "${el.emoji}",\n`;
            code += `        position: { x: ${el.position.x}, y: ${el.position.y}, width: ${el.position.width}, height: ${el.position.height} },\n`;
            code += `        displaySize: ${el.displaySize},\n`;
            code += `        dropZone: { widthPercent: ${el.dropZone.widthPercent}, heightPercent: ${el.dropZone.heightPercent} },\n`;
            code += `        image: "${el.image}",\n`;
            code += `        level: ${el.level}\n`;
            code += `    }${idx < scenario.elements.length - 1 ? ',' : ''}\n`;
        });

        code += `]\n`;
        document.getElementById('generated-code').value = code;
    }

    // Poblar selector de elementos
    populateElementSelector() {
        const select = document.getElementById('element-select');
        select.innerHTML = '';
        
        this.currentScenario.elements.forEach((el, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${el.emoji} ${el.word}`;
            select.appendChild(option);
        });
    }

    // Configurar eventos del editor
    attachEditorEvents() {
        // Toggle grid
        document.getElementById('toggle-grid').addEventListener('click', () => {
            const grid = document.getElementById('editor-grid');
            grid.classList.toggle('hidden');
            const btn = document.getElementById('toggle-grid');
            btn.classList.toggle('active');
        });

        // Toggle labels
        document.getElementById('toggle-labels').addEventListener('click', () => {
            document.querySelectorAll('.element-label').forEach(label => {
                label.classList.toggle('hidden');
            });
            const btn = document.getElementById('toggle-labels');
            btn.classList.toggle('active');
        });

        // Copiar código completo
        document.getElementById('save-positions').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Copiar código (botón principal)
        document.getElementById('copy-code-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Cerrar editor
        document.getElementById('editor-close-btn').addEventListener('click', () => {
            this.closeEditor();
        });

        // Cambiar escenario
        document.getElementById('scenario-select').addEventListener('change', (e) => {
            if (confirm('¿Cambiar de escenario? Los cambios no guardados se perderán.')) {
                this.init(e.target.value);
            } else {
                e.target.value = this.currentScenarioKey;
            }
        });

        // Actualizar elemento seleccionado
        document.getElementById('element-select').addEventListener('change', (e) => {
            this.selectElement(parseInt(e.target.value));
        });

        // Actualizar desde inputs numéricos
        const inputs = ['pos-x', 'pos-y', 'size-w', 'size-h', 'display-size', 'dropzone-w', 'dropzone-h'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                this.updateFromInput(id, parseFloat(e.target.value));
            });
        });
    }

    // Actualizar elemento desde input numérico
    updateFromInput(inputId, value) {
        const selectIdx = parseInt(document.getElementById('element-select').value);
        const element = this.currentScenario.elements[selectIdx];
        const editableEl = document.querySelector(`[data-element-index="${selectIdx}"]`);

        if (!element || !editableEl) return;

        const sizeMultiplier = element.displaySize || 2.0;

        switch(inputId) {
            case 'pos-x':
                element.position.x = value;
                const offsetX = ((element.position.width * sizeMultiplier) - element.position.width) / 2;
                editableEl.style.left = `${value - offsetX}%`;
                break;
            case 'pos-y':
                element.position.y = value;
                const offsetY = ((element.position.height * sizeMultiplier) - element.position.height) / 2;
                editableEl.style.top = `${value - offsetY}%`;
                break;
            case 'size-w':
                element.position.width = value;
                editableEl.style.width = `${value * sizeMultiplier}%`;
                break;
            case 'size-h':
                element.position.height = value;
                editableEl.style.height = `${value * sizeMultiplier}%`;
                break;
            case 'display-size':
                element.displaySize = value;
                // Recalcular todo
                const newVisualW = element.position.width * value;
                const newVisualH = element.position.height * value;
                const newOffsetX = (newVisualW - element.position.width) / 2;
                const newOffsetY = (newVisualH - element.position.height) / 2;
                editableEl.style.width = `${newVisualW}%`;
                editableEl.style.height = `${newVisualH}%`;
                editableEl.style.left = `${element.position.x - newOffsetX}%`;
                editableEl.style.top = `${element.position.y - newOffsetY}%`;
                break;
            case 'dropzone-w':
                element.dropZone.widthPercent = value;
                break;
            case 'dropzone-h':
                element.dropZone.heightPercent = value;
                break;
        }

        this.updateGeneratedCode();
    }

    // Copiar código al portapapeles
    copyToClipboard() {
        const code = document.getElementById('generated-code');
        code.select();
        document.execCommand('copy');
        
        // Feedback visual
        const btn = document.getElementById('copy-code-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ ¡Copiado!';
        btn.style.background = '#4CAF50';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }

    // Cerrar editor
    closeEditor() {
        if (confirm('¿Cerrar el editor? Los cambios no guardados se perderán.')) {
            const panel = document.getElementById('editor-panel');
            if (panel) panel.remove();
            
            const btn = document.getElementById('open-editor-btn');
            if (btn) btn.style.display = 'block';
            
            // Recargar la página para volver al juego normal
            location.reload();
        }
    }

    // Agregar estilos CSS del editor
    addEditorStyles() {
        const style = document.createElement('style');
        style.id = 'editor-styles';
        style.textContent = `
            /* Panel del Editor */
            #editor-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 380px;
                max-height: calc(100vh - 20px);
                background: rgba(255, 255, 255, 0.98);
                border: 3px solid #4CAF50;
                border-radius: 15px;
                box-shadow: 0 5px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: 'Comic Sans MS', cursive;
                overflow-y: auto;
            }

            .editor-controls {
                padding: 15px;
            }

            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #4CAF50;
            }

            .editor-header h3 {
                margin: 0;
                color: #4CAF50;
                font-size: 1.3rem;
            }

            .editor-close-btn {
                background: #f44336;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                font-size: 20px;
                cursor: pointer;
                line-height: 1;
                transition: background 0.3s;
            }

            .editor-close-btn:hover {
                background: #d32f2f;
            }

            .editor-scenario-selector {
                margin-bottom: 15px;
            }

            .editor-scenario-selector label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
                font-size: 0.9rem;
            }

            .editor-scenario-selector select {
                width: 100%;
                padding: 8px;
                border-radius: 8px;
                border: 2px solid #ddd;
                font-family: 'Comic Sans MS', cursive;
                font-size: 0.9rem;
            }

            .editor-buttons {
                display: flex;
                gap: 8px;
                margin-bottom: 15px;
            }

            .editor-btn {
                flex: 1;
                padding: 10px 8px;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                background: white;
                color: #4CAF50;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: bold;
                transition: all 0.3s;
            }

            .editor-btn:hover {
                background: #4CAF50;
                color: white;
            }

            .editor-btn.active {
                background: #4CAF50;
                color: white;
            }

            .element-selector {
                margin-bottom: 15px;
            }

            .element-selector label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #333;
                font-size: 0.9rem;
            }

            .element-selector select {
                width: 100%;
                padding: 8px;
                border-radius: 8px;
                border: 2px solid #ddd;
                font-family: 'Comic Sans MS', cursive;
                font-size: 0.9rem;
            }

            .position-display {
                background: #f5f5f5;
                padding: 12px;
                border-radius: 10px;
                margin-bottom: 15px;
            }

            .coord-info, .size-info, .display-size-info, .dropzone-info {
                display: grid;
                grid-template-columns: auto 1fr auto 1fr;
                gap: 8px;
                margin-bottom: 8px;
                align-items: center;
            }

            .display-size-info, .dropzone-info {
                grid-template-columns: auto 1fr;
            }

            .position-display label {
                font-size: 0.8rem;
                font-weight: bold;
                color: #555;
            }

            .position-display input {
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 5px;
                text-align: center;
                font-size: 0.85rem;
            }

            .editor-info {
                background: #E3F2FD;
                border-left: 4px solid #2196F3;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px;
            }

            .editor-info p {
                margin: 0;
                font-size: 0.85rem;
                color: #1565C0;
            }

            .code-output h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1rem;
            }

            #generated-code {
                width: 100%;
                height: 180px;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 10px;
                resize: vertical;
                margin-bottom: 10px;
            }

            .editor-btn-primary {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 8px;
                background: #2196F3;
                color: white;
                cursor: pointer;
                font-size: 0.95rem;
                font-weight: bold;
                font-family: 'Comic Sans MS', cursive;
                transition: background 0.3s;
            }

            .editor-btn-primary:hover {
                background: #1976D2;
            }

            /* Elementos Editables */
            .editable-element {
                position: absolute;
                border: 2px dashed rgba(76, 175, 80, 0.5);
                cursor: move;
                transition: border-color 0.2s;
                box-sizing: border-box;
                z-index: 100;
            }

            .editable-element:hover {
                border-color: #FFC107;
                border-style: solid;
                border-width: 3px;
            }

            .editable-element.selected {
                border: 3px solid #FF5722;
                border-style: solid;
                box-shadow: 0 0 15px rgba(255, 87, 34, 0.5);
            }

            .editable-element.dragging {
                opacity: 0.7;
                border-color: #2196F3;
                z-index: 1000;
            }

            .element-label {
                position: absolute;
                bottom: -28px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(76, 175, 80, 0.95);
                color: white;
                padding: 4px 10px;
                border-radius: 5px;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
                pointer-events: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            .element-label.hidden {
                display: none;
            }

            /* Punto Central (Cruz Roja) */
            .center-point {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 10;
            }

            .center-cross-h {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 2px;
                background: #FF5722;
                transform: translateY(-50%);
            }

            .center-cross-v {
                position: absolute;
                left: 50%;
                top: 0;
                bottom: 0;
                width: 2px;
                background: #FF5722;
                transform: translateX(-50%);
            }

            /* Handles de Redimensionamiento */
            .resize-handle {
                position: absolute;
                width: 14px;
                height: 14px;
                background: #4CAF50;
                border: 2px solid white;
                border-radius: 50%;
                z-index: 20;
                transition: all 0.2s;
            }

            .resize-handle:hover {
                background: #FFC107;
                transform: scale(1.4);
                box-shadow: 0 0 10px rgba(255, 193, 7, 0.8);
            }

            .resize-nw { top: -7px; left: -7px; cursor: nw-resize; }
            .resize-ne { top: -7px; right: -7px; cursor: ne-resize; }
            .resize-sw { bottom: -7px; left: -7px; cursor: sw-resize; }
            .resize-se { bottom: -7px; right: -7px; cursor: se-resize; }

            /* Grid del Editor */
            .editor-grid {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 10%, rgba(0,0,0,0.15) calc(10% + 1px)),
                    repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 10%, rgba(0,0,0,0.15) calc(10% + 1px));
                pointer-events: none;
                z-index: 50;
            }

            .editor-grid.hidden {
                display: none;
            }

            /* Botón flotante para abrir editor */
            #open-editor-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                padding: 15px 25px;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 16px;
                font-family: 'Comic Sans MS', cursive;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
                transition: all 0.3s;
            }

            #open-editor-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
            }

            #open-editor-btn:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Variable global para el editor
let scenarioEditor = null;

// Función para abrir el editor
function openEditor(scenarioKey = 'casa') {
    // Ocultar botón de abrir
    const btn = document.getElementById('open-editor-btn');
    if (btn) btn.style.display = 'none';

    // Crear e inicializar editor
    scenarioEditor = new ScenarioEditor();
    scenarioEditor.init(scenarioKey);
}

// Agregar botón flotante para abrir el editor cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Crear botón solo si estamos en modo desarrollo (localhost o 127.0.0.1)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.includes('192.168');
    
    // Siempre mostrar el botón (comentar la línea anterior si solo quieres en localhost)
    // if (isLocalhost) {
        const editorToggle = document.createElement('button');
        editorToggle.id = 'open-editor-btn';
        editorToggle.textContent = '🎨 Abrir Editor';
        editorToggle.onclick = () => openEditor('casa');
        document.body.appendChild(editorToggle);
    // }
});
