document.addEventListener('DOMContentLoaded', () => {
    const stages = [
        { id: "spawning_grounds", name: "Spawning Grounds", icon: "images/stages/64px-S3_Badge_Spawning_Grounds_200.png" },
        { id: "sockeye_station", name: "Sockeye Station", icon: "images/stages/64px-S3_Badge_Sockeye_Station_200.png" },
        { id: "salmonid_smokeyard", name: "Salmonid Smokeyard", icon: "images/stages/64px-S3_Badge_Salmonid_Smokeyard_200.png" },
        { id: "marooners_bay", name: "Marooner's Bay", icon: "images/stages/64px-S3_Badge_Marooner's_Bay_200.png" },
        { id: "gone_fission_hydroplant", name: "Gone Fission Hydroplant", icon: "images/stages/64px-S3_Badge_Gone_Fission_Hydroplant_200.png" },
        { id: "jammin_salmon_junction", name: "Jammin' Salmon Junction", icon: "images/stages/64px-S3_Badge_Jammin'_Salmon_Junction_200.png" },
        { id: "bonerattle_arena", name: "Bonerattle Arena", icon: "images/stages/64px-S3_Badge_Bonerattle_Arena_200.png" },
    ];

    const weapons = [
        { id: "sploosh_o_matic", name: "Sploosh-o-matic", icon: "images/weapons/64px-S3_Badge_Sploosh-o-matic_4.png" },
        { id: "splattershot_jr", name: "Splattershot Jr.", icon: "images/weapons/64px-S3_Badge_Splattershot_Jr._4.png" },
        { id: "splash_o_matic", name: "Splash-o-matic", icon: "images/weapons/64px-S3_Badge_Splash-o-matic_4.png" },
        { id: "aerospray_mg", name: "Aerospray MG", icon: "images/weapons/64px-S3_Badge_Aerospray_MG_4.png" },
        { id: "splattershot", name: "Splattershot", icon: "images/weapons/64px-S3_Badge_Splattershot_4.png" },
        { id: "52_gal", name: ".52 Gal", icon: "images/weapons/64px-S3_Badge_.52_Gal_4.png" },
        { id: "nzap_85", name: "N-ZAP '85", icon: "images/weapons/64px-S3_Badge_N-ZAP_'85_4.png" },
        { id: "splattershot_pro", name: "Splattershot Pro", icon: "images/weapons/64px-S3_Badge_Splattershot_Pro_4.png" },
        { id: "96_gal", name: ".96 Gal", icon: "images/weapons/64px-S3_Badge_.96_Gal_4.png" },
        { id: "jet_squelcher", name: "Jet Squelcher", icon: "images/weapons/64px-S3_Badge_Jet_Squelcher_4.png" },
        { id: "splattershot_nova", name: "Splattershot Nova", icon: "images/weapons/64px-S3_Badge_Splattershot_Nova_4.png" },
        { id: "l3_nozzlenose", name: "L-3 Nozzlenose", icon: "images/weapons/64px-S3_Badge_L-3_Nozzlenose_4.png" },
        { id: "h3_nozzlenose", name: "H-3 Nozzlenose", icon: "images/weapons/64px-S3_Badge_H-3_Nozzlenose_4.png" },
        { id: "squeezer", name: "Squeezer", icon: "images/weapons/64px-S3_Badge_Squeezer_4.png" },
        { id: "luna_blaster", name: "Luna Blaster", icon: "images/weapons/64px-S3_Badge_Luna_Blaster_4.png" },
        { id: "blaster", name: "Blaster", icon: "images/weapons/64px-S3_Badge_Blaster_4.png" },
        { id: "range_blaster", name: "Range Blaster", icon: "images/weapons/64px-S3_Badge_Range_Blaster_4.png" },
        { id: "clash_blaster", name: "Clash Blaster", icon: "images/weapons/64px-S3_Badge_Clash_Blaster_4.png" },
        { id: "rapid_blaster", name: "Rapid Blaster", icon: "images/weapons/64px-S3_Badge_Rapid_Blaster_4.png" },
        { id: "rapid_blaster_pro", name: "Rapid Blaster Pro", icon: "images/weapons/64px-S3_Badge_Rapid_Blaster_Pro_4.png" },
        { id: "sblast_92", name: "S-BLAST '92", icon: "images/weapons/64px-S3_Badge_S-BLAST_'92_4.png" },
        { id: "carbon_roller", name: "Carbon Roller", icon: "images/weapons/64px-S3_Badge_Carbon_Roller_4.png" },
        { id: "splat_roller", name: "Splat Roller", icon: "images/weapons/64px-S3_Badge_Splat_Roller_4.png" },
        { id: "dynamo_roller", name: "Dynamo Roller", icon: "images/weapons/64px-S3_Badge_Dynamo_Roller_4.png" },
        { id: "flingza_roller", name: "Flingza Roller", icon: "images/weapons/64px-S3_Badge_Flingza_Roller_4.png" },
        { id: "big_swig_roller", name: "Big Swig Roller", icon: "images/weapons/64px-S3_Badge_Big_Swig_Roller_4.png" },
        { id: "inkbrush", name: "Inkbrush", icon: "images/weapons/64px-S3_Badge_Inkbrush_4.png" },
        { id: "octobrush", name: "Octobrush", icon: "images/weapons/64px-S3_Badge_Octobrush_4.png" },
        { id: "painbrush", name: "Painbrush", icon: "images/weapons/64px-S3_Badge_Painbrush_4.png" },
        { id: "classic_squiffer", name: "Classic Squiffer", icon: "images/weapons/64px-S3_Badge_Classic_Squiffer_4.png" },
        { id: "splat_charger", name: "Splat Charger", icon: "images/weapons/64px-S3_Badge_Splat_Charger_4.png" },
        { id: "eliter_4k", name: "E-liter 4K", icon: "images/weapons/64px-S3_Badge_E-liter_4K_4.png" },
        { id: "bamboozler_14_mk_i", name: "Bamboozler 14 Mk I", icon: "images/weapons/64px-S3_Badge_Bamboozler_14_Mk_I_4.png" },
        { id: "goo_tuber", name: "Goo Tuber", icon: "images/weapons/64px-S3_Badge_Goo_Tuber_4.png" },
        { id: "snipewriter_5h", name: "Snipewriter 5H", icon: "images/weapons/64px-S3_Badge_Snipewriter_5H_4.png" },
        { id: "slosher", name: "Slosher", icon: "images/weapons/64px-S3_Badge_Slosher_4.png" },
        { id: "tri_slosher", name: "Tri-Slosher", icon: "images/weapons/64px-S3_Badge_Tri-Slosher_4.png" },
        { id: "sloshing_machine", name: "Sloshing Machine", icon: "images/weapons/64px-S3_Badge_Sloshing_Machine_4.png" },
        { id: "bloblobber", name: "Bloblobber", icon: "images/weapons/64px-S3_Badge_Bloblobber_4.png" },
        { id: "explosher", name: "Explosher", icon: "images/weapons/64px-S3_Badge_Explosher_4.png" },
        { id: "dread_wringer", name: "Dread Wringer", icon: "images/weapons/64px-S3_Badge_Dread_Wringer_4.png" },
        { id: "mini_splatling", name: "Mini Splatling", icon: "images/weapons/64px-S3_Badge_Mini_Splatling_4.png" },
        { id: "heavy_splatling", name: "Heavy Splatling", icon: "images/weapons/64px-S3_Badge_Heavy_Splatling_4.png" },
        { id: "hydra_splatling", name: "Hydra Splatling", icon: "images/weapons/64px-S3_Badge_Hydra_Splatling_4.png" },
        { id: "ballpoint_splatling", name: "Ballpoint Splatling", icon: "images/weapons/64px-S3_Badge_Ballpoint_Splatling_4.png" },
        { id: "nautilus_47", name: "Nautilus 47", icon: "images/weapons/64px-S3_Badge_Nautilus_47_4.png" },
        { id: "heavy_edit_splatling", name: "Heavy Edit Splatling", icon: "images/weapons/64px-S3_Badge_Heavy_Edit_Splatling_4.png" },
        { id: "dapple_dualies", name: "Dapple Dualies", icon: "images/weapons/64px-S3_Badge_Dapple_Dualies_4.png" },
        { id: "splat_dualies", name: "Splat Dualies", icon: "images/weapons/64px-S3_Badge_Splat_Dualies_4.png" },
        { id: "glooga_dualies", name: "Glooga Dualies", icon: "images/weapons/64px-S3_Badge_Glooga_Dualies_4.png" },
        { id: "dualie_squelchers", name: "Dualie Squelchers", icon: "images/weapons/64px-S3_Badge_Dualie_Squelchers_4.png" },
        { id: "dark_tetra_dualies", name: "Dark Tetra Dualies", icon: "images/weapons/64px-S3_Badge_Dark_Tetra_Dualies_4.png" },
        { id: "douser_dualies_ff", name: "Douser Dualies FF", icon: "images/weapons/64px-S3_Badge_Douser_Dualies_FF_4.png" },
        { id: "splat_brella", name: "Splat Brella", icon: "images/weapons/64px-S3_Badge_Splat_Brella_4.png" },
        { id: "tenta_brella", name: "Tenta Brella", icon: "images/weapons/64px-S3_Badge_Tenta_Brella_4.png" },
        { id: "undercover_brella", name: "Undercover Brella", icon: "images/weapons/64px-S3_Badge_Undercover_Brella_4.png" },
        { id: "recycled_brella_24_mk_i", name: "Recycled Brella 24 Mk I", icon: "images/weapons/64px-S3_Badge_Recycled_Brella_24_Mk_I_4.png" },
        { id: "tri_stringer", name: "Tri-Stringer", icon: "images/weapons/64px-S3_Badge_Tri-Stringer_4.png" },
        { id: "reeflux_450", name: "REEF-LUX 450", icon: "images/weapons/64px-S3_Badge_REEF-LUX_450_4.png" },
        { id: "wellstring_v", name: "Wellstring V", icon: "images/weapons/64px-S3_Badge_Wellstring_V_4.png" },
        { id: "splatana_stamper", name: "Splatana Stamper", icon: "images/weapons/64px-S3_Badge_Splatana_Stamper_4.png" },
        { id: "splatana_wiper", name: "Splatana Wiper", icon: "images/weapons/64px-S3_Badge_Splatana_Wiper_4.png" },
        { id: "mint_decavitator", name: "Mint Decavitator", icon: "images/weapons/64px-S3_Badge_Mint_Decavitator_4.png" },
        { id: "wildcard", name: "Wildcard", icon: "" },
    ];

    const defaultIcon = "images/placeholder.png";

    // --- DOM Elements ---
    const stageSelect = document.getElementById('stage-select');
    const stageIcon = document.getElementById('stage-icon');
    const weaponCheckboxContainer = document.getElementById('weapon-checkbox-container');
    const confirmButton = document.getElementById('confirm-button');
    const predictedRatingDisplay = document.getElementById('predicted-rating');

    // --- ONNX Model Variables ---
    let onnxSession = null;
    const onnxModelPath = 'data/model.onnx';
    
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
        stages.forEach(stage => {
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
        weapons.forEach(weapon => {
            if (weapon.id === 'wildcard') return; // Skip wildcard
            
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

    function initializeSelectionsAndIcons() {
        populateStageDropdown();
        updateIcon(stageSelect, stageIcon);
        populateWeaponCheckboxes();
    }

    initializeSelectionsAndIcons();

    function convertSelectionsToFeatures(stageId, weaponIds) {
        const features = [];
        const numExpectedFeatures = stages.length + weapons.length;

        // One-hot encode stage
        const stageIndex = stages.findIndex(s => s.id === stageId);
        stages.forEach((stage, index) => {
            features.push(index === stageIndex ? 1.0 : 0.0);
        });

        // Multi-hot encode weapons
        const weaponIndices = []
        weaponIds.forEach(weaponId => {
            weaponIndices.push(weapons.findIndex(w => w.id === weaponId));
        })
        weapons.forEach((weapon, index) => {
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
});