import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Inject } from '@angular/core';

export interface ProjectRow {
  year: number | null;
  projectType: string | null;
  engineeringNumber: string | null;
  woNumber: string | null;
  town: string | null;
  designerSupervisor: string | null;
  designerName: string | null;
  designStatus: string | null;
  // ... add the rest of your fields here (same as Python JSON structure)
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  httpClient = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/projects'; // FastAPI endpoint


  /**
   * Get projects from FastAPI with optional filters.
   * Defaults match your Python function defaults.
   */
  getProjects(
    filterValue: string = 'DOT',
    sheetName: string = 'DOT Projects',
    filterColumn: string = 'Project Type',
    filePath: string = './data/Nicor DI Project Status.xlsm'
  ): Observable<any> {
    let params = new HttpParams()
      .set('filter_value', filterValue)
      .set('sheet_name', sheetName)
      .set('filter_column', filterColumn)
      .set('file_path', filePath);
// project.service.ts

    return this.httpClient.get<any[]>('/api/projects', { params: params });
  }
}
