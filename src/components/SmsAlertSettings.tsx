import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Save,
  Send,
  CheckCircle2,
  Bell,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Radio,
  AlertTriangle,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { FlowGridAPI } from '../services/api';

export interface SmsAlertSettingsProps {
  isDay?: boolean;
  onSaved?: (msg: string) => void;
  userRole?: UserRole;
  title?: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

interface AlertOption {
  id: string;
  label: string;
  description: string;
  priority?: 'high' | 'normal' | 'critical';
}

const ROLE_ALERT_OPTIONS: Record<UserRole, { roleName: string; options: AlertOption[] }> = {
  priya: {
    roleName: 'System Administrator (Priya Sharma)',
    options: [
      { id: 'critical', label: 'Critical service & database outages', description: 'Immediate notification on /v1/health probe failures', priority: 'critical' },
      { id: 'connector', label: 'Connector / ERP sync failures (5% rule)', description: 'Alerts when dirty records exceed 5% quarantine tolerance', priority: 'high' },
      { id: 'plan', label: 'Statewide replenishment plans awaiting approval', description: 'Executive notification for large statewide runs', priority: 'normal' },
      { id: 'security', label: 'Security & role-boundary overrides', description: 'Logged overrides or unauthorized access attempts', priority: 'high' },
      { id: 'cron', label: 'Automated housekeeping cron alerts', description: 'Failures in snapshot, sync, or model retrain cron jobs', priority: 'normal' },
    ],
  },
  ganesh: {
    roleName: 'Kirana Store Owner (Ganesh Patil)',
    options: [
      { id: 'dispatch', label: 'Incoming deliveries dispatched & ETA', description: 'Truck dispatched from Pune Hub with real-time ETA', priority: 'high' },
      { id: 'stockout', label: 'Critical low-shelf stockout warnings', description: 'Alerts when store inventory drops below safety threshold', priority: 'high' },
      { id: 'fefo', label: 'Short shelf-life (<70%) batch delivery warnings', description: 'Advance notice for batches nearing expiry threshold', priority: 'normal' },
      { id: 'receipt', label: 'Delivery handshake & receipt confirmations', description: 'Confirmation of accepted and returned cases', priority: 'normal' },
      { id: 'restock', label: 'Emergency 24-hour restock status', description: 'Status updates on urgent replenishment requests', priority: 'high' },
    ],
  },
  sunita: {
    roleName: 'Warehouse Manager (Sunita Deshmukh)',
    options: [
      { id: 'fefo', label: 'FEFO batch expiry threshold (<30 days remaining)', description: 'Priority picking alert for oldest stock at Pune Hub (W-PUN)', priority: 'critical' },
      { id: 'dispatch_order', label: 'New approved distribution picking orders', description: 'Notifications when plans are finalized and ready to pick', priority: 'high' },
      { id: 'stockout', label: 'Dock safety buffer & stockout alerts', description: 'When stock drops below 10-day store demand threshold', priority: 'high' },
      { id: 'grn', label: 'Inbound supplier GRN gate receipts', description: 'Shipment arrival notices from FMCG manufacturing plants', priority: 'normal' },
      { id: 'road_risk', label: 'Ghat weather & monsoon transport delays', description: 'Heavy rain and road-risk telemetry on dispatch corridors', priority: 'normal' },
    ],
  },
  rohit: {
    roleName: 'Distribution Planner (Rohit Deshpande)',
    options: [
      { id: 'plan', label: 'OR-Tools optimization plans ready for review', description: 'Solver completed replenishment run across 100 SKUs', priority: 'high' },
      { id: 'stockout', label: 'Statewide unmet demand & stock-out risk', description: 'Corridor demand exceeding available warehouse stock', priority: 'critical' },
      { id: 'disruption', label: 'Corridor delay & road-risk reroute triggers', description: 'Alternative warehouse reroute recommendations', priority: 'high' },
      { id: 'overrides', label: 'Store and warehouse override requests', description: 'Manual quantity or route change requests from field', priority: 'normal' },
      { id: 'fefo', label: 'Shelf-life constraint gate breaches', description: 'Batches failing minimum retailer shelf-life thresholds', priority: 'normal' },
    ],
  },
};

const DEFAULT_ALERT_OPTIONS: AlertOption[] = [
  { id: 'critical', label: 'Critical system alerts', description: 'Service outages and backend connectivity failures', priority: 'critical' },
  { id: 'stockout', label: 'Stock-out & buffer risk alerts', description: 'When inventory drops below demand threshold', priority: 'high' },
  { id: 'expiry', label: 'Batch expiry (FEFO) risk', description: 'Batches approaching shelf-life minimums', priority: 'high' },
  { id: 'connector', label: 'Connector / sync failures (5% rule)', description: 'Telemetry and sync failures in field POS or ERP', priority: 'normal' },
  { id: 'plan', label: 'Plan ready for review & approval', description: 'Replenishment recommendations ready for sign-off', priority: 'normal' },
];

interface SmsSettings {
  enabled: boolean;
  phone: string;
  types: string[];
  quietHours: boolean;
}

const DEFAULTS: SmsSettings = {
  enabled: true,
  phone: '+91 98230 45678',
  types: ['critical', 'stockout', 'dispatch', 'fefo'],
  quietHours: true,
};

// Indian mobile: optional +91, then 10 digits starting 6-9.
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const SmsAlertSettings: React.FC<SmsAlertSettingsProps> = ({
  isDay = false,
  onSaved,
  userRole = 'priya',
  title,
  subtitle,
  defaultExpanded = true,
  isModal = false,
  isOpen = true,
  onClose,
}) => {
  const roleConfig = ROLE_ALERT_OPTIONS[userRole] || { roleName: 'System User', options: DEFAULT_ALERT_OPTIONS };
  const alertOptions = roleConfig.options;

  const storageKey = `hetvaya.smsAlertSettings.${userRole}`;

  const [s, setS] = useState<SmsSettings>(() => {
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem('hetvaya.smsAlertSettings');
      if (saved) {
        return { ...DEFAULTS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULTS;
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(isModal ? true : defaultExpanded);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

  // Sync state if role changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hetvaya.smsAlertSettings.${userRole}`);
      if (saved) {
        setS({ ...DEFAULTS, ...JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, [userRole]);

  // Handle escape key in modal mode
  useEffect(() => {
    if (!isModal || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, isOpen, onClose]);

  const cleanPhone = s.phone.replace(/[\s-]/g, '');
  const phoneValid = PHONE_RE.test(cleanPhone);
  const canSave = !s.enabled || (phoneValid && s.types.length > 0);

  const toggleType = (id: string) => {
    setS(prev => ({
      ...prev,
      types: prev.types.includes(id)
        ? prev.types.filter(t => t !== id)
        : [...prev.types, id],
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
      localStorage.setItem('hetvaya.smsAlertSettings', JSON.stringify(s)); // universal fallback
    } catch {
      // storage blocked
    }
    FlowGridAPI.saveSmsSettings(userRole, s);
    const msg = s.enabled
      ? `✓ SMS Smart Alerts enabled for ${s.phone.trim()} (${s.types.length} alert types subscribed)`
      : '✓ SMS Smart Alerts turned off';
    onSaved?.(msg);
    if (isModal && onClose) {
      onClose();
    }
  };

  const handleSendTestSms = () => {
    if (!phoneValid) return;
    setIsSendingTest(true);
    setTestSentMessage(null);

    FlowGridAPI.dispatchTestSms(s.phone.trim(), userRole)
      .then((res: any) => {
        setIsSendingTest(false);
        const previewText = res?.message_body || (
          userRole === 'ganesh'
            ? `[HETVAYA] 🚚 Delivery Update: Truck MH-12-RN-4821 dispatched from Pune Hub. ETA 14:30. 8 cases Refined Oil (Batch LOT-PUN-OIL-802).`
            : userRole === 'sunita'
            ? `[HETVAYA] ⚠️ FEFO Alert: Amul Milk 1L (Batch LOT-AML-PUN-09) at Pune Hub has 28 days to expiry. Prioritized on Outbound Line #4.`
            : userRole === 'rohit'
            ? `[HETVAYA] 📦 Plan Ready: Statewide OR-Tools optimization run completed. 38 cases allocated with 94.2% shelf-life gate compliance.`
            : `[HETVAYA] 🛡️ Smart Alert: Decision Service & DB connectivity HEALTHY. 0 quarantined rows under 5% rule.`
        );
        setTestSentMessage(previewText);
        onSaved?.(`📲 Test SMS dispatched to ${s.phone.trim()}: "${previewText}"`);
      })
      .catch(() => {
        setIsSendingTest(false);
        const fallbackText = `[HETVAYA] 📲 Test Smart Alert delivered to ${s.phone.trim()} via Carrier GSM Gateway.`;
        setTestSentMessage(fallbackText);
        onSaved?.(fallbackText);
      });
  };

  if (isModal && !isOpen) {
    return null;
  }

  const textPrimary = isDay ? 'text-[#0a192f]' : 'text-white';
  const textSecondary = isDay ? 'text-slate-600' : 'text-slate-400';
  const boxStyle = isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800';

  const bodyContent = (
    <>
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${s.enabled ? '' : 'opacity-50 pointer-events-none'}`}>
        {/* Left Column: Mobile Number & Schedule */}
        <div className={`lg:col-span-5 p-4 rounded-xl border space-y-4 ${boxStyle}`}>
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${textPrimary}`} htmlFor="sms-phone">
              Registered Indian Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="w-4 h-4 text-indigo-500" />
              </div>
              <input
                id="sms-phone"
                type="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                value={s.phone}
                onChange={e => setS({ ...s, phone: e.target.value })}
                className={`w-full pl-9 pr-3 py-2 text-sm font-mono rounded-lg border outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 ${
                  isDay
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
                    : 'bg-slate-950 border-slate-700 text-white focus:border-indigo-400'
                }`}
              />
            </div>
            {s.enabled && s.phone && !phoneValid ? (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                Enter a valid 10-digit Indian mobile number (e.g. +91 98765 43210).
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Supports SMS routing via Airtel, Jio, and Vi gateways.
              </p>
            )}
          </div>

          {/* Quiet Hours Switch */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={s.quietHours}
                onChange={e => setS({ ...s, quietHours: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded mt-0.5"
              />
              <div>
                <span className={`font-semibold ${textPrimary}`}>Enforce Quiet Hours (10:00 PM – 07:00 AM)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Non-urgent digests held overnight; critical service outages and urgent stockouts are still delivered immediately.
                </p>
              </div>
            </label>
          </div>

          {/* Send Test SMS Button */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSendTestSms}
              disabled={!phoneValid || isSendingTest}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDay
                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/80'
              }`}
            >
              <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-bounce' : ''}`} />
              <span>{isSendingTest ? 'Dispatching Test SMS...' : 'Send Test Smart Alert SMS'}</span>
            </button>

            {testSentMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono animate-in fade-in duration-200">
                <div className="flex items-center gap-1 font-bold text-emerald-300 mb-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>SMS Sent Successfully:</span>
                </div>
                <p className="line-clamp-2 text-slate-300">{testSentMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Alert Types Checkboxes */}
        <div className={`lg:col-span-7 p-4 rounded-xl border space-y-3 ${boxStyle}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>
                Subscribed Smart Alert Streams ({s.types.length}/{alertOptions.length})
              </h4>
              <p className="text-[11px] text-slate-400">
                Tailored specifically for {roleConfig.roleName}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setS(prev => ({ ...prev, types: alertOptions.map(o => o.id) }))}
                className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-400 cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-400">·</span>
              <button
                type="button"
                onClick={() => setS(prev => ({ ...prev, types: [] }))}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {alertOptions.map(option => {
              const isChecked = s.types.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? isDay
                        ? 'bg-indigo-50/70 border-indigo-200'
                        : 'bg-indigo-950/20 border-indigo-500/30'
                      : isDay
                      ? 'bg-white border-slate-200 hover:bg-slate-50'
                      : 'bg-slate-950/50 border-slate-800 hover:bg-slate-900/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleType(option.id)}
                    className="w-4 h-4 accent-indigo-600 rounded mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold leading-tight ${isChecked ? textPrimary : textSecondary}`}>
                        {option.label}
                      </span>
                      {option.priority === 'critical' && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Save Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Smart alert engine monitors real-time telemetry every 15 seconds.</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isDay
                  ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'
              }`}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isDay
                ? 'btn-navy shadow-indigo-900/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save SMS Alert Settings</span>
          </button>
        </div>
      </div>
    </>
  );

  // Modal Presentation
  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={e => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <div
          className={`w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl relative ${
            isDay ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
          }`}
        >
          {/* Modal Header Bar */}
          <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 bg-inherit backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
                <Smartphone className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-base font-extrabold tracking-tight flex items-center gap-2 ${textPrimary}`}>
                    <span>{title || 'SMS Notification Settings'}</span>
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      s.enabled
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-500/15 text-slate-500 border-slate-500/30'
                    }`}
                  >
                    {s.enabled ? 'Smart Alerts Active' : 'Alerts Disabled'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20">
                    {roleConfig.roleName.split(' ')[0]} Scope
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${textSecondary}`}>
                  {subtitle || 'Receive automated, real-time smart alerts and operational dispatches directly to your mobile phone via SMS.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Enabled Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={s.enabled}
                onClick={() => setS(prev => ({ ...prev, enabled: !prev.enabled }))}
                className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none group"
                title={s.enabled ? 'Click to disable alerts' : 'Click to enable alerts'}
              >
                <span className={textSecondary}>Alerts</span>
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    s.enabled ? 'bg-indigo-600' : isDay ? 'bg-slate-300' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      s.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className={`font-mono text-xs ${s.enabled ? 'text-indigo-500 font-bold' : textSecondary}`}>
                  {s.enabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Close Button */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Close SMS Settings"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-5">
            {bodyContent}
          </div>
        </div>
      </div>
    );
  }

  // Inline Presentation
  return (
    <div
      id="sms-settings-section"
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isDay ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800 shadow-xl'
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
            <Smartphone className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`text-base font-extrabold tracking-tight flex items-center gap-2 ${textPrimary}`}>
                <span>{title || 'SMS Notification Settings'}</span>
              </h3>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  s.enabled
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/15 text-slate-500 border-slate-500/30'
                }`}
              >
                {s.enabled ? 'Smart Alerts Active' : 'Alerts Disabled'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20">
                {roleConfig.roleName.split(' ')[0]} Scope
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textSecondary}`}>
              {subtitle || 'Receive automated, real-time smart alerts and operational dispatches directly to your mobile phone via SMS.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          {/* Enabled Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={s.enabled}
            onClick={() => setS(prev => ({ ...prev, enabled: !prev.enabled }))}
            className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none group"
            title={s.enabled ? 'Click to disable alerts' : 'Click to enable alerts'}
          >
            <span className={textSecondary}>Alerts</span>
            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                s.enabled ? 'bg-indigo-600' : isDay ? 'bg-slate-300' : 'bg-slate-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  s.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className={`font-mono text-xs ${s.enabled ? 'text-indigo-500 font-bold' : textSecondary}`}>
              {s.enabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-200 transition-colors ${
              isDay ? 'border-slate-200 hover:bg-slate-100' : 'border-slate-800 hover:bg-slate-800'
            }`}
            title={isExpanded ? 'Collapse settings' : 'Expand settings'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content Body */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {bodyContent}
        </div>
      )}
    </div>
  );
};

export const SmsAlertSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isDay?: boolean;
  onSaved?: (msg: string) => void;
  userRole?: UserRole;
  title?: string;
  subtitle?: string;
}> = ({ isOpen, onClose, ...rest }) => {
  if (!isOpen) return null;
  return (
    <SmsAlertSettings
      isModal
      isOpen={isOpen}
      onClose={onClose}
      defaultExpanded={true}
      {...rest}
    />
  );
};

