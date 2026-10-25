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

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  queuedEventCount: number;
  onOpenDemoModal: () => void;
  onOpenWhatIfModal: () => void;
  onTriggerSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  isOnline,
  setIsOnline,
  queuedEventCount,
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

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 space-y-6">
      {/* Top Brand Section */}
      <div className="space-y-4">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleTabClick('plans')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/40 group-hover:scale-105 transition-transform">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
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
          </div>

          {/* Persona Switcher Dropdown */}
          {personaDropdownOpen && (
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
            </div>
          )}
        </div>

        {/* Connectivity & Sync Status Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-2 rounded-xl text-xs">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}
            title="Toggle the simulated local event-processing mode; this does not change the backend connection."
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Wifi className="w-3.5 h-3.5" />
                <span>Demo online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Demo offline</span>
              </>
            )}
          </button>

          {queuedEventCount > 0 ? (
            <button
              onClick={onTriggerSync}
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
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

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


      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar: Fixed/Sticky on the Left */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 h-screen sticky top-0 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl z-30 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleTabClick('plans')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">
              HETVAYA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Online status indicator */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            aria-label={isOnline ? 'Demo network mode is online' : 'Demo network mode is offline'}
            title="Toggle simulated local event processing"
            className={`p-1.5 rounded-lg border text-xs ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </button>

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
          </div>

          {/* Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container on the left */}
          <div className="relative w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Navigation Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
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
