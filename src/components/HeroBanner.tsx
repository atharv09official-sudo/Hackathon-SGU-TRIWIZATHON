import React, { useState } from 'react';
import {
  ArrowDownRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Clock,
  PackageCheck,
<<<<<<< HEAD
  MapPin,
  ChevronRight,
  Sun,
  RotateCcw,
  Globe2,
  Activity
} from 'lucide-react';
import { TerraDusk } from './TerraDusk';
import { BENCHMARK_COMPARISONS, BENCHMARK_SOLVE_TIME } from '../data/mockData';
import { PLAN_HORIZON_DAYS } from '../data/demoScope';
import { useTranslation } from '../context/TranslationContext';

export interface HeroBannerProps {
=======
  Play,
  RotateCcw,
  Globe2,
  Sparkles,
  MapPin,
  Sun,
  Layers,
  ChevronRight,
  Activity
} from 'lucide-react';
import { TerraDusk } from './TerraDusk';
import { BENCHMARK_COMPARISONS } from '../data/mockData';
import { PLAN_HORIZON_DAYS, SYNTHETIC_SALES_PANEL } from '../data/demoScope';

interface HeroBannerProps {
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  onQuickGenerate: () => void;
  planStatus: string;
  onExploreMap?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onQuickGenerate,
  planStatus,
  onExploreMap
}) => {
  const [earthSpeed, setEarthSpeed] = useState<number>(8.5);
  const [sunMode, setSunMode] = useState<'cursor' | 'fixed'>('cursor');
<<<<<<< HEAD
  const { t } = useTranslation();

  const stockoutDisplay = `${BENCHMARK_COMPARISONS.stockoutReductionVsCurrentPct}%`;
  const wasteDisplay = `${BENCHMARK_COMPARISONS.wasteReductionVsCurrentPct}%`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E7E5E4] p-6 md:p-8 mb-8 shadow-xs">
      {/* Subtle light background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF8E7]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FAF3E0]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Core Value Prop & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              {t('hero.tradeBadge', 'Indian FMCG & Traditional Store Trade')}
            </span>
            <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium bg-[#FFF8E7] px-2 py-0.5 rounded-full border border-[#E7E5E4]">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> {t('hero.weeklyCycle', 'Weekly Cycle W43')}
            </span>
            <span className="text-xs text-[#64748B] bg-[#FAF3E0] border border-[#E7E5E4] px-2 py-0.5 rounded-full font-medium">
              {PLAN_HORIZON_DAYS}-Day Horizon
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
            {t('hero.title', 'AI Marginal-Value Allocation & Demand Intelligence')}
          </h1>

          <p className="text-sm md:text-base text-[#64748B] leading-relaxed">
            {t('hero.subtitle', 'Eliminating the store replenishment trap for 13M+ stores where 3–5% distributor margins mean one expired case wipes out the profit of 20+ sales. Optimized via greedy marginal-value knapsack allocation with arrival shelf-life gating.')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Action Button (Red - Important / Critical Driver of the Engine) */}
            <button
              type="button"
              onClick={onQuickGenerate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all cursor-pointer select-none"
              title="Trigger immediate greedy marginal-value allocation run"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t('hero.quickRun', 'Quick Run Optimization')}</span>
=======
  const [isHoveredGlobe, setIsHoveredGlobe] = useState<boolean>(false);

  const stockoutDisplay = `${BENCHMARK_COMPARISONS.stockoutReductionVsCurrentPct}%`;
  const wasteDisplay = `${BENCHMARK_COMPARISONS.wasteReductionVsCurrentPct}%`;
  const freightDisplay = BENCHMARK_COMPARISONS.freightReductionVsCurrentPct < 0
    ? `${BENCHMARK_COMPARISONS.freightReductionVsCurrentPct}%`
    : `+${BENCHMARK_COMPARISONS.freightReductionVsCurrentPct}%`;

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#050b1a] to-slate-950 border border-slate-800/80 p-5 sm:p-6 md:p-8 2xl:p-10 shadow-2xl backdrop-blur-2xl">
      {/* Cinematic Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-[36rem] h-[36rem] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 grid min-w-0 grid-cols-1 xl:grid-cols-12 gap-7 xl:gap-8 2xl:gap-10 items-center">
        {/* Left Column: Typography, Value Proposition & Actions (7 Cols) */}
        <div className="min-w-0 xl:col-span-7 space-y-5 md:space-y-6">
          {/* Top Pill Tags */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              Maharashtra Supply Grid
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              {SYNTHETIC_SALES_PANEL.storeCount} Synthetic Stores / {SYNTHETIC_SALES_PANEL.skuCount} SKUs
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>{PLAN_HORIZON_DAYS}-Day Planning Horizon</span>
            </span>
          </div>

          {/* Hero Main Heading with custom Parmyo font */}
          <div className="space-y-2">
            <h1 className="font-parmyo text-3xl sm:text-4xl md:text-5xl 2xl:text-[3.25rem] text-white font-normal tracking-wide leading-[1.08] text-balance drop-shadow-md">
              AI-POWERED DISTRIBUTION INTELLIGENCE
            </h1>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
              <p className="font-parmyo text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-slate-200 tracking-wider uppercase font-normal">
                &amp; Inventory Optimization Engine
              </p>
            </div>
          </div>

          {/* Narrative Body Text */}
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-2xl text-pretty">
            Eliminating the kirana replenishment trap across Maharashtra hubs (Pune, Kolhapur, Satara, Solapur).
            Where thin <strong className="text-emerald-400 font-semibold">3–5% distributor margins</strong> mean a single expired case wipes out the profit of 20+ sales. Powered by
            <strong className="text-indigo-300 font-semibold"> OR-Tools CP-SAT</strong>, multi-horizon quantile demand predictions, and local <strong className="text-purple-300 font-semibold">Ollama LLM</strong> dispatch explainability.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Arrival Shelf-Life Gating (&ge;70% Min)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-xl shadow-sm">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Synthetic allocation benchmark</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Local Ollama Causal Intelligence</span>
            </div>
          </div>

          {/* Primary Action Row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={onQuickGenerate}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all duration-200 cursor-pointer active:scale-[0.98] select-none"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run AI Allocation Engine</span>
              <span className="ml-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-mono bg-indigo-950/60 border border-indigo-400/30">
                {PLAN_HORIZON_DAYS}D
              </span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </button>

            {onExploreMap && (
              <button
                type="button"
                onClick={onExploreMap}
<<<<<<< HEAD
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{t('hero.gisMap', 'Maharashtra GIS Map')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-[#64748B] pl-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span>Status: <strong className="text-[#1E293B] uppercase font-mono">{planStatus}</strong></span>
            </div>
          </div>

          {/* Semantic Badges: Green (Success/Safe), Yellow (Caution/Shelf-Life), Orange (Reason Cards) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-[#854D0E] bg-[#FEFCE8] border border-[#FEF08A] px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>{t('hero.shelfLifeBadge', 'Arrival Shelf-Life Verified (≥70% Min)')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1 rounded-full font-medium">
              <Zap className="w-3.5 h-3.5 text-[#15803D]" />
              <span>{t('hero.solveTimeBadge', 'Solve Time: <1ms p95')} ({BENCHMARK_SOLVE_TIME.p95}ms)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#EA580C] bg-[#FFF7ED] border border-[#FED7AA] px-3 py-1 rounded-full font-medium">
              <PackageCheck className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{t('hero.reasonCardsBadge', 'Explainable Marginal Reason Cards')}</span>
            </div>
          </div>

          {/* Quick KPI Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
            {/* Stockout reduction (Green Success) */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#15803D] font-bold">
                <span>{t('hero.kpiStockouts', 'Stockouts Reduced')}</span>
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="mt-1 text-2xl font-black text-[#15803D] tracking-tight">{stockoutDisplay}</div>
              <div className="text-[11px] text-[#64748B] font-medium">{t('hero.kpiStockoutsSub', 'vs Current Practice (simulated)')}</div>
            </div>

            {/* Waste reduction (Blue Informational/Efficiency) */}
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#2563EB] font-bold">
                <span>{t('hero.kpiWaste', 'Expiry & Waste Cut')}</span>
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="mt-1 text-2xl font-black text-[#2563EB] tracking-tight">{wasteDisplay}</div>
              <div className="text-[11px] text-[#64748B] font-medium">{t('hero.kpiWasteSub', 'Total inventory waste reduction')}</div>
            </div>

            {/* vs Textbook (Orange Operational Comparison) */}
            <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-xs col-span-2 sm:col-span-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#EA580C] font-bold">
                <span>{t('hero.kpiTextbook', 'vs Textbook Model')}</span>
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="mt-1 text-2xl font-black text-[#EA580C] tracking-tight">{BENCHMARK_COMPARISONS.stockoutChangeVsTextbookPct}%</div>
              <div className="text-[11px] text-[#64748B] font-medium">{t('hero.kpiTextbookSub', 'Stockout reduction vs textbook baseline')}</div>
=======
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Maharashtra GIS Map</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Status: <strong className="text-white uppercase font-mono">{planStatus}</strong></span>
            </div>
          </div>

          {/* Synthetic Benchmark Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-3 border-t border-slate-800/60">
            {/* Stockout reduction */}
            <div className="glass-panel p-3.5 rounded-2xl border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/40">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Stockouts Reduced</span>
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
                {stockoutDisplay}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">vs Current Baseline</div>
            </div>

            {/* Waste reduction */}
            <div className="glass-panel p-3.5 rounded-2xl border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-slate-900/40">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                <span>Expiry &amp; Rejection</span>
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black text-indigo-300 font-mono tracking-tight">
                {wasteDisplay}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Total Waste Cut</div>
            </div>

            {/* Benchmark vs Textbook */}
            <div className="glass-panel p-3.5 rounded-2xl border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/40 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>vs Textbook Model</span>
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                {BENCHMARK_COMPARISONS.stockoutChangeVsTextbookPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Stockout Elimination</div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Rotating Earth (5 Cols) */}
<<<<<<< HEAD
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#FAF3E0] to-white border border-[#E7E5E4] p-2 shadow-xs group">
            <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
              <TerraDusk
                size={320}
=======
        <div className="relative flex min-w-0 w-full flex-col items-center justify-center xl:col-span-5">
          {/* Earth Container with Ambient Shadow & Glow Ring */}
          <div
            className="relative w-full max-w-[420px] aspect-square flex items-center justify-center rounded-3xl p-1 group"
            onMouseEnter={() => setIsHoveredGlobe(true)}
            onMouseLeave={() => setIsHoveredGlobe(false)}
          >
            {/* Ambient Multi-Ring Halo Effect */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-600/20 via-cyan-500/20 to-blue-600/10 blur-2xl pointer-events-none animate-pulse-subtle" />
            <div className="absolute inset-8 rounded-full border border-indigo-500/20 pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-cyan-500/15 border-dashed pointer-events-none" />

            {/* Rotating Earth WebGL Canvas */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
              <TerraDusk
                size={420}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                speed={earthSpeed}
                sun={sunMode}
                daylight={86}
                sunAngle={175}
<<<<<<< HEAD
                stars={4}
=======
                stars={6}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                hover={7.2}
                look={{
                  clouds: 5,
                  lights: 6,
<<<<<<< HEAD
                  atmosphere: '#2563EB',
=======
                  atmosphere: '#4F9BFF',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                }}
                background="transparent"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

<<<<<<< HEAD
            {/* Pune Hub Telemetry Badge */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E7E5E4] text-[10px] text-[#1E293B] flex items-center gap-1.5 shadow-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-ping" />
                <span className="font-bold">18.5204° N, 73.8567° E</span>
                <span className="text-[#64748B]">({t('hero.puneHub', 'Pune Hub')})</span>
=======
            {/* Floating Telemetry Badges */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <div className="glass-panel px-3 py-1.5 rounded-xl border-cyan-500/30 text-[11px] text-cyan-200 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono font-bold">18.5204° N, 73.8567° E</span>
                <span className="text-slate-400 text-[10px]">(Pune Hub)</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </div>
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none">
<<<<<<< HEAD
              <div className="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg border border-[#E7E5E4] text-[10px] text-[#64748B] flex items-center gap-1 shadow-xs">
                <Activity className="w-3 h-3 text-[#2563EB]" />
                <span>{t('hero.earthView', 'Interactive 3D Grid')}</span>
=======
              <div className="glass-panel px-3 py-1.5 rounded-xl border-indigo-500/30 text-[11px] text-indigo-200 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Drag to Rotate &bull; Cursor Sun Track</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Micro-Controls */}
          <div className="w-full max-w-[340px] mt-2 bg-white px-3 py-1.5 rounded-xl border border-[#E7E5E4] flex items-center justify-between text-xs text-[#64748B] shadow-xs">
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-[11px] font-semibold text-[#1E293B]">{t('hero.earthView', 'Earth View')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSunMode(prev => prev === 'cursor' ? 'fixed' : 'cursor')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  sunMode === 'cursor'
                    ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                    : 'bg-[#FAF3E0] text-[#64748B] hover:text-[#1E293B]'
                }`}
                title="Toggle sun light vector following cursor"
              >
                <Sun className="w-2.5 h-2.5 inline mr-1 text-amber-500" />
                <span>{sunMode === 'cursor' ? t('hero.cursorSun', 'Cursor Sun') : t('hero.fixedSun', 'Fixed Sun')}</span>
=======
          {/* Interactive Globe Micro-Controls Toolbar */}
          <div className="w-full max-w-[420px] mt-2 glass-panel p-2.5 rounded-2xl border-slate-800/80 flex items-center justify-between text-xs text-slate-300 shadow-md">
            <div className="flex items-center gap-2 pl-2">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-semibold text-slate-300">Interactive Earth View</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSunMode(prev => prev === 'cursor' ? 'fixed' : 'cursor')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  sunMode === 'cursor'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle sun light vector following cursor"
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>{sunMode === 'cursor' ? 'Cursor Sun' : 'Fixed Sun'}</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </button>

              <button
                type="button"
                onClick={() => setEarthSpeed(prev => prev === 0 ? 8.5 : prev < 15 ? prev + 4 : 0)}
<<<<<<< HEAD
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FAF3E0] hover:bg-[#FFF8E7] text-[#64748B] border border-[#E7E5E4] transition-all cursor-pointer"
                title="Change Earth rotation speed"
              >
                <RotateCcw className="w-2.5 h-2.5 inline mr-1 text-[#2563EB]" />
=======
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                title="Change Earth rotation speed"
              >
                <RotateCcw className="w-3 h-3 text-indigo-400" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                <span>{earthSpeed === 0 ? 'Paused' : `${(earthSpeed / 5).toFixed(1)}x`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
    </div>
=======
    </section>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  );
};

export default HeroBanner;
