// --- Define global assets ---
let gameDefinitions = {};
let translations = {};
let currentLanguage = 'en';
const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
];

async function loadGameDefinitions() {
    try {
        const response = await fetch('data/definitions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        gameDefinitions = await response.json();
        console.log("Game definitions loaded:", gameDefinitions);
    } catch (error) {
        console.error("Could not load game definitions:", error);
        throw error; // Re-throw critical error
    }
}

async function loadTranslations(lang = 'en') {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        translations = await response.json();
        currentLanguage = lang;
        console.log(`Translations for ${lang} loaded:`, translations);
        // Store user's language preference
        localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
        console.error(`Could not load translations for ${lang}:`, error);
        if (lang !== 'en') {
            console.warn("Falling back to English translations.");
            await loadTranslations('en'); // Recursive call, ensure base 'en.json' exists
        } else {
            throw error; // Re-throw critical error
        }
    }
}

function initializeAppUI() {
    // --- DOM Elements ---
    const languageSwitcher = document.getElementById('language-switcher');
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


    function applyAllUIText() {
        if (!translations.ui) {
            console.error("UI translations not loaded.");
            return;
        }
        document.title = translations.ui.pageTitle;
        document.querySelector('header h1').textContent = translations.ui.headerTitle;
        document.querySelector('section#selection-area h2').textContent = translations.ui.selectStageWeaponsTitle;
        document.querySelector('label[for="stage-select"]').textContent = translations.ui.stageLabel;
        document.querySelector('label[for="weapon-checkbox-container"]').textContent = translations.ui.select4WeaponsLabel;
        confirmButton.textContent = translations.ui.predictButton;
        document.querySelector('section#results-area h2').textContent = translations.ui.predictedRatingTitle;

        // Footer text
        const footer = document.querySelector('footer');
        const footerDisclaimer = footer.querySelector('p:first-child');
        if (footerDisclaimer) footerDisclaimer.textContent = translations.ui.footerDisclaimer;

        populateStageDropdown();
        populateWeaponCheckboxes();
    }

    async function handleLanguageChange(event) {
        const newLangCode = event.target.value;
        if (newLangCode === currentLanguage) return;
        try {
            await loadTranslations(newLangCode);
            localStorage.setItem('preferredLanguage', newLangCode);

            applyAllUIText();
            document.getElementById('language-switcher').value = currentLanguage;
        } catch (error) {
            console.error("Error switching language:", error);
        }
    }

    function populateLanguageSwitcher() {
        const switcher = document.getElementById('language-switcher');
        if (!switcher) {
            console.warn("Language switcher element not found.");
            return;
        }

        switcher.innerHTML = ''; // Clear any existing options

        supportedLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            switcher.appendChild(option);
        });

        switcher.value = currentLanguage;
    }

    function updateIcon(selectElement, iconElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const iconPath = selectedOption && selectedOption.dataset.icon ? selectedOption.dataset.icon : defaultIcon;
        iconElement.src = iconPath;
        iconElement.alt = selectedOption ? selectedOption.textContent + " icon" : "Icon";
    }

    function populateStageDropdown() {
        stageSelect.innerHTML = '';
        gameDefinitions.stages.forEach(stage => {
            const option = document.createElement('option');
            option.value = stage.id;
            option.textContent = translations.stageNames[stage.id] || stage.id;
            option.dataset.icon = stage.icon;
            stageSelect.appendChild(option);
        });
        updateIcon(stageSelect, stageIcon);
    }

    function updateConfirmButtonState() {
        if (!onnxSession) {
            confirmButton.disabled = true;
            return;
        }
        confirmButton.disabled = selectedWeapons.size !== 4;
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
                alert(translations.ui.maxWeaponsAlert);
            }
        }
        updateConfirmButtonState();
    }

    function populateWeaponCheckboxes() {
        weaponCheckboxContainer.innerHTML = '';
        selectedWeapons.clear();
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
            img.alt = translations.weaponNames[weapon.id] || weapon.id;
            img.classList.add('weapon-item-icon');
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = translations.weaponNames[weapon.id] || weapon.id;
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

    languageSwitcher.addEventListener('change', handleLanguageChange);
    stageSelect.addEventListener('change', () => updateIcon(stageSelect, stageIcon));

    populateLanguageSwitcher();
    applyAllUIText();
    

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
            predictedRatingDisplay.textContent = translations.ui.modelNotLoadedError;
            console.warn("Prediction attempted before ONNX session was ready.");
            return;
        }

        const selectedStageId = stageSelect.value;
        const selectedWeaponIds = Array.from(selectedWeapons);

        const features = convertSelectionsToFeatures(selectedStageId, selectedWeaponIds);
        if (!features) {
            predictedRatingDisplay.textContent = translations.ui.errorPreparingData;
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
                    predictedRatingDisplay.textContent = translations.ui.errorOutputFormatUnknown;
                    return;
                }
            }

            console.log("Parsed rating without roundoff:", rating);
            predictedRatingDisplay.textContent = `${parseFloat(rating).toFixed(1)} / 10`;
        } catch (e) {
            console.error("Error during ONNX inference:", e);
            predictedRatingDisplay.textContent = translations.ui.errorPredictionFailed;
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
            document.getElementById('confirm-button').textContent = translations.ui.predictButton;
            updateConfirmButtonState();
            return onnxSession;
        } catch (e) {
            console.error("Failed to load ONNX model:", e);
            predictedRatingDisplay.textContent = translations.ui.errorModelLoad;
            document.getElementById('confirm-button').textContent = translations.ui.predictButtonFailure;
            return null;
        }
    }

    // --- INITIAL PAGE SETUP ---
    confirmButton.disabled = true;
    confirmButton.textContent = translations.ui.predictButtonLoading;

    loadOnnxModel();
}

document.addEventListener('DOMContentLoaded', async () => {
    currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

    try {
        await loadGameDefinitions();
        await loadTranslations(currentLanguage);
        
        initializeAppUI();
        
    } catch (error) {
        console.error("Failed to initialize the application:", error);
        document.body.innerHTML = '<p style="text-align:center; padding:20px;">Sorry, the application could not be started. Please try again later.</p>';
    }
});
