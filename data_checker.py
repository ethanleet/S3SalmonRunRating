import pandas as pd

# --- Configuration ---
csv_file_path = 'rotation_data.csv'  # Replace with the actual path to your CSV file
header_option = None
columns_to_use = [1, 2, 3, 4, 5]
column_names = ['Stage', 'Weapon1', 'Weapon2', 'Weapon3', 'Weapon4']

# --- Processing ---
try:
	# Read the CSV, selecting only the necessary columns (2 through 6)
	# This automatically drops Column 1 (index 0) and ignores Column 7 (index 6)
	df = pd.read_csv(csv_file_path, header=header_option, usecols=columns_to_use)
	
	# Assign meaningful column names if no header was read
	if header_option is None:
		df.columns = column_names
		
	print(f"Successfully read {csv_file_path}.")
	
	# --- Stage Ranking ---
	stage_ranks = df['Stage'].value_counts()
	print("--- Stage Ranking (Most Frequent First) ---")
	print(stage_ranks)
	print("-" * 40)
	
	# --- Weapon Ranking ---
	weapon_columns = ['Weapon1', 'Weapon2', 'Weapon3', 'Weapon4']
	df_weapon = df[weapon_columns]
	
	# Use stack() to combine all items from the weapon columns into a single Series
	# This handles potential variations in column data types and is efficient
	all_weapons = df_weapon.stack()
	
	weapon_ranks = all_weapons.value_counts()
	with pd.option_context('display.max_rows', None):
		print("--- Weapon Ranking (Most Frequent First) ---")
		print(weapon_ranks)
		print("-" * 40)
	
except FileNotFoundError:
	print(f"Error: The file '{csv_file_path}' was not found.")
except pd.errors.EmptyDataError:
	print(f"Error: The file '{csv_file_path}' is empty.")
except ValueError as ve:
	print(f"Error processing columns. Did you specify the correct indices in 'usecols'?")
	print(f"Original error: {ve}")
except KeyError as ke:
	print(f"Error: A specified column name was not found: {ke}")
	print("Check if 'header_option' is set correctly and column names match.")
except Exception as e:
	print(f"An unexpected error occurred: {e}")