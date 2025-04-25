import pandas as pd
import numpy as np
import joblib


try:
    # --- Load the necessary components ---
    trained_model = joblib.load('data/weights.joblib')
    stage_columns_from_training = joblib.load('data/columns/stage_columns.joblib')
    weapon_columns_from_training = joblib.load('data/columns/weapon_columns.joblib')
    all_training_columns = joblib.load('data/columns/all_training_columns.joblib')

except FileNotFoundError:
    print("Error: Model or column list files not found.")
    print("Please ensure all files exist.")
    exit()


def predict_difficulty(stage_name, weapons_list, model, stage_cols, weapon_cols, all_cols_ordered):
    """
    Predicts game difficulty based on interactive input.

    Args:
        stage_name (str): The name of the stage.
        weapons_list (list): A list containing exactly four weapon names (strings).
        model: The pre-trained machine learning model object.
        stage_cols (list): List of all stage column names from training data.
        weapon_cols (list): List of all weapon column names from training data.
        all_cols_ordered (list): List of all column names in the exact order
                                  the model was trained on.

    Returns:
        float: The predicted difficulty score, rounded to the nearest 0.5.
        Returns None if input is invalid.
    """
    if len(weapons_list) != 4:
        print("Error: Please provide exactly four weapon names.")
        return None
    if len(set(weapons_list)) != 4:
        print("Warning: Duplicate weapons provided. Ensure weapons are unique.")

    # --- 1. Create Input DataFrame (Single Row) ---
    # Use a dictionary to represent the single input row for preprocessing ease
    input_data = {'Stage': [stage_name]} # Wrap in list for DataFrame creation
    input_df = pd.DataFrame(input_data)

    # --- 2. Preprocess the Input ---

    # 2a. One-Hot Encode Stage
    # Use pd.get_dummies and reindex to ensure all training columns are present
    try:
        stage_encoded_input = pd.get_dummies(input_df[['Stage']], prefix='Stage')
        # Ensure all stage columns from training are present, fill missing with 0
        stage_encoded_input = stage_encoded_input.reindex(columns=stage_cols, fill_value=0)
    except Exception as e:
        print(f"Error encoding stage '{stage_name}': {e}. Is it a valid stage from training?")
        return None

    # 2b. Multi-Hot Encode Weapons
    # Create a Series of zeros indexed by all possible weapon columns
    weapon_encoded_input = pd.Series(0, index=weapon_cols)
    valid_weapons_found = 0
    for weapon in weapons_list:
        weapon_col_name = f"Weapon_{weapon}" # Match the prefix used in training
        if weapon_col_name in weapon_cols:
            weapon_encoded_input[weapon_col_name] = 1
            valid_weapons_found += 1
        else:
            print(f"Warning: Weapon '{weapon}' (column '{weapon_col_name}') was not seen during training and will be ignored.")

    # Check if enough valid weapons were found
    if valid_weapons_found < 4:
        print(f"Warning: Only {valid_weapons_found} valid weapons processed.")

    # Convert the weapon Series to a DataFrame row
    weapon_encoded_input_df = pd.DataFrame([weapon_encoded_input]) # Wrap Series in list

    # --- 3. Combine and Ensure Column Order ---
    # Combine encoded stage and weapons
    combined_input = pd.concat([stage_encoded_input, weapon_encoded_input_df], axis=1)

    # **Crucial:** Reindex to match the exact column order used for training
    processed_input = combined_input.reindex(columns=all_cols_ordered, fill_value=0)

    # --- 4. Predict ---
    try:
        prediction_raw = model.predict(processed_input)[0] # Get the single prediction value
    except Exception as e:
        print(f"Error during model prediction: {e}")
        return None

    # --- 5. Round and Return ---
    prediction_rounded = (prediction_raw * 2).round() / 2
    return prediction_rounded


# --- Interactive Loop ---
print("Game Rating Predictor")
print("Enter 'quit' for stage name to exit.")

while True:
    print("-" * 20)
    stage = input("Enter Stage Name: ")
    if stage.lower() == 'quit':
        break

    weapons_input = []
    print("Enter the names of the 4 available weapons:")
    for i in range(4):
        while True:
            weapon = input(f"  Weapon {i+1}: ")
            if weapon: # Basic check if input is not empty
                 weapons_input.append(weapon)
                 break
            else:
                 print("Weapon name cannot be empty.")


    # Call the prediction function
    predicted_difficulty = predict_difficulty(
        stage,
        weapons_input,
        trained_model,
        stage_columns_from_training,
        weapon_columns_from_training,
        all_training_columns
    )

    if predicted_difficulty is not None:
        print(f"\n>>> Predicted Rating: {predicted_difficulty:.1f}")
    else:
        print("\nPrediction failed due to invalid input.")

print("Exiting predictor.")