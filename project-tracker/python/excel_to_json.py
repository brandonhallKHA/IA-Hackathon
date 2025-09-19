import pandas as pd
import numpy as np
from pathlib import Path
import datetime

def filter_excel_to_json(relative_excel_path, sheet_name, filter_column, filter_value):
    full_path = Path(relative_excel_path).resolve()
    if not full_path.exists():
        raise FileNotFoundError(f"Excel file not found: {full_path}")

    # Read Excel
    df = pd.read_excel(full_path, sheet_name=sheet_name, header=1, engine="openpyxl")

    # Filter
    filtered_df = df[df[filter_column] == filter_value].copy()

    # --- Clean for JSON ---
    # 1. Convert pandas datetime64 columns to strings
    for col in filtered_df.select_dtypes(include=["datetime64[ns]", "datetime64[ns, UTC]"]).columns:
        filtered_df[col] = filtered_df[col].dt.strftime("%Y-%m-%d")

    # 2. Replace NaN/Inf with None
    filtered_df.replace([np.nan, np.inf, -np.inf], None, inplace=True)

    # 3. Catch any stray Timestamp OR datetime objects
    def normalize(val):
        if isinstance(val, (pd.Timestamp, datetime.datetime, datetime.date)):
            return val.isoformat()  # 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM:SS'
        return val

    filtered_df = filtered_df.applymap(normalize)

    return filtered_df
