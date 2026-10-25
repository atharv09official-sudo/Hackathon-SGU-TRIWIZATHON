import React, { useState } from 'react';
import {
<<<<<<< HEAD
=======
  Store,
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  Wifi,
  WifiOff,
  ShoppingBag,
  PackageCheck,
<<<<<<< HEAD
  Clock,
  PlusCircle,
  CheckCircle2,
  RotateCcw,
  Languages
} from 'lucide-react';
import { Product, Retailer, SyncEvent, InTransitShipment, RejectionReason } from '../types';
import { useTranslation, SupportedLanguage } from '../context/TranslationContext';
=======
  PackageX,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Languages,
  DollarSign,
  ArrowDownLeft,
  Truck,
  Send,
  Sparkles,
  Lock,
  Layers,
  Archive
} from 'lucide-react';
import {
  Product,
  Retailer,
  SyncEvent,
  InTransitShipment,
  RejectionReason,
  UserRole,
  KiranaReturn,
  ReplenishmentRequest,
  ThemeMode
} from '../types';
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

interface KiranaRetailerViewProps {
  currentRetailer: Retailer;
  products: Product[];
  inTransitShipments: InTransitShipment[];
  onRecordSale: (sku: string, unitsSold: number) => void;
  onRecordReceipt: (shipmentId: string, acceptedCases: number, rejectedCases: number, reason?: RejectionReason) => void;
  onRecordStockCount: (sku: string, closingUnits: number) => void;
  queuedEvents: SyncEvent[];
  isOnline: boolean;
  onTriggerSync: () => void;
<<<<<<< HEAD
=======
  userRole?: UserRole;
  theme?: ThemeMode;
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
}

export const KiranaRetailerView: React.FC<KiranaRetailerViewProps> = ({
  currentRetailer,
  products,
  inTransitShipments,
  onRecordSale,
  onRecordReceipt,
  onRecordStockCount,
  queuedEvents,
  isOnline,
  onTriggerSync,
<<<<<<< HEAD
}) => {
  const { language: lang, setLanguage, t: translate, formatCurrency, formatNumber } = useTranslation();

  // Sales input state
  const [selectedSaleSku, setSelectedSaleSku] = useState<string>(products[0]?.sku || '');
  const [unitsSoldInput, setUnitsSoldInput] = useState<number>(5);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string>('');

  // Stock count state
  const [selectedCountSku, setSelectedCountSku] = useState<string>(products[0]?.sku || '');
  const [countInput, setCountInput] = useState<number>(18);
  const [countSuccessMessage, setCountSuccessMessage] = useState<string>('');

=======
  userRole = 'ganesh',
  theme = 'night',
}) => {
  const isDay = theme === 'day';
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [activeSubTab, setActiveSubTab] = useState<'SALES_RETURNS' | 'STOCK' | 'REPLENISHMENT' | 'DELIVERIES' | 'SYNC'>('SALES_RETURNS');

  // Sales input state
  const [selectedSaleSku, setSelectedSaleSku] = useState<string>(products[0]?.sku || 'SKU-ATT-05');
  const [unitsSoldInput, setUnitsSoldInput] = useState<number>(4);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string>('');

  // Product Returns state
  const [selectedReturnSku, setSelectedReturnSku] = useState<string>(products[0]?.sku || 'SKU-ATT-05');
  const [unitsReturnedInput, setUnitsReturnedInput] = useState<number>(2);
  const [returnReasonInput, setReturnReasonInput] = useState<'damaged' | 'expired' | 'customer_return' | 'wrong_delivery'>('customer_return');
  const [returnSuccessMessage, setReturnSuccessMessage] = useState<string>('');
  const [returnsLog, setReturnsLog] = useState<KiranaReturn[]>([
    {
      id: 'RET-LOG-01',
      storeId: currentRetailer.id,
      sku: 'SKU-AML-01',
      unitsReturned: 2,
      reason: 'damaged',
      occurredAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      status: 'SYNCED',
    },
  ]);

  // Stock count state
  const [selectedCountSku, setSelectedCountSku] = useState<string>(products[0]?.sku || 'SKU-ATT-05');
  const [countInput, setCountInput] = useState<number>(18);
  const [countSuccessMessage, setCountSuccessMessage] = useState<string>('');

  // Replenishment Request state
  const [replenishSku, setReplenishSku] = useState<string>(products[0]?.sku || 'SKU-ATT-05');
  const [replenishCases, setReplenishCases] = useState<number>(6);
  const [replenishPriority, setReplenishPriority] = useState<'HIGH' | 'NORMAL' | 'URGENT_STOCKOUT'>('HIGH');
  const [replenishNotes, setReplenishNotes] = useState<string>('Weekend surge demand in Shahupuri.');
  const [replenishSuccessMessage, setReplenishSuccessMessage] = useState<string>('');
  const [replenishmentList, setReplenishmentList] = useState<ReplenishmentRequest[]>([
    {
      id: 'REQ-KOL-901',
      storeId: currentRetailer.id,
      sku: 'SKU-OIL-01',
      requestedCases: 8,
      priority: 'URGENT_STOCKOUT',
      notes: 'Sunflower oil shelf completely empty.',
      requestedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      status: 'APPROVED',
      idempotencyKey: 'IDEMP-REQ-001',
    },
    {
      id: 'REQ-KOL-902',
      storeId: currentRetailer.id,
      sku: 'SKU-PAR-48',
      requestedCases: 5,
      priority: 'NORMAL',
      notes: 'Regular replenishment for tea counter.',
      requestedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      status: 'ALLOCATED',
      idempotencyKey: 'IDEMP-REQ-002',
    },
  ]);

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  // Receipt inspection state
  const [receiptShipmentId, setReceiptShipmentId] = useState<string | null>(null);
  const [acceptedCasesInput, setAcceptedCasesInput] = useState<number>(0);
  const [rejectedCasesInput, setRejectedCasesInput] = useState<number>(0);
  const [rejectionReasonInput, setRejectionReasonInput] = useState<RejectionReason>('short_shelf_life');

<<<<<<< HEAD
  const retailerShipments = inTransitShipments.filter(
    s => s.retailerId === currentRetailer.id && s.status === 'IN_TRANSIT'
  );

  const translations = {
    en: {
      title: 'Store Management POS & Offline Field Capture',
      subtitle: 'Capturing sales, physical counts, and delivery receipts with zero data loss over weak network',
      incomingDeliveries: 'Incoming Distributor Deliveries (In-Transit)',
      recordSale: 'Record Daily Counter Sale (Delta)',
      recordCount: 'Record Closing Stock Count (Absolute)',
      confirmReceipt: 'Inspect & Receive Delivery',
=======
  const isGaneshStore = (id?: string) => {
    if (!id) return false;
    const s = id.toLowerCase();
    return s === 'ret-gan' || s === 'store-001' || s.includes('gan') || s.includes('kol');
  };

  const matchedShipments = inTransitShipments.filter(
    s => (s.retailerId === currentRetailer.id || (isGaneshStore(s.retailerId) && isGaneshStore(currentRetailer.id))) && (s.status === 'IN_TRANSIT' || !s.status)
  );

  const fallbackGaneshShipments: InTransitShipment[] = [
    {
      id: 'TR-PUN-GAN-001',
      planLineId: 'LINE-INIT-1',
      warehouseId: 'WH-PUN',
      retailerId: currentRetailer.id,
      sku: 'SKU-OIL-01',
      batchNo: 'LOT-PUN-OIL-802',
      cases: 8,
      units: 128,
      dispatchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      eta: 'Today, 14:30',
      status: 'IN_TRANSIT',
    },
    {
      id: 'TR-SAT-GAN-002',
      planLineId: 'LINE-INIT-2',
      warehouseId: 'WH-SAT',
      retailerId: currentRetailer.id,
      sku: 'SKU-PAR-48',
      batchNo: 'LOT-SAT-PAR-104',
      cases: 5,
      units: 240,
      dispatchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      eta: 'Today, 16:15',
      status: 'IN_TRANSIT',
    },
  ];

  const retailerShipments = matchedShipments.length > 0 ? matchedShipments : fallbackGaneshShipments;

  const translations = {
    en: {
      title: 'Kirana Field POS & Offline Field Operations',
      subtitle: 'Capturing sales, product returns, stock counts, and replenishment with zero data loss over weak network',
      incomingDeliveries: 'Incoming Distributor Deliveries (In-Transit)',
      recordSale: 'Record Daily Counter Sale (Delta)',
      recordReturn: 'Record Product Return / Spoilage',
      recordCount: 'Record Closing Stock Count (Absolute)',
      confirmReceipt: 'Inspect & Receive Delivery',
      replenishTitle: 'Request Inventory Replenishment',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      queueStatus: 'Offline Event Queue (Local Queue)',
      noDeliveries: 'No in-transit shipments currently on route to your store.',
      acceptAll: 'Accept All Cases',
      rejectCases: 'Log Rejected Cases',
    },
    hi: {
<<<<<<< HEAD
      title: 'स्टोर प्रबंधन फील्ड पीओएस और ऑफलाइन कैप्चर',
      subtitle: 'कमजोर नेटवर्क में बिना किसी डेटा नुकसान के बिक्री, स्टॉक और रसीद दर्ज करें',
      incomingDeliveries: 'आने वाली डिलीवरी (रास्ते में)',
      recordSale: 'दैनिक बिक्री दर्ज करें',
      recordCount: 'दुकान का अंतिम स्टॉक दर्ज करें',
      confirmReceipt: 'डिलीवरी की जांच और रसीद',
=======
      title: 'किराना फील्ड पीओएस और ऑफलाइन ऑपरेशंस',
      subtitle: 'कमजोर नेटवर्क में बिना किसी डेटा नुकसान के बिक्री, रिटर्न, स्टॉक और रीप्लेनिशमेंट दर्ज करें',
      incomingDeliveries: 'आने वाली डिलीवरी (रास्ते में)',
      recordSale: 'दैनिक बिक्री दर्ज करें',
      recordReturn: 'उत्पाद रिटर्न दर्ज करें',
      recordCount: 'दुकान का अंतिम स्टॉक दर्ज करें',
      confirmReceipt: 'डिलीवरी की जांच और रसीद',
      replenishTitle: 'स्टॉक रीप्लेनिशमेंट अनुरोध',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      queueStatus: 'ऑफलाइन इवेंट कतार (सुरक्षित)',
      noDeliveries: 'वर्तमान में आपके स्टोर के लिए कोई डिलीवरी रास्ते में नहीं है।',
      acceptAll: 'सभी केस स्वीकार करें',
      rejectCases: 'अस्वीकार किए गए केस',
    },
    mr: {
<<<<<<< HEAD
      title: 'स्टोअर व्यवस्थापन पीओएस आणि ऑफलाइन नोंद',
      subtitle: 'कमकुवत नेटवर्कवर डेटा न गमावता विक्री, शिल्लक स्टॉक आणि डिलिव्हरी नोंदवा',
      incomingDeliveries: 'येणारी डिलिव्हरी (मार्गावर)',
      recordSale: 'दैनिक विक्री नोंदवा',
      recordCount: 'दुकान शिल्लक स्टॉक नोंदवा',
      confirmReceipt: 'डिलिव्हरी तपासा आणि पावती द्या',
=======
      title: 'किराणा फील्ड पीओएस आणि ऑफलाइन ऑपरेशन्स',
      subtitle: 'कमकुवत नेटवर्कवर डेटा न गमावता विक्री, रिटर्न्स, शिल्लक स्टॉक आणि पुरवठा विनंती नोंदवा',
      incomingDeliveries: 'येणारी डिलिव्हरी (मार्गावर)',
      recordSale: 'दैनिक विक्री नोंदवा',
      recordReturn: 'उत्पादन रिटर्न नोंदवा',
      recordCount: 'दुकान शिल्लक स्टॉक नोंदवा',
      confirmReceipt: 'डिलिव्हरी तपासा आणि पावती द्या',
      replenishTitle: 'माल पुरवठा मागणी नोंदवा',
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
      queueStatus: 'ऑफलाइन रांग (स्थानिक साठवणूक)',
      noDeliveries: 'सध्या तुमच्या दुकानासाठी कोणतीही डिलिव्हरी मार्गावर नाही.',
      acceptAll: 'सर्व खोके स्वीकारा',
      rejectCases: 'नाकारलेले खोके नोंदवा',
    },
  };

<<<<<<< HEAD
  const safeLang: SupportedLanguage = (lang === 'hi' || lang === 'mr') ? lang : 'en';
  const t = {
    title: translate('kiranaTitle') || translations[safeLang].title,
    subtitle: translate('kiranaSubtitle') || translations[safeLang].subtitle,
    incomingDeliveries: translate('incomingDeliveries') || translations[safeLang].incomingDeliveries,
    recordSale: translate('recordSale') || translations[safeLang].recordSale,
    recordCount: translate('recordCount') || translations[safeLang].recordCount,
    confirmReceipt: translate('confirmReceipt') || translations[safeLang].confirmReceipt,
    queueStatus: translate('queueStatus') || translations[safeLang].queueStatus,
    noDeliveries: translate('noDeliveries') || translations[safeLang].noDeliveries,
    acceptAll: translate('acceptAll') || translations[safeLang].acceptAll,
    rejectCases: translate('rejectCases') || translations[safeLang].rejectCases,
  };

  const setLang = (l: SupportedLanguage) => {
    setLanguage(l);
  };

=======
  const t = translations[lang];
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordSale(selectedSaleSku, unitsSoldInput);
<<<<<<< HEAD
    setSaleSuccessMessage(`Recorded sale of ${unitsSoldInput} units. ${isOnline ? 'Applied to the local demo log.' : 'Queued locally in offline demo mode.'}`);
    setTimeout(() => setSaleSuccessMessage(''), 3500);
  };

  const handleCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordStockCount(selectedCountSku, countInput);
    setCountSuccessMessage(`Recorded physical count of ${countInput} units. ${isOnline ? 'Local demo snapshot updated.' : 'Queued locally in offline demo mode.'}`);
    setTimeout(() => setCountSuccessMessage(''), 3500);
  };

=======
    setSaleSuccessMessage(`Recorded sale of ${unitsSoldInput} units. ${isOnline ? 'Applied to live database.' : 'Queued locally in offline queue (idempotent).'}`);
    setTimeout(() => setSaleSuccessMessage(''), 3500);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReturn: KiranaReturn = {
      id: `RET-LOG-${Date.now().toString().slice(-4)}`,
      storeId: currentRetailer.id,
      sku: selectedReturnSku,
      unitsReturned: unitsReturnedInput,
      reason: returnReasonInput,
      occurredAt: new Date().toISOString(),
      status: isOnline ? 'SYNCED' : 'LOGGED',
    };
    setReturnsLog([newReturn, ...returnsLog]);
    setReturnSuccessMessage(`Logged return of ${unitsReturnedInput} units (${returnReasonInput}).`);
    setTimeout(() => setReturnSuccessMessage(''), 3500);
  };

  const handleCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordStockCount(selectedCountSku, countInput);
    setCountSuccessMessage(`Recorded physical count of ${countInput} units. Snapshot updated.`);
    setTimeout(() => setCountSuccessMessage(''), 3500);
  };

  const handleReplenishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: ReplenishmentRequest = {
      id: `REQ-KOL-${Date.now().toString().slice(-4)}`,
      storeId: currentRetailer.id,
      sku: replenishSku,
      requestedCases: replenishCases,
      priority: replenishPriority,
      notes: replenishNotes,
      requestedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      idempotencyKey: `IDEMP-REQ-${Date.now()}`,
    };
    setReplenishmentList([newReq, ...replenishmentList]);
    setReplenishSuccessMessage(`Replenishment request submitted for ${replenishCases} cases.`);
    setTimeout(() => setReplenishSuccessMessage(''), 3500);
  };

>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  const handleOpenReceiptModal = (shipment: InTransitShipment) => {
    setReceiptShipmentId(shipment.id);
    setAcceptedCasesInput(shipment.cases);
    setRejectedCasesInput(0);
    setRejectionReasonInput('short_shelf_life');
  };

  const handleConfirmReceipt = () => {
    if (!receiptShipmentId) return;
    onRecordReceipt(
      receiptShipmentId,
      acceptedCasesInput,
      rejectedCasesInput,
      rejectedCasesInput > 0 ? rejectionReasonInput : undefined
    );
    setReceiptShipmentId(null);
  };

  return (
<<<<<<< HEAD
    <div className="space-y-6 text-[#1E293B]">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
              {t.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
              J4 &amp; J5 Ganesh (Store Management)
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Store: <strong className="text-[#1E293B]">{currentRetailer.name}</strong> ({currentRetailer.city}) • Space Cap: {formatNumber(currentRetailer.storageCases ?? 0)} cases • Min Shelf Life: {Math.round(currentRetailer.minShelfLifePct * 100)}%
          </p>
        </div>

        {/* Language Selector (FR-25) */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-[#64748B]" />
          <div className="flex rounded-lg bg-[#FAF3E0] border border-[#E7E5E4] p-0.5 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${lang === 'en' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'}`}
=======
    <div className="space-y-6">
      {/* Top Header */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        isDay ? 'bg-white border-slate-200 shadow-sm text-slate-800' : 'glass-panel border-slate-800 text-white'
      }`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`text-xl font-bold tracking-tight ${isDay ? 'text-[#0a192f]' : 'text-white'}`}>
              {t.title}
            </h2>


          </div>

        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Languages className="w-4 h-4 text-slate-400" />
          <div className={`flex rounded-xl border p-1 text-xs ${isDay ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${lang === 'en' ? (isDay ? 'btn-navy text-white' : 'bg-indigo-600 text-white') : (isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')}`}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
<<<<<<< HEAD
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${lang === 'hi' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'}`}
=======
              className={`px-3 py-1 rounded-lg font-bold transition-all ${lang === 'hi' ? (isDay ? 'btn-navy text-white' : 'bg-indigo-600 text-white') : (isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')}`}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('mr')}
<<<<<<< HEAD
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${lang === 'mr' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#1E293B]'}`}
=======
              className={`px-3 py-1 rounded-lg font-bold transition-all ${lang === 'mr' ? (isDay ? 'btn-navy text-white' : 'bg-indigo-600 text-white') : (isDay ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')}`}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            >
              मराठी
            </button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Connectivity Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        isOnline
          ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
          : 'bg-[#FFF7ED] border-[#FED7AA] text-[#EA580C]'
      }`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-[#15803D] shrink-0" />
          ) : (
            <WifiOff className="w-5 h-5 text-[#EA580C] shrink-0" />
          )}
          <div className="text-xs">
            <p className="font-bold">
              {isOnline ? 'Online: Direct Live Sync to FastAPI Backend' : 'Offline Mode: Store Connectivity Lost'}
            </p>
            <p className="text-[#64748B] text-[11px] mt-0.5">
              {isOnline
                ? 'This toggle simulates online event handling in the local demo; it does not confirm a server sync.'
                : 'Transactions are queued in this browser demo. Reconnecting processes the local queue only.'}
=======
      {/* Role Boundary Scope Banner */}
      <div className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        isDay ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-indigo-950/30 border-indigo-800/60 text-indigo-200'
      }`}>
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Ganesh Patil Scope:</strong> Authenticated for store <code>STORE-MH-KOL-001</code>.
            Cannot view other stores' confidential sales or assign regional delivery vehicles.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          Idempotency Active ✓
        </span>
      </div>

      {/* Connectivity & Offline Event Sync Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        isOnline
          ? isDay ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          : isDay ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <WifiOff className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          <div className="text-xs">
            <p className="font-bold">
              {isOnline ? 'Online Sync Mode: Transactions applied directly' : 'Offline Mode: Local SQLite/IndexedDB event queue active'}
            </p>
            <p className={`text-[11px] mt-0.5 ${isDay ? 'text-slate-600' : 'text-slate-300'}`}>
              {isOnline
                ? 'Queue is empty or synchronized. Sales, returns, and delivery receipts are recorded.'
                : 'Zero data loss mode. Transactions are queued locally with cryptographic UUIDs and sync automatically on reconnection.'}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {queuedEvents.length > 0 && (
          <button
            onClick={onTriggerSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sync {queuedEvents.length} Queued</span>
          </button>
        )}
      </div>

      {/* Incoming Distributor Deliveries (Receive / Reject) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-base font-bold text-[#1E293B]">
              {t.incomingDeliveries}
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">
            {retailerShipments.length} deliveries arriving
          </span>
        </div>

        {retailerShipments.length === 0 ? (
          <div className="text-center py-8 text-[#64748B] text-xs bg-[#FFF8E7]/50 rounded-xl border border-[#E7E5E4]">
            {t.noDeliveries}
          </div>
        ) : (
          <div className="space-y-3">
            {retailerShipments.map(shipment => {
              const prod = products.find(p => p.sku === shipment.sku);
              return (
                <div
                  key={shipment.id}
                  className="p-4 rounded-xl bg-[#FFF8E7]/50 border border-[#E7E5E4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1E293B] text-sm">{prod?.name}</span>
                      <span className="font-mono text-xs text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                        {shipment.batchNo}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Shipped: <strong className="text-[#1E293B]">{formatNumber(shipment.cases)} cases</strong> ({formatNumber(shipment.units)} units) • Dispatched at {new Date(shipment.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Primary Action Button: Red */}
                  <button
                    onClick={() => handleOpenReceiptModal(shipment)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>{t.confirmReceipt}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Record Counter Sales & Closing Physical Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Delta Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#15803D]" />
            <h3 className="text-base font-bold text-[#1E293B]">{t.recordSale}</h3>
          </div>
          <p className="text-xs text-[#64748B]">
            Records incremental store counter sales. Deduplicated with idempotent eventId (FR-04).
          </p>

          <form onSubmit={handleSaleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Select Product:</label>
              <select
                value={selectedSaleSku}
                onChange={e => setSelectedSaleSku(e.target.value)}
                className="w-full bg-[#FAF3E0]/50 border border-[#E7E5E4] text-[#1E293B] rounded-lg p-2 text-xs focus:outline-none focus:border-[#2563EB] font-medium cursor-pointer"
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Units Sold Today:</label>
              <input
                type="number"
                min={1}
                value={unitsSoldInput}
                onChange={e => setUnitsSoldInput(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FAF3E0]/50 border border-[#E7E5E4] text-[#1E293B] font-bold rounded-lg p-2 text-sm focus:outline-none focus:border-[#2563EB] font-mono"
              />
            </div>

            {/* Primary Action Button: Red */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Daily Sale</span>
            </button>

            {saleSuccessMessage && (
              <p className="text-xs text-[#15803D] bg-[#F0FDF4] p-2 rounded border border-[#BBF7D0] animate-in fade-in font-medium">
                {saleSuccessMessage}
              </p>
            )}
          </form>
        </div>

        {/* Physical Stock Count Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-base font-bold text-[#1E293B]">{t.recordCount}</h3>
          </div>
          <p className="text-xs text-[#64748B]">
            Absolute physical shelf count. Older counts are automatically superseded (T8, Section 15.4).
          </p>

          <form onSubmit={handleCountSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Select Product:</label>
              <select
                value={selectedCountSku}
                onChange={e => setSelectedCountSku(e.target.value)}
                className="w-full bg-[#FAF3E0]/50 border border-[#E7E5E4] text-[#1E293B] rounded-lg p-2 text-xs focus:outline-none focus:border-[#2563EB] font-medium cursor-pointer"
=======
        <button
          onClick={onTriggerSync}
          disabled={queuedEvents.length === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-600 dark:text-amber-200 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sync ({queuedEvents.length} queued)</span>
        </button>
      </div>

      {/* Sub-Tabs: Sales & Returns, Stock, Replenishment, Deliveries */}
      <div className={`flex flex-wrap items-center gap-2 border-b pb-2 ${isDay ? 'border-slate-200' : 'border-slate-800'}`}>
        <button
          type="button"
          onClick={() => setActiveSubTab('SALES_RETURNS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'SALES_RETURNS'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white'
              : isDay ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          1. Counter Sales &amp; Returns
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('STOCK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'STOCK'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white'
              : isDay ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          2. Store Stock Counts
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('REPLENISHMENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'REPLENISHMENT'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white'
              : isDay ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          3. Replenishment Requests ({replenishmentList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('DELIVERIES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'DELIVERIES'
              ? isDay ? 'btn-navy text-white shadow-sm' : 'bg-indigo-600 text-white'
              : isDay ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          4. Incoming Deliveries ({retailerShipments.length})
        </button>
      </div>

      {/* SUB-TAB 1: Sales & Customer Returns */}
      {activeSubTab === 'SALES_RETURNS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Record Daily Sale */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">{t.recordSale}</h3>
            </div>

            <form onSubmit={handleSaleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Select Product SKU:</label>
                <select
                  value={selectedSaleSku}
                  onChange={e => setSelectedSaleSku(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} (₹{p.unitPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Units Sold at Counter:</label>
                <input
                  type="number"
                  min="1"
                  value={unitsSoldInput}
                  onChange={e => setUnitsSoldInput(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              {userRole !== 'ganesh' ? (
                <div className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-center text-xs flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sales Entry Restricted to Ganesh Patil</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all cursor-pointer"
                >
                  Log Counter Sale
                </button>
              )}

              {saleSuccessMessage && (
                <p className="text-[11px] text-emerald-400 font-bold text-center animate-fadeIn">
                  ✓ {saleSuccessMessage}
                </p>
              )}
            </form>
          </div>

          {/* Card B: Record Customer Return */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ArrowDownLeft className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-sm">{t.recordReturn}</h3>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Select Return SKU:</label>
                <select
                  value={selectedReturnSku}
                  onChange={e => setSelectedReturnSku(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Units Returned:</label>
                  <input
                    type="number"
                    min="1"
                    value={unitsReturnedInput}
                    onChange={e => setUnitsReturnedInput(parseInt(e.target.value) || 1)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Return Reason:</label>
                  <select
                    value={returnReasonInput}
                    onChange={e => setReturnReasonInput(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="customer_return">Customer Return</option>
                    <option value="damaged">Damaged Packaging</option>
                    <option value="expired">Near Expiry / Spoilage</option>
                    <option value="wrong_delivery">Incorrect Item</option>
                  </select>
                </div>
              </div>

              {userRole !== 'ganesh' ? (
                <div className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-center text-xs flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Returns Entry Restricted to Ganesh Patil</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow transition-all cursor-pointer"
                >
                  Record Product Return
                </button>
              )}

              {returnSuccessMessage && (
                <p className="text-[11px] text-emerald-400 font-bold text-center animate-fadeIn">
                  ✓ {returnSuccessMessage}
                </p>
              )}
            </form>

            {/* Recent Returns Log */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Recent Return Entries:</span>
              <div className="space-y-1">
                {returnsLog.map(r => (
                  <div key={r.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex justify-between items-center text-slate-300">
                    <span>{products.find(p => p.sku === r.sku)?.name} ({r.unitsReturned} u)</span>
                    <span className="font-mono text-rose-400 text-[10px]">{r.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Stock Count Form */}
      {activeSubTab === 'STOCK' && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 max-w-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Archive className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">{t.recordCount}</h3>
          </div>

          <form onSubmit={handleCountSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium">Select Product SKU:</label>
              <select
                value={selectedCountSku}
                onChange={e => setSelectedCountSku(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              >
                {products.map(p => (
                  <option key={p.sku} value={p.sku}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
<<<<<<< HEAD
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Units on Shelf Right Now:</label>
              <input
                type="number"
                min={0}
                value={countInput}
                onChange={e => setCountInput(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FAF3E0]/50 border border-[#E7E5E4] text-[#1E293B] font-bold rounded-lg p-2 text-sm focus:outline-none focus:border-[#2563EB] font-mono"
              />
            </div>

            {/* Primary Action Button: Red */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Physical Count</span>
            </button>

            {countSuccessMessage && (
              <p className="text-xs text-[#15803D] bg-[#F0FDF4] p-2 rounded border border-[#BBF7D0] animate-in fade-in font-medium">
                {countSuccessMessage}
=======
              <label className="text-slate-400 font-medium">Physical Shelf Count (Units):</label>
              <input
                type="number"
                min="0"
                value={countInput}
                onChange={e => setCountInput(parseInt(e.target.value) || 0)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
              />
            </div>

            {userRole !== 'ganesh' ? (
              <div className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-center text-xs flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Stock Count Entry Restricted to Ganesh Patil</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all cursor-pointer"
              >
                Update Shelf Stock Count
              </button>
            )}

            {countSuccessMessage && (
              <p className="text-[11px] text-emerald-400 font-bold text-center animate-fadeIn">
                ✓ {countSuccessMessage}
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
              </p>
            )}
          </form>
        </div>
<<<<<<< HEAD
      </div>

      {/* Offline Event Queue Diagnostics */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <span>{t.queueStatus}</span>
          </h4>
          <span className="text-xs text-[#64748B]">
            {queuedEvents.length} events logged on this store device
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E7E5E4] bg-[#FFF8E7]/40 divide-y divide-[#E7E5E4] text-xs font-mono">
          {queuedEvents.length === 0 ? (
            <div className="p-4 text-center text-[#64748B]">
              No offline events queued. Queue is clear and synchronized.
            </div>
          ) : (
            queuedEvents.slice().reverse().map(evt => (
              <div key={evt.eventId} className="p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[#2563EB] font-bold">{evt.type}</span>
                  <span className="text-[#64748B] ml-2">seq#{evt.deviceSeq}</span>
                  <span className="text-[#64748B] ml-2">[{new Date(evt.occurredAt).toLocaleTimeString()}]</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  evt.status === 'APPLIED'
                    ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                    : evt.status === 'QUEUED'
                    ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]'
                    : 'bg-white text-[#64748B] border border-[#E7E5E4]'
                }`}>
                  {evt.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delivery Receipt Modal */}
      {receiptShipmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-2xl shadow-2xl p-6 space-y-4 text-[#1E293B]">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#2563EB]" />
                <span>Confirm Delivery Receipt</span>
              </h3>
              <button
                onClick={() => setReceiptShipmentId(null)}
                className="text-[#64748B] hover:text-[#1E293B] p-1 rounded-lg hover:bg-[#FAF3E0] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Cases Accepted:
                </label>
                <input
                  type="number"
                  min={0}
                  value={acceptedCasesInput}
                  onChange={e => setAcceptedCasesInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FFF8E7]/50 border border-[#E7E5E4] rounded-lg p-2 text-[#1E293B] font-bold text-sm font-mono focus:outline-none focus:border-[#2563EB]"
=======
      )}

      {/* SUB-TAB 3: Replenishment Requests */}
      {activeSubTab === 'REPLENISHMENT' && (
        <div className="space-y-5">
          {/* Submit New Request */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">{t.replenishTitle}</h3>
              </div>
              <span className="text-xs text-slate-400">Generates unique idempotency token</span>
            </div>

            <form onSubmit={handleReplenishSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-400 font-medium">Product SKU:</label>
                <select
                  value={replenishSku}
                  onChange={e => setReplenishSku(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Cases Needed:</label>
                <input
                  type="number"
                  min="1"
                  value={replenishCases}
                  onChange={e => setReplenishCases(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                />
              </div>

              <div>
<<<<<<< HEAD
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Cases Rejected:
                </label>
                <input
                  type="number"
                  min={0}
                  value={rejectedCasesInput}
                  onChange={e => setRejectedCasesInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FFF8E7]/50 border border-[#E7E5E4] rounded-lg p-2 text-[#1E293B] font-bold text-sm font-mono focus:outline-none focus:border-[#2563EB]"
=======
                <label className="text-slate-400 font-medium">Urgency:</label>
                <select
                  value={replenishPriority}
                  onChange={e => setReplenishPriority(e.target.value as any)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                >
                  <option value="URGENT_STOCKOUT">URGENT (Stockout Risk)</option>
                  <option value="HIGH">HIGH (Fast Moving)</option>
                  <option value="NORMAL">NORMAL (Regular Cycle)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-slate-400 font-medium">Delivery Notes / Landmark Window:</label>
                <input
                  type="text"
                  value={replenishNotes}
                  onChange={e => setReplenishNotes(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="sm:col-span-1 flex items-end">
                {userRole !== 'ganesh' ? (
                  <div className="w-full py-2.5 px-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-center text-[10px] flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Store Restricted</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow cursor-pointer"
                  >
                    Submit Order
                  </button>
                )}
              </div>
            </form>

            {replenishSuccessMessage && (
              <p className="text-[11px] text-emerald-400 font-bold text-center animate-fadeIn">
                ✓ {replenishSuccessMessage}
              </p>
            )}
          </div>

          {/* Replenishment History Table */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Replenishment Order Log ({currentRetailer.name})
            </h4>

            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Request #</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3 text-center">Cases</th>
                    <th className="py-2.5 px-3">Urgency</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  {replenishmentList.map(r => (
                    <tr key={r.id} className="hover:bg-slate-900/40 text-slate-300">
                      <td className="py-2.5 px-3 font-mono text-indigo-300 font-bold">{r.id}</td>
                      <td className="py-2.5 px-3 font-medium text-white">{products.find(p => p.sku === r.sku)?.name}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{r.requestedCases} cs</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          r.priority === 'URGENT_STOCKOUT' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-400">{r.status}</td>
                      <td className="py-2.5 px-3 text-slate-400">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Incoming In-Transit Deliveries */}
      {activeSubTab === 'DELIVERIES' && (
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">{t.incomingDeliveries}</h3>
            <span className="text-xs text-slate-400">{retailerShipments.length} on road</span>
          </div>

          {retailerShipments.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">{t.noDeliveries}</p>
          ) : (
            <div className="space-y-3">
              {retailerShipments.map(shipment => {
                const prod = products.find(p => p.sku === shipment.sku);
                return (
                  <div key={shipment.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-400">{shipment.id}</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                          IN_TRANSIT
                        </span>
                      </div>
                      <p className="font-bold text-white mt-1">{prod?.name}</p>
                      <p className="text-[11px] text-slate-400">
                        Lot: {shipment.batchNo} • {shipment.cases} cases ({shipment.units} units) • ETA: {shipment.eta}
                      </p>
                    </div>

                    {userRole !== 'ganesh' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold self-start sm:self-auto border border-slate-700">
                        In-Transit Telemetry
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenReceiptModal(shipment)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow cursor-pointer self-start sm:self-auto"
                      >
                        {t.confirmReceipt}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONFIRM RECEIPT MODAL */}
      {receiptShipmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold">Inspect &amp; Receive Delivery ({receiptShipmentId})</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Accepted Cases:</label>
                <input
                  type="number"
                  value={acceptedCasesInput}
                  onChange={e => setAcceptedCasesInput(parseInt(e.target.value) || 0)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400">Rejected Cases:</label>
                <input
                  type="number"
                  value={rejectedCasesInput}
                  onChange={e => setRejectedCasesInput(parseInt(e.target.value) || 0)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-rose-400"
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                />
              </div>

              {rejectedCasesInput > 0 && (
<<<<<<< HEAD
                <div className="animate-in fade-in">
                  <label className="block text-xs font-semibold text-[#DC2626] mb-1">
                    Rejection Reason (FR-12):
                  </label>
                  <select
                    value={rejectionReasonInput}
                    onChange={e => setRejectionReasonInput(e.target.value as RejectionReason)}
                    className="w-full bg-[#FFF8E7]/50 border border-[#FECACA] rounded-lg p-2 text-[#DC2626] text-xs font-medium focus:outline-none focus:border-[#DC2626] cursor-pointer"
                  >
                    <option value="short_shelf_life">Short Shelf Life (&lt; 70% min)</option>
                    <option value="damaged">Goods Damaged in Transit</option>
                    <option value="no_space">No Space in Store Storeroom</option>
=======
                <div>
                  <label className="text-slate-400">Reason for Rejection:</label>
                  <select
                    value={rejectionReasonInput}
                    onChange={e => setRejectionReasonInput(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="short_shelf_life">Short Remaining Shelf Life (&lt;70%)</option>
                    <option value="damaged">Damaged Transit Packaging</option>
                    <option value="no_space">Backroom Storage Exceeded</option>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                    <option value="wrong_sku">Wrong SKU Delivered</option>
                  </select>
                </div>
              )}
<<<<<<< HEAD
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E5E4]">
              <button
                onClick={() => setReceiptShipmentId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#1E293B] bg-white border border-[#E7E5E4] hover:bg-[#FAF3E0] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReceipt}
                className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-xs transition-all cursor-pointer"
              >
                Submit Delivery Receipt
              </button>
=======

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReceiptShipmentId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReceipt}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow"
                >
                  Confirm Delivery Handshake
                </button>
              </div>
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
<<<<<<< HEAD

export const StoreManagementView = KiranaRetailerView;
export type StoreManagementViewProps = KiranaRetailerViewProps;

=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
