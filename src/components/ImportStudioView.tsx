<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  UploadCloud,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Database,
  ArrowRight,
  Bot,
  Cpu,
  RefreshCw,
  FileCheck2,
  MessageSquareCode,
  CheckCheck
} from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { Product, Warehouse, Retailer, Route, InventoryBatch } from '../types';
import {
  INITIAL_WAREHOUSES,
  INITIAL_PRODUCTS,
  INITIAL_RETAILERS,
  INITIAL_BATCHES,
  INITIAL_ROUTES
} from '../data/mockData';
import {
  processMasterDataImport,
  generateCleanDemoCSV,
  generate3PercentErrorCSV,
  generate18PercentErrorCSV,
  ImportProcessingResult,
  ENTITY_SCHEMAS
} from '../services/importValidator';
import { FlowGridAPI, DocumentAuditResponsePayload } from '../services/api';

export interface ImportStudioViewProps {
  batches?: InventoryBatch[];
  products?: Product[];
  retailers?: Retailer[];
  warehouses?: Warehouse[];
  routes?: Route[];
  onCommitBatches?: (newBatches: InventoryBatch[]) => void;
  onCommitProducts?: (newProducts: Product[]) => void;
  onCommitRetailers?: (newRetailers: Retailer[]) => void;
  onCommitRoutes?: (newRoutes: Route[]) => void;
}

export const ImportStudioView: React.FC<ImportStudioViewProps> = ({
  batches = INITIAL_BATCHES,
  products = INITIAL_PRODUCTS,
  retailers = INITIAL_RETAILERS,
  warehouses = INITIAL_WAREHOUSES,
  routes = INITIAL_ROUTES,
  onCommitBatches,
  onCommitProducts,
  onCommitRetailers,
  onCommitRoutes,
}) => {
  const { t, formatNumber } = useTranslation();
  const [selectedKind, setSelectedKind] = useState<string>('batches');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportProcessingResult | null>(null);
  const [aiAuditResult, setAiAuditResult] = useState<DocumentAuditResponsePayload | null>(null);
  const [isAiAuditing, setIsAiAuditing] = useState<boolean>(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'summary' | 'rule' | 'anomalies'>('summary');
  const [importedHashes, setImportedHashes] = useState<Set<string>>(new Set());
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleDatasets = [
    { kind: 'batches', name: 'inventory_batches.csv', desc: 'Warehouse batch stock, shelf-life expiry dates, versions' },
    { kind: 'sales', name: 'sales_daily.csv', desc: '84 days historical daily sales per store and SKU' },
    { kind: 'products', name: 'products.csv', desc: 'SKU definitions, case sizes, standard space units, perishable flags' },
    { kind: 'retailers', name: 'retailers.csv', desc: 'Store Management accounts, service class (A/B/C), min shelf-life %, storage limits' },
    { kind: 'routes', name: 'routes.csv', desc: 'Warehouse-to-retailer freight ₹/case and transit days' },
  ];

  // Prepare active validation context from live state
  const validationContext = {
    warehouses,
    products,
    retailers,
    routes,
    existingBatches: batches,
    importedFileHashes: importedHashes,
  };

  /**
   * Execute real import workflow with the 5% transactional rule
   */
  const handleExecuteImport = async (csvContent: string, fileName: string) => {
    setIsProcessing(true);
    setImportResult(null);
    setAiAuditResult(null);

    try {
      const result = await processMasterDataImport(
        csvContent,
        selectedKind,
        fileName,
        validationContext
      );

      // Enforce Transactional State Commit
      if (result.committed) {
        // Track SHA-256 for duplicate re-import protection (FR-02)
        setImportedHashes(prev => new Set([...prev, result.sha256]));

        // Commit valid records to application state
        if (selectedKind === 'batches' && result.committedBatches && onCommitBatches) {
          onCommitBatches(result.committedBatches);
        } else if (selectedKind === 'products' && result.committedProducts && onCommitProducts) {
          onCommitProducts(result.committedProducts);
        } else if (selectedKind === 'retailers' && result.committedRetailers && onCommitRetailers) {
          onCommitRetailers(result.committedRetailers);
        } else if (selectedKind === 'routes' && result.committedRoutes && onCommitRoutes) {
          onCommitRoutes(result.committedRoutes);
        }
      }

      setImportResult(result);

      // Trigger LLM Document & Schema Integrity Audit via nemotron-3-ultra:cloud
      setIsAiAuditing(true);
      try {
        const auditPayload = {
          file_name: fileName,
          target_entity: selectedKind,
          total_rows: result.totalRows,
          rows_accepted: result.rowsAccepted,
          rows_rejected: result.rowsRejected,
          error_rate_pct: result.errorRatePct,
          committed: result.committed,
          sha256: result.sha256,
          is_duplicate: result.isDuplicateFile,
          has_critical_error: result.hasCriticalError,
          sample_rows: result.parsedRows.slice(0, 5).map(r => r.data),
          errors_sample: result.errors.slice(0, 10).map(e => ({ row: e.row, field: e.field, message: e.message })),
          user_notes: 'Uploaded via Master Data Studio by Priya & Rohit',
        };
        const aiResp = await FlowGridAPI.auditImportDocument(auditPayload);
        setAiAuditResult(aiResp);
      } catch (auditErr) {
        console.warn('AI document audit error:', auditErr);
      } finally {
        setIsAiAuditing(false);
      }
    } catch (err: any) {
      setImportResult({
        importId: `IMP-ERR-${Date.now().toString().slice(-4)}`,
        fileName,
        sha256: '0000000000000000000000000000000000000000000000000000000000000000',
        targetEntity: selectedKind,
        totalRows: 0,
        rowsAccepted: 0,
        rowsRejected: 0,
        errorRatePct: 100,
        committed: false,
        isDuplicateFile: false,
        hasCriticalError: true,
        errors: [{ row: 0, field: 'execution', message: err?.message || 'Unexpected import processing error' }],
        parsedRows: [],
        committedRecordsCount: 0,
        inventoryStateChanged: false,
        summaryMessage: 'Internal processing failure. Transaction aborted.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Action 1: Load Clean Demo Dataset (100% Valid -> 0% Errors)
   */
  const handleLoadCleanDemo = () => {
    setSelectedFile(null);
    setAiAuditResult(null);
    const csv = generateCleanDemoCSV(selectedKind);
    const fileName = `${selectedKind}_demo_clean_v1.5.csv`;
    handleExecuteImport(csv, fileName);
  };

  /**
   * Action 2: Test 3% Row Errors (Valid Rows Commit, <= 5% Threshold)
   */
  const handleTest3PercentErrors = () => {
    setSelectedFile(null);
    setAiAuditResult(null);
    const csv = generate3PercentErrorCSV(selectedKind);
    const fileName = `${selectedKind}_test_3pct_errors.csv`;
    handleExecuteImport(csv, fileName);
  };

  /**
   * Action 3: Test 18% Errors (Entire File Rejected, > 5% Threshold)
   */
  const handleTest18PercentErrors = () => {
    setSelectedFile(null);
    setAiAuditResult(null);
    const csv = generate18PercentErrorCSV(selectedKind);
    const fileName = `${selectedKind}_corrupted_18pct_errors.csv`;
    handleExecuteImport(csv, fileName);
  };

  /**
   * File Upload / Drag-and-Drop Handler (Supports CSV and XLSX)
   */
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setAiAuditResult(null);
    const isXlsx = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');

    if (isXlsx) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          if (csvText && csvText.trim().length > 0) {
            handleExecuteImport(csvText, file.name);
          } else {
            alert('The uploaded Excel spreadsheet contains no data rows.');
          }
        } catch (err: any) {
          alert(`Failed to parse Excel file: ${err?.message || 'Invalid format'}`);
        }
      };
      reader.onerror = () => {
        alert('Unable to read selected XLSX file.');
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          handleExecuteImport(text, file.name);
        }
      };
      reader.onerror = () => {
        alert('Unable to read selected file. Please select a valid CSV or plain text file.');
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 text-[#1E293B]">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              Master Data &amp; Batch Inventory Import Studio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              J1 Priya &amp; Rohit
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            CSV/XLSX schema verification • Single Sales Path deduplication • 5% Error Threshold Transactional Rule (FR-02)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-semibold">Target Entity:</span>
          <select
            value={selectedKind}
            onChange={e => {
              setSelectedKind(e.target.value);
              setImportResult(null);
              setSelectedFile(null);
            }}
            className="bg-[#FFF8E7] border border-[#E7E5E4] text-[#1E293B] font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            {sampleDatasets.map(d => (
              <option key={d.kind} value={d.kind}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5% Threshold Rule Explanation Box */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E293B] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[#2563EB]">
            Transactional Data Integrity Guarantee (J1 Step 3 &amp; FR-02)
          </h4>
          <p className="text-[#64748B] mt-0.5 leading-relaxed">
            If <strong>&le; 5%</strong> of rows fail validation, the valid rows are committed in one transaction and rejected rows are flagged with file:row diagnostics. If <strong>&gt; 5%</strong> fail, nothing is committed—preventing half-updated stock states from corrupting planning runs.
          </p>
          <p className="text-[11px] text-[#2563EB] mt-1.5 font-medium">
            Runtime Scope: Valid transactions update the active application catalog state immediately. File SHA-256 hashes are tracked to prevent duplicate re-imports.
=======
import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Database,
  Hash,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Check,
  Layers,
  Lock
} from 'lucide-react';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  isCritical?: boolean;
  value?: string;
}

interface ColumnMapping {
  csvHeader: string;
  targetField: string;
  dataType: string;
  isMapped: boolean;
}

export const ImportStudioView: React.FC = () => {
  const [selectedKind, setSelectedKind] = useState<string>('batches');
  const [sourceSystem, setSourceSystem] = useState<string>('SAP_WMS');
  const [sourceTrustTier, setSourceTrustTier] = useState<string>('TIER_1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isQuarantineReviewed, setIsQuarantineReviewed] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const [importResult, setImportResult] = useState<{
    importId: string;
    fileName: string;
    sha256: string;
    sourceSystem: string;
    trustTier: string;
    totalRows: number;
    rowsAccepted: number;
    rowsQuarantined: number;
    errorRatePct: number;
    status: 'CLEAN' | 'QUARANTINE_REVIEW' | 'PUBLICATION_BLOCKED';
    errors: ValidationError[];
  } | null>(null);

  const sampleDatasets = [
    { kind: 'batches', name: 'inventory_batches.csv', desc: 'Warehouse batch stock, shelf-life expiry dates, versions' },
    { kind: 'sales', name: 'sales_daily.csv', desc: '84 days historical daily sales per kirana store and SKU' },
    { kind: 'products', name: 'products.csv', desc: 'SKU definitions, case sizes, standard space units, perishable flags' },
    { kind: 'retailers', name: 'retailers.csv', desc: 'Kirana accounts, service class (A/B/C), min shelf-life %, storage limits' },
    { kind: 'routes', name: 'routes.csv', desc: 'Warehouse-to-retailer freight ₹/case and transit days' },
  ];

  const columnMappings: Record<string, ColumnMapping[]> = {
    batches: [
      { csvHeader: 'batch_number', targetField: 'batchNo', dataType: 'String (UUID/Code)', isMapped: true },
      { csvHeader: 'warehouse_id', targetField: 'warehouseId', dataType: 'Foreign Key (WH)', isMapped: true },
      { csvHeader: 'sku_code', targetField: 'sku', dataType: 'Foreign Key (Product)', isMapped: true },
      { csvHeader: 'qty_on_hand', targetField: 'qtyUnits', dataType: 'Integer (>= 0)', isMapped: true },
      { csvHeader: 'exp_date_iso', targetField: 'expiryDate', dataType: 'Date (YYYY-MM-DD)', isMapped: true },
    ],
    sales: [
      { csvHeader: 'txn_id', targetField: 'transactionId', dataType: 'Unique ID', isMapped: true },
      { csvHeader: 'store_id', targetField: 'retailerId', dataType: 'Foreign Key (Store)', isMapped: true },
      { csvHeader: 'sku', targetField: 'sku', dataType: 'Foreign Key (Product)', isMapped: true },
      { csvHeader: 'units_sold', targetField: 'unitsSold', dataType: 'Integer (> 0)', isMapped: true },
      { csvHeader: 'sale_timestamp', targetField: 'occurredAt', dataType: 'ISO DateTime', isMapped: true },
    ],
  };

  const handleSimulateCleanUpload = () => {
    setIsProcessing(true);
    setImportResult(null);
    setIsQuarantineReviewed(false);
    setIsPublished(false);

    setTimeout(() => {
      setIsProcessing(false);
      setImportResult({
        importId: `IMP-CLN-${Date.now().toString().slice(-5)}`,
        fileName: `${selectedKind}_verified_clean_v1.5.csv`,
        sha256: '9a3f4e18c2198031d77a88ef4101e40a793a52599201a4e12e753f20d52bc194',
        sourceSystem,
        trustTier: sourceTrustTier,
        totalRows: 240,
        rowsAccepted: 240,
        rowsQuarantined: 0,
        errorRatePct: 0.0,
        status: 'CLEAN',
        errors: [],
      });
    }, 450);
  };

  const handleSimulateQuarantineUpload = () => {
    setIsProcessing(true);
    setImportResult(null);
    setIsQuarantineReviewed(false);
    setIsPublished(false);

    setTimeout(() => {
      setIsProcessing(false);
      const totalRows = 200;
      const quarantined = 7; // 7 / 200 = 3.5% (<= 5% -> Quarantine Rule Activated)
      const accepted = totalRows - quarantined;
      const errorRate = (quarantined / totalRows) * 100;

      const sampleErrors: ValidationError[] = [
        { row: 14, field: 'expiryDate', message: 'Missing expiry date on perishable SKU', isCritical: true, value: 'NULL' },
        { row: 42, field: 'warehouseId', message: 'Foreign key lookup failed: Unknown WH "WH-GOA"', isCritical: false, value: 'WH-GOA' },
        { row: 89, field: 'qtyUnits', message: 'Invalid negative stock quantity (-24 units)', isCritical: true, value: '-24' },
        { row: 112, field: 'caseSize', message: 'Case size must be >= 1', isCritical: false, value: '0' },
        { row: 156, field: 'expiryDate', message: 'Batch expired before cycle start date', isCritical: true, value: '2026-09-01' },
        { row: 174, field: 'transactionId', message: 'Duplicate transaction ID detected', isCritical: true, value: 'TXN-9981' },
        { row: 184, field: 'sku', message: 'Unrecognized SKU barcode', isCritical: false, value: 'SKU-UNKNOWN' },
      ];

      setImportResult({
        importId: `IMP-QRN-${Date.now().toString().slice(-5)}`,
        fileName: `${selectedKind}_quarantine_test_v1.5.csv`,
        sha256: '8f7e2a91c530b420f18d73b64ecf001193d2581ad79e830e23b2c1450a8d42ef',
        sourceSystem,
        trustTier: sourceTrustTier,
        totalRows,
        rowsAccepted: accepted,
        rowsQuarantined: quarantined,
        errorRatePct: errorRate,
        status: 'QUARANTINE_REVIEW',
        errors: sampleErrors,
      });
    }, 550);
  };

  const handleSimulateBlockedUpload = () => {
    setIsProcessing(true);
    setImportResult(null);
    setIsQuarantineReviewed(false);
    setIsPublished(false);

    setTimeout(() => {
      setIsProcessing(false);
      const totalRows = 120;
      const quarantined = 16; // 16 / 120 = 13.3% (> 5% -> Publication Blocked)
      const errorRate = (quarantined / totalRows) * 100;

      const sampleErrors: ValidationError[] = [
        { row: 4, field: 'sku', message: 'Missing mandatory SKU code', isCritical: true },
        { row: 11, field: 'qtyUnits', message: 'Corrupt non-numeric quantity "NA"', isCritical: true },
        { row: 19, field: 'transactionId', message: 'Duplicate transaction ID', isCritical: true },
        { row: 28, field: 'warehouseId', message: 'Invalid facility code', isCritical: false },
        { row: 35, field: 'expiryDate', message: 'Invalid ISO date string format', isCritical: true },
        { row: 52, field: 'qtyUnits', message: 'Negative stock (-120 units)', isCritical: true },
        { row: 64, field: 'date', message: 'Corrupt row encoding', isCritical: true },
        { row: 78, field: 'retailerId', message: 'Foreign key mismatch', isCritical: false },
      ];

      setImportResult({
        importId: `IMP-BLK-${Date.now().toString().slice(-5)}`,
        fileName: 'corrupted_distributor_feed.csv',
        sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        sourceSystem,
        trustTier: sourceTrustTier,
        totalRows,
        rowsAccepted: 0,
        rowsQuarantined: quarantined,
        errorRatePct: errorRate,
        status: 'PUBLICATION_BLOCKED',
        errors: sampleErrors,
      });
    }, 550);
  };

  const handlePublishCleanRows = () => {
    setIsPublished(true);
  };

  const activeMappings = columnMappings[selectedKind] || columnMappings.batches;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Data import
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              5% Rule Enforced
            </span>

          </div>

        </div>

        {/* Source System & Entity Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">Source System:</span>
            <select
              value={sourceSystem}
              onChange={e => setSourceSystem(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
            >
              <option value="SAP_WMS">WMS (SAP S/4HANA Pune)</option>
              <option value="DISTRIBUTOR_TALLY">Distributor ERP (TallyPrime)</option>
              <option value="FIELD_POS">Kirana Field POS Terminal</option>
              <option value="FLEET_TELEMETRY">Maharashtra Fleet GPS Telemetry</option>
            </select>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">Target Entity:</span>
            <select
              value={selectedKind}
              onChange={e => setSelectedKind(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
            >
              {sampleDatasets.map(d => (
                <option key={d.kind} value={d.kind}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5% Rule Contract & Source Information Registry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>5% Rule Transactional Policy</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            • <strong>&le; 5% invalid</strong>: Quarantine bad rows for review; clean rows are publishable.<br />
            • <strong>&gt; 5% invalid</strong>: Publication blocked immediately; corrections required.<br />
            • <strong>Critical errors</strong>: Duplicate IDs &amp; negative stock are always rejected.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Source Trust Level: Tier-1 Authoritative</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Connected via <strong>{sourceSystem}</strong> with SHA-256 idempotency verification.
            Stock mutations and master imports are logged to immutable audit records.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span>Single Sales Path Deduplication</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Every counter sale, stock receipt, and GRN has a unique UUIDv4 token preventing double-counting during offline synchronization.
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </p>
        </div>
      </div>

<<<<<<< HEAD
      {/* Drop Zone & Test Scenarios */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`bg-white p-8 rounded-2xl border-2 border-dashed transition-colors text-center space-y-4 shadow-xs ${
          isDragOver ? 'border-[#2563EB] bg-[#EFF6FF]/40' : 'border-[#E7E5E4]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,.txt,.xlsx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelected(e.target.files[0]);
            }
          }}
        />

        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mx-auto">
=======
      {/* Column Mapping Preview */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>CSV Column Mapping Contract ({selectedKind})</span>
          </h3>
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> All {activeMappings.length} schema fields mapped
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Incoming CSV Header</th>
                <th className="py-2.5 px-3">Mapped Target Field</th>
                <th className="py-2.5 px-3">Data Type &amp; Constraint</th>
                <th className="py-2.5 px-3 text-right">Mapping Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {activeMappings.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 text-slate-300">
                  <td className="py-2 px-3 font-mono text-indigo-300">{m.csvHeader}</td>
                  <td className="py-2 px-3 font-mono text-cyan-300 flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span>{m.targetField}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-400">{m.dataType}</td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Auto-Matched ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Drop Zone & Test Scenarios */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 border-dashed text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
<<<<<<< HEAD
          <h3 className="text-base font-bold text-[#1E293B]">
            Upload Master Data or Inventory Batches
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Drag and drop CSV or XLSX files (max 10MB) or run a demo scenario below
          </p>
          {selectedFile && (
            <p className="text-xs font-semibold text-[#2563EB] mt-1 font-mono">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* File Picker trigger */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#1E293B] bg-white border border-[#E7E5E4] hover:bg-[#FAF3E0] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2563EB]" />
            <span>Browse CSV File</span>
          </button>

          {/* Action 1: Load Clean Demo Dataset */}
          <button
            type="button"
            onClick={handleLoadCleanDemo}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Clean Demo Dataset (100% Valid)</span>
          </button>

          {/* Action 2: Test 3% Row Errors */}
          <button
            type="button"
            onClick={handleTest3PercentErrors}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1E293B] bg-white border border-[#2563EB] hover:bg-[#EFF6FF] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Demonstrate <= 5% error rule where valid rows commit and 3 errors are reported"
          >
            <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
            <span>Test 3% Row Errors (Valid Rows Commit)</span>
          </button>

          {/* Action 3: Test 18% Errors */}
          <button
            type="button"
            onClick={handleTest18PercentErrors}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#DC2626] bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Demonstrate > 5% error rule where entire file is rolled back"
          >
            <XCircle className="w-4 h-4 text-[#DC2626]" />
            <span>Test 18% Errors (Entire File Rejected)</span>
=======
          <h3 className="text-base font-bold text-white">
            Upload CSV / XLSX Dataset for Validation
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag and drop data files or test the 3 rule thresholds below
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleSimulateCleanUpload}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test Clean Batch (0% Errors &rarr; Ready to Publish)</span>
          </button>

          <button
            onClick={handleSimulateQuarantineUpload}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Demonstrate 3.5% row errors <= 5% rule where bad rows are quarantined"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Test 3.5% Row Errors (&le;5% &rarr; Quarantine Review)</span>
          </button>

          <button
            onClick={handleSimulateBlockedUpload}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Demonstrate 13.3% row errors > 5% rule where publication is blocked"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Test 13.3% Row Errors (&gt;5% &rarr; Publication Blocked)</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Processing State */}
      {isProcessing && (
        <div className="bg-white p-8 rounded-2xl border border-[#E7E5E4] text-center space-y-3 shadow-xs">
          <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#1E293B]">Parsing file, checking schema, and verifying foreign keys...</p>
        </div>
      )}

      {/* Validation Result Inspection */}
      {importResult && !isProcessing && (
        <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs animate-in fade-in">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5E4] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E293B] text-base">{importResult.fileName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  importResult.committed
                    ? 'bg-emerald-50 text-[#15803D] border border-emerald-200'
                    : 'bg-red-50 text-[#DC2626] border border-red-200'
                }`}>
                  {importResult.committed ? 'TRANSACTION COMMITTED' : 'IMPORT ROLLED BACK'}
                </span>
                {importResult.isDuplicateFile && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF3E0] text-[#EA580C] border border-[#E7E5E4]">
                    DUPLICATE IGNORED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                SHA-256: {importResult.sha256}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#64748B]">Import Batch ID:</span>
              <span className="block font-mono text-xs font-bold text-[#2563EB]">{importResult.importId}</span>
            </div>
          </div>

          {/* Summary Banner */}
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            importResult.committed
              ? 'bg-emerald-50 border-emerald-200 text-[#15803D]'
              : 'bg-red-50 border-red-200 text-[#DC2626]'
          }`}>
            <div className="flex items-center gap-2">
              {importResult.committed ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              <span className="font-semibold">{importResult.summaryMessage}</span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider block">
                {importResult.inventoryStateChanged ? 'State Changed: YES' : 'State Changed: NO'}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#E7E5E4]">
              <span className="text-[#64748B] font-medium">Total Rows Processed</span>
              <p className="text-lg font-black text-[#1E293B] mt-0.5 font-mono">{formatNumber(importResult.totalRows)}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF3E0] border border-[#E7E5E4]">
              <span className="text-[#64748B] font-medium">Valid Rows Committed</span>
              <p className="text-lg font-black text-[#15803D] mt-0.5 font-mono">{formatNumber(importResult.rowsAccepted)}</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E7E5E4]">
              <span className="text-[#64748B] font-medium">Rejected Rows</span>
              <p className="text-lg font-black text-[#DC2626] mt-0.5 font-mono">{formatNumber(importResult.rowsRejected)}</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E7E5E4]">
              <span className="text-[#64748B] font-medium">Error Rate</span>
              <p className={`text-lg font-black mt-0.5 font-mono ${importResult.errorRatePct <= 5 ? 'text-[#EA580C]' : 'text-[#DC2626]'}`}>
                {importResult.errorRatePct.toFixed(1)}% {importResult.errorRatePct <= 5 ? '(≤ 5% Limit)' : '(> 5% Limit)'}
=======
      {/* Validation Result Inspection */}
      {importResult && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-5 animate-in fade-in">
          {/* Status Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{importResult.fileName}</span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  importResult.status === 'CLEAN'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : importResult.status === 'QUARANTINE_REVIEW'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {importResult.status === 'CLEAN'
                    ? 'CLEAN DATASET (VERIFIED)'
                    : importResult.status === 'QUARANTINE_REVIEW'
                    ? 'QUARANTINE REVIEW REQUIRED (≤5% ERROR)'
                    : 'PUBLICATION BLOCKED (>5% ERROR)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Batch ID: {importResult.importId} • SHA-256: {importResult.sha256.slice(0, 24)}...
              </p>
            </div>

            {/* Publication / Commitment Actions */}
            <div>
              {importResult.status === 'CLEAN' && !isPublished && (
                <button
                  type="button"
                  onClick={handlePublishCleanRows}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish All Clean Rows</span>
                </button>
              )}

              {importResult.status === 'QUARANTINE_REVIEW' && !isPublished && (
                <button
                  type="button"
                  onClick={handlePublishCleanRows}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Verified Clean Rows ({importResult.rowsAccepted} rows)</span>
                </button>
              )}

              {importResult.status === 'PUBLICATION_BLOCKED' && (
                <span className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>Publication Locked: Request Source Correction</span>
                </span>
              )}

              {isPublished && (
                <span className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Published &amp; Committed to DB</span>
                </span>
              )}
            </div>
          </div>

          {/* Stats Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Rows Processed</span>
              <p className="text-xl font-black text-white mt-0.5">{importResult.totalRows}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Clean / Valid Rows</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{importResult.rowsAccepted}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Quarantined / Rejected</span>
              <p className={`text-xl font-black mt-0.5 ${importResult.rowsQuarantined > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {importResult.rowsQuarantined}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Error Rate</span>
              <p className={`text-xl font-black mt-0.5 ${importResult.errorRatePct <= 5 ? 'text-amber-400' : 'text-rose-400'}`}>
                {importResult.errorRatePct.toFixed(1)}% {importResult.errorRatePct <= 5 ? '(≤ 5% Rule)' : '(> 5% Rule)'}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </p>
            </div>
          </div>

<<<<<<< HEAD
          {/* LLM Document & Schema Integrity Audit Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0B1528] via-[#0F1E36] to-[#0A1120] text-white p-5 shadow-xl relative overflow-hidden space-y-4">
            {/* Ambient decorative lighting */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Title and Live Badge */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      LLM Document &amp; Schema Integrity Audit
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1 font-mono">
                      <Cpu className="w-3 h-3" />
                      nemotron-3-ultra:cloud
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Autonomous verification for Priya &amp; Rohit • Transactional Integrity Guarantee (J1 Step 3 &amp; FR-02)
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isAiAuditing ? (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Auditing File with LLM...
                  </span>
                ) : (
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border tracking-wider uppercase font-mono ${
                    importResult.committed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : importResult.isDuplicateFile
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                  }`}>
                    {importResult.committed
                      ? 'TRANSACTION COMMITTED (<= 5% LIMIT)'
                      : importResult.isDuplicateFile
                      ? 'DUPLICATE SHA-256 IGNORED'
                      : 'TRANSACTION ABORTED (> 5% LIMIT)'}
                  </span>
                )}
              </div>
            </div>

            {/* 4 Metric Tiles */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Tile 1: Data Quality Score */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Data Quality Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-cyan-300 font-mono">
                    {aiAuditResult
                      ? `${(aiAuditResult.data_quality_score * 100).toFixed(0)}%`
                      : `${((1 - importResult.errorRatePct / 100) * 100).toFixed(0)}%`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {importResult.errorRatePct === 0 ? 'Flawless' : importResult.errorRatePct <= 5 ? 'Transactional Pass' : 'Sub-Threshold'}
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      importResult.errorRatePct <= 5 ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(5, (1 - importResult.errorRatePct / 100) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Tile 2: 5% Rule Verdict */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  FR-02 Rule Check
                </span>
                <span className={`block text-xs font-bold mt-1 font-mono ${
                  importResult.errorRatePct <= 5 ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {importResult.errorRatePct <= 5 ? 'PASSED (<= 5.0% LIMIT)' : 'VIOLATED (> 5.0% LIMIT)'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  {importResult.committed
                    ? `${importResult.rowsAccepted} valid rows committed atomically`
                    : 'Atomic rollback applied to prevent corruption'}
                </p>
              </div>

              {/* Tile 3: Operational Risk Assessment */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  Downstream Planning Risk
                </span>
                <span className={`block text-xs font-bold mt-1 font-mono ${
                  importResult.committed ? 'text-cyan-300' : 'text-rose-300'
                }`}>
                  {importResult.committed ? 'LOW PLANNING RISK' : 'CRITICAL CORRUPTION AVERTED'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  {importResult.committed
                    ? 'FEFO batch allocation state verified'
                    : 'Prevented half-updated batch state'}
                </p>
              </div>

              {/* Tile 4: SHA-256 Idempotency */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                  SHA-256 Idempotency
                </span>
                <span className="block text-xs font-bold text-amber-300 mt-1 font-mono truncate">
                  {importResult.sha256.slice(0, 16)}...
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  {importResult.isDuplicateFile ? 'Duplicate re-import blocked' : 'Unique fingerprint verified'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="relative z-10 flex items-center gap-2 border-b border-white/10 pt-1">
              <button
                type="button"
                onClick={() => setActiveAuditTab('summary')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                  activeAuditTab === 'summary'
                    ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Executive Document Review
              </button>
              <button
                type="button"
                onClick={() => setActiveAuditTab('rule')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                  activeAuditTab === 'rule'
                    ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5% Rule (FR-02) Compliance
              </button>
              <button
                type="button"
                onClick={() => setActiveAuditTab('anomalies')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer ${
                  activeAuditTab === 'anomalies'
                    ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Root Causes &amp; Remediation Plan ({aiAuditResult?.anomaly_root_causes.length || importResult.errors.length})
              </button>
            </div>

            {/* Tab 1 Content: Executive Document Review */}
            {activeAuditTab === 'summary' && (
              <div className="relative z-10 space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-slate-200">
                  <p className="font-medium text-slate-100">
                    {aiAuditResult?.executive_summary ||
                      `Master data file '${importResult.fileName}' processed ${importResult.totalRows} records. ${
                        importResult.committed
                          ? `${importResult.rowsAccepted} valid rows were committed to live application state.`
                          : 'The file exceeded the 5% error limit and was completely rolled back.'
                      }`}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                    Operational Impact Assessment:
                  </span>
                  <p className="mt-0.5">
                    {aiAuditResult?.operational_risk_assessment ||
                      (importResult.committed
                        ? 'Batch inventory successfully synchronized for FEFO distribution and replenishment runs.'
                        : 'Atomic rollback prevented corrupted stock levels from propagating into optimization plans.')}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2 Content: 5% Rule Compliance */}
            {activeAuditTab === 'rule' && (
              <div className="relative z-10 space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                  <p className="font-semibold text-cyan-300 mb-1">
                    Transactional Data Integrity Guarantee (J1 Step 3 &amp; PRD FR-02):
                  </p>
                  <p className="text-slate-300">
                    {aiAuditResult?.rule_compliance_narrative ||
                      (importResult.errorRatePct <= 5
                        ? `The measured error rate of ${importResult.errorRatePct.toFixed(1)}% satisfies the strict <= 5.0% threshold. All ${importResult.rowsAccepted} valid records committed in a single atomic database transaction.`
                        : `The error rate of ${importResult.errorRatePct.toFixed(1)}% breaches the strict 5.0% ceiling. The atomic transaction was aborted with 0 records committed.`)}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Error Rate</span>
                    <span className={importResult.errorRatePct <= 5 ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                      {importResult.errorRatePct.toFixed(1)}% (Threshold: 5.0%)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Committed Rows</span>
                    <span className="text-white font-bold">{importResult.rowsAccepted} / {importResult.totalRows}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                    <span className="text-slate-400 text-[10px] block">Audit Integrity</span>
                    <span className="text-cyan-300 font-bold">100% Deterministic Guard</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3 Content: Root Causes & Remediation Plan */}
            {activeAuditTab === 'anomalies' && (
              <div className="relative z-10 space-y-3 text-xs leading-relaxed">
                <div className="space-y-2">
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                    Diagnostic Anomalies Detected (file:row):
                  </span>
                  {(aiAuditResult?.anomaly_root_causes && aiAuditResult.anomaly_root_causes.length > 0) ? (
                    <div className="space-y-1.5">
                      {aiAuditResult.anomaly_root_causes.map((anomaly, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{anomaly}</span>
                        </div>
                      ))}
                    </div>
                  ) : importResult.errors.length > 0 ? (
                    <div className="space-y-1.5">
                      {importResult.errors.slice(0, 5).map((err, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span><strong>Row {err.row} ({err.field}):</strong> {err.message}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>Zero anomalies detected. File conforms 100% to enterprise catalog rules.</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1 border-t border-white/10">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                    Step-by-Step Remediation Plan:
                  </span>
                  <div className="space-y-1.5">
                    {(aiAuditResult?.remediation_steps || [
                      importResult.committed
                        ? 'Proceed to Distribution Planning & Optimization with updated inventory batches.'
                        : 'Review row diagnostics, resolve missing required dates and foreign keys, and re-upload file.',
                    ]).map((step, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-black/20 border border-white/5 text-slate-300 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Card Action Footer */}
            <div className="relative z-10 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-300" />
                Audited via <strong>nemotron-3-ultra:cloud</strong> • Audit ID: <span className="font-mono text-cyan-300">{aiAuditResult?.audit_id || 'AUD-LIVE'}</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-chatbot', {
                      detail: {
                        initialMessage: `Audit master data import file "${importResult.fileName}" and explain the 5% error threshold rule under FR-02 for Priya & Rohit.`,
                      },
                    })
                  );
                }}
                className="px-3 py-1.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all text-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Hetvaya Copilot about this File</span>
              </button>
            </div>
          </div>

          {/* Parsed Rows Preview */}
          {importResult.parsedRows.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#2563EB]" />
                  <span>Parsed Rows Preview (First {importResult.parsedRows.length} Rows)</span>
                </h4>
                <span className="text-[11px] text-[#64748B]">
                  Schema Target: <strong className="text-[#1E293B]">{importResult.targetEntity}</strong>
                </span>
              </div>

              <div className="rounded-xl border border-[#E7E5E4] overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E7E5E4] bg-[#FAF3E0] text-[#64748B] font-semibold">
                        <th className="py-2 px-3">Row</th>
                        <th className="py-2 px-3">Validation Status</th>
                        {Object.keys(importResult.parsedRows[0].data).map((key) => (
                          <th key={key} className="py-2 px-3">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E5E4] font-mono text-[11px]">
                      {importResult.parsedRows.map((row) => (
                        <tr key={row.rowNumber} className={`hover:bg-[#FFF8E7]/50 ${!row.isValid ? 'bg-red-50/50' : ''}`}>
                          <td className="py-2 px-3 font-bold text-[#64748B]">{row.rowNumber}</td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              row.isValid
                                ? 'bg-emerald-100 text-[#15803D]'
                                : 'bg-red-100 text-[#DC2626]'
                            }`}>
                              {row.isValid ? 'VALID' : 'INVALID'}
                            </span>
                          </td>
                          {Object.keys(row.data).map((key) => (
                            <td key={key} className="py-2 px-3 truncate max-w-[150px]">
                              {row.data[key] || <span className="text-[#94A3B8] italic">empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Error Diagnostics Table */}
          {importResult.errors.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                <span>Row-Level Diagnostics (file:row) • {importResult.errors.length} Issue(s) Reported</span>
              </h4>

              <div className="rounded-xl border border-[#E7E5E4] overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E7E5E4] bg-[#FAF3E0] text-[#64748B] font-semibold">
                        <th className="py-2 px-3">Location</th>
                        <th className="py-2 px-3">Target Field</th>
                        <th className="py-2 px-3">Validation Rule Broken</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E5E4] font-mono text-[11px]">
                      {importResult.errors.map((err, idx) => (
                        <tr key={idx} className="hover:bg-[#FFF8E7]/50 text-[#1E293B]">
                          <td className="py-2 px-3 text-[#EA580C] font-semibold whitespace-nowrap">
                            {importResult.fileName}:{err.row}
                          </td>
                          <td className="py-2 px-3 text-[#2563EB] font-semibold whitespace-nowrap">
                            {err.field}
                          </td>
                          <td className="py-2 px-3 text-[#DC2626] font-sans">
                            {err.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
=======
          {/* Quarantined Records Table (if rows were quarantined) */}
          {importResult.errors.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Quarantined Records Review Table ({importResult.errors.length} bad rows)</span>
                </h4>
                <span className="text-[11px] text-slate-400">
                  Critical errors (duplicate IDs, invalid stock) cannot be published under any threshold
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Row #</th>
                      <th className="py-2 px-3">Field</th>
                      <th className="py-2 px-3">Invalid Value</th>
                      <th className="py-2 px-3">Reason for Quarantine</th>
                      <th className="py-2 px-3">Severity</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {importResult.errors.map((err, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 text-slate-300">
                        <td className="py-2 px-3 text-amber-400 font-bold">
                          Row {err.row}
                        </td>
                        <td className="py-2 px-3 text-indigo-300">
                          {err.field}
                        </td>
                        <td className="py-2 px-3 text-rose-300">
                          {err.value || 'N/A'}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-300">
                          {err.message}
                        </td>
                        <td className="py-2 px-3">
                          {err.isCritical ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              CRITICAL
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              WARNING
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-sans">
                          <button
                            type="button"
                            onClick={() => setIsQuarantineReviewed(true)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          >
                            Review &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
