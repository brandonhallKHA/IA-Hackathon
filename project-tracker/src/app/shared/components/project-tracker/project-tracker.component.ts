import { Component, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../../../services/project.service';
import { mapRowsToProjectRows } from '../../pipes/project-row-mapper';
import { MatCard } from "@angular/material/card";

type ColType = 'text' | 'number' | 'date' | 'bool' | 'currency';

interface ColumnDef {
  key: string;
  label: string;
  type: ColType;
}

export interface ProjectRow {
  year: number | null;
  projectType: string | null;
  engineeringNumber: string | null;
  woNumber: string | null;
  town: string | null;
  designerSupervisor: string | null;
  designerName: string | null;
  designStatus: string | null;
  dateAssignedToDesigner: string | Date | null;
  engineeringApprovedDesignDate: string | Date | null;
  actionItems: string | null;
  projectScopeLocation: string | null;
  projectOwner: string | null;
  idot: boolean | null;
  c: boolean | null;
  m: boolean | null;
  t: boolean | null;
  other: string | null;
  khBillingNo: string | null;
  siteVisit: boolean | null;
  sowToDot: string | Date | null;
  spoDocsSaved: boolean | null;
  runningLineReview: boolean | null;
  blTo3rdParty: string | Date | null;
  blFrom3rdParty: string | Date | null;
  designTo3rdParty: string | Date | null;
  designFrom3rdParty: string | Date | null;
  lgDrawing: boolean | null;
  preRrReview: string | Date | null;
  sendOutRr: string | Date | null;
  absoluteLatestRr: string | Date | null;
  preAfcReview: string | Date | null;
  tdsMopMain: boolean | null;
  workplanDate: string | Date | null;
  designPagesCount: number | null;
  dotContact: string | null;
  contactMade: boolean | null;
  agencyProjectNo: string | null;
  dotLettingDate: string | Date | null;
  dotConstDate: string | Date | null;
  planPhase: string | null;
  cadFilesReceived: boolean | null;
  dotNotes: string | null;
  foreignPipeline: boolean | null;
  realEstateReceived: boolean | null;
  envReceived: boolean | null;
  reimbursable: boolean | null;
  mopVerification: boolean | null;
  dimpLeakRequest: boolean | null;
  nicorSpF: boolean | null;
  thirdPartyWork: boolean | null;
  thirdParty: string | null;
  preliminaryCostEstimate: number | null;
  trueInvoiceDate: string | Date | null;
  potentialInvoiceDate: string | Date | null;
}

@Component({
  selector: 'app-project-tracker',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatCard
],
  templateUrl: './project-tracker.component.html',
  styleUrls: ['./project-tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTrackerComponent {
  projectService = inject(ProjectService); // Assume you have a service to fetch data
  columns: ColumnDef[] = [
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'projectType', label: 'Project Type', type: 'text' },
    { key: 'engineeringNumber', label: 'Engineering Number', type: 'text' },
    { key: 'woNumber', label: 'WO Number', type: 'text' },
    { key: 'town', label: 'Town', type: 'text' },
    { key: 'designerSupervisor', label: 'Designer Supervisor', type: 'text' },
    { key: 'designerName', label: 'Designer Name', type: 'text' },
    { key: 'designStatus', label: 'Design Status', type: 'text' },
    { key: 'dateAssignedToDesigner', label: 'Date Assigned to Designer', type: 'date' },
    { key: 'engineeringApprovedDesignDate', label: 'Engineering Approved Design Date', type: 'date' },
    { key: 'actionItems', label: 'Action Items', type: 'text' },
    { key: 'projectScopeLocation', label: 'Project Scope / Location', type: 'text' },
    { key: 'projectOwner', label: 'Project Owner', type: 'text' },
    { key: 'idot', label: 'IDOT', type: 'bool' },
    { key: 'c', label: 'C', type: 'bool' },
    { key: 'm', label: 'M', type: 'bool' },
    { key: 't', label: 'T', type: 'bool' },
    { key: 'other', label: 'Other', type: 'text' },
    { key: 'khBillingNo', label: 'KH Billing No', type: 'text' },
    { key: 'siteVisit', label: 'Site Visit', type: 'bool' },
    { key: 'sowToDot', label: 'SOW to DOT', type: 'date' },
    { key: 'spoDocsSaved', label: 'SPO Docs Saved', type: 'bool' },
    { key: 'runningLineReview', label: 'Running Line Review', type: 'bool' },
    { key: 'blTo3rdParty', label: 'BL to 3rd Party', type: 'date' },
    { key: 'blFrom3rdParty', label: 'BL From 3rd Party', type: 'date' },
    { key: 'designTo3rdParty', label: 'Design to 3rd Party', type: 'date' },
    { key: 'designFrom3rdParty', label: 'Design From 3rd Party', type: 'date' },
    { key: 'lgDrawing', label: 'LG Drawing', type: 'bool' },
    { key: 'preRrReview', label: 'Pre RR Review', type: 'date' },
    { key: 'sendOutRr', label: 'Send Out RR', type: 'date' },
    { key: 'absoluteLatestRr', label: 'Absolute Latest RR', type: 'date' },
    { key: 'preAfcReview', label: 'Pre AFC Review', type: 'date' },
    { key: 'tdsMopMain', label: 'TDS (i.e. MOP main)', type: 'bool' },
    { key: 'workplanDate', label: 'Workplan Date', type: 'date' },
    { key: 'designPagesCount', label: '# of Design Pages', type: 'number' },
    { key: 'dotContact', label: 'DOT Contact', type: 'text' },
    { key: 'contactMade', label: 'Contact Made', type: 'bool' },
    { key: 'agencyProjectNo', label: 'Agency Project No.', type: 'text' },
    { key: 'dotLettingDate', label: 'DOT Letting Date', type: 'date' },
    { key: 'dotConstDate', label: 'DOT Const. Date', type: 'date' },
    { key: 'planPhase', label: 'Plan Phase', type: 'text' },
    { key: 'cadFilesReceived', label: 'CAD Files Received', type: 'bool' },
    { key: 'dotNotes', label: 'DOT Notes', type: 'text' },
    { key: 'foreignPipeline', label: 'Foreign Pipeline', type: 'bool' },
    { key: 'realEstateReceived', label: 'Real Estate Received', type: 'bool' },
    { key: 'envReceived', label: 'Env. Received', type: 'bool' },
    { key: 'reimbursable', label: 'Reimbursable', type: 'bool' },
    { key: 'mopVerification', label: 'MOP Verification', type: 'bool' },
    { key: 'dimpLeakRequest', label: 'DIMP Leak Request', type: 'bool' },
    { key: 'nicorSpF', label: 'Nicor SP & F', type: 'bool' },
    { key: 'thirdPartyWork', label: '3rd Party Work', type: 'bool' },
    { key: 'thirdParty', label: '3rd Party', type: 'text' },
    { key: 'preliminaryCostEstimate', label: 'Preliminary Cost Estimate', type: 'currency' },
    { key: 'trueInvoiceDate', label: 'True Invoice Date', type: 'date' },
    { key: 'potentialInvoiceDate', label: 'Potential Invoice Date', type: 'date' }
  ];

  displayedColumns = this.columns.map(c => c.key);
  dataSource = new MatTableDataSource<ProjectRow>([
    {
      year: 2025, projectType: 'Distribution', engineeringNumber: 'ENG-00123', woNumber: 'WO-98765',
      town: 'Springfield', designerSupervisor: 'Alice Smith', designerName: 'Brandon Hall',
      designStatus: 'In Progress', dateAssignedToDesigner: '2025-09-01', engineeringApprovedDesignDate: null,
      actionItems: 'Confirm easements; schedule site walk.', projectScopeLocation: 'Main St between 3rd & 7th',
      projectOwner: 'Nicor', idot: true, c: true, m: false, t: false, other: '', khBillingNo: 'KH-2025-0001',
      siteVisit: true, sowToDot: '2025-09-05', spoDocsSaved: true, runningLineReview: false,
      blTo3rdParty: null, blFrom3rdParty: null, designTo3rdParty: null, designFrom3rdParty: null,
      lgDrawing: false, preRrReview: null, sendOutRr: null, absoluteLatestRr: null, preAfcReview: null,
      tdsMopMain: false, workplanDate: '2025-10-01', designPagesCount: 12, dotContact: 'J. Doe',
      contactMade: true, agencyProjectNo: 'AG-55-2025', dotLettingDate: null, dotConstDate: null, planPhase: '60%',
      cadFilesReceived: false, dotNotes: '', foreignPipeline: false, realEstateReceived: false, envReceived: false,
      reimbursable: true, mopVerification: false, dimpLeakRequest: false, nicorSpF: true, thirdPartyWork: false,
      thirdParty: '', preliminaryCostEstimate: 125000.5, trueInvoiceDate: null, potentialInvoiceDate: null
    }
  ]);


  // Example data (replace with your service call)



// rawRows: any[] parsed from your FastAPI JSON

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.projectService.getProjects().subscribe(data => {
      this.dataSource = new MatTableDataSource<ProjectRow>(mapRowsToProjectRows(data));
  });

    // Case-insensitive filter across all fields
    this.dataSource.filterPredicate = (row, filter) => {
      const f = filter.trim().toLowerCase();
      return this.columns.some(c => {
        const v = (row as any)[c.key];
        if (v == null) return false;
        if (c.type === 'bool') return (v ? 'yes' : 'no').includes(f);
        return String(v).toLowerCase().includes(f);
      });
    };
        this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value || '';
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // Rendering helpers
  fmt(value: unknown, type: ColType): string {
    if (value == null) return '';
    switch (type) {
      case 'date': {
        const d = new Date(value as any);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
      }
      case 'currency': {
        const n = Number(value);
        return Number.isNaN(n) ? '' : n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
      }
      default:
        return String(value);
    }
  }

}
