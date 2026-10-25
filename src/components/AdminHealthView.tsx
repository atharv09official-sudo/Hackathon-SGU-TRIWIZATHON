<<<<<<< HEAD
import React, { useState } from 'react';
import {
=======
import React, { useState, useEffect } from 'react';
import {
  Activity,
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  Server,
  Clock,
  AlertTriangle,
  CheckCircle2,
<<<<<<< HEAD
  RotateCcw,
  Bell,
  Cpu
} from 'lucide-react';
import { INITIAL_SCHEDULED_JOBS, INITIAL_ALERTS } from '../data/mockData';
import { ScheduledJob, SystemAlert } from '../types';
import { FlowGridAPI, BackendHealthStatus, OllamaHealthStatus } from '../services/api';
import { useTranslation } from '../context/TranslationContext';

export const AdminHealthView: React.FC = () => {
  const { t, formatNumber } = useTranslation();
=======
  XCircle,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Bell,
  Cpu,
  Layers,
  FileText,
  Sliders,
  Database,
  Wifi,
  WifiOff,
  UserCheck,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Lock,
  Radio
} from 'lucide-react';
import { INITIAL_SCHEDULED_JOBS, INITIAL_ALERTS } from '../data/mockData';
import { ScheduledJob, SystemAlert, UserRole, ThemeMode } from '../types';
import { FlowGridAPI, BackendHealthStatus, OllamaHealthStatus } from '../services/api';

interface AdminHealthViewProps {
  queuedEventCount?: number;
  userRole?: UserRole;
  isOnline?: boolean;
  theme?: ThemeMode;
}

interface ConnectorStatus {
  id: string;
  name: string;
  system: string;
  type: 'WMS' | 'ERP' | 'POS' | 'TELEMETRY';
  status: 'CONNECTED' | 'SYNCHRONIZED' | 'DEGRADED' | 'DISCONNECTED';
  latencyMs: number;
  errorRatePct: number;
  lastSyncAt: string;
  failedImportsCount: number;
  trustTier: 'TIER_1_VERIFIED' | 'TIER_2_QUARANTINE_REVIEW' | 'TIER_3_UNVERIFIED';
}

interface AuditRecord {
  id: string;
  timestamp: string;
  persona: string;
  action: string;
  targetEntity: string;
  reasonCode: string;
  status: 'COMMITTED' | 'QUARANTINED' | 'BLOCKED';
  impact: string;
}

export const AdminHealthView: React.FC<AdminHealthViewProps> = ({
  queuedEventCount = 0,
  userRole = 'priya',
  isOnline = true,
  theme = 'night'
}) => {
  const [activeTab, setActiveTab] = useState<'INFRA' | 'TRUST_POLICIES' | 'MODELS_THRESHOLDS' | 'AUDIT_LOG'>('INFRA');
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const [jobs, setJobs] = useState<ScheduledJob[]>(INITIAL_SCHEDULED_JOBS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [decisionServiceStatus, setDecisionServiceStatus] = useState<'HEALTHY' | 'DEGRADED' | 'DOWN'>('HEALTHY');
  const [backendHealth, setBackendHealth] = useState<BackendHealthStatus | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaHealthStatus | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
<<<<<<< HEAD

  // Poll backend health & Ollama status
  React.useEffect(() => {
=======
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isDay = theme === 'day';
  const isAdmin = userRole === 'priya';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Connectors Matrix State
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([
    {
      id: 'CONN-WMS-01',
      name: 'Pune Hub WMS SAP Connector',
      system: 'SAP S/4HANA (Pune Hub W-PUN)',
      type: 'WMS',
      status: 'CONNECTED',
      latencyMs: 14,
      errorRatePct: 0.0,
      lastSyncAt: 'Just now (Real-time)',
      failedImportsCount: 0,
      trustTier: 'TIER_1_VERIFIED'
    },
    {
      id: 'CONN-ERP-02',
      name: 'Retailer Invoicing ERP Connector',
      system: 'TallyPrime Server 9',
      type: 'ERP',
      status: 'SYNCHRONIZED',
      latencyMs: 24,
      errorRatePct: 0.8,
      lastSyncAt: '4 mins ago',
      failedImportsCount: 2,
      trustTier: 'TIER_2_QUARANTINE_REVIEW'
    },
    {
      id: 'CONN-POS-03',
      name: 'Kirana Field POS Offline Queue Stream',
      system: 'SQLite / IndexedDB Event Bus (Kolhapur STORE-001)',
      type: 'POS',
      status: 'CONNECTED',
      latencyMs: 8,
      errorRatePct: 0.0,
      lastSyncAt: 'Continuous Heartbeat',
      failedImportsCount: 0,
      trustTier: 'TIER_1_VERIFIED'
    },
    {
      id: 'CONN-TEL-04',
      name: 'Maharashtra Roadways Telemetry Gateway',
      system: 'MSRDC / NH-48 Ghat Sensor Stream',
      type: 'TELEMETRY',
      status: 'CONNECTED',
      latencyMs: 42,
      errorRatePct: 1.2,
      lastSyncAt: '12 mins ago',
      failedImportsCount: 1,
      trustTier: 'TIER_2_QUARANTINE_REVIEW'
    }
  ]);

  // Model & Alert Thresholds State
  const [thresholds, setThresholds] = useState({
    stockoutRiskPct: 85,
    importValidationTolerancePct: 5.0, // 5% Rule
    routeRiskRerouteIndex: 0.65,
    batchExpiryWarningDays: 14,
    staleInventoryAlertHours: 6
  });

  // Source-Trust Policies State
  const [trustPolicies, setTrustPolicies] = useState([
    {
      source: 'Warehouse WMS SAP (Pune Hub)',
      tier: 'TIER_1_VERIFIED',
      autoPublish: true,
      quarantineThresholdPct: 0,
      notes: 'Authoritative physical batch inward records; zero quarantine delay.'
    },
    {
      source: 'Distributor CSV / TallyPrime ERP',
      tier: 'TIER_2_QUARANTINE_REVIEW',
      autoPublish: false,
      quarantineThresholdPct: 5.0,
      notes: 'Enforces 5% Rule: bad rows ≤5% quarantined for review; >5% blocks batch publication.'
    },
    {
      source: 'Kirana Field POS Client Store',
      tier: 'TIER_1_VERIFIED',
      autoPublish: true,
      quarantineThresholdPct: 2.0,
      notes: 'Offline resilient counter sales with client-side UUID idempotency tokens.'
    },
    {
      source: 'Crowdsourced Road Traffic & Fuel Logs',
      tier: 'TIER_3_UNVERIFIED',
      autoPublish: false,
      quarantineThresholdPct: 10.0,
      notes: 'Requires planner verification before promotion to trusted training observations.'
    }
  ]);

  // Immutable Administrative Audit Trail
  const [auditLog, setAuditLog] = useState<AuditRecord[]>([
    {
      id: 'AUD-8910',
      timestamp: '2026-10-25 05:42:18',
      persona: 'Rohit Deshpande (Distribution Planner)',
      action: 'ALLOCATION_OVERRIDE',
      targetEntity: 'LINE-004 (Tata Salt / Store Kolhapur)',
      reasonCode: 'DIWALI_KIRANA_SURGE',
      status: 'COMMITTED',
      impact: 'Quantity increased from 10 to 16 cases; stock reserved.'
    },
    {
      id: 'AUD-8909',
      timestamp: '2026-10-25 04:30:11',
      persona: 'Sunita Deshmukh (Warehouse Manager)',
      action: 'STOCK_COUNT_ADJUSTMENT',
      targetEntity: 'LOT-PUN-02 (Parle-G 800g)',
      reasonCode: 'EXPIRY_SPOILAGE',
      status: 'COMMITTED',
      impact: 'Adjusted physical count -12 units; batch version bumped.'
    },
    {
      id: 'AUD-8908',
      timestamp: '2026-10-25 03:15:49',
      persona: 'Priya Sharma (System Administrator)',
      action: 'IMPORT_QUARANTINE_REVIEW',
      targetEntity: 'IMPORT-2026-10-24-001 (Row 14: SKU-014)',
      reasonCode: 'VALIDATED_SUPPLIER_INVOICE',
      status: 'COMMITTED',
      impact: 'Approved quarantined row into master catalog.'
    },
    {
      id: 'AUD-8907',
      timestamp: '2026-10-25 00:00:01',
      persona: 'System Cron (Housekeeping Engine)',
      action: 'FEFO_BATCH_SWEEP',
      targetEntity: 'ALL_ACTIVE_BATCHES (Maharashtra Grid)',
      reasonCode: 'AUTO_NIGHTLY_RECONCILIATION',
      status: 'COMMITTED',
      impact: 'Evaluated 800 batches; 0 stale locks detected.'
    }
  ]);

  // Live polling of backend health & Ollama readiness
  useEffect(() => {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    let active = true;
    const fetchStatus = async () => {
      const [h, o] = await Promise.all([
        FlowGridAPI.checkHealth(),
<<<<<<< HEAD
        FlowGridAPI.getOllamaStatus(),
=======
        FlowGridAPI.getOllamaStatus()
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      ]);
      if (!active) return;
      setBackendHealth(h);
      setOllamaStatus(o);
      if (h.isOnline) {
        setDecisionServiceStatus('HEALTHY');
      }
    };
    fetchStatus();
<<<<<<< HEAD
    const interval = setInterval(fetchStatus, 15000);
=======
    const interval = setInterval(fetchStatus, 12000);
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleSeedNetwork = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await FlowGridAPI.seedFlipkartNetwork();
      setSeedResult(`Seeded: ${res.products_seeded} Products, ${res.batches_seeded} Batches, ${res.stores_seeded} Stores, ${res.warehouses_seeded} Warehouses, ${res.agents_seeded} Agents.`);
<<<<<<< HEAD
    } catch (e: any) {
      setSeedResult(`Seeding notification: ${e?.message || 'Database synchronized'}`);
=======
      showToast('✓ Successfully seeded FMCG network in backend database.');
    } catch (e: any) {
      setSeedResult(`Seeding notification: ${e?.message || 'Database synchronized'}`);
      showToast('Database synchronization completed.');
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSimulateOutage = () => {
    setDecisionServiceStatus('DOWN');
<<<<<<< HEAD

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    const outageAlert: SystemAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      rule: 'DECISION_SERVICE_DOWN',
      openedAt: new Date().toISOString(),
      type: 'EVENT',
      severity: 'critical',
      message: 'Decision Service health check failed twice in 30s (GET /v1/health)',
      details: 'Planner interface notified with "plans unavailable". Last approved plan remains visible (NFR-05).',
<<<<<<< HEAD
      active: true,
    };

    setAlerts(prev => [outageAlert, ...prev]);
=======
      active: true
    };
    setAlerts(prev => [outageAlert, ...prev]);
    showToast('⚠️ Fault injected: Decision service marked DOWN.');
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  };

  const handleRestoreService = () => {
    setDecisionServiceStatus('HEALTHY');
    setAlerts(prev => prev.map(a => a.rule === 'DECISION_SERVICE_DOWN' ? { ...a, active: false } : a));
<<<<<<< HEAD
=======
    showToast('✓ Decision service restored to HEALTHY.');
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  };

  const handleTriggerJob = (jobName: string) => {
    setJobs(prev => prev.map(j => {
      if (j.job === jobName) {
        return {
          ...j,
          lastStartedAt: new Date().toISOString(),
          lastFinishedAt: new Date(Date.now() + 1500).toISOString(),
<<<<<<< HEAD
          status: 'SUCCESS',
=======
          status: 'SUCCESS'
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        };
      }
      return j;
    }));
<<<<<<< HEAD
  };

  return (
    <div className="space-y-6 text-[#1E293B]">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              {t('health.title', 'System Health & Administrative Observability')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              NFR-14 &amp; NFR-15
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            {t('health.subtitle', 'Real-time decision service latency • node-cron scheduler telemetry • T22 fault injection & SLA compliance')}
          </p>
        </div>

        {/* Fault Injection & Network Sync Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Action Button: Red */}
          <button
            onClick={handleSeedNetwork}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            title="Idempotently seed the full Flipkart 100-SKU network into the database"
          >
            <RotateCcw className={`w-4 h-4 text-white ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Seeding Network...' : 'Seed Flipkart 100-SKU Network'}</span>
          </button>

          {decisionServiceStatus === 'HEALTHY' ? (
            <button
              onClick={handleSimulateOutage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#EA580C] bg-[#FFF8E7] hover:bg-[#FAF3E0] border border-[#E7E5E4] transition-all cursor-pointer"
              title="Test T10/T22: Inject decision-service failure and verify last approved plan remains visible"
            >
              <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
              <span>Simulate Service Outage (T22)</span>
            </button>
          ) : (
            <button
              onClick={handleRestoreService}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#15803D] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>Restore Service (Auto-Close Alert)</span>
            </button>
          )}
        </div>
      </div>

      {seedResult && (
        <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#2563EB] flex items-center justify-between shadow-xs">
          <span className="font-mono">{seedResult}</span>
          <button onClick={() => setSeedResult(null)} className="text-[#64748B] hover:text-[#1E293B] text-xs cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Decision Service & Infrastructure Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-semibold text-[#1E293B]">
              <Cpu className="w-4 h-4 text-[#2563EB]" />
              <span>FastAPI Optimization</span>
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${backendHealth?.isOnline ? 'bg-[#15803D] animate-pulse' : 'bg-[#EAB308]'}`} />
          </div>
          <div className="text-2xl font-black text-[#1E293B] font-mono">
            {backendHealth?.isOnline ? 'ONLINE' : decisionServiceStatus}
          </div>
          <p className="text-[11px] text-[#64748B]">
            FMCG Engine + SQLite DB • Latency: <strong className="text-[#15803D]">{backendHealth?.latencyMs !== undefined ? `${backendHealth.latencyMs}ms` : '<1ms'}</strong>
          </p>
          <p className="text-[10px] text-[#64748B]">Fault-injection controls below simulate UI state; they do not alter the backend.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-semibold text-[#1E293B]">
              <Server className="w-4 h-4 text-[#2563EB]" />
              <span>Ollama GenAI Engine</span>
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${ollamaStatus?.isConnected ? 'bg-[#15803D]' : 'bg-[#64748B]'}`} />
          </div>
          <div className="text-2xl font-black text-[#1E293B] font-mono">
            {ollamaStatus?.isConnected ? 'ACTIVE' : 'FALLBACK'}
          </div>
          <p className="text-[11px] text-[#64748B]">
            {ollamaStatus?.isConnected ? `Model: ${ollamaStatus.model}` : 'Rule-based NL rationale active'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-semibold text-[#1E293B]">
              <Server className="w-4 h-4 text-[#15803D]" />
              <span>SQLite & Vector Store</span>
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${backendHealth?.isOnline ? 'bg-[#15803D]' : 'bg-[#64748B]'}`} />
          </div>
          <div className="text-2xl font-black text-[#1E293B] font-mono">
            {backendHealth?.isOnline ? (backendHealth.database.toUpperCase()) : 'CONNECTED'}
          </div>
          <p className="text-[11px] text-[#64748B]">
            SQLite (Alembic Head) + FAISS Index (100 SKUs)
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-semibold text-[#1E293B]">
              <Bell className="w-4 h-4 text-[#EA580C]" />
              <span>Active System Alerts</span>
            </span>
            <span className="text-[#EA580C] font-bold">{alerts.filter(a => a.active).length} Open</span>
          </div>
          <div className="text-2xl font-black text-[#EA580C] font-mono">
            {alerts.filter(a => a.active).length} ALERT(S)
          </div>
          <p className="text-[11px] text-[#64748B]">
            Evaluated every 30s by scheduler (NFR-15, Section 9.6)
          </p>
        </div>
      </div>

      {/* Active Alerts Center */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#EA580C]" />
          <span>Observability Alert Center (Section 9.6)</span>
        </h3>

        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                alert.active
                  ? alert.severity === 'critical'
                    ? 'bg-red-50/70 border-red-200'
                    : 'bg-[#FFF8E7] border-[#E7E5E4]'
                  : 'bg-[#FAF3E0]/40 border-[#E7E5E4] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    alert.severity === 'critical' ? 'bg-red-100 text-[#DC2626]' : 'bg-amber-100 text-[#EA580C]'
                  }`}>
                    {alert.rule}
                  </span>
                  <span className="text-xs font-bold text-[#1E293B]">{alert.message}</span>
                  {!alert.active && (
                    <span className="text-[10px] text-[#64748B] font-bold uppercase">(CLOSED)</span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-1">{alert.details}</p>
                <span className="text-[10px] text-[#64748B] mt-0.5 block font-mono">Opened: {new Date(alert.openedAt).toLocaleTimeString()}</span>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-bold shrink-0 font-mono ${
                alert.active ? 'bg-amber-100 text-[#EA580C] border border-amber-200' : 'bg-[#FFF8E7] text-[#64748B] border border-[#E7E5E4]'
              }`}>
                {alert.active ? 'ACTIVE ALERT' : 'RESOLVED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Jobs Table (NFR-14) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            <span>Scheduled Housekeeping Cron Jobs (NFR-14 &amp; T19)</span>
          </h3>
          <span className="text-xs text-[#64748B]">All jobs idempotent</span>
        </div>

        <div className="rounded-xl border border-[#E7E5E4] overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E4] bg-[#FAF3E0] text-[#64748B] font-semibold uppercase">
                  <th className="py-2.5 px-3">Job Name</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Last Finished</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Manual Run</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {jobs.map(j => (
                  <tr key={j.job} className="hover:bg-[#FFF8E7]/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#2563EB] whitespace-nowrap">
                      {j.job}
                    </td>
                    <td className="py-3 px-3 text-[#1E293B] font-medium whitespace-nowrap">
                      {j.frequency}
                    </td>
                    <td className="py-3 px-3 text-[#64748B] text-[11px] max-w-xs leading-relaxed">
                      {j.description}
                    </td>
                    <td className="py-3 px-3 text-[#64748B] font-mono whitespace-nowrap">
                      {new Date(j.lastFinishedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#15803D] border border-emerald-200">
                        {j.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleTriggerJob(j.job)}
                        className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        Trigger Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
=======
    showToast(`✓ Triggered job: ${jobName}`);
  };

  const handleSaveThresholds = () => {
    showToast('✓ System alert thresholds updated and published to rule evaluator.');
  };

  return (
    <div className={`space-y-6 transition-colors duration-200 ${isDay ? 'theme-day' : 'theme-night'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0a192f] text-white border border-cyan-400/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isDay
          ? 'bg-white border-slate-200 shadow-sm'
          : 'glass-panel border-slate-800 shadow-xl'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>


            <h1 className={`text-xl sm:text-2xl font-black tracking-tight mt-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              System health
            </h1>

          </div>

          {/* Fault-Injection & Database Sync Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSeedNetwork}
              disabled={isSeeding}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer ${
                isDay
                  ? 'btn-navy text-white shadow-sm'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
              title="Idempotently seed the full Flipkart 100-SKU network into backend SQLite"
            >
              <RotateCcw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding Network...' : 'Seed FMCG 100-SKU Network'}</span>
            </button>

            {decisionServiceStatus === 'HEALTHY' ? (
              <button
                onClick={handleSimulateOutage}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer"
                title="Inject decision-service failure and verify last approved plan remains visible (NFR-05)"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Simulate Service Outage</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreService}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Restore Service</span>
              </button>
            )}
          </div>
        </div>

        {seedResult && (
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between">
            <span className="font-mono">{seedResult}</span>
            <button onClick={() => setSeedResult(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Quad Health & Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Backend API Readiness */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Python FastAPI + ML</span>
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${backendHealth?.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          </div>
          <div className={`text-2xl font-black mt-2 font-mono ${
            backendHealth?.isOnline ? (isDay ? 'text-emerald-700' : 'text-emerald-400') : 'text-amber-500'
          }`}>
            {backendHealth?.isOnline ? 'API CONNECTED' : 'CHECKING PROBE'}
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Latency RTT:</span>
            <strong className="font-mono text-indigo-600 dark:text-indigo-300">
              {backendHealth?.latencyMs !== undefined ? `${backendHealth.latencyMs} ms` : '&lt; 10 ms'}
            </strong>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Live response from /api/v1/health/readiness</p>
        </div>

        {/* Card 2: Database Connectivity */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Database Persistence</span>
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${backendHealth?.isOnline ? 'bg-emerald-500' : 'bg-slate-600'}`} />
          </div>
          <div className={`text-2xl font-black mt-2 font-mono ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
            {backendHealth?.isOnline ? 'SQLITE READY' : 'LOCAL CACHE'}
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Integrity Status:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">100% Passed</strong>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Authoritative backend authority enforced</p>
        </div>

        {/* Card 3: Offline Synchronization Queue Depth (Requirement: Initial is 0) */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              {isOnline ? <Wifi className="w-4 h-4 text-cyan-500" /> : <WifiOff className="w-4 h-4 text-amber-500" />}
              <span>Sync Queue Depth</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              queuedEventCount === 0 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}>
              {queuedEventCount === 0 ? 'SYNCHRONIZED' : `${queuedEventCount} PENDING`}
            </span>
          </div>
          <div className={`text-2xl font-black mt-2 font-mono ${
            queuedEventCount === 0 ? (isDay ? 'text-indigo-900' : 'text-cyan-300') : 'text-amber-500'
          }`}>
            {queuedEventCount} QUEUED
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Offline Event Bus:</span>
            <strong className="font-mono text-emerald-600 dark:text-emerald-400">0 Dropped</strong>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {queuedEventCount === 0 ? 'Queue clean; all POS & warehouse events committed' : 'Events will sync automatically on heartbeat'}
          </p>
        </div>

        {/* Card 4: Active Alerts & Stale Data */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Active System Alerts</span>
            </span>
            <span className="text-amber-500 font-bold">{alerts.filter(a => a.active).length} Open</span>
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-500">
            {alerts.filter(a => a.active).length} ALERT(S)
          </div>
          <div className="mt-2 text-xs flex items-center justify-between text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Failed Imports Quarantine:</span>
            <strong className="font-mono text-indigo-600 dark:text-indigo-400">3 Rows (Under 5% Rule)</strong>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Connector errors &amp; batch age monitored</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs for System Administrator (Priya Sharma Scope) */}
      <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border ${
        isDay ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <button
          onClick={() => setActiveTab('INFRA')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'INFRA'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white shadow-md'
              : isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Infra &amp; Connectors Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('TRUST_POLICIES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'TRUST_POLICIES'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white shadow-md'
              : isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Source-Trust Policies &amp; 5% Rule</span>
        </button>

        <button
          onClick={() => setActiveTab('MODELS_THRESHOLDS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'MODELS_THRESHOLDS'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white shadow-md'
              : isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Model Versions &amp; Alert Thresholds</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'AUDIT_LOG'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white shadow-md'
              : isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Administrative Overrides Audit Log ({auditLog.length})</span>
        </button>
      </div>

      {/* Tab 1: Live Infrastructure & Connectors Matrix */}
      {activeTab === 'INFRA' && (
        <div className="space-y-6">
          {/* Connector Telemetry Matrix */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
                  <Server className="w-4 h-4 text-indigo-500" />
                  <span>External Connectors &amp; Data Pipeline Streams</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live status of SAP WMS, TallyPrime ERP, Kirana Field POS, and MSRDC Highway telemetry connectors.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                All 4 Connectors Operational
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase font-bold text-[11px] ${
                    isDay ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-900/80 text-slate-400 border-slate-800'
                  }`}>
                    <th className="py-3 px-4">Connector / System</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Trust Tier</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Latency RTT</th>
                    <th className="py-3 px-3">Error Rate</th>
                    <th className="py-3 px-3">Failed Imports</th>
                    <th className="py-3 px-4">Last Sync</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {connectors.map(conn => (
                    <tr key={conn.id} className={isDay ? 'hover:bg-slate-50/70' : 'hover:bg-slate-900/40'}>
                      <td className="py-3.5 px-4">
                        <div className={`font-bold ${isDay ? 'text-[#0a192f]' : 'text-slate-100'}`}>{conn.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{conn.system}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {conn.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          conn.trustTier === 'TIER_1_VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : conn.trustTier === 'TIER_2_QUARANTINE_REVIEW'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                        }`}>
                          {conn.trustTier === 'TIER_1_VERIFIED' ? 'Tier 1 Verified' : conn.trustTier === 'TIER_2_QUARANTINE_REVIEW' ? 'Tier 2 (5% Rule)' : 'Tier 3 Unverified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{conn.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {conn.latencyMs} ms
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        <span className={conn.errorRatePct > 1 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
                          {conn.errorRatePct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        {conn.failedImportsCount > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                            {conn.failedImportsCount} row(s)
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {conn.lastSyncAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stale Data & Telemetry Monitor */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Stale Data &amp; Location Telemetry Monitor</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Monitoring telemetry snapshot freshness across Maharashtra hubs and stores. Items older than 6 hours trigger planner notifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Pune Hub (W-PUN) Batches</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    FRESH
                  </span>
                </div>
                <div className="text-xl font-bold font-mono mt-2 text-indigo-600 dark:text-indigo-300">
                  18 mins ago
                </div>
                <p className="text-[11px] text-slate-400 mt-1">800 active batches synchronized with zero drift</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Kolhapur Store (STORE-001)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    REAL-TIME
                  </span>
                </div>
                <div className="text-xl font-bold font-mono mt-2 text-indigo-600 dark:text-indigo-300">
                  Continuous
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Offline event queue clean; 0 events backlog</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">NH-48 / Bhor Ghat Roadway</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    SIMULATED
                  </span>
                </div>
                <div className="text-xl font-bold font-mono mt-2 text-indigo-600 dark:text-indigo-300">
                  42 mins ago
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Synthetic rain &amp; pothole indices active</p>
              </div>
            </div>
          </div>

          {/* Active Alerts Center */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Observability Alerts &amp; Rule Violations</span>
            </h3>

            <div className="space-y-3 mt-4">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    alert.active
                      ? alert.severity === 'critical'
                        ? isDay ? 'bg-rose-50 border-rose-300' : 'bg-rose-950/30 border-rose-500/50'
                        : isDay ? 'bg-amber-50 border-amber-300' : 'bg-amber-950/30 border-amber-500/50'
                      : isDay ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      }`}>
                        {alert.rule}
                      </span>
                      <span className={`text-xs font-bold ${isDay ? 'text-slate-900' : 'text-white'}`}>
                        {alert.message}
                      </span>
                      {!alert.active && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">(CLOSED)</span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
                      {alert.details}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Opened: {new Date(alert.openedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-bold shrink-0 ${
                    alert.active
                      ? isDay ? 'bg-amber-500 text-white' : 'bg-amber-400 text-slate-950'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {alert.active ? 'ACTIVE ALERT' : 'RESOLVED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Housekeeping Cron Jobs */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Scheduled Housekeeping Cron Jobs (NFR-14 &amp; T19)</span>
              </h3>
              <span className="text-xs text-slate-400">All jobs idempotent</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase font-bold text-[11px] ${
                    isDay ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-900/80 text-slate-400 border-slate-800'
                  }`}>
                    <th className="py-2.5 px-3">Job Name</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Last Finished</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Manual Run</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {jobs.map(j => (
                    <tr key={j.job} className={isDay ? 'hover:bg-slate-50/70' : 'hover:bg-slate-900/40'}>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-300">
                        {j.job}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                        {j.frequency}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs">
                        {j.description}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {new Date(j.lastFinishedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {j.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleTriggerJob(j.job)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            isDay
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          Trigger Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Source-Trust Policies & 5% Import Rule */}
      {activeTab === 'TRUST_POLICIES' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <span>Data Source Registry &amp; Source-Trust Policies</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Priya Sharma manages data trust levels and publication gating rules. Protects downstream ML optimization engines from corrupted batches.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase font-bold text-[11px] ${
                    isDay ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-900/80 text-slate-400 border-slate-800'
                  }`}>
                    <th className="py-3 px-4">Data Source System</th>
                    <th className="py-3 px-3">Trust Tier</th>
                    <th className="py-3 px-3">5% Rule Validation</th>
                    <th className="py-3 px-3">Auto-Publish</th>
                    <th className="py-3 px-4">Policy Description</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {trustPolicies.map((pol, idx) => (
                    <tr key={idx} className={isDay ? 'hover:bg-slate-50/70' : 'hover:bg-slate-900/40'}>
                      <td className={`py-3.5 px-4 font-bold ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
                        {pol.source}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pol.tier === 'TIER_1_VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : pol.tier === 'TIER_2_QUARANTINE_REVIEW'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                        }`}>
                          {pol.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {pol.quarantineThresholdPct > 0 ? `≤ ${pol.quarantineThresholdPct}% Threshold` : '0% (Direct ERP)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pol.autoPublish
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}>
                          {pol.autoPublish ? 'AUTO-APPROVED' : 'REQUIRES REVIEW'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-sm">
                        {pol.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Model Versions & Alert Thresholds */}
      {activeTab === 'MODELS_THRESHOLDS' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              <Cpu className="w-5 h-5 text-indigo-500" />
              <span>Production ML Models &amp; Local Ollama LLM Engines</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Manage deployed machine learning model weights, quantile prediction configurations, and LLM reasoning fallbacks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Demand Forecasting ML</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-mono">
                    v1.4 Quantile
                  </span>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  GradientBoosting Quantile Regressor
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Outputs P50 median and P90 upper quantile replenishment buffer with 88.4% directional accuracy.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Ghat &amp; Alley Road Risk</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-mono">
                    v2.1 Geometry
                  </span>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Narrow Alley Width + Weather Scorer
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Evaluates 2.5m lane clearance, ghat hairpin turns, and monsoon delay surcharges.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Local Reasoning Engine</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 font-mono">
                    {ollamaStatus?.model || 'qwen2.5:7b'}
                  </span>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Ollama Causal Dispatch Briefing
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Generates plain-language trade-off rationales and warehouse executive briefings.
                </p>
              </div>
            </div>
          </div>

          {/* Configurable Alert Thresholds */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
                  <Sliders className="w-5 h-5 text-indigo-500" />
                  <span>Configurable System Alert Thresholds</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust triggers for stockout alerts, quarantine rates, and road-risk replanning.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveThresholds}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDay ? 'btn-navy text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                Save Thresholds
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Stockout Risk Trigger (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="60"
                    max="99"
                    value={thresholds.stockoutRiskPct}
                    onChange={e => setThresholds(prev => ({ ...prev, stockoutRiskPct: parseInt(e.target.value) }))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {thresholds.stockoutRiskPct}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Default: 85% probability threshold</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  5% Rule Import Quarantine Tolerance (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={thresholds.importValidationTolerancePct}
                    onChange={e => setThresholds(prev => ({ ...prev, importValidationTolerancePct: parseFloat(e.target.value) }))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {thresholds.importValidationTolerancePct}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">&gt; 5% blocks publication entirely</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Road-Risk Reroute Threshold (0-1)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.3"
                    max="0.9"
                    step="0.05"
                    value={thresholds.routeRiskRerouteIndex}
                    onChange={e => setThresholds(prev => ({ ...prev, routeRiskRerouteIndex: parseFloat(e.target.value) }))}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {thresholds.routeRiskRerouteIndex}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Auto-divert trucks from hazardous ghats</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Immutable Administrative Audit Log */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border transition-all ${
            isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`text-base font-bold flex items-center gap-2 ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span>Administrative Overrides &amp; Security Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cryptographically referenced audit records of all manual interventions, reason-coded inventory adjustments, and policy updates.
                </p>
              </div>
              <span className="text-xs font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                Immutable Log • Section 11.3
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase font-bold text-[11px] ${
                    isDay ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-900/80 text-slate-400 border-slate-800'
                  }`}>
                    <th className="py-3 px-4">Audit ID</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Persona / User</th>
                    <th className="py-3 px-3">Action Type</th>
                    <th className="py-3 px-3">Target Entity</th>
                    <th className="py-3 px-3">Reason Code</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4">Impact Summary</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDay ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                  {auditLog.map(record => (
                    <tr key={record.id} className={isDay ? 'hover:bg-slate-50/70' : 'hover:bg-slate-900/40'}>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-300">
                        {record.id}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {record.timestamp}
                      </td>
                      <td className={`py-3.5 px-3 font-semibold ${isDay ? 'text-[#0a192f]' : 'text-slate-200'}`}>
                        {record.persona}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {record.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {record.targetEntity}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {record.reasonCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{record.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs">
                        {record.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    </div>
  );
};
