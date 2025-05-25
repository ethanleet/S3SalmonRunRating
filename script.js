// --- Define global assets ---
let gameDefinitions = {};

async function loadGameDefinitions() {
    try {
        const response = await fetch('data/definitions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        gameDefinitions = await response.json();
        console.log("Game definitions loaded:", gameDefinitions);
    } catch (error) {
        console.error("Could not load game definitions:", error);
        throw error; // Re-throw to stop further execution if critical
    }
}

function initializeAppUI() {
    // --- DOM Elements ---
    const stageSelect = document.getElementById('stage-select');
    const stageIcon = document.getElementById('stage-icon');
    const weaponCheckboxContainer = document.getElementById('weapon-checkbox-container');
    const confirmButton = document.getElementById('confirm-button');
    const predictedRatingDisplay = document.getElementById('predicted-rating');

    // --- ONNX Model Variables ---
    let onnxSession = null;
    const onnxModelPath = 'data/model.onnx';

    // --- Other local variables ---
    const defaultIcon = "images/placeholder.png";
    let selectedWeapons = new Set();


    function updateIcon(selectElement, iconElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const iconPath = selectedOption && selectedOption.dataset.icon ? selectedOption.dataset.icon : defaultIcon;
        iconElement.src = iconPath;
        iconElement.alt = selectedOption ? selectedOption.textContent + " icon" : "Icon";
    }

    function updateConfirmButtonState() {
        if (!onnxSession) {
            confirmButton.disabled = true;
            return;
        }
        confirmButton.disabled = selectedWeapons.size !== 4;
    }

    stageSelect.addEventListener('change', () => updateIcon(stageSelect, stageIcon));

    function populateStageDropdown() {
        gameDefinitions.stages.forEach(stage => {
            const option = document.createElement('option');
            option.value = stage.id;
            option.textContent = stage.name;
            option.dataset.icon = stage.icon;
            stageSelect.appendChild(option);
        });
    }

    function handleWeaponSelection(event) {
        const weaponEl = event.currentTarget;
        const weaponId = weaponEl.dataset.weaponId;
        
        if (selectedWeapons.has(weaponId)) {
            selectedWeapons.delete(weaponId);
            weaponEl.classList.remove('selected');
            weaponEl.setAttribute('aria-checked', 'false');
        } else {
            if (selectedWeapons.size < 4) {
                selectedWeapons.add(weaponId);
                weaponEl.classList.add('selected');
                weaponEl.setAttribute('aria-checked', 'true');
            } else {
                alert("You can only select up to 4 weapons. Please deselect one if you wish to choose another.");
            }
        }
        updateConfirmButtonState();
    }

    function populateWeaponCheckboxes() {
        weaponCheckboxContainer.innerHTML = '';
        gameDefinitions.weapons.forEach(weapon => {
            if (weapon.id === 'wildcard') return;
            
            const weaponEl = document.createElement('div');
            weaponEl.classList.add('weapon-checkbox-item');
            weaponEl.dataset.weaponId = weapon.id;
            weaponEl.setAttribute('role', 'checkbox');
            weaponEl.setAttribute('aria-checked', 'false');
            weaponEl.tabIndex = 0; // Make it focusable
            
            const img = document.createElement('img');
            img.src = weapon.icon || defaultIcon;
            img.alt = weapon.name;
            img.classList.add('weapon-item-icon');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = weapon.name;
            nameSpan.classList.add('weapon-item-name');
            
            weaponEl.appendChild(img);
            weaponEl.appendChild(nameSpan);
            
            weaponEl.addEventListener('click', handleWeaponSelection);
            weaponEl.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleWeaponSelection(e);
                }
            });
            weaponCheckboxContainer.appendChild(weaponEl);
        });
    }

    populateStageDropdown();
    updateIcon(stageSelect, stageIcon);
    populateWeaponCheckboxes();

    function convertSelectionsToFeatures(stageId, weaponIds) {
        const features = [];
        const numExpectedFeatures = 71; // Hard-coded based on training

        // One-hot encode stage
        const stageIndex = gameDefinitions.stages.findIndex(s => s.id === stageId);
        gameDefinitions.stages.forEach((stage, index) => {
            features.push(index === stageIndex ? 1.0 : 0.0);
        });

        // Multi-hot encode weapons
        const weaponIndices = []
        weaponIds.forEach(weaponId => {
            weaponIndices.push(gameDefinitions.weapons.findIndex(w => w.id === weaponId));
        })
        gameDefinitions.weapons.forEach((weapon, index) => {
            features.push(weaponIndices.includes(index) ? 1.0 : 0.0);
        })

        if (features.length !== numExpectedFeatures) {
            const errorMessage = `Feature mismatch: Expected ${numExpectedFeatures} features, but generated ${features.length}. Please check 'convertSelectionsToFeatures' and 'numExpectedFeatures'.`;
            console.error(errorMessage);
            alert(`Critical Error: ${errorMessage}`);
            return null;
        }

        console.log("Generated features for ONNX:", features);
        return new Float32Array(features);
    }

    confirmButton.addEventListener('click', async () => {
        if (!onnxSession) {
            predictedRatingDisplay.textContent = "Model not loaded yet. Please wait or refresh.";
            console.warn("Prediction attempted before ONNX session was ready.");
            return;
        }

        const selectedStageId = stageSelect.value;
        const selectedWeaponIds = Array.from(selectedWeapons);

        const features = convertSelectionsToFeatures(selectedStageId, selectedWeaponIds);
        if (!features) {
            predictedRatingDisplay.textContent = "Error preparing input data for the model.";
            return;
        }

        const inputName = onnxSession.inputNames[0];
        const feeds = { [inputName]: new ort.Tensor('float32', features, [1, features.length]) };

        try {
            const results = await onnxSession.run(feeds);
            // --- PROCESS OUTPUTS ---

            console.log("ONNX Results:", results);

            let rating;
            const outputKey = onnxSession.outputNames[0];
            if (results[outputKey] && results[outputKey].data) {
                rating = results[outputKey].data[0];
            } else if (results.output_label && results.output_label.data) {
                rating = results.output_label.data[0];
            } else if (results.variable && results.variable.data) {
                rating = results.variable.data[0];
            } else {
                // Fallback if common names aren't found, try the first key if it exists
                const fallbackOutputKey = Object.keys(results)[0];
                if (fallbackOutputKey && results[fallbackOutputKey] && results[fallbackOutputKey].data) {
                    rating = results[fallbackOutputKey].data[0];
                    console.warn(`Used fallback output key: ${fallbackOutputKey}`);
                } else {
                    console.error("Could not determine or access output tensor in ONNX results:", results);
                    predictedRatingDisplay.textContent = "Error: Prediction output format unknown.";
                    return;
                }
            }

            console.log("Parsed rating without roundoff:", rating);
            predictedRatingDisplay.textContent = `${parseFloat(rating).toFixed(1)}`;
        } catch (e) {
            console.error("Error during ONNX inference:", e);
            predictedRatingDisplay.textContent = "Error: Prediction failed.";
        }

        // Scroll to results
        const resultsArea = document.getElementById('results-area');
        if (resultsArea) {
            resultsArea.scrollIntoView({ behavior: 'smooth' });
        }
    });

    async function loadOnnxModel() {
        if (onnxSession) return onnxSession;
        try {
            onnxSession = await ort.InferenceSession.create(onnxModelPath);
            console.log("ONNX Model loaded successfully.");
            document.getElementById('confirm-button').disabled = false;
            document.getElementById('confirm-button').textContent = "Predict Difficulty";
            updateConfirmButtonState();
            return onnxSession;
        } catch (e) {
            console.error("Failed to load ONNX model:", e);
            predictedRatingDisplay.textContent = "Error: Could not load model.";
            document.getElementById('confirm-button').textContent = "Model Load Failed";
            return null;
        }
    }

    // --- INITIAL PAGE SETUP ---
    confirmButton.disabled = true;
    confirmButton.textContent = "Loading Model...";

    loadOnnxModel();
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadGameDefinitions();
        
        initializeAppUI();
        
    } catch (error) {
        console.error("Failed to initialize the application:", error);
        document.body.innerHTML = '<p style="text-align:center; padding:20px;">Sorry, the application could not be started. Please try again later.</p>';
    }
});
