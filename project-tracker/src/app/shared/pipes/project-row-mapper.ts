// project-row.mapper.ts
import { ProjectRow } from "../components/project-tracker/project-tracker.component"; // <- your interface file

// ---------- helpers ----------
const NULLY_STRINGS = new Set([
  '', '-', 'n/a', 'na', 'tbd', 'pending', 'pending scope', 'unknown'
]);

function cleanStr(v: any): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function isNullyLike(v: any): boolean {
  const s = cleanStr(v);
  if (s == null) return true;
  return NULLY_STRINGS.has(s.toLowerCase());
}

function toBoolOrNull(v: any): boolean | null {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  if (!s) return null;
  if (['y', 'yes', 'true', 't', '1'].includes(s)) return true;
  if (['n', 'no', 'false', 'f', '0'].includes(s)) return false;
  // if value is not a recognizable yes/no (e.g., "Will", "New Lenox"), treat as null
  return null;
}

function toNumberOrNull(v: any): number | null {
  if (isNullyLike(v)) return null;
  // remove currency symbols/commas/etc.
  const s = String(v).replace(/[$,]/g, '').trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Convert to Date if clearly a date (ISO, yyyy-mm-dd, mm/dd/yyyy, yyyy/mm/dd, etc.).
 * Returns null for month-only strings like "December" or for TBD/Pending/etc.
 */
function toDateOrNull(v: any): Date | null {
  if (isNullyLike(v)) return null;
  if (v instanceof Date && !isNaN(v.getTime())) return v;

  const s = String(v).trim();
  // Ignore obvious non-dates like "TBD", "Pending Scope", month-only words
  if (/^[A-Za-z]+$/.test(s)) return null;

  // Common Excel/ISO patterns usually parse fine with Date.parse
  const t = Date.parse(s);
  if (!Number.isNaN(t)) {
    const d = new Date(t);
    return isNaN(d.getTime()) ? null : d;
  }

  // Last resort: try dd/mm/yyyy ↔ mm/dd/yyyy normalization if needed (simple heuristic)
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const [_, a, b, c] = m;
    // Try mm/dd/yyyy first (US-style)
    const d1 = new Date(`${c.length === 2 ? '20' + c : c}-${a.padStart(2, '0')}-${b.padStart(2, '0')}`);
    if (!isNaN(d1.getTime())) return d1;
    // Then dd/mm/yyyy
    const d2 = new Date(`${c.length === 2 ? '20' + c : c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`);
    if (!isNaN(d2.getTime())) return d2;
  }

  return null;
}

function get(raw: any, keys: string[]): any {
  for (const k of keys) {
    if (k in raw) return raw[k];
  }
  return undefined;
}

// Map of incoming column labels (including variants/newlines) → getter keys
const K = {
  year:              ['Year'],
  projectType:       ['Project Type'],
  engineeringNumber: ['Engineering Number'],
  woNumber:          ['WO Number'],
  town:              ['Town'],
  designerSupervisor:['Designer Supervisor'],
  designerName:      ['Designer Name'],
  designStatus:      ['Design Status'],

  dateAssignedToDesigner:        ['Date Assigned to Designer'],
  engineeringApprovedDesignDate: ['Engineering Approved Design Date'],

  actionItems:        ['Action Items'],
  projectScopeLocation:['Project Scope / Location'],
  projectOwner:       ['Project Owner'],

  idot:  ['IDOT', 'IDOT\n'],
  c:     ['C', 'C\n'],
  m:     ['M', 'M\n'],
  t:     ['T', 'T\n'],
  other: ['Other', 'Other\n'],

  khBillingNo:       ['KH Billing No'],
  siteVisit:         ['Site Visit'],
  sowToDot:          ['SOW to DOT'],
  spoDocsSaved:      ['SPO Docs Saved'],
  runningLineReview: ['Running Line Review'],
  blTo3rdParty:      ["BL to 3rd Party"],
  blFrom3rdParty:    ["BL From 3rd Party"],
  designTo3rdParty:  ['Design to 3rd Party'],
  designFrom3rdParty:['Design From 3rd Party'],
  lgDrawing:         ['LG Drawing'],
  preRrReview:       ['Pre RR Review'],
  sendOutRr:         ['Send Out RR'],
  absoluteLatestRr:  ['Absolute Latest RR'],
  preAfcReview:      ['Pre AFC Review'],
  tdsMopMain:        ['TDS (i.e. MOP main)'],
  workplanDate:      ['Workplan Date'],
  designPagesCount:  ['# of Design Pages', '# of design pages'],

  dotContact:        ['DOT Contact'],
  contactMade:       ['Contact Made'],
  agencyProjectNo:   ['Agency Project No.', 'Agency Project No'],
  dotLettingDate:    ['DOT Letting Date'],
  dotConstDate:      ['DOT Const. Date', 'DOT Const Date'],
  planPhase:         ['Plan Phase'],
  cadFilesReceived:  ['CAD Files Received'],
  dotNotes:          ['DOT Notes'],
  foreignPipeline:   ['Foreign Pipeline'],
  realEstateReceived:['Real Estate Received'],
  envReceived:       ['Env. Received', 'Env Received'],
  reimbursable:      ['Reimbursable'],
  mopVerification:   ['MOP Verification'],
  dimpLeakRequest:   ['DIMP Leak Request'],
  nicorSpF:          ['Nicor SP & F'],
  thirdPartyWork:    ['3rd Party Work'],
  thirdParty:        ['3rd Party'],
  preliminaryCostEstimate: ['Preliminary Cost Estimate'],
  trueInvoiceDate:        ['True Invoice Date'],
  potentialInvoiceDate:   ['Potential Invoice Date'],
};

// ---------- main mapper ----------
export function mapRowsToProjectRows(rawRows: any[]): ProjectRow[] {
  return (rawRows ?? []).map<ProjectRow>((raw) => {
    const row: ProjectRow = {
      year:                      toNumberOrNull(get(raw, K.year)),
      projectType:               cleanStr(get(raw, K.projectType)),
      engineeringNumber:         cleanStr(get(raw, K.engineeringNumber)),
      woNumber:                  cleanStr(get(raw, K.woNumber)),
      town:                      cleanStr(get(raw, K.town)),
      designerSupervisor:        cleanStr(get(raw, K.designerSupervisor)),
      designerName:              cleanStr(get(raw, K.designerName)),
      designStatus:              cleanStr(get(raw, K.designStatus)),

      dateAssignedToDesigner:        toDateOrNull(get(raw, K.dateAssignedToDesigner)),
      engineeringApprovedDesignDate: toDateOrNull(get(raw, K.engineeringApprovedDesignDate)),

      actionItems:               cleanStr(get(raw, K.actionItems)),
      projectScopeLocation:      cleanStr(get(raw, K.projectScopeLocation)),
      projectOwner:              cleanStr(get(raw, K.projectOwner)),

      idot:  toBoolOrNull(get(raw, K.idot)),
      c:     toBoolOrNull(get(raw, K.c)),
      m:     toBoolOrNull(get(raw, K.m)),
      t:     toBoolOrNull(get(raw, K.t)),
      other: cleanStr(get(raw, K.other)),

      khBillingNo:              cleanStr(get(raw, K.khBillingNo)),
      siteVisit:                toBoolOrNull(get(raw, K.siteVisit)) ?? (toDateOrNull(get(raw, K.siteVisit)) ? true : null),
      sowToDot:                 toDateOrNull(get(raw, K.sowToDot)),         // if not a date, stays null
      spoDocsSaved:             toBoolOrNull(get(raw, K.spoDocsSaved)),
      runningLineReview:        toBoolOrNull(get(raw, K.runningLineReview)),
      blTo3rdParty:             toDateOrNull(get(raw, K.blTo3rdParty)),
      blFrom3rdParty:           toDateOrNull(get(raw, K.blFrom3rdParty)),
      designTo3rdParty:         toDateOrNull(get(raw, K.designTo3rdParty)),
      designFrom3rdParty:       toDateOrNull(get(raw, K.designFrom3rdParty)),
      lgDrawing:                toBoolOrNull(get(raw, K.lgDrawing)),
      preRrReview:              toDateOrNull(get(raw, K.preRrReview)),
      sendOutRr:                toDateOrNull(get(raw, K.sendOutRr)),
      absoluteLatestRr:         toDateOrNull(get(raw, K.absoluteLatestRr)),
      preAfcReview:             toDateOrNull(get(raw, K.preAfcReview)),
      tdsMopMain:               toBoolOrNull(get(raw, K.tdsMopMain)),
      workplanDate:             toDateOrNull(get(raw, K.workplanDate)),
      designPagesCount:         toNumberOrNull(get(raw, K.designPagesCount)),

      dotContact:               cleanStr(get(raw, K.dotContact)),
      contactMade:              toBoolOrNull(get(raw, K.contactMade)),
      agencyProjectNo:          cleanStr(get(raw, K.agencyProjectNo)),
      dotLettingDate:           toDateOrNull(get(raw, K.dotLettingDate)),
      dotConstDate:             toDateOrNull(get(raw, K.dotConstDate)),
      planPhase:                cleanStr(get(raw, K.planPhase)),
      cadFilesReceived:         toBoolOrNull(get(raw, K.cadFilesReceived)),
      dotNotes:                 cleanStr(get(raw, K.dotNotes)),
      foreignPipeline:          toBoolOrNull(get(raw, K.foreignPipeline)),
      realEstateReceived:       toBoolOrNull(get(raw, K.realEstateReceived)),
      envReceived:              toBoolOrNull(get(raw, K.envReceived)),
      reimbursable:             toBoolOrNull(get(raw, K.reimbursable)),
      mopVerification:          toBoolOrNull(get(raw, K.mopVerification)),
      dimpLeakRequest:          toBoolOrNull(get(raw, K.dimpLeakRequest)),
      nicorSpF:                 toBoolOrNull(get(raw, K.nicorSpF)),
      thirdPartyWork:           toBoolOrNull(get(raw, K.thirdPartyWork)),
      thirdParty:               cleanStr(get(raw, K.thirdParty)),

      preliminaryCostEstimate:  toNumberOrNull(get(raw, K.preliminaryCostEstimate)),
      trueInvoiceDate:          toDateOrNull(get(raw, K.trueInvoiceDate)),
      potentialInvoiceDate:     toDateOrNull(get(raw, K.potentialInvoiceDate)),
    };

    return row;
  });
}
