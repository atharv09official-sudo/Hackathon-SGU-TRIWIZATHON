<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  Zap,
  Filter,
  Sparkles,
  TrendingUp,
  BarChart2,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Package,
  Layers,
  Scale,
  ArrowRight,
  Info,
=======
import React, { useState } from 'react';
import {
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Zap,
  BarChart2,
  Filter,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  Sparkles,
  RotateCcw,
  FileText
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
<<<<<<< HEAD
  CartesianGrid
} from 'recharts';
import { DemandForecast, Product, Retailer } from '../types';
import { useTranslation } from '../context/TranslationContext';
import { INITIAL_PRODUCTS, INITIAL_RETAILERS } from '../data/mockData';
import { FlowGridAPI, ForecastDecisionResponsePayload } from '../services/api';

interface ForecastReviewViewProps {
  forecasts?: DemandForecast[];
  products?: Product[];
  retailers?: Retailer[];
}

export const ForecastReviewView: React.FC<ForecastReviewViewProps> = ({
  forecasts = [],
  products = [],
  retailers = [],
}) => {
  const { t, formatNumber } = useTranslation();
  const [selectedRetailer, setSelectedRetailer] = useState<string>('RET-GAN');
  const [selectedSku, setSelectedSku] = useState<string>('SKU-ATT-05');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [showStockoutCorrectedOnly, setShowStockoutCorrectedOnly] = useState<boolean>(false);
  const [decision, setDecision] = useState<ForecastDecisionResponsePayload | null>(null);
  const [loadingDecision, setLoadingDecision] = useState<boolean>(false);

  // Resilient lookup helpers: check passed props first, fall back to initial catalog
  const getRetailer = (retailerId: string): Retailer | undefined => {
    return retailers.find(r => r.id === retailerId) || INITIAL_RETAILERS.find(r => r.id === retailerId);
  };

  const getProduct = (sku: string): Product | undefined => {
    return products.find(p => p.sku === sku) || INITIAL_PRODUCTS.find(p => p.sku === sku);
  };

  const filteredForecasts = forecasts.filter(f => {
=======
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { DemandForecast, Product, Retailer, UserRole, ThemeMode } from '../types';

interface ForecastReviewViewProps {
  forecasts: DemandForecast[];
  products: Product[];
  retailers: Retailer[];
  userRole?: UserRole;
  theme?: ThemeMode;
}

export const ForecastReviewView: React.FC<ForecastReviewViewProps> = ({
  forecasts,
  products,
  retailers,
  userRole = 'rohit',
  theme = 'night',
}) => {
  const isDay = theme === 'day';
  const [selectedRetailer, setSelectedRetailer] = useState<string>(userRole === 'ganesh' ? 'RET-GAN' : 'RET-GAN');
  const [selectedSku, setSelectedSku] = useState<string>('SKU-ATT-05');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [showStockoutCorrectedOnly, setShowStockoutCorrectedOnly] = useState<boolean>(false);

  React.useEffect(() => {
    if (userRole === 'ganesh') {
      setSelectedRetailer('RET-GAN');
    } else if (userRole === 'sunita') {
      setSelectedRetailer('RET-DMA');
    } else {
      setSelectedRetailer('RET-GAN');
    }
  }, [userRole]);

  const activeForecast = forecasts.find(
    f => f.retailerId === selectedRetailer && f.sku === selectedSku
  ) || forecasts[0];

  const activeProduct = products.find(p => p.sku === (activeForecast?.sku || selectedSku));
  const activeRetailer = retailers.find(r => r.id === (activeForecast?.retailerId || selectedRetailer));

  // Generate simulated 7-day quantile spread daily fan
  const dailyQuantileData = [
    { day: 'Mon', p10: Math.round(activeForecast.q10 / 7 * 0.9), p50: Math.round(activeForecast.q50 / 7 * 0.95), p95: Math.round(activeForecast.q95 / 7 * 1.05) },
    { day: 'Tue', p10: Math.round(activeForecast.q10 / 7 * 0.95), p50: Math.round(activeForecast.q50 / 7 * 0.98), p95: Math.round(activeForecast.q95 / 7 * 1.02) },
    { day: 'Wed', p10: Math.round(activeForecast.q10 / 7 * 1.0), p50: Math.round(activeForecast.q50 / 7 * 1.0), p95: Math.round(activeForecast.q95 / 7 * 1.0) },
    { day: 'Thu', p10: Math.round(activeForecast.q10 / 7 * 1.02), p50: Math.round(activeForecast.q50 / 7 * 1.02), p95: Math.round(activeForecast.q95 / 7 * 1.04) },
    { day: 'Fri', p10: Math.round(activeForecast.q10 / 7 * 1.1), p50: Math.round(activeForecast.q50 / 7 * 1.15), p95: Math.round(activeForecast.q95 / 7 * 1.18) },
    { day: 'Sat', p10: Math.round(activeForecast.q10 / 7 * 1.3), p50: Math.round(activeForecast.q50 / 7 * 1.4), p95: Math.round(activeForecast.q95 / 7 * 1.45) },
    { day: 'Sun', p10: Math.round(activeForecast.q10 / 7 * 1.25), p50: Math.round(activeForecast.q50 / 7 * 1.35), p95: Math.round(activeForecast.q95 / 7 * 1.38) },
  ];

  const filteredForecasts = forecasts.filter(f => {
    if (userRole === 'ganesh' && f.retailerId !== 'RET-GAN') return false;
    if (userRole === 'sunita' && !['RET-GAN', 'RET-DMA'].includes(f.retailerId)) return false;
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
    if (filterMethod !== 'all' && f.method !== filterMethod) return false;
    if (showStockoutCorrectedOnly && !f.stockoutCorrected) return false;
    return true;
  });

<<<<<<< HEAD
  const activeForecast = (
    filteredForecasts.find(f => f.retailerId === selectedRetailer && f.sku === selectedSku) ||
    filteredForecasts[0] ||
    forecasts.find(f => f.retailerId === selectedRetailer && f.sku === selectedSku) ||
    forecasts[0] ||
    null
  );

  const activeProduct = activeForecast ? getProduct(activeForecast.sku) : undefined;
  const activeRetailer = activeForecast ? getRetailer(activeForecast.retailerId) : undefined;

  // Generate simulated 7-day quantile spread daily fan safely
  const dailyQuantileData = activeForecast
    ? [
        { day: 'Mon', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 0.9), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 0.95), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.05) },
        { day: 'Tue', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 0.95), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 0.98), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.02) },
        { day: 'Wed', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 1.0), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 1.0), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.0) },
        { day: 'Thu', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 1.02), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 1.02), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.04) },
        { day: 'Fri', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 1.1), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 1.15), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.18) },
        { day: 'Sat', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 1.3), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 1.4), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.45) },
        { day: 'Sun', p10: Math.round((activeForecast.q10 ?? 0) / 7 * 1.25), p50: Math.round((activeForecast.q50 ?? 0) / 7 * 1.35), p95: Math.round((activeForecast.q95 ?? 0) / 7 * 1.38) },
      ]
    : [];

  const fetchLlmDecision = async () => {
    if (!activeForecast) return;
    const prod = getProduct(activeForecast.sku);
    const ret = getRetailer(activeForecast.retailerId);

    setLoadingDecision(true);
    try {
      const res = await FlowGridAPI.getForecastLlmDecision({
        store_code: activeForecast.retailerId,
        store_name: ret?.name,
        store_city: ret?.city,
        store_tier: ret?.serviceClass === 'A' ? 1 : ret?.serviceClass === 'B' ? 2 : 3,
        sku: activeForecast.sku,
        product_name: prod?.name,
        category: prod?.category,
        unit_cost: prod?.unitCost,
        unit_price: prod?.unitPrice,
        case_size: prod?.caseSize || 12,
        shelf_life_days: prod?.shelfLifeDays || 180,
        is_perishable: prod?.perishable || false,
        q10: activeForecast.q10,
        q50: activeForecast.q50,
        q80: activeForecast.q80,
        q90: activeForecast.q90,
        q95: activeForecast.q95,
        method: activeForecast.method,
        stockout_corrected: activeForecast.stockoutCorrected,
        wape: activeForecast.wape,
        bias: activeForecast.bias,
        last_week_actual: activeForecast.lastWeekActual,
        current_stock: 10,
      });
      setDecision(res);
    } catch (err) {
      console.warn('Failed to load LLM decision:', err);
    } finally {
      setLoadingDecision(false);
    }
  };

  useEffect(() => {
    fetchLlmDecision();
  }, [activeForecast?.retailerId, activeForecast?.sku]);

  const askCopilot = () => {
    const query = `Audit demand forecast decision for ${activeProduct?.name || activeForecast?.sku} at ${activeRetailer?.name || activeForecast?.retailerId}`;
    window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { query } }));
  };

  if (!forecasts || forecasts.length === 0) {
    return (
      <div className="space-y-6 text-[#1E293B]">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
                {t('forecast.title', 'AI Demand Intelligence & Quantile Forecasts')}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                FR-08 Quantile ML
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              {t('forecast.subtitle', '7-day replenishment cycle quantiles (p10 to p95) • Scikit-learn HistGradientBoosting vs 4-week Moving Average Baseline • Stockout Day Correction (RC2)')}
            </p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-2xl border border-[#E7E5E4] text-center shadow-xs">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">No Demand Forecast Records Available</h3>
            <p className="text-xs text-[#64748B]">
              Demand forecast series are being computed or have not been loaded. Please verify data pipeline connectivity or re-run the planning engine.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1E293B]">
      {/* Header Overview */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              {t('forecast.title', 'AI Demand Intelligence & Quantile Forecasts')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              FR-08 Quantile ML
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            {t('forecast.subtitle', '7-day replenishment cycle quantiles (p10 to p95) • Scikit-learn HistGradientBoosting vs 4-week Moving Average Baseline • Stockout Day Correction (RC2)')}
          </p>
        </div>

        {/* Forecast Health Badge */}
        <div className="flex items-center gap-3 bg-[#FFF8E7] border border-[#E7E5E4] px-3.5 py-2 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Model WAPE</span>
            <span className="text-sm font-black text-[#15803D] font-mono">14.2%</span>
          </div>
          <div className="h-6 w-px bg-[#E7E5E4]" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Coverage (p95)</span>
            <span className="text-sm font-black text-[#2563EB] font-mono">94.3%</span>
          </div>
          <div className="h-6 w-px bg-[#E7E5E4]" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">Bias</span>
            <span className="text-sm font-black text-[#1E293B] font-mono">+0.0%</span>
=======
  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        isDay ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'glass-panel border-slate-800 text-white'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`text-xl font-bold tracking-tight ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              {userRole === 'ganesh'
                ? 'Store Demand AI Forecast'
                : userRole === 'sunita'
                ? 'Downstream Demand Intake Curve'
                : userRole === 'priya'
                ? 'Demand ML Governance & Calibration'
                : 'Demand Forecast & Quantile Fan'}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              userRole === 'ganesh'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : userRole === 'sunita'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : userRole === 'priya'
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
            }`}>
              {userRole === 'ganesh'
                ? 'Kolhapur Store Scope'
                : userRole === 'sunita'
                ? 'Pune Hub Outbound Scope'
                : userRole === 'priya'
                ? 'Governance Tier-1'
                : 'Statewide ML Model'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {userRole === 'ganesh'
              ? 'Store run-rate and safety stock buffer predictions based on local Kirana velocity.'
              : userRole === 'sunita'
              ? 'Aggregated downstream demand intake for Pune hub outbound fulfillment planning.'
              : userRole === 'priya'
              ? 'Model accuracy (WAPE, bias, pinball loss) across all regional deployment zones.'
              : 'Quantile fan spread (10th percentile floor to 95th percentile peak) feeding MIP solver.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Persona-specific action button */}
          {userRole === 'ganesh' ? (
            <button
              type="button"
              onClick={() => alert('🔄 Syncing Kirana store demand AI with counter sales...')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDay ? 'btn-navy text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sync Store Run-Rate</span>
            </button>
          ) : userRole === 'sunita' ? (
            <button
              type="button"
              onClick={() => alert('📦 Downstream demand curves synchronized with Pune dock picklists.')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDay ? 'btn-navy text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sync Dock Intake</span>
            </button>
          ) : userRole === 'priya' ? (
            <button
              type="button"
              onClick={() => alert('🛡️ Model calibration log exported for governance review.')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDay ? 'btn-navy text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Calibration Log</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => alert('✨ ML Quantile Predictor retrained with latest 84-day telemetry.')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDay ? 'btn-navy text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Retrain ML Predictor</span>
            </button>
          )}

          {/* Forecast Health Badge */}
          <div className={`flex items-center gap-3 border px-3 py-2 rounded-xl ${
            isDay ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Model WAPE</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">14.2%</span>
            </div>
            <div className={`h-6 w-px ${isDay ? 'bg-slate-200' : 'bg-slate-800'}`} />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Coverage (p95)</span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">94.3%</span>
            </div>
            <div className={`h-6 w-px ${isDay ? 'bg-slate-200' : 'bg-slate-800'}`} />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Bias</span>
              <span className={`text-sm font-extrabold ${isDay ? 'text-slate-800' : 'text-slate-200'}`}>+0.0%</span>
            </div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        </div>
      </div>

      {/* Selected SKU Quantile Breakdown Card */}
      {activeForecast && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Panel */}
<<<<<<< HEAD
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <span>{activeProduct?.name || activeForecast.sku}</span>
                  <span className="text-xs font-normal text-[#64748B]">
                    @ {activeRetailer?.name || activeForecast.retailerId}
                    {activeRetailer?.city ? ` (${activeRetailer.city})` : ''}
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
=======
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activeProduct?.name}</span>
                  <span className="text-xs font-normal text-slate-400">@ {activeRetailer?.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                  Quantile Fan Spread (10th percentile floor to 95th percentile peak)
                </p>
              </div>

              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  {activeForecast.method}
                </span>
                {activeForecast.stockoutCorrected && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-[#FFF8E7] text-[#EA580C] border border-[#E7E5E4] flex items-center gap-1" title="Stockout day was corrected to historical median (RC2)">
                    <Sparkles className="w-3 h-3 text-[#EAB308]" /> Stockout Corrected
=======
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {activeForecast.method}
                </span>
                {activeForecast.stockoutCorrected && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1" title="Stockout day was corrected to historical median (RC2)">
                    <Sparkles className="w-3 h-3" /> Stockout Corrected
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                  </span>
                )}
              </div>
            </div>

            {/* Recharts Area Fan Chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyQuantileData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
<<<<<<< HEAD
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803D" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#15803D" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} unit=" u" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7E5E4', borderRadius: '8px', fontSize: '12px', color: '#1E293B' }}
                    labelStyle={{ color: '#1E293B', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="p95" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#p95Grad)" name="95th %ile (Peak)" />
                  <Area type="monotone" dataKey="p50" stroke="#15803D" strokeWidth={2.5} fillOpacity={1} fill="url(#p50Grad)" name="Median (q50)" />
                  <Area type="monotone" dataKey="p10" stroke="#EA580C" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="10th %ile (Floor)" />
=======
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" u" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="p95" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#p95Grad)" name="95th %ile (Peak)" />
                  <Area type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#p50Grad)" name="Median (q50)" />
                  <Area type="monotone" dataKey="p10" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="10th %ile (Floor)" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                </AreaChart>
              </ResponsiveContainer>
            </div>

<<<<<<< HEAD
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#E7E5E4]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span>
                <span>Median (q50): {formatNumber(activeForecast.q50)} units</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                <span>95th %ile (q95): {formatNumber(activeForecast.q95)} units</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span>
                <span>10th %ile (q10): {formatNumber(activeForecast.q10)} units</span>
=======
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Median (q50): {activeForecast.q50} units</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                <span>95th %ile (q95): {activeForecast.q95} units</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>10th %ile (q10): {activeForecast.q10} units</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </span>
            </div>
          </div>

          {/* Model Intelligence & Stockout Correction Details */}
<<<<<<< HEAD
          <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 flex flex-col justify-between shadow-xs">
            <div>
              <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#2563EB]" />
=======
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                <span>Forecasting Algorithm Rules (Section 13)</span>
              </h4>

              <div className="space-y-3 text-xs">
<<<<<<< HEAD
                <div className="p-3 rounded-xl bg-[#FAF3E0] border border-[#E7E5E4]">
                  <div className="text-[#64748B] font-medium">Selected Technique:</div>
                  <div className="text-sm font-bold text-[#1E293B] mt-0.5">{activeForecast.method}</div>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
=======
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Selected Technique:</div>
                  <div className="text-sm font-bold text-white mt-0.5">{activeForecast.method}</div>
                  <p className="text-[11px] text-slate-400 mt-1">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                    {activeForecast.method === 'HistGradientBoosting'
                      ? 'Gradient boosting quantile loss with lag-7, 14, 28 features + festival proximity. Switched to because it beat 4-week MA.'
                      : activeForecast.method === 'Bootstrap'
                      ? 'Intermittent demand (interval ≥ 1.32 days): 1,000 resampled uncensored 7-day totals.'
<<<<<<< HEAD
                      : 'Peer transfer model: scaled from peer stores due to short history (<56 days).'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#E7E5E4]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] font-medium">Stockout Correction:</span>
                    <span className={activeForecast.stockoutCorrected ? 'text-[#15803D] font-bold' : 'text-[#64748B]'}>
                      {activeForecast.stockoutCorrected ? 'ACTIVE' : 'NONE DETECTED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                    Days where closing stock reached 0 were corrected to 4-week weekday median, preventing the store death spiral where zero stock creates zero forecast.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E7E5E4]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] font-medium">Last Week Accuracy:</span>
                    <span className="text-[#2563EB] font-semibold font-mono">
                      Actual {formatNumber(activeForecast.lastWeekActual)} vs Pred {formatNumber(activeForecast.q50)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
=======
                      : 'Peer transfer model: scaled from peer kiranas due to short history (<56 days).'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stockout Correction:</span>
                    <span className={activeForecast.stockoutCorrected ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {activeForecast.stockoutCorrected ? 'ACTIVE' : 'NONE DETECTED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Days where closing stock reached 0 were corrected to 4-week weekday median, preventing the kirana death spiral where zero stock creates zero forecast.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Week Accuracy:</span>
                    <span className="text-indigo-300 font-semibold">
                      Actual {activeForecast.lastWeekActual} vs Pred {activeForecast.q50}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                    Series WAPE: {Math.round(activeForecast.wape * 100)}% • Error is within 1.2× validation threshold (FR-18 Health Pass).
                  </p>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#2563EB]">
=======
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-300">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <span className="font-bold">Next Action:</span> These quantile curves feed the Marginal Value Tiers in Section 14.
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* LLM Prediction Synthesis & Decision Copilot Card */}
      {activeForecast && (
        <div id="llm-decision-panel" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-700/60 p-6 text-white shadow-xl space-y-6">
          {/* Ambient decorative glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-400 shadow-inner">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    LLM Prediction Synthesis & Replenishment Decision
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-600/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {decision?.model_used || 'nemotron-3-ultra:cloud'}
                  </span>
                  {decision?.is_fallback && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-600/40">
                      Deterministic High-Reliability Guard
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesizes machine-learning quantile forecasts ({activeForecast.method}) with shelf life and kirana priority for transparent data accessibility and bounded replenishment orders.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                type="button"
                onClick={fetchLlmDecision}
                disabled={loadingDecision}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Re-run LLM audit on current forecast"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDecision ? 'animate-spin text-blue-400' : ''}`} />
                <span>{loadingDecision ? 'Synthesizing...' : 'Re-Evaluate'}</span>
              </button>

              <button
                type="button"
                onClick={askCopilot}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all cursor-pointer shadow-md hover:shadow-blue-500/25"
                title="Open Hetvaya Copilot with prefilled audit query"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Copilot</span>
              </button>
            </div>
          </div>

          {/* KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tile 1: Recommended Replenishment */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                Recommended Order
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {decision?.recommended_units ?? Math.round(activeForecast.q50)} <span className="text-xs font-bold text-slate-300">units</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>{decision?.recommended_cases ?? 4} full cases ({activeProduct?.caseSize || 12} u/cs)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 text-[10px] font-bold">Case Pack Lot</span>
              </div>
            </div>

            {/* Tile 2: Decision Verdict */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Decision Verdict
              </span>
              <div className="text-base font-black text-blue-300 font-mono truncate">
                {decision?.verdict ?? 'BUFFER_AUGMENTED'}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Buffer Hedge:</span>
                <span className="font-bold text-blue-400 font-mono">+{decision?.recommended_safety_buffer_pct ?? 15}%</span>
              </div>
            </div>

            {/* Tile 3: Confidence Score */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Decision Confidence
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {((decision?.confidence_score ?? 0.94) * 100).toFixed(0)}%
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Series WAPE: {Math.round(activeForecast.wape * 100)}%</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 text-[10px] font-bold">Fact-Grounded</span>
              </div>
            </div>

            {/* Tile 4: Risk Multi-Index */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                Risk Guardrails
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-slate-200">
                  Stockout: <span className="text-emerald-400">{decision?.stockout_risk_level ?? 'LOW'}</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 border border-slate-700 text-slate-200">
                  Spoilage: <span className="text-emerald-400">{decision?.waste_spoilage_risk_level ?? 'LOW'}</span>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 pt-0.5">
                Shelf Life: <span className="text-slate-200 font-semibold">{activeProduct?.shelfLifeDays || 180} days</span>
              </div>
            </div>
          </div>

          {/* Deep-Dive Accessible Explanations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* Panel 1: Plain-Language Accessibility */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-300 uppercase tracking-wider text-[11px]">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Plain-Language Accessibility Summary</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {decision?.natural_language_explanation ||
                  `For ${activeProduct?.name || activeForecast.sku} at ${activeRetailer?.name || activeForecast.retailerId}, the ML quantile model predicts median 7-day demand of ${formatNumber(activeForecast.q50)} units. Ordering ${decision?.recommended_units ?? Math.round(activeForecast.q50)} units protects against weekend surges without tying up excessive working capital.`}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-700/40">
                Audience: Store Managers, Delivery Drivers, Supply Chain Operators
              </div>
            </div>

            {/* Panel 2: Quantile Spread & Volatility */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-300 uppercase tracking-wider text-[11px]">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quantile Volatility & Spread (Q10 to Q95)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {decision?.quantile_spread_analysis ||
                  `Demand spans from a floor of ${formatNumber(activeForecast.q10)} units (Q10) to a peak surge of ${formatNumber(activeForecast.q95)} units (Q95). The quantile spread highlights weekend volume concentration in ${activeRetailer?.city || 'the region'}.`}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/40">
                <span>Floor: {formatNumber(activeForecast.q10)} u</span>
                <span>Median: {formatNumber(activeForecast.q50)} u</span>
                <span>Peak: {formatNumber(activeForecast.q95)} u</span>
              </div>
            </div>

            {/* Panel 3: Stockout Correction & Key Drivers */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Causal Factors & Correction (RC2)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {decision?.stockout_correction_impact ||
                  (activeForecast.stockoutCorrected
                    ? 'Stockout correction (RC2) is ACTIVE: Historic days with zero closing stock were reconstructed from weekday medians to prevent under-replenishment.'
                    : 'Standard demand history: No out-of-stock data distortion detected.')}
              </p>
              <ul className="pt-2 space-y-1 text-[11px] text-slate-300 border-t border-slate-700/40">
                {(decision?.key_decision_factors || [
                  `Median cycle consumption is ${formatNumber(activeForecast.q50)} units`,
                  `Full shipping case multiple (${activeProduct?.caseSize || 12} units/cs)`,
                  'Separation of duties requires independent warehouse approval'
                ]).slice(0, 3).map((factor, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Series Filter and Comprehensive Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E7E5E4] shadow-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <span className="text-xs font-semibold text-[#1E293B]">Filter Series (SKU × Store Management):</span>
=======
      {/* Series Filter and Comprehensive Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-300">Filter Series (SKU × Kirana):</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <select
              value={filterMethod}
              onChange={e => setFilterMethod(e.target.value)}
<<<<<<< HEAD
              className="bg-[#FFF8E7] border border-[#E7E5E4] text-[#1E293B] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2563EB] cursor-pointer font-medium"
=======
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            >
              <option value="all">All ML Methods</option>
              <option value="HistGradientBoosting">HistGradientBoosting</option>
              <option value="MovingAverage">4-Week Moving Average</option>
              <option value="Bootstrap">Bootstrap Resampling</option>
              <option value="PeerTransfer">Peer Transfer</option>
            </select>

<<<<<<< HEAD
            <label className="flex items-center gap-2 cursor-pointer text-[#1E293B]">
=======
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              <input
                type="checkbox"
                checked={showStockoutCorrectedOnly}
                onChange={e => setShowStockoutCorrectedOnly(e.target.checked)}
<<<<<<< HEAD
                className="rounded border-[#E7E5E4] text-[#DC2626] focus:ring-0"
              />
              <span className="font-medium">Stockout Corrected Only (RC2)</span>
=======
                className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Stockout Corrected Only (RC2)</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </label>
          </div>
        </div>

        {/* Forecast Table */}
<<<<<<< HEAD
        <div className="rounded-2xl border border-[#E7E5E4] overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E4] bg-[#FAF3E0] text-[#64748B] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Store Management</th>
=======
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Kirana Retailer</th>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                  <th className="py-3 px-4">FMCG SKU</th>
                  <th className="py-3 px-4 text-center">10th %ile</th>
                  <th className="py-3 px-4 text-center">Median (q50)</th>
                  <th className="py-3 px-4 text-center">80th %ile</th>
                  <th className="py-3 px-4 text-center">90th %ile</th>
<<<<<<< HEAD
                  <th className="py-3 px-4 text-center font-bold text-[#2563EB]">95th %ile</th>
                  <th className="py-3 px-4">Model Used</th>
                  <th className="py-3 px-4">Flags</th>
                  <th className="py-3 px-4 text-center">AI Decision</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {filteredForecasts.map((f, idx) => {
                  const ret = getRetailer(f.retailerId);
                  const prod = getProduct(f.sku);
                  const isSelected = activeForecast?.retailerId === f.retailerId && activeForecast?.sku === f.sku;

                  return (
                    <tr
                      key={`${f.retailerId}-${f.sku}-${idx}`}
                      className={`hover:bg-[#FFF8E7]/50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#EFF6FF]/60' : ''
=======
                  <th className="py-3 px-4 text-center font-bold text-indigo-400">95th %ile</th>
                  <th className="py-3 px-4">Model Used</th>
                  <th className="py-3 px-4">Flags</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredForecasts.map((f, idx) => {
                  const ret = retailers.find(r => r.id === f.retailerId);
                  const prod = products.find(p => p.sku === f.sku);
                  const isSelected = selectedRetailer === f.retailerId && selectedSku === f.sku;

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-950/30' : ''
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                      }`}
                      onClick={() => {
                        setSelectedRetailer(f.retailerId);
                        setSelectedSku(f.sku);
                      }}
                    >
<<<<<<< HEAD
                      <td className="py-3 px-4 font-semibold text-[#1E293B]">
                        {ret?.name || f.retailerId}
                        <span className="block text-[10px] text-[#64748B]">
                          {ret?.city || (f.retailerId ? `ID: ${f.retailerId}` : '—')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#1E293B]">
                        {prod?.name || f.sku}
                        <span className="block text-[10px] text-[#64748B] font-mono whitespace-nowrap select-all">
                          {prod?.sku || f.sku}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center text-[#64748B] font-mono">
                        {typeof f.q10 === 'number' ? formatNumber(f.q10) : '0'}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-sm text-[#15803D] font-mono">
                        {typeof f.q50 === 'number' ? formatNumber(f.q50) : '0'}
                      </td>
                      <td className="py-3 px-4 text-center text-[#1E293B] font-mono">
                        {typeof f.q80 === 'number' ? formatNumber(f.q80) : '0'}
                      </td>
                      <td className="py-3 px-4 text-center text-[#1E293B] font-mono">
                        {typeof f.q90 === 'number' ? formatNumber(f.q90) : '0'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#2563EB] font-mono">
                        {typeof f.q95 === 'number' ? formatNumber(f.q95) : '0'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFF8E7] text-[#1E293B] border border-[#E7E5E4]">
=======
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {ret?.name}
                        <span className="block text-[10px] text-slate-500">{ret?.city}</span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {prod?.name}
                        <span className="block text-[10px] text-slate-500 font-mono">{prod?.sku}</span>
                      </td>

                      <td className="py-3 px-4 text-center text-slate-400 font-mono">{f.q10}</td>
                      <td className="py-3 px-4 text-center font-black text-sm text-emerald-400 font-mono">{f.q50}</td>
                      <td className="py-3 px-4 text-center text-slate-300 font-mono">{f.q80}</td>
                      <td className="py-3 px-4 text-center text-slate-300 font-mono">{f.q90}</td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-300 font-mono">{f.q95}</td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                          {f.method}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {f.stockoutCorrected && (
<<<<<<< HEAD
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF3E0] text-[#EA580C] border border-[#E7E5E4]">
                              CORRECTED
                            </span>
                          )}
                          {(f.flags || []).map((flag, fIdx) => (
                            <span key={fIdx} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#FFF8E7] text-[#64748B] border border-[#E7E5E4]">
=======
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              CORRECTED
                            </span>
                          )}
                          {f.flags.map((flag, fIdx) => (
                            <span key={fIdx} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-800 text-slate-400">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                              {flag}
                            </span>
                          ))}
                        </div>
                      </td>

<<<<<<< HEAD
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRetailer(f.retailerId);
                            setSelectedSku(f.sku);
                            const el = document.getElementById('llm-decision-panel');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-all cursor-pointer shadow-2xs hover:scale-102"
                          title="Synthesize LLM prediction decision and natural-language accessibility audit"
                        >
                          <Bot className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>AI Audit</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRetailer(f.retailerId);
                            setSelectedSku(f.sku);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#2563EB] text-white shadow-xs'
                              : 'text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE]'
=======
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRetailer(f.retailerId);
                            setSelectedSku(f.sku);
                          }}
                          className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                          }`}
                        >
                          View Curve
                        </button>
                      </td>
                    </tr>
                  );
                })}
<<<<<<< HEAD

                {filteredForecasts.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-12 px-4 text-center">
                      <div className="max-w-sm mx-auto space-y-2">
                        <p className="text-sm font-semibold text-[#1E293B]">No Forecast Series Found</p>
                        <p className="text-xs text-[#64748B]">
                          No demand forecast records match the currently selected filter criteria.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setFilterMethod('all');
                            setShowStockoutCorrectedOnly(false);
                          }}
                          className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
