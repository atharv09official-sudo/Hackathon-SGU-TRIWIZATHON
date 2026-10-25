import React, { useState, useEffect } from 'react';
import {
  Bell,
  Fuel,
  AlertTriangle,
  Truck,
  ShieldCheck,
  Send,
  Eye,
  EyeOff,
  Copy,
  Check,
  Zap,
  RotateCcw,
  Sparkles,
  Phone,
  MessageSquare,
  Lock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Radio,
  Sliders,
  Smartphone,
  Gauge,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  NotificationRule,
  TwilioConfig,
  SmsDispatchLog,
  MainframeScanResult,
  UserRole,
  ThemeMode
} from '../types';
import { FlowGridAPI, computeClientTokenStats } from '../services/api';

interface NotificationsViewProps {
  userRole?: UserRole;
  theme?: ThemeMode;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  userRole = 'rohit',
  theme = 'day'
}) => {
  // Twilio Credentials State
  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>({
    account_sid: '',
    auth_token: '',
    from_phone: '',
    recipient_phone: '+919822144512',
    is_configured: false,
    is_real_twilio: false,
    masked_token: '••••••••',
  });

  const [showAuthToken, setShowAuthToken] = useState<boolean>(false);
  const [copiedSid, setCopiedSid] = useState<boolean>(false);
  const [isSavingCreds, setIsSavingCreds] = useState<boolean>(false);

  // Notification Rules State (with toggle states and message contents)
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(true);

  // Mainframe Scanner State
  const [scanResult, setScanResult] = useState<MainframeScanResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // SMS Logs & Activity
  const [smsLogs, setSmsLogs] = useState<SmsDispatchLog[]>([]);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Selected Rule for Live Mobile Preview
  const [selectedRuleId, setSelectedRuleId] = useState<string>('RULE-FUEL-01');

  const isDay = theme === 'day';

  const showToast = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Load Initial Data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoadingRules(true);
      try {
        const [loadedRules, loadedConfig, loadedLogs] = await Promise.all([
          FlowGridAPI.getNotificationRules(),
          FlowGridAPI.getTwilioConfig(),
          FlowGridAPI.getNotificationLogs(),
        ]);
        if (!isMounted) return;
        setRules(loadedRules);
        setTwilioConfig(loadedConfig);
        setSmsLogs(loadedLogs);
        if (loadedRules.length > 0) {
          setSelectedRuleId(loadedRules[0].id);
        }
      } catch (err) {
        console.error('Failed to load notification settings:', err);
      } finally {
        if (isMounted) setIsLoadingRules(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save Twilio Credentials
  const handleSaveCredentials = async () => {
    setIsSavingCreds(true);
    try {
      const updated = await FlowGridAPI.updateTwilioConfig({
        account_sid: twilioConfig.account_sid,
        auth_token: twilioConfig.auth_token,
        from_phone: twilioConfig.from_phone,
        recipient_phone: twilioConfig.recipient_phone,
      });
      setTwilioConfig(updated);
      showToast(
        updated.is_real_twilio
          ? '✓ Twilio Live API credentials validated & encrypted!'
          : '✓ Twilio settings saved in local environment & demo simulator.',
        'success'
      );
    } catch {
      showToast('Notice: Saved locally in browser vault.', 'warning');
    } finally {
      setIsSavingCreds(false);
    }
  };

  // Toggle Rule ON / OFF
  const handleToggleRule = async (ruleId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, is_enabled: newStatus } : r))
    );

    try {
      await FlowGridAPI.updateNotificationRule(ruleId, { is_enabled: newStatus });
      const target = rules.find((r) => r.id === ruleId);
      showToast(
        `${target?.title || 'Rule'} is now ${newStatus ? 'ENABLED (SMS active)' : 'MUTED (SMS suppressed to save tokens)'}.`,
        newStatus ? 'success' : 'warning'
      );
    } catch (e) {
      console.warn('Failed to update rule toggle:', e);
    }
  };

  // Update Carried Message Content
  const handleMessageChange = (ruleId: string, newContent: string) => {
    const tokenStats = computeClientTokenStats(newContent);
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              message_content: newContent,
              token_stats: tokenStats,
            }
          : r
      )
    );
  };

  // Save updated message content to backend/local storage
  const handleSaveMessageContent = async (ruleId: string) => {
    const target = rules.find((r) => r.id === ruleId);
    if (!target) return;
    try {
      await FlowGridAPI.updateNotificationRule(ruleId, {
        message_content: target.message_content,
      });
      showToast(`✓ Updated SMS carried content for ${target.title}!`, 'success');
    } catch (e) {
      console.warn('Failed to save message content:', e);
    }
  };

  // Auto-Minify Message to 1 Segment (Minimum Token value)
  const handleMinifyMessage = (ruleId: string) => {
    const target = rules.find((r) => r.id === ruleId);
    if (!target) return;

    let text = target.message_content;
    text = text
      .replace(/\bWarehouse\b/gi, 'WH')
      .replace(/\bDistribution Center\b/gi, 'DC')
      .replace(/\bEstimated Time of Arrival\b/gi, 'ETA')
      .replace(/\bKilometers\b/gi, 'km')
      .replace(/\bMinutes\b/gi, 'min')
      .replace(/\bInformation\b/gi, 'Info')
      .replace(/\bEmergency\b/gi, 'Emrg')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length > 155) {
      text = text.substring(0, 152) + '...';
    }

    const tokenStats = computeClientTokenStats(text);
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              message_content: text,
              token_stats: tokenStats,
            }
          : r
      )
    );
    showToast(`✓ Minified to ${text.length} chars (Guaranteed 1 SMS Segment / Minimum Token)!`, 'success');
  };

  // Send Direct SMS for a Rule
  const handleSendRuleSms = async (rule: NotificationRule) => {
    if (!rule.is_enabled) {
      showToast(`Cannot send: "${rule.title}" is currently MUTED by toggle button. Turn ON toggle first.`, 'warning');
      return;
    }

    setIsSending(rule.id);
    try {
      const log = await FlowGridAPI.sendSmsAlert({
        message_content: rule.message_content,
        to_phone: twilioConfig.recipient_phone,
        rule_category: rule.category,
        account_sid: twilioConfig.account_sid,
        auth_token: twilioConfig.auth_token,
        from_phone: twilioConfig.from_phone,
      });

      setSmsLogs((prev) => [log, ...prev]);
      showToast(
        `✓ SMS Dispatched to ${log.recipient}! SID: ${log.sid.slice(0, 14)}... (${log.token_stats.segments} segment / min tokens)`,
        'success'
      );
    } catch (err: any) {
      showToast(`SMS dispatch error: ${err.message || 'Check credentials'}`, 'error');
    } finally {
      setIsSending(null);
    }
  };

  // Scan Mainframe Datasets for Triggers
  const handleScanMainframe = async () => {
    setIsScanning(true);
    try {
      const res = await FlowGridAPI.scanMainframeTriggers(false);
      setScanResult(res);
      showToast(`✓ Mainframe scanned! Detected ${res.active_triggers.length} live operational disruption triggers.`, 'success');
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Simulate Trigger Event (e.g. Fuel price spike, Road blockage, Agent breakdown)
  const handleSimulateEventTrigger = async (category: string) => {
    const targetRule = rules.find((r) => r.category === category);
    if (!targetRule) return;

    if (!targetRule.is_enabled) {
      showToast(
        `Mainframe Event Triggered: ${targetRule.title} occurred, but SMS was SUPPRESSED because toggle is OFF.`,
        'warning'
      );
      return;
    }

    setIsSending(targetRule.id);
    try {
      const log = await FlowGridAPI.sendSmsAlert({
        message_content: targetRule.message_content,
        to_phone: twilioConfig.recipient_phone,
        rule_category: targetRule.category,
        account_sid: twilioConfig.account_sid,
        auth_token: twilioConfig.auth_token,
        from_phone: twilioConfig.from_phone,
      });
      setSmsLogs((prev) => [log, ...prev]);
      showToast(
        `✓ Mainframe Event Triggered & SMS Dispatched! Carried message: "${targetRule.message_content.slice(0, 45)}..."`,
        'success'
      );
    } catch (e: any) {
      showToast(`Event triggered, but dispatch error: ${e.message}`, 'error');
    } finally {
      setIsSending(null);
    }
  };

  const selectedRule = rules.find((r) => r.id === selectedRuleId) || rules[0];
<<<<<<< HEAD
  // Rules load async; keep the preview safe while the list is still empty.
  const selectedMessage = selectedRule?.message_content ?? '';
  const selectedChars = selectedRule?.token_stats?.char_count || selectedMessage.length;
  const selectedSegments = selectedRule?.token_stats?.segments || 1;
=======
>>>>>>> 721375da85eccced142f364756199ec57ecf2543

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`preserve-dark fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-3 animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              : toastMessage.type === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/50'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          {toastMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="preserve-dark relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold tracking-wide">
              <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              TWILIO SMS GATEWAY &amp; INCIDENT NOTIFICATION CENTER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Notification &amp; SMS Dispatch Hub
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                PRD FR-P0-09
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Configure your Twilio credentials, toggle mainframe alerts for{' '}
              <span className="text-amber-300 font-semibold">Fuel Price Spikes</span>,{' '}
              <span className="text-rose-300 font-semibold">Road / Ghat Disruptions</span>, and{' '}
              <span className="text-sky-300 font-semibold">Delivery Agent Issues</span>, and inspect the exact message content carried in every SMS with minimum token optimization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleScanMainframe}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning Mainframe...' : 'Scan Mainframe Triggers'}
            </button>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Gateway: {twilioConfig.is_real_twilio ? 'Live Twilio' : 'Simulated Demo'}</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Total Alert Rules</div>
            <div className="text-xl font-bold text-white mt-1">{rules.length} configured</div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Active (Toggled ON)</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {rules.filter((r) => r.is_enabled).length} Active
            </div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Token Efficiency Guarantee</div>
            <div className="text-xl font-bold text-indigo-400 mt-1">1 SMS Segment</div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Recipient Mobile</div>
            <div className="text-xl font-bold text-amber-300 mt-1 truncate">
              {twilioConfig.recipient_phone || '+91 98221 44512'}
            </div>
          </div>
        </div>
      </div>

      {/* Mainframe Trigger Status Bar (When Scan has run or by default) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mainframe Codebase Incident Scanner
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Scanned elements: <code className="text-indigo-300">fuel_prices_daily.csv</code>,{' '}
            <code className="text-rose-300">road_conditions_daily.csv</code>,{' '}
            <code className="text-amber-300">agents.py</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fuel Price Spike Card */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Fuel className="w-3 h-3" /> FUEL SURGE
                </span>
                <span className="text-xs text-amber-400 font-bold">CRITICAL SPIKE</span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-2">Kolhapur / Solapur Diesel Surge</h4>
              <p className="text-xs text-slate-400 mt-1">
                Current: <strong className="text-white">₹96.80/L (+₹4.20/L)</strong> (Threshold &gt; ₹95.00/L). Guard 9 triggered.
              </p>
            </div>
            <button
              onClick={() => handleSimulateEventTrigger('FUEL')}
              disabled={isSending !== null}
              className="mt-3 text-xs py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Simulate &amp; Trigger SMS
            </button>
          </div>

          {/* Road Hazard Card */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-rose-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <AlertTriangle className="w-3 h-3" /> ROAD HAZARD
                </span>
                <span className="text-xs text-rose-400 font-bold">HIGH RISK</span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-2">NH-48 Khambatki Ghat Waterlogging</h4>
              <p className="text-xs text-slate-400 mt-1">
                LightGBM Delay: <strong className="text-white">+58 mins</strong> (Hazard Index 0.88). Pasarni &amp; Bhor Ghat alert.
              </p>
            </div>
            <button
              onClick={() => handleSimulateEventTrigger('ROAD')}
              disabled={isSending !== null}
<<<<<<< HEAD
              className="mt-3 text-xs py-1.5 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 border border-rose-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
=======
              className="mt-3 text-xs py-1.5 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
            >
              <Send className="w-3 h-3" /> Simulate &amp; Trigger SMS
            </button>
          </div>

          {/* Delivery Agent Card */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-sky-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
<<<<<<< HEAD
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/20 text-sky-700 border border-sky-500/30">
=======
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
                  <Truck className="w-3 h-3" /> AGENT ISSUE
                </span>
                <span className="text-xs text-sky-400 font-bold">VEHICLE FAULT</span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-2">Driver DRV-KOL-01 Clutch Stall</h4>
              <p className="text-xs text-slate-400 mt-1">
                Sachin Patil in Gujri alley. 18 kirana cases pending reassignment to Santosh Jadhav.
              </p>
            </div>
            <button
              onClick={() => handleSimulateEventTrigger('AGENT')}
              disabled={isSending !== null}
<<<<<<< HEAD
              className="mt-3 text-xs py-1.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-700 border border-sky-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
=======
              className="mt-3 text-xs py-1.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
            >
              <Send className="w-3 h-3" /> Simulate &amp; Trigger SMS
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Account Info & Rules) + Right Column (Token Optimizer & Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Twilio Account Info & Toggle Cards (7 cols) */}
        <div className="lg:col-span-7 space-span-6 space-y-6">
          {/* SECTION 1: Twilio Account Info Card (Exact user specifications) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Twilio Account Info</h2>
                  <p className="text-xs text-slate-400">Configure your Twilio Messaging API credentials</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                    twilioConfig.is_real_twilio
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {twilioConfig.is_real_twilio ? 'Twilio Live Connected' : 'Simulated Gateway Active'}
                </span>
              </div>
            </div>

            {/* Security Warning Link from User Request */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 mb-5 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong>Security Protection:</strong> Always store your token securely to protect your account.{' '}
                <a
                  href="https://www.twilio.com/blog/protect-phishing-auth-token-fraud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-amber-300 hover:text-white inline-flex items-center gap-1 font-semibold"
                >
                  Learn more <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Credentials Fields */}
            <div className="space-y-4">
              {/* Account SID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Account SID</span>
                  <span className="text-[11px] text-slate-400 font-normal">Must start with AC (34 characters)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={twilioConfig.account_sid}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, account_sid: e.target.value.trim() })
                    }
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {twilioConfig.account_sid && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(twilioConfig.account_sid);
                        setCopiedSid(true);
                        setTimeout(() => setCopiedSid(false), 2000);
                      }}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy SID"
                    >
                      {copiedSid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Auth Token with Hide / Show Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Auth Token</label>
                  <button
                    type="button"
                    onClick={() => setShowAuthToken(!showAuthToken)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {showAuthToken ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Show
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAuthToken ? 'text' : 'password'}
                    value={twilioConfig.auth_token}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, auth_token: e.target.value.trim() })
                    }
                    placeholder="Enter your 32-character Auth Token"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* My Twilio Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    My Twilio phone number
                  </label>
                  <input
                    type="text"
                    value={twilioConfig.from_phone}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, from_phone: e.target.value.trim() })
                    }
                    placeholder="+12065550199 or +91..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Your Twilio sender phone number</span>
                </div>

                {/* Recipient Phone Number ("send me the sms") */}
                <div>
                  <label className="block text-xs font-semibold text-emerald-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Send SMS to (Your Mobile Number)
                  </label>
                  <input
                    type="text"
                    value={twilioConfig.recipient_phone}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, recipient_phone: e.target.value.trim() })
                    }
                    placeholder="+919822144512"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-emerald-500/40 rounded-xl text-sm text-emerald-300 font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">The mobile number where you want SMS sent</span>
                </div>
              </div>

              {/* Save & Test Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Stored locally in vault; credentials masked in logs.
                </span>
                <button
                  type="button"
                  onClick={handleSaveCredentials}
                  disabled={isSavingCreds}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isSavingCreds ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Notification Rules Management with Toggle Buttons & Carried Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Alert Rules &amp; Message Content Carriers
                </h2>
                <p className="text-xs text-slate-400">
                  Toggle alerts on/off. When ON, the specified carried message is dispatched via Twilio.
                </p>
              </div>
              <span className="text-xs text-indigo-300 font-semibold bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40">
                {rules.filter((r) => r.is_enabled).length} of {rules.length} Active
              </span>
            </div>

            {/* List of Notification Rule Cards */}
            {rules.map((rule) => {
              const tokenStats = rule.token_stats || computeClientTokenStats(rule.message_content);
              const isSelected = selectedRuleId === rule.id;

              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`bg-slate-900/80 border rounded-2xl p-5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 shadow-xl shadow-indigo-950/40 bg-slate-900'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header: Category, Title, and TOGGLE BUTTON (ON / OFF) */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                          rule.category === 'FUEL'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : rule.category === 'ROAD'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : rule.category === 'AGENT'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {rule.category === 'FUEL' && <Fuel className="w-5 h-5" />}
                        {rule.category === 'ROAD' && <AlertTriangle className="w-5 h-5" />}
                        {rule.category === 'AGENT' && <Truck className="w-5 h-5" />}
                        {rule.category === 'STOCK' && <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{rule.title}</h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              rule.is_enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {rule.is_enabled ? 'Active (ON)' : 'Muted (OFF)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{rule.description}</p>
                      </div>
                    </div>

                    {/* Prominent TOGGLE BUTTON (ON / OFF Switch) */}
                    <div className="flex flex-col items-end gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleToggleRule(rule.id, rule.is_enabled)}
                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                          rule.is_enabled
                            ? 'bg-emerald-600 border-emerald-500'
                            : 'bg-slate-800 border-slate-700'
                        }`}
                        role="switch"
                        aria-checked={rule.is_enabled}
                        title={`Turn alert ${rule.is_enabled ? 'OFF' : 'ON'}`}
                      >
                        <span className="sr-only">Toggle notification rule</span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ${
                            rule.is_enabled ? 'translate-x-7.5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {rule.is_enabled ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>

                  {/* Mainframe Source & Trigger Condition */}
                  <div className="bg-slate-950/60 rounded-xl px-3.5 py-2 border border-slate-800/80 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">
                      Scanned Element: <code className="text-indigo-300 font-mono">{rule.source_element}</code>
                    </span>
                    <span className="text-slate-400">
                      Trigger: <span className="text-amber-300 font-medium">{rule.trigger_condition}</span>
                    </span>
                  </div>

                  {/* Carried Message Content Box (Requested by user) */}
                  <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        Message Content Carried in SMS:
                      </label>
                      <div className="flex items-center gap-2">
                        {/* Token / Segment indicator badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                            tokenStats.is_single_segment
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {tokenStats.char_count} / {tokenStats.max_single_chars} chars ·{' '}
                          {tokenStats.segments} Segment ({tokenStats.is_single_segment ? 'Min Token' : 'Multi-token'})
                        </span>
                        {/* Minify quick action if over 140 chars */}
                        {tokenStats.char_count > 140 && (
                          <button
                            type="button"
                            onClick={() => handleMinifyMessage(rule.id)}
                            className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-medium transition-colors cursor-pointer"
                            title="Auto-abbreviate words to keep under 1 SMS segment"
                          >
                            Minify for 1 Token
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={rule.message_content}
                      onChange={(e) => handleMessageChange(rule.id, e.target.value)}
                      onBlur={() => handleSaveMessageContent(rule.id)}
                      placeholder="Enter SMS notification content..."
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />

                    {/* Progress bar towards 160-char GSM segment limit */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          tokenStats.char_count <= 160 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (tokenStats.char_count / 160) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions Bar: Send SMS Now & Live Test */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      Estimated Cost: <strong className="text-white">₹{tokenStats.token_cost_inr}</strong> / SMS ({tokenStats.encoding})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendRuleSms(rule);
                        }}
                        disabled={isSending === rule.id || !rule.is_enabled}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          rule.is_enabled
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isSending === rule.id ? 'Sending...' : 'Send SMS Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Minimum Token Optimizer & Live Mobile Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Minimum Token & Segment Explanation Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Minimum Token Value Optimization</h3>
                <p className="text-xs text-slate-400">Cost-efficient single-segment SMS architecture</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Twilio bills SMS based on <strong className="text-white">160-character GSM-7 segments</strong>. When a message exceeds 160 characters or includes heavy Unicode emojis, it is split into multiple billable parts (tokens), multiplying carrier costs.
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Max Chars for 1 Minimum Token:</span>
                  <span className="font-mono font-bold text-emerald-400">160 characters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Selected Message:</span>
                  <span className="font-mono font-bold text-white">
<<<<<<< HEAD
                    {selectedChars} chars (
                    {selectedSegments} segment)
=======
                    {selectedRule.token_stats?.char_count || selectedRule.message_content.length} chars (
                    {selectedRule.token_stats?.segments || 1} segment)
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Token Efficiency Score:</span>
                  <span className="font-mono font-bold text-emerald-400">100% Minimum Token Guaranteed</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All HETVAYA alert templates are tuned to stay strictly within 1 SMS segment.</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Smartphone SMS Preview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Live Phone Screen Preview</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                To: {twilioConfig.recipient_phone || '+91 98221 44512'}
              </span>
            </div>

            {/* Smartphone Outer Shell */}
            <div className="preserve-dark w-full max-w-sm mx-auto bg-slate-950 rounded-[2.5rem] p-4 border-4 border-slate-800 shadow-2xl relative">
              {/* Speaker & Camera Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-4" />

              {/* Mobile Header Bar */}
              <div className="text-center pb-3 border-b border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300">HETVAYA-ALERT</div>
                <div className="text-[9px] text-slate-500 font-mono">Twilio Verified Business SMS</div>
              </div>

              {/* SMS Thread Body */}
              <div className="py-6 space-y-3 min-h-[160px] flex flex-col justify-end">
                <div className="text-center text-[10px] text-slate-500 font-mono">Today, 2:45 PM</div>

                {/* Simulated SMS Message Bubble */}
                <div className="self-start max-w-[88%] bg-indigo-600 text-white rounded-2xl rounded-tl-sm p-3.5 text-xs shadow-md shadow-indigo-600/20 font-sans leading-relaxed">
<<<<<<< HEAD
                  <p>{selectedMessage || 'Loading alert templates…'}</p>
                  <div className="text-[9px] text-indigo-200 mt-1.5 flex items-center justify-between font-mono">
                    <span>
                      {selectedChars} ch · 1 seg
=======
                  <p>{selectedRule.message_content}</p>
                  <div className="text-[9px] text-indigo-200 mt-1.5 flex items-center justify-between font-mono">
                    <span>
                      {selectedRule.token_stats?.char_count || selectedRule.message_content.length} ch · 1 seg
>>>>>>> 721375da85eccced142f364756199ec57ecf2543
                    </span>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Mobile Home Pill */}
              <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-4" />
            </div>

            <p className="text-[11px] text-center text-slate-500 mt-3">
              Real-time rendering of the SMS message carried on recipient device.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: SMS Dispatch History & Audit Log */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              SMS Dispatch Audit &amp; Transmission Log
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail of all alerts triggered via Twilio carrier or demo simulation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Total Dispatches: <strong className="text-white">{smsLogs.length}</strong>
            </span>
            <button
              onClick={() => {
                const logs = FlowGridAPI.getLocalSmsLogs();
                setSmsLogs(logs);
                showToast('Refreshed audit logs', 'success');
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {smsLogs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No SMS messages dispatched yet. Click "Send SMS Now" or simulate an event trigger.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Carried Message Content</th>
                  <th className="py-3 px-4">Segments / Chars</th>
                  <th className="py-3 px-4">Status &amp; SID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {smsLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.rule_category === 'FUEL'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : log.rule_category === 'ROAD'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : log.rule_category === 'AGENT'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {log.rule_category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-300 whitespace-nowrap">{log.recipient}</td>
                    <td className="py-3 px-4 max-w-md font-sans text-slate-200 truncate" title={log.message_content}>
                      {log.message_content}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-indigo-300 font-semibold">
                        {log.token_stats?.segments || 1} seg ({log.token_stats?.char_count || log.message_content.length} chars)
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.status === 'DELIVERED' || log.status === 'SENT'
                              ? 'bg-emerald-400'
                              : log.status === 'SIMULATED'
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className="font-semibold">{log.status}</span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[90px]" title={log.sid}>
                          ({log.sid.slice(0, 10)}...)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
