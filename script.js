document.addEventListener('DOMContentLoaded', () => {
    const stages = [
        { id: "spawning_grounds", name: "Spawning Grounds", icon: "images/stages/64px-S3_Badge_Spawning_Grounds_200.png" },
        { id: "sockeye_station", name: "Sockeye Station", icon: "images/stages/sockeye_station.png" },
        { id: "salmonid_smokeyard", name: "Salmonid Smokeyard", icon: "images/stages/sockeye_station.png" },
        { id: "marooners_bay", name: "Marooner's Bay", icon: "images/stages/marooners_bay.png" },
        { id: "gone_fission_hydroplant", name: "Gone Fission Hydroplant", icon: "images/stages/gone_fission_hydroplant.png" },
        { id: "jammin_salmon_junction", name: "Jammin' Salmon Junction", icon: "images/stages/jammin_salmon_junction.png" },
        { id: "bonerattle_arena", name: "Bonerattle Arena", icon: "images/stages/gone_fission_hydroplant.png" },
    ];

    const weapons = [
        { id: "sploosh_o_matic", name: "Sploosh-o-matic", icon: "images/weapons/splattershot.png" },
        { id: "splattershot_jr", name: "Splattershot Jr.", icon: "images/weapons/splattershot.png" },
        { id: "splash_o_matic", name: "Splash-o-matic", icon: "images/weapons/splattershot.png" },
        { id: "aerospray_mg", name: "Aerospray MG", icon: "images/weapons/splattershot.png" },
        { id: "splattershot", name: "Splattershot", icon: "images/weapons/splattershot.png" },
        { id: "52_gal", name: ".52 Gal", icon: "images/weapons/splat_roller.png" },
        { id: "nzap_85", name: "N-ZAP '85", icon: "images/weapons/splat_charger.png" },
        { id: "splattershot_pro", name: "Splattershot Pro", icon: "images/weapons/heavy_splatling.png" },
        { id: "96_gal", name: ".96 Gal", icon: "images/weapons/grizzco_blaster.png" },
        { id: "jet_squelcher", name: "Jet Squelcher", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splattershot_nova", name: "Splattershot Nova", icon: "images/weapons/grizzco_blaster.png" },
        { id: "l3_nozzlenose", name: "L-3 Nozzlenose", icon: "images/weapons/grizzco_blaster.png" },
        { id: "h3_nozzlenose", name: "H-3 Nozzlenose", icon: "images/weapons/grizzco_blaster.png" },
        { id: "squeezer", name: "Squeezer", icon: "images/weapons/grizzco_blaster.png" },
        { id: "luna_blaster", name: "Luna Blaster", icon: "images/weapons/grizzco_blaster.png" },
        { id: "blaster", name: "Blaster", icon: "images/weapons/grizzco_blaster.png" },
        { id: "range_blaster", name: "Range Blaster", icon: "images/weapons/grizzco_blaster.png" },
        { id: "clash_blaster", name: "Clash Blaster", icon: "images/weapons/grizzco_blaster.png" },
        { id: "rapid_blaster", name: "Rapid Blaster", icon: "images/weapons/grizzco_blaster.png" },
        { id: "rapid_blaster_pro", name: "Rapid Blaster Pro", icon: "images/weapons/grizzco_blaster.png" },
        { id: "sblast_92", name: "S-BLAST '92", icon: "images/weapons/grizzco_blaster.png" },
        { id: "carbon_roller", name: "Carbon Roller", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splat_roller", name: "Splat Roller", icon: "images/weapons/grizzco_blaster.png" },
        { id: "dynamo_roller", name: "Dynamo Roller", icon: "images/weapons/grizzco_blaster.png" },
        { id: "flingza_roller", name: "Flingza Roller", icon: "images/weapons/grizzco_blaster.png" },
        { id: "big_swig_roller", name: "Big Swig Roller", icon: "images/weapons/grizzco_blaster.png" },
        { id: "inkbrush", name: "Inkbrush", icon: "images/weapons/grizzco_blaster.png" },
        { id: "octobrush", name: "Octobrush", icon: "images/weapons/grizzco_blaster.png" },
        { id: "painbrush", name: "Painbrush", icon: "images/weapons/grizzco_blaster.png" },
        { id: "classic_squiffer", name: "Classic Squiffer", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splat_charger", name: "Splat Charger", icon: "images/weapons/grizzco_blaster.png" },
        { id: "eliter_4k", name: "E-liter 4K", icon: "images/weapons/grizzco_blaster.png" },
        { id: "bamboozler_14_mk_i", name: "Bamboozler 14 Mk I", icon: "images/weapons/grizzco_blaster.png" },
        { id: "goo_tuber", name: "Goo Tuber", icon: "images/weapons/grizzco_blaster.png" },
        { id: "snipewriter_5h", name: "Snipewriter 5H", icon: "images/weapons/grizzco_blaster.png" },
        { id: "slosher", name: "Slosher", icon: "images/weapons/grizzco_blaster.png" },
        { id: "tri_slosher", name: "Tri-Slosher", icon: "images/weapons/grizzco_blaster.png" },
        { id: "sloshing_machine", name: "Sloshing Machine", icon: "images/weapons/grizzco_blaster.png" },
        { id: "bloblobber", name: "Bloblobber", icon: "images/weapons/grizzco_blaster.png" },
        { id: "explosher", name: "Explosher", icon: "images/weapons/grizzco_blaster.png" },
        { id: "dread_wringer", name: "Dread Wringer", icon: "images/weapons/grizzco_blaster.png" },
        { id: "mini_splatling", name: "Mini Splatling", icon: "images/weapons/grizzco_blaster.png" },
        { id: "heavy_splatling", name: "Heavy Splatling", icon: "images/weapons/grizzco_blaster.png" },
        { id: "hydra_splatling", name: "Hydra Splatling", icon: "images/weapons/grizzco_blaster.png" },
        { id: "ballpoint_splatling", name: "Ballpoint Splatling", icon: "images/weapons/grizzco_blaster.png" },
        { id: "nautilus_47", name: "Nautilus 47", icon: "images/weapons/grizzco_blaster.png" },
        { id: "heavy_edit_splatling", name: "Heavy Edit Splatling", icon: "images/weapons/grizzco_blaster.png" },
        { id: "dapple_dualies", name: "Dapple Dualies", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splat_dualies", name: "Splat Dualies", icon: "images/weapons/grizzco_blaster.png" },
        { id: "glooga_dualies", name: "Glooga Dualies", icon: "images/weapons/grizzco_blaster.png" },
        { id: "dualie_squelchers", name: "Dualie Squelchers", icon: "images/weapons/grizzco_blaster.png" },
        { id: "dark_tetra_dualies", name: "Dark Tetra Dualies", icon: "images/weapons/grizzco_blaster.png" },
        { id: "douser_dualies_ff", name: "Douser Dualies FF", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splat_brella", name: "Splat Brella", icon: "images/weapons/grizzco_blaster.png" },
        { id: "tenta_brella", name: "Tenta Brella", icon: "images/weapons/grizzco_blaster.png" },
        { id: "undercover_brella", name: "Undercover Brella", icon: "images/weapons/grizzco_blaster.png" },
        { id: "recycled_brella_24_mk_i", name: "Recycled Brella 24 Mk I", icon: "images/weapons/grizzco_blaster.png" },
        { id: "tri_stringer", name: "Tri-Stringer", icon: "images/weapons/grizzco_blaster.png" },
        { id: "reeflux_450", name: "REEF-LUX 450", icon: "images/weapons/grizzco_blaster.png" },
        { id: "wellstring_v", name: "Wellstring V", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splatana_stamper", name: "Splatana Stamper", icon: "images/weapons/grizzco_blaster.png" },
        { id: "splatana_wiper", name: "Splatana Wiper", icon: "images/weapons/grizzco_blaster.png" },
        { id: "mint_decavitator", name: "Mint Decavitator", icon: "images/weapons/grizzco_blaster.png" },
        { id: "wildcard", name: "Wildcard", icon: "images/placeholder.png" },
    ];

    const defaultIcon = "images/placeholder.png";

    // --- DOM Elements ---
    const stageSelect = document.getElementById('stage-select');
    const stageIcon = document.getElementById('stage-icon');
    const weaponSelects = [
        document.getElementById('weapon1-select'),
        document.getElementById('weapon2-select'),
        document.getElementById('weapon3-select'),
        document.getElementById('weapon4-select')
    ];
    const weaponIcons = [
        document.getElementById('weapon1-icon'),
        document.getElementById('weapon2-icon'),
        document.getElementById('weapon3-icon'),
        document.getElementById('weapon4-icon')
    ];
    const confirmButton = document.getElementById('confirm-button');
    const predictedRatingDisplay = document.getElementById('predicted-rating');

    // --- ONNX Model Variables ---
    let onnxSession = null;
    const onnxModelPath = 'data/model.onnx';


    function updateIcon(selectElement, iconElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const iconPath = selectedOption && selectedOption.dataset.icon ? selectedOption.dataset.icon : defaultIcon;
        iconElement.src = iconPath;
        iconElement.alt = selectedOption ? selectedOption.textContent + " icon" : "Icon";
    }

    stageSelect.addEventListener('change', () => updateIcon(stageSelect, stageIcon));
    weaponSelects.forEach((select, index) => {
        select.addEventListener('change', () => updateIcon(select, weaponIcons[index]));
    });

    function populateDropdowns() {
        stages.forEach(stage => {
            const option = document.createElement('option');
            option.value = stage.id;
            option.textContent = stage.name;
            option.dataset.icon = stage.icon;
            stageSelect.appendChild(option);
        });

        weaponSelects.forEach(select => {
            weapons.forEach(weapon => {
                if (weapon.id === 'wildcard') return;
                const option = document.createElement('option');
                option.value = weapon.id;
                option.textContent = weapon.name;
                option.dataset.icon = weapon.icon;
                select.appendChild(option);
            });
        });
    }

    function initializeSelectionsAndIcons() {
        populateDropdowns();
        updateIcon(stageSelect, stageIcon);
        weaponSelects.forEach((select, index) => updateIcon(select, weaponIcons[index]));
    }

    initializeSelectionsAndIcons();

    function convertSelectionsToFeatures(stageId, weaponIds) {
        const features = [];
        const numExpectedFeatures = 71;

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
        const selectedWeaponIds = weaponSelects.map(select => select.value);

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