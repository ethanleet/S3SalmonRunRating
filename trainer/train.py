import os
import pandas as pd
import joblib

from datetime import datetime
from pathlib import Path
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from scipy.stats import randint

BASE_DIR = Path(__file__).resolve().parent.parent
RANDOM_STATE = 6

# --- 1. Load Data ---
df = pd.read_csv(BASE_DIR / 'data/rotations_raw.csv', usecols=[1, 2, 3, 4, 5, 6])
column_names = ['Stage', 'Weapon1', 'Weapon2', 'Weapon3', 'Weapon4', 'Rating']
df.columns = column_names

print("--- Original DataFrame ---")
print(df)
print("\n")

# --- 2. Separate Features (X) and Target (y) ---
y = df['Rating']
X = df[['Stage', 'Weapon1', 'Weapon2', 'Weapon3', 'Weapon4']]

print("--- Initial Features (X) ---")
print(X.head())
print("\n")
print("--- Target Variable (y) ---")
print(y.head())
print("\n")

# --- 3. Preprocessing ---

# Step 3a: One-Hot Encode the 'Stage' feature
# pd.get_dummies automatically handles categorical columns
stage_encoded = pd.get_dummies(X['Stage'], prefix='Stage')
joblib.dump(stage_encoded.columns.tolist(), BASE_DIR / 'data/columns/stage_columns.joblib')

print("--- One-Hot Encoded Stage ---")
print(stage_encoded.head())
print("\n")

# Step 3b: Multi-Hot Encode the Weapon features (Handling the "Set" nature)

# Identify the weapon columns
weapon_cols = ['Weapon1', 'Weapon2', 'Weapon3', 'Weapon4']

# Use stack() to pivot the weapon columns into a single series,
# indexed by the original row index and the weapon column name.
# Then apply get_dummies() to this series.
# Finally, group by the original row index (level=0) and sum().
weapons_stacked = X[weapon_cols].stack()
weapons_encoded_intermediate = pd.get_dummies(weapons_stacked, prefix='Weapon')
weapons_multi_hot = weapons_encoded_intermediate.groupby(level=0).sum()
joblib.dump(weapons_multi_hot.columns.tolist(), BASE_DIR / 'data/columns/weapon_columns.joblib')

print("--- Multi-Hot Encoded Weapons ---")
print(weapons_multi_hot.head())
print(f"Shape: {weapons_multi_hot.shape}") # The columns are all unique weapons
print("\n")

# Step 3c: Combine the encoded features
# Drop the original 'Stage' column from X before combining (it's replaced by stage_encoded)
# Also drop the original weapon columns (replaced by weapons_multi_hot)
X_processed = pd.concat([stage_encoded, weapons_multi_hot], axis=1)

print("--- Final Processed Feature Matrix (X_processed) ---")
print(X_processed.head())
print(f"Shape: {X_processed.shape}")
print("\n")

# --- 4. Ready for Model Training ---
print("X_processed and y are now ready for training a machine learning model.")
print(f"Shape of X_processed: {X_processed.shape}")
print(f"Shape of y: {y.shape}")

# --- 5. Start training ---
X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.1, random_state=RANDOM_STATE)
joblib.dump(X_train.columns.tolist(), BASE_DIR / 'data/columns/all_training_columns.joblib')

# Define the parameter distribution for RandomizedSearchCV
param_dist = {
	'n_estimators': randint(100, 500),
	'max_depth': randint(3, 10),
	'min_samples_split': randint(5, 25),
	'min_samples_leaf': randint(3, 15),
	'max_features': ['sqrt', 'log2', 0.5, 0.7, None]
}

# Initialize the RandomizedSearchCV object
random_search = RandomizedSearchCV(
	estimator=RandomForestRegressor(oob_score=False), # oob_score not typically used with CV
	param_distributions=param_dist,
	n_iter=1000,
	cv=5,
	scoring='neg_mean_squared_error',
	verbose=2,
	n_jobs=-1  # Use all available cores
)

print("Starting hyperparameter tuning...")
random_search.fit(X_train, y_train)
print("Hyperparameter tuning complete.\n")

print(f"Best parameters found: {random_search.best_params_}")
best_model = random_search.best_estimator_

# --- 6. Saving the Model ---

# Step 6a: Create checkpoint directory
timestamp = datetime.now().isoformat().replace(':', '-')
checkpoint_dir = BASE_DIR / "data" / timestamp;
try:
	os.mkdir(checkpoint_dir)
	print(f"Directory '{checkpoint_dir}' created successfully.")
except FileExistsError:
	print(f"Directory '{checkpoint_dir}' already exists.")
except PermissionError:
	print(f"Permission denied: Unable to create '{checkpoint_dir}'.")
except Exception as e:
	print(f"An error occurred: {e}")
# Step 6a: Dump using joblib for Python interactive inference
model_filename = checkpoint_dir / 'weights.joblib'
print(f"Saving model to {model_filename}...")
joblib.dump(best_model, model_filename)
print("Model saved successfully.")

# Step 6b: Convert to ONNX for JavaScript consumption on the front end
num_features = X_train.shape[1]
print(f"Number of features for ONNX model: {num_features}")
initial_type = [('float_input', FloatTensorType([None, num_features]))]
onnx_model_filename = checkpoint_dir / 'model.onnx'
try:
	onnx_model = convert_sklearn(best_model, initial_types=initial_type)
	with open(onnx_model_filename, "wb") as f:
		f.write(onnx_model.SerializeToString())
	print(f"Model saved successfully to {onnx_model_filename}")
except Exception as e:
	print(f"Error converting model to ONNX: {e}")
	print("Make sure your model type is supported and the input signature (initial_type) is correct.")
	print("Check supported models: https://onnx.ai/sklearn-onnx/supported.html")
	print("Double-check that `num_features` accurately reflects your model's input.")

# --- 7. Make predictions, evaluate, etc. ---
y_pred_raw = best_model.predict(X_test)
y_pred = (y_pred_raw * 2).round() / 2
print("--- Evaluating Raw Predictions ---")
mae_raw = mean_absolute_error(y_test, y_pred_raw)
rmse_raw = mean_squared_error(y_test, y_pred_raw, squared=False) # RMSE
r2_raw = r2_score(y_test, y_pred_raw)
mae_output = f"Mean Absolute Error (MAE): {mae_raw:.4f}"
rmse_output = f"Root Mean Squared Error (RMSE): {rmse_raw:.4f}"
r2_output  = f"R-squared (R2 Score): {r2_raw:.4f}"
print(mae_output)
print(rmse_output)
print(r2_output)

metadata_filename = checkpoint_dir / 'metadata.txt';
with open(metadata_filename, "w") as f:
	f.write(mae_output + '\n' + rmse_output + '\n' + r2_output + '\n')
print(f"Metadata saved successfully to {metadata_filename}")