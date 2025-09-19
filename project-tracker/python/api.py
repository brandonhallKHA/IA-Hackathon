from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from excel_to_json import filter_excel_to_json

app = FastAPI()

@app.get("/projects")
def get_projects(
    file_path: str = Query("project-tracker/data/Nicor DI Project Status.xlsm"),
    sheet_name: str = Query("DOT Projects"),
    filter_column: str = Query("Project Type"),
    filter_value: str = Query("DOT"),
):
    try:
        df = filter_excel_to_json(file_path, sheet_name, filter_column, filter_value)
    except FileNotFoundError as e:
        # 400 makes it clear it's a bad input; include the resolved path in the message
        raise HTTPException(status_code=400, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Unexpected error (Excel read issues, etc.)
        raise HTTPException(status_code=500, detail=f"Server error: {e}")

    # df has already been cleaned (no NaN/Inf/NaT)
    records = df.to_dict(orient="records")
    return JSONResponse(content=records)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
