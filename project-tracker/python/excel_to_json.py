import pandas as pd
import os

def filter_excel_to_json(relative_excel_path, sheet_name, filter_column, filter_value):
    # Construct full path from relative path
    full_path = os.path.abspath(relative_excel_path)

    # Read the Excel file with header starting from the second row (index 1)
    df = pd.read_excel(full_path, sheet_name=sheet_name, header=1, engine='openpyxl')

    # Filter the DataFrame based on the specified column and value
    filtered_df = df[df[filter_column] == filter_value]

    # Create JSON filename based on Excel filename
    json_filename = f"filtered_{os.path.splitext(os.path.basename(relative_excel_path))[0]}.json"

    # Export the filtered DataFrame to a JSON file in the same directory as the script
    filtered_df.to_json(json_filename, orient='records', indent=4)

    # Return the filtered DataFrame
    return filtered_df


if __name__ == "__main__":
    result = filter_excel_to_json('project-tracker/data/Nicor DI Project Status.xlsm', 'DOT Projects', 'Project Type', 'DOT')
    print(result)
