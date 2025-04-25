import pandas as pd
import joblib

# --- 1. Create Sample Data ---
# Let's simulate a dataset like the one you described.
df = pd.read_csv('data/rotations_raw.csv', usecols=[1, 2, 3, 4, 5, 6])
column_names = ['Stage', 'Weapon1', 'Weapon2', 'Weapon3', 'Weapon4', 'Rating']
df.columns = column_names

print("--- Original DataFrame ---")
print(df)
print("\n")

# --- 2. Separate Features (X) and Target (y) ---
# The target variable is 'Rating'
y = df['Rating']

# The features are 'Stage' and the four weapon columns
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
joblib.dump(stage_encoded.columns.tolist(), 'data/columns/stage_columns.joblib')

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
joblib.dump(weapons_multi_hot.columns.tolist(), 'data/columns/weapon_columns.joblib')


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


from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)
joblib.dump(X_train.columns.tolist(), 'data/columns/all_training_columns.joblib')

model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, oob_score=True)
print("Training the model...")
model.fit(X_train, y_train)
print("Model training complete.\n")

# --- Saving the Model ---
model_filename = 'data/weights.joblib'
print(f"Saving model to {model_filename}...")
joblib.dump(model, model_filename)
print("Model saved successfully.")

# Make predictions, evaluate, etc.
y_pred_raw = model.predict(X_test)
y_pred = (y_pred * 2).round() / 2
print("--- Evaluating Raw Predictions ---")
mae_raw = mean_absolute_error(y_test, y_pred_raw)
rmse_raw = mean_squared_error(y_test, y_pred_raw, squared=False) # RMSE
r2_raw = r2_score(y_test, y_pred_raw)
print(f"Mean Absolute Error (MAE): {mae_raw:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse_raw:.4f}")
print(f"R-squared (R2 Score): {r2_raw:.4f}\n")