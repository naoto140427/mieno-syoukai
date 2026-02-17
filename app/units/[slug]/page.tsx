'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Download, Wrench, Calendar, Info, ShieldCheck, PaintBucket, Cog } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

// --- Types & Interfaces ---
interface SpecItem {
  label: string;
  value: string;
}

interface DocumentItem {
  title: string;
  type: 'PDF' | 'Manual' | 'Catalog';
  size: string;
  url: string; // Dummy URL
}

interface MaintenanceItem {
  id: string;
  date: string;
  category: 'inspection' | 'custom' | 'wash' | 'repair';
  title: string;
  description: string;
}

interface UnitDetail {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string; // Placeholder or Unsplash URL
  specs: SpecItem[];
  documents: DocumentItem[];
  maintenance: MaintenanceItem[];
}

// --- Dummy Data ---
const unitsData: Record<string, UnitDetail> = {
  'serena-luxion': {
    id: 'serena-luxion',
    name: 'SERENA LUXION (2025)',
    role: 'Strategic Command Vehicle',
    description: 'ProPILOT 2.0を搭載した移動司令基地。全方位の状況把握と高度な兵站管理を可能にする、組織の要。',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop', // Car interior/abstract
    specs: [
      { label: 'Model', value: 'C28 SERENA e-POWER LUXION' },
      { label: 'Power Unit', value: '1.4L HR14DDe + EM57 Motor' },
      { label: 'Output', value: '120kW (163PS) / 315N・m' },
      { label: 'Drive System', value: 'FWD (e-POWER)' },
      { label: 'Dimensions', value: '4,765 x 1,715 x 1,885 mm' },
      { label: 'Seating', value: '7 Occupants (Captain Seats)' },
      { label: 'Tech', value: 'ProPILOT 2.0 / NissanConnect' },
    ],
    documents: [
      { title: 'Owner\'s Manual', type: 'PDF', size: '12.4 MB', url: '#' },
      { title: 'Navigation System Guide', type: 'PDF', size: '8.1 MB', url: '#' },
      { title: 'ProPILOT 2.0 Reference', type: 'PDF', size: '2.3 MB', url: '#' },
      { title: 'Maintenance Note', type: 'PDF', size: '1.5 MB', url: '#' },
    ],
    maintenance: [
      { id: 'm1', date: '2025-04-15', category: 'inspection', title: '1-Month Inspection', description: 'Initial system check, sensor calibration complete. All systems green.' },
      { id: 'm2', date: '2025-04-01', category: 'custom', title: 'Interior Command Console Setup', description: 'Installation of communication equipment and mobile office suite.' },
      { id: 'm3', date: '2025-03-20', category: 'wash', title: 'Pre-Deployment Detailing', description: 'Full body glass coating application (Layer: 2).' },
    ]
  },
  'gb350': {
    id: 'gb350',
    name: 'GB350 (2023)',
    role: 'The Classic Authority',
    description: '空冷単気筒の鼓動と、普遍的な造形美。CEOの意志を体現する、揺るぎないフラッグシップ。',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop', // Classic bike vibe
    specs: [
      { label: 'Model', value: 'Honda GB350 (NC59)' },
      { label: 'Engine', value: '348cc Air-Cooled Single OHC' },
      { label: 'Output', value: '15kW (20PS) / 5,500rpm' },
      { label: 'Torque', value: '29N・m / 3,000rpm' },
      { label: 'Weight', value: '179kg' },
      { label: 'Tank Capacity', value: '15L' },
    ],
    documents: [
      { title: 'Owner\'s Manual', type: 'PDF', size: '4.2 MB', url: '#' },
      { title: 'Parts Catalog (2nd Edition)', type: 'PDF', size: '18.5 MB', url: '#' },
    ],
    maintenance: [
      { id: 'g1', date: '2024-11-05', category: 'inspection', title: '12-Month Inspection', description: 'Oil change (Honda Ultra G1), Chain adjustment.' },
      { id: 'g2', date: '2024-05-20', category: 'wash', title: 'Detailing', description: 'Chrome polishing and rust prevention treatment.' },
    ]
  },
  'cbr600rr-monkey125': {
    id: 'cbr600rr-monkey125',
    name: 'CBR600RR & Monkey 125',
    role: 'Speed & Agility (Dual Platform)',
    description: 'サーキットDNAを持つスーパースポーツと、都市部を自在に駆けるレジャーバイクの戦略的運用。',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop', // Sport bike vibe
    specs: [
      { label: 'CBR600RR Engine', value: '599cc Liquid-Cooled 4-Stroke DOHC Inline-4' },
      { label: 'CBR Output', value: '89kW (121PS) / 14,000rpm' },
      { label: 'Monkey Engine', value: '123cc Air-Cooled 4-Stroke OHC Single' },
      { label: 'Monkey Output', value: '6.9kW (9.4PS) / 6,750rpm' },
      { label: 'Strategy', value: 'High-Speed Interception / Urban Reconnaissance' },
    ],
    documents: [
      { title: 'CBR600RR Owner\'s Manual', type: 'PDF', size: '5.6 MB', url: '#' },
      { title: 'Monkey 125 Owner\'s Manual', type: 'PDF', size: '3.1 MB', url: '#' },
      { title: 'HRC Setup Guide (Draft)', type: 'PDF', size: '1.2 MB', url: '#' },
    ],
    maintenance: [
        { id: 'c1', date: '2025-01-10', category: 'custom', title: 'CBR: Exhaust System Upgrade', description: 'Installation of slip-on silencer for weight reduction.' },
        { id: 'c2', date: '2024-12-15', category: 'inspection', title: 'Monkey: 6-Month Check', description: 'Tire pressure check, Oil replacement.' },
    ]
  },
  'yzf-r3': {
    id: 'yzf-r3',
    name: 'YZF-R3 (2025)',
    role: 'Next Generation Standard',
    description: 'R-Worldへの招待状。扱いやすさとスポーツ性能を高次元でバランスさせた、次世代のスタンダード。',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee53?q=80&w=2070&auto=format&fit=crop', // Yamaha blue vibe
    specs: [
      { label: 'Model', value: 'Yamaha YZF-R3' },
      { label: 'Engine', value: '320cc Liquid-Cooled DOHC Inline-2' },
      { label: 'Output', value: '31kW (42PS) / 10,750rpm' },
      { label: 'Weight', value: '169kg' },
      { label: 'Features', value: 'Upside-down Front Forks, LCD Meter' },
    ],
    documents: [
      { title: 'Owner\'s Manual', type: 'PDF', size: '4.8 MB', url: '#' },
    ],
    maintenance: [
        { id: 'y1', date: '2025-02-01', category: 'wash', title: 'Delivery Wash', description: 'Initial coating application.' },
    ]
  },
  'cbr400r': {
    id: 'cbr400r',
    name: 'CBR400R (2020)',
    role: 'The Core of Operations',
    description: '公道での扱いやすさを追求した、リアル・スポーツ。ツーリングからシティライドまで、あらゆる任務に対応する。',
    image: 'https://images.unsplash.com/photo-1625043484555-705944c8dc7a?q=80&w=2070&auto=format&fit=crop', // CBR vibe
    specs: [
      { label: 'Model', value: 'Honda CBR400R (NC56)' },
      { label: 'Engine', value: '399cc Liquid-Cooled DOHC Inline-2' },
      { label: 'Output', value: '34kW (46PS) / 9,000rpm' },
      { label: 'Torque', value: '38N・m / 7,500rpm' },
      { label: 'Weight', value: '192kg' },
    ],
    documents: [
      { title: 'Owner\'s Manual', type: 'PDF', size: '4.5 MB', url: '#' },
      { title: 'Service Manual', type: 'PDF', size: '22.1 MB', url: '#' },
    ],
    maintenance: [
      { id: 'cr1', date: '2024-10-10', category: 'inspection', title: 'Safety Inspection', description: 'Brake pad check, Fluid replacement.' },
      { id: 'cr2', date: '2024-08-05', category: 'custom', title: 'USB Charger Installation', description: 'Added dual port USB charger for mobile devices.' },
    ]
  }
};


export default function UnitDashboard() {
  const params = useParams();
  const slug = params?.slug as string;
  const unit = unitsData[slug];

  const [activeTab, setActiveTab] = useState<'specs' | 'documents' | 'maintenance'>('specs');

  // If unit not found, show 404 (though useParams might be async in future, currently usable directly in Client Components)
  if (!unit) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-mieno-gray text-mieno-navy">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">UNIT NOT FOUND</h1>
                <Link href="/units" className="text-blue-600 hover:underline">Return to Fleet</Link>
            </div>
        </div>
    );
  }

  const tabs = [
    { id: 'specs', label: 'Specs' },
    { id: 'documents', label: 'Documents' },
    { id: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="min-h-screen bg-mieno-gray text-mieno-text pb-20">
      {/* Header Section */}
      <header className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img src={unit.image} alt={unit.name} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="absolute top-0 left-0 p-6 z-20">
          <Link href="/units" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Fleet</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-mieno-navy/80 text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-2 bg-white/10 w-fit px-2 py-1 rounded backdrop-blur-sm">
                {unit.role}
              </h2>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                {unit.name}
              </h1>
              <p className="text-white/80 max-w-2xl text-sm md:text-lg leading-relaxed">
                {unit.description}
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 -mt-8 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl min-h-[500px] overflow-hidden">

          {/* Tabs Navigation */}
          <div className="border-b border-gray-100 p-2 md:p-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-colors whitespace-nowrap outline-none ${
                    activeTab === tab.id ? 'text-mieno-navy' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-mieno-gray rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-10 bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unit.specs.map((spec, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{spec.label}</h4>
                        <p className="text-lg font-semibold text-mieno-navy">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {unit.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:border-mieno-navy/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-white shadow-sm text-mieno-navy">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-mieno-text group-hover:text-mieno-navy transition-colors">{doc.title}</h4>
                            <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-mieno-navy transition-colors">
                          <Download size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 space-y-8 py-2">
                    {unit.maintenance.map((log, idx) => {
                        const Icon = log.category === 'inspection' ? ShieldCheck : log.category === 'custom' ? Wrench : log.category === 'wash' ? PaintBucket : Cog;
                        const colorClass = log.category === 'inspection' ? 'text-green-600 bg-green-50' : log.category === 'custom' ? 'text-purple-600 bg-purple-50' : log.category === 'wash' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-50';

                        return (
                            <div key={idx} className="relative pl-8 md:pl-10">
                                <div className={`absolute -left-[9px] top-0 p-1 rounded-full border-2 border-white shadow-sm ${colorClass}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                                    <span className="text-sm font-bold text-mieno-navy">{log.date}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider w-fit ${colorClass.replace('text-', 'bg-').replace('bg-', 'text-white ')}`}>
                                        {log.category}
                                    </span>
                                </div>
                                <h4 className="text-lg font-semibold text-mieno-text mb-1">{log.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{log.description}</p>
                            </div>
                        );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
