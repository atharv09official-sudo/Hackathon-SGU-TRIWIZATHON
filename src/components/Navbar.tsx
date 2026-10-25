import React, { useState } from 'react';
import {
  Boxes,
  TrendingUp,
  Cpu,
  BarChart3,
  Warehouse as WarehouseIcon,
  Store,
  UploadCloud,
  Activity,
  Wifi,
  WifiOff,
  Sparkles,
  Sliders,
  CheckCircle2,
<<<<<<< HEAD
  MapPin,
  Menu,
  X,
  Truck,
  Sun,
  Moon,
  Languages,
  UserCheck,
  Bell,
  Bot
} from 'lucide-react';
import { UserRole, ThemeMode } from '../types';
import { useTranslation, SUPPORTED_LANGUAGES } from '../context/TranslationContext';


export type ActiveTab = 'plans' | 'forecast' | 'map' | 'benchmark' | 'warehouse' | 'retailer' | 'dispatch' | 'import' | 'health' | 'profile';
=======
  AlertTriangle,
  Globe,
  MapPin,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Truck,
  RotateCcw,
  Bell,
  MessageSquare
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab = 'plans' | 'forecast' | 'map' | 'benchmark' | 'warehouse' | 'retailer' | 'dispatch' | 'import' | 'health' | 'notifications';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  queuedEventCount: number;
<<<<<<< HEAD
  unreadCriticalCount?: number;
  onOpenDemoModal: () => void;
  onOpenWhatIfModal: () => void;
  onTriggerSync: () => void;
  onOpenChatbot?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
=======
  onOpenDemoModal: () => void;
  onOpenWhatIfModal: () => void;
  onTriggerSync: () => void;
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  isOnline,
  setIsOnline,
  queuedEventCount,
<<<<<<< HEAD
  unreadCriticalCount = 0,
  onOpenDemoModal,
  onOpenWhatIfModal,
  onTriggerSync,
  onOpenChatbot,
  theme = 'day',
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();

  const roleNames: Record<UserRole, { name: string; title: string }> = {
    rohit: { name: 'Rohit Deshpande', title: 'Distribution Planner' },
    sunita: { name: 'Sunita Deshmukh', title: 'Warehouse Manager (Pune Hub)' },
    ganesh: { name: 'Ganesh Patil', title: 'Store Management Owner (Kolhapur)' },
    priya: { name: 'Priya Sharma', title: 'System Administrator' },
  };

  const navCategories = [
    {
      label: t('nav.decisionSuite', 'PLANNING & FORECAST'),
      items: [
        { id: 'plans' as ActiveTab, label: t('nav.plans', 'Allocation Plan'), icon: Cpu, badge: 'ALLOC' },
        { id: 'forecast' as ActiveTab, label: t('nav.forecast', 'Demand Forecast'), icon: TrendingUp, badge: 'Quantile' },
        { id: 'map' as ActiveTab, label: t('nav.map', 'Demand Map'), icon: MapPin, badge: 'Geo' },
        { id: 'benchmark' as ActiveTab, label: t('nav.benchmark', 'Impact Benchmark'), icon: BarChart3, badge: '-40%' },
      ],
    },
    {
      label: t('nav.operations', 'FIELD & OPERATIONS'),
      items: [
        { id: 'dispatch' as ActiveTab, label: t('nav.dispatch', 'Smart Delivery Dispatch'), icon: Truck, badge: 'Native AI' },
        { id: 'warehouse' as ActiveTab, label: t('nav.warehouse', 'Warehouse Ops'), icon: WarehouseIcon, badge: 'FEFO' },
        { id: 'retailer' as ActiveTab, label: t('nav.retailer', 'Store Management'), icon: Store, badge: 'Offline' },
      ],
    },
    {
      label: t('nav.system', 'DATA & OBSERVABILITY'),
      items: [
        { id: 'import' as ActiveTab, label: t('nav.import', 'Data Import Studio'), icon: UploadCloud, badge: '5% Rule' },
        { id: 'health' as ActiveTab, label: t('nav.health', 'System Health & Alerts'), icon: Activity, badge: 'API' },
        {
          id: 'profile' as ActiveTab,
          label: 'Profile & Critical Messages',
          icon: UserCheck,
          badge: unreadCriticalCount > 0 ? `${unreadCriticalCount} New` : 'Profile',
        },
      ],
    },
  ];
=======
  onOpenDemoModal,
  onOpenWhatIfModal,
  onTriggerSync,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const roleNames: Record<UserRole, { name: string; title: string; scope: string; badgeColor: string }> = {
    rohit: {
      name: 'Rohit Deshpande',
      title: 'Distribution Planner',
      scope: 'Statewide Planning',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    sunita: {
      name: 'Sunita Deshmukh',
      title: 'Warehouse Manager',
      scope: 'Pune Hub (W-PUN)',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    ganesh: {
      name: 'Ganesh Patil',
      title: 'Kirana Store Owner',
      scope: 'Kolhapur (STORE-MH-KOL-001)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    priya: {
      name: 'Priya Sharma',
      title: 'System Administrator',
      scope: 'Systemwide Administration',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
  };

  const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
    rohit: Sliders,
    sunita: WarehouseIcon,
    ganesh: Store,
    priya: ShieldCheck,
  };
  const ActiveRoleIcon = roleIcons[userRole];

  const getNavCategoriesForRole = (role: UserRole) => {
    switch (role) {
      case 'ganesh':
        return [
          {
            label: 'MY KIRANA STORE (KOLHAPUR)',
            items: [
              { id: 'retailer' as ActiveTab, label: 'Kirana Field POS', icon: Store, badge: 'Counter POS' },
              { id: 'plans' as ActiveTab, label: 'Inbound Store Orders', icon: Boxes, badge: 'Inbound' },
              { id: 'forecast' as ActiveTab, label: 'Store Demand AI', icon: TrendingUp, badge: 'Local ML' },
              { id: 'dispatch' as ActiveTab, label: 'Incoming Delivery Tracker', icon: Truck, badge: 'Kolhapur' },
              { id: 'notifications' as ActiveTab, label: 'Store SMS Alerts', icon: Bell, badge: 'Twilio' },
            ],
          },
        ];
      case 'sunita':
        return [
          {
            label: 'PUNE HUB OPERATIONS (W-PUN)',
            items: [
              { id: 'warehouse' as ActiveTab, label: 'Warehouse Dock & FEFO', icon: WarehouseIcon, badge: 'W-PUN Dock' },
              { id: 'dispatch' as ActiveTab, label: 'Pune Fleet Dispatch', icon: Truck, badge: 'Native AI' },
              { id: 'plans' as ActiveTab, label: 'Pune Outbound Plan', icon: Cpu, badge: 'Outbound' },
              { id: 'forecast' as ActiveTab, label: 'Downstream Demand Intake', icon: TrendingUp, badge: 'Pune Hub' },
              { id: 'notifications' as ActiveTab, label: 'Warehouse SMS Alerts', icon: Bell, badge: 'Twilio' },
            ],
          },
        ];
      case 'priya':
        return [
          {
            label: 'GOVERNANCE & SYSTEM INTEGRITY',
            items: [
              { id: 'health' as ActiveTab, label: 'System Health & Alerts', icon: Activity, badge: 'API Mon' },
              { id: 'notifications' as ActiveTab, label: 'Twilio SMS & Alert Center', icon: Bell, badge: 'Gateway' },
              { id: 'import' as ActiveTab, label: 'Data Import Studio', icon: UploadCloud, badge: '5% Rule' },
              { id: 'plans' as ActiveTab, label: 'Allocation Audit Matrix', icon: Cpu, badge: 'Audit' },
            ],
          },
          {
            label: 'OBSERVABILITY & NETWORK',
            items: [
              { id: 'benchmark' as ActiveTab, label: 'Impact Benchmark', icon: BarChart3, badge: 'Baseline' },
              { id: 'dispatch' as ActiveTab, label: 'Fleet Dispatch Audit', icon: Truck, badge: 'Telemetry' },
              { id: 'map' as ActiveTab, label: 'Logistics Grid Map', icon: MapPin, badge: 'GIS' },
            ],
          },
        ];
      case 'rohit':
      default:
        return [
          {
            label: 'STATEWIDE PLANNING & OPTIMIZATION',
            items: [
              { id: 'plans' as ActiveTab, label: 'Allocation Plan', icon: Cpu, badge: 'OR-Tools' },
              { id: 'forecast' as ActiveTab, label: 'Demand Forecast', icon: TrendingUp, badge: 'Quantile' },
              { id: 'map' as ActiveTab, label: 'Demand Map', icon: MapPin, badge: 'Geo' },
              { id: 'benchmark' as ActiveTab, label: 'Impact Benchmark', icon: BarChart3, badge: 'Sim Result' },
            ],
          },
          {
            label: 'SUPPLY CHAIN EXECUTION & NOTIFICATIONS',
            items: [
              { id: 'dispatch' as ActiveTab, label: 'Smart Delivery Agent', icon: Truck, badge: 'Native AI' },
              { id: 'notifications' as ActiveTab, label: 'SMS & Incident Alerts Hub', icon: Bell, badge: 'Twilio' },
              { id: 'warehouse' as ActiveTab, label: 'Warehouse Stock Audit', icon: WarehouseIcon, badge: 'Audit FEFO' },
            ],
          },
        ];
    }
  };

  const navCategories = getNavCategoriesForRole(userRole);
  const allowedTabIds = React.useMemo(() => {
    return navCategories.flatMap(cat => cat.items.map(item => item.id));
  }, [userRole]);

  // Auto-switch to authorized tab if current tab becomes unauthorized
  React.useEffect(() => {
    if (!allowedTabIds.includes(activeTab)) {
      if (userRole === 'rohit') setActiveTab('plans');
      else if (userRole === 'sunita') setActiveTab('warehouse');
      else if (userRole === 'ganesh') setActiveTab('retailer');
      else if (userRole === 'priya') setActiveTab('health');
    }
  }, [userRole, activeTab, allowedTabIds, setActiveTab]);
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
<<<<<<< HEAD
    <div className="flex flex-col h-full justify-between p-4 space-y-4 bg-white text-[#1E293B]">
      {/* Top Brand Section */}
      <div className="space-y-3.5">
=======
    <div className="flex flex-col h-full justify-between p-4 space-y-6">
      {/* Top Brand Section */}
      <div className="space-y-4">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleTabClick('plans')}
        >
<<<<<<< HEAD
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-[#2563EB]/25 group-hover:bg-[#1D4ED8] transition-all">
=======
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/40 group-hover:scale-105 transition-transform">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
<<<<<<< HEAD
              <span className="font-extrabold text-xl tracking-tight text-[#1E293B]">
                HETVAYA
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded">
                v1.5
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-tight font-medium">
              Distribution Intelligence
            </p>
          </div>
        </div>

        {/* Multilingual Selector (Global Language State) */}
        <div className="bg-[#FFF8E7] border border-[#E7E5E4] rounded-xl p-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] mb-1.5 px-1">
            <span className="flex items-center gap-1.5 text-[#1E293B]">
              <Languages className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Language / भाषा</span>
            </span>
            <span className="text-[10px] uppercase font-mono font-bold text-[#2563EB] bg-white px-1.5 py-0.2 rounded border border-[#E7E5E4]">
              {lang.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {SUPPORTED_LANGUAGES.map(opt => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLang(opt.code)}
                className={`py-1 px-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  lang === opt.code
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAF3E0] border border-[#E7E5E4]'
                }`}
                title={`Switch to ${opt.name}`}
              >
                <span>{opt.flag}</span>
                <span>{opt.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hackathon Micro Badge */}
        <div className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between text-[11px]">
          <span className="text-[#2563EB] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Problem Statement 2
          </span>
          <span className="text-[10px] text-[#64748B] font-mono font-medium">FMCG</span>
        </div>

        {/* User Persona Switcher Card */}
        <div className="relative">
          <div
            className={`flex items-center justify-between border rounded-xl p-2.5 transition-all shadow-xs ${
              activeTab === 'profile'
                ? 'bg-[#EFF6FF] border-[#2563EB] ring-1 ring-[#2563EB]'
                : 'bg-[#FAF3E0] border-[#E7E5E4] hover:border-[#2563EB]'
            }`}
          >
            <div
              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              onClick={() => handleTabClick('profile')}
              title="Open User Profile & Critical Messages"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs relative">
                {userRole[0].toUpperCase()}
                {unreadCriticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-[#1E293B] truncate leading-tight">
                  {roleNames[userRole].name}
                </p>
                <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                  {roleNames[userRole].title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                type="button"
                onClick={() => handleTabClick('profile')}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#2563EB] hover:bg-[#EFF6FF]'
                }`}
                title="View Profile & Critical Messages"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPersonaDropdownOpen(!personaDropdownOpen);
                }}
                className="text-[10px] text-[#64748B] hover:text-[#1E293B] font-bold px-1.5 py-0.5 rounded hover:bg-[#FAF3E0] cursor-pointer"
                title="Switch active user persona"
              >
                Switch
              </button>
            </div>
=======
              <span className="font-extrabold text-xl tracking-tight text-[#0a192f]">
                HETVAYA
              </span>
            </div>
          </div>
        </div>

        {/* User Persona Switcher Card */}
        <div className="relative">
          <div
            onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
            className="flex items-center justify-between bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <ActiveRoleIcon className="w-4 h-4 text-white" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-slate-200 truncate leading-tight flex items-center gap-1.5">
                  <span>{roleNames[userRole].name}</span>
                </p>
                <p className="text-[10px] text-indigo-400 font-medium truncate mt-0.5">
                  {roleNames[userRole].scope}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-white font-semibold shrink-0 ml-1 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
              Switch
            </span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          {/* Persona Switcher Dropdown */}
          {personaDropdownOpen && (
<<<<<<< HEAD
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E5E4] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-2 py-1">
                Switch User Persona
              </p>
              {(Object.keys(roleNames) as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setPersonaDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    userRole === r
                      ? 'bg-[#EFF6FF] text-[#2563EB] font-bold border border-[#BFDBFE]'
                      : 'text-[#1E293B] hover:bg-[#FAF3E0]'
                  }`}
                >
                  <div className="truncate">
                    <p className="font-semibold truncate">{roleNames[r].name}</p>
                    <p className="text-[10px] text-[#64748B] truncate">{roleNames[r].title}</p>
                  </div>
                  {userRole === r && <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 ml-2" />}
                </button>
              ))}
=======
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
                Select Persona Scope
              </p>
              {(Object.keys(roleNames) as UserRole[]).map(r => {
                const RoleIcon = roleIcons[r];
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setPersonaDropdownOpen(false);
                      if (r === 'rohit') {
                        setActiveTab('plans');
                      } else if (r === 'sunita') {
                        setActiveTab('warehouse');
                      } else if (r === 'ganesh') {
                        setActiveTab('retailer');
                      } else if (r === 'priya') {
                        setActiveTab('health');
                      }
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      userRole === r ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                        <RoleIcon className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-slate-200 truncate">{roleNames[r].name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{roleNames[r].title}</p>
                        <span className="text-[9px] px-1 py-0.2 bg-slate-800 text-indigo-300 rounded font-mono">
                          {roleNames[r].scope}
                        </span>
                      </div>
                    </div>
                    {userRole === r && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          )}
        </div>

        {/* Connectivity & Sync Status Bar */}
<<<<<<< HEAD
        <div className="flex items-center justify-between bg-[#FFF8E7] border border-[#E7E5E4] p-2 rounded-xl text-xs">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 text-[#15803D] border border-emerald-200'
                : 'bg-orange-50 text-[#EA580C] border border-orange-200'
=======
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl text-xs">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            }`}
            title="Toggle the simulated local event-processing mode; this does not change the backend connection."
          >
            {isOnline ? (
              <>
<<<<<<< HEAD
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
                <Wifi className="w-3.5 h-3.5" />
                <span>{t('header.online', 'Online Mode')}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>
                <WifiOff className="w-3.5 h-3.5" />
                <span>{t('header.offline', 'Offline Mode')}</span>
=======
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Wifi className="w-3.5 h-3.5" />
                <span>Demo online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Demo offline</span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </>
            )}
          </button>

          {queuedEventCount > 0 ? (
            <button
              onClick={onTriggerSync}
<<<<<<< HEAD
              className="flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg border border-red-200 transition-all cursor-pointer"
              title="Click to force sync offline queue"
            >
              <span>{queuedEventCount} {t('header.queued', 'queued')}</span>
              <span className="underline ml-0.5">{t('header.processQueue', 'Process')}</span>
            </button>
          ) : (
            <span className="text-[10px] text-[#64748B] flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-[#15803D]" /> {t('header.synced', 'Synced')}
            </span>
          )}
        </div>

        {/* Navigation Categories */}
        <nav className="space-y-3.5 pt-1">
          {navCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-3">
=======
              className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-1 rounded-lg border border-amber-500/30 transition-all"
              title="Process queued events in the local demo queue"
            >
              <span>{queuedEventCount} queued</span>
              <span className="underline ml-0.5">Process</span>
            </button>
          ) : null}
        </div>

        {/* Navigation Categories */}
        <nav className="space-y-4 pt-1">
          {navCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                {cat.label}
              </p>
              <div className="space-y-0.5">
                {cat.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
<<<<<<< HEAD
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                          : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAF3E0] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-white' : 'text-[#2563EB]'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-1.5 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FAF3E0] text-[#64748B] border border-[#E7E5E4] group-hover:text-[#1E293B]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
=======
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        <span>{item.label}</span>
                      </div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

<<<<<<< HEAD
      {/* Bottom Utility & Demo Buttons */}
      <div className="space-y-2 pt-3 border-t border-[#E7E5E4]">
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none ${
              theme === 'night'
                ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                : 'bg-[#FFF8E7] text-[#1E293B] border border-[#E7E5E4] hover:bg-[#FAF3E0]'
            }`}
          >
            {theme === 'night' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>{t('header.nightMode', 'Night Mode (Cosmic)')}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('header.dayMode', 'Day Mode (Light Enterprise)')}</span>
              </>
            )}
          </button>
        )}

        {onOpenChatbot && (
          <button
            type="button"
            onClick={onOpenChatbot}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 transition-all shadow-md shadow-blue-500/20 cursor-pointer border border-white/20 group"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>HETVAYA Copilot</span>
            </div>
            <span className="text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white font-semibold">
              nemotron
            </span>
          </button>
        )}

        <button
          onClick={onOpenDemoModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{t('header.demoScript', '3-Min Demo Script')}</span>
        </button>

        <button
          onClick={onOpenWhatIfModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#1E293B] bg-white hover:bg-[#FFF8E7] border border-[#2563EB]/40 transition-all shadow-xs cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{t('header.whatIf', 'What-If Simulator')}</span>
        </button>

        <p className="text-[10px] text-center text-[#64748B] pt-1">
          HETVAYA Intelligence Engine
        </p>
=======
      {/* Bottom Utility & Persona-Specific Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-slate-800/80">
        {/* Persona Quick Action 1 */}
        {userRole === 'ganesh' ? (
          <button
            type="button"
            onClick={onTriggerSync}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-sm cursor-pointer"
            title="Sync offline counter sales and inventory counts"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Store POS ({queuedEventCount})</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>3-Min Demo Script</span>
          </button>
        )}

        {/* Persona Quick Action 2 */}
        {userRole === 'ganesh' ? (
          <button
            type="button"
            onClick={() => handleTabClick('dispatch')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all shadow-sm cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kolhapur Delivery ETA</span>
          </button>
        ) : userRole === 'sunita' ? (
          <button
            type="button"
            onClick={() => handleTabClick('warehouse')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all shadow-sm cursor-pointer"
          >
            <WarehouseIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pune Dock &amp; GRN Entry</span>
          </button>
        ) : userRole === 'priya' ? (
          <button
            type="button"
            onClick={() => handleTabClick('import')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>5% Discrepancy Rule Studio</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenWhatIfModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all shadow-sm cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>What-If Simulator</span>
          </button>
        )}


>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar: Fixed/Sticky on the Left */}
<<<<<<< HEAD
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 border-r border-[#E7E5E4] bg-white z-30 overflow-y-auto">
=======
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl z-30 overflow-y-auto">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
<<<<<<< HEAD
      <header className="lg:hidden sticky top-0 z-40 w-full border-b border-[#E7E5E4] bg-white px-4 py-3 flex items-center justify-between shadow-xs">
=======
      <header className="lg:hidden sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleTabClick('plans')}
        >
<<<<<<< HEAD
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#1E293B]">
              HETVAYA
            </span>
            <span className="text-[9px] uppercase tracking-wider ml-1.5 font-bold px-1 py-0.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded">
              v1.5
            </span>
=======
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">
              HETVAYA
            </span>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>
        </div>

        <div className="flex items-center gap-2">
<<<<<<< HEAD
          {/* Quick Language Toggle on Mobile */}
          <div className="flex rounded-lg bg-[#FFF8E7] border border-[#E7E5E4] p-0.5 text-[10px] font-bold">
            {SUPPORTED_LANGUAGES.map(opt => (
              <button
                key={opt.code}
                onClick={() => setLang(opt.code)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${lang === opt.code ? 'bg-[#2563EB] text-white' : 'text-[#64748B]'}`}
              >
                {opt.code.toUpperCase()}
              </button>
            ))}
          </div>

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          {/* Online status indicator */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            aria-label={isOnline ? 'Demo network mode is online' : 'Demo network mode is offline'}
            title="Toggle simulated local event processing"
<<<<<<< HEAD
            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 text-[#15803D] border-emerald-200'
                : 'bg-orange-50 text-[#EA580C] border-orange-200'
=======
            className={`p-1.5 rounded-lg border text-xs ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </button>

<<<<<<< HEAD
          {/* Persona Avatar */}
          <div
            onClick={() => handleTabClick('profile')}
            className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-xs font-bold text-white shadow-xs cursor-pointer relative"
            title="Open Profile & Critical Messages"
          >
            {userRole[0].toUpperCase()}
            {unreadCriticalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white animate-pulse" />
            )}
=======
          {/* Quick Bell Notifications button */}
          <button
            onClick={() => handleTabClick('notifications')}
            aria-label="Twilio SMS & Notifications"
            title="Twilio SMS & Notifications Hub"
            className={`p-1.5 rounded-lg border text-xs relative cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Persona Avatar with dynamic RoleIcon */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
            <ActiveRoleIcon className="w-3.5 h-3.5 text-white" />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          </div>

          {/* Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
<<<<<<< HEAD
            className="p-1.5 rounded-lg bg-[#FFF8E7] border border-[#E7E5E4] text-[#1E293B] hover:bg-[#FAF3E0] cursor-pointer"
=======
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sliding Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
<<<<<<< HEAD
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
=======
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container on the left */}
<<<<<<< HEAD
          <div className="relative w-72 max-w-[85vw] bg-white border-r border-[#E7E5E4] h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
            <div className="p-3 border-b border-[#E7E5E4] flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
=======
          <div className="relative w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                Navigation Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
<<<<<<< HEAD
                className="p-1 rounded-lg text-[#64748B] hover:text-[#1E293B] cursor-pointer"
=======
                className="p-1 rounded-lg text-slate-400 hover:text-white"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
