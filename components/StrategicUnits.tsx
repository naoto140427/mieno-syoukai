'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Gauge, Calendar, Wrench, Edit2, X, Save, User } from 'lucide-react';
import { Unit } from '@/types/database';
import { updateUnit } from '@/app/actions/units';

interface UnitData {
  id: string;
  name: string;
  role: string;
  copy: string;
  description: string;
  imageLabel: string;
  slug: string;
  isSpecial?: boolean; // For Watanabe's & Suemori's toggle
  specialContent?: {
    secondaryName: string;
    secondaryCopy: string;
    secondaryDescription: string;
    secondaryImageLabel: string;
    secondarySlug: string;
  };
  toggleLabels?: {
    primary: string;
    secondary: string;
  };
}

const units: UnitData[] = [
  {
    id: 'ceo',
    name: 'GB350 (2023)',
    role: '三重野 匠 CEO',
    copy: '本質は、飾らない。The Classic Authority.',
    description: '単気筒という名の、純粋な意志決定。伝統的な造形美と現代のテクノロジーが融合した、組織の揺るぎない基軸。',
    imageLabel: 'GB350 IMAGE',
    slug: 'gb350',
  },
  {
    id: 'cmo',
    name: 'CBR600RR (2020)',
    role: '末森 知輝 CMO',
    copy: '加速する情熱、緻密な機動力。',
    description: '600ccの高回転型バリュー・エンジン。圧倒的なポテンシャルを誇るメイン機体。',
    imageLabel: 'CBR600RR',
    slug: 'cbr600rr',
    isSpecial: true,
    toggleLabels: {
      primary: 'メイン機体',
      secondary: '局地用モビリティ'
    },
    specialContent: {
      secondaryName: 'Monkey 125',
      secondaryCopy: 'ラストワンマイルを開拓する。',
      secondaryDescription: '局地的な機動力を提供するマイクロ・モビリティ。Dual-Platform戦略の要。',
      secondaryImageLabel: 'MONKEY 125',
      secondarySlug: 'monkey125',
    },
  },
  {
    id: 'coo',
    name: 'YZF-R3 (2025)',
    role: '坂井 龍之介 COO',
    copy: '未来を、追い越していく。Define the Next Standard.',
    description: '最新のR-DNAがもたらす、次世代のイノベーション。変化の激しい市場環境における、最も効率的な回答。',
    imageLabel: 'YZF-R3 IMAGE',
    slug: 'yzf-r3',
  },
  {
    id: 'cto',
    name: 'CBR400R (2020)',
    role: '渡辺 直人 課長 (CTO/CIO)',
    copy: 'すべての道を、統治する。The Core of Operations.',
    description: '現場指揮官のための高機動二輪アセット。ロジスティクスの完全なる掌握。',
    imageLabel: 'CBR400R IMAGE',
    slug: 'cbr400r',
    isSpecial: true,
    toggleLabels: {
      primary: '二輪モード',
      secondary: '移動司令基地'
    },
    specialContent: {
      secondaryName: 'SERENA LUXION (2025)',
      secondaryCopy: 'すべての道を、統治する。The Core of Operations.',
      secondaryDescription: '組織全体を支える移動司令基地（ProPILOT 2.0搭載）。ロジスティクスの完全なる掌握。',
      secondaryImageLabel: 'SERENA LUXION IMAGE',
      secondarySlug: 'serena-luxion',
    },
  },
];

const UnitSection = ({ unit, index, dbUnits, isAdmin, onEdit }: { unit: UnitData; index: number; dbUnits: Unit[]; isAdmin: boolean; onEdit: (u: Unit) => void }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // State for toggle
  const [mode, setMode] = useState<'primary' | 'secondary'>('primary');

  const currentSlug = mode === 'primary' ? unit.slug : unit.specialContent?.secondarySlug;
  const currentName = mode === 'primary' ? unit.name : unit.specialContent?.secondaryName;
  const currentCopy = mode === 'primary' ? unit.copy : unit.specialContent?.secondaryCopy;
  const currentDesc = mode === 'primary' ? unit.description : unit.specialContent?.secondaryDescription;
  const currentImageLabel = mode === 'primary' ? unit.imageLabel : unit.specialContent?.secondaryImageLabel;

  // Find matching DB unit
  const dbUnit = dbUnits.find(u => u.slug === currentSlug);
  const displayName = dbUnit?.unit_name || currentName;

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center py-24 overflow-hidden relative"
    >
      <div className={`container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>

        {/* Image Side */}
        <div className="w-full md:w-1/2 relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-2xl group">
           {/* Parallax Background Simulation */}
           <motion.div
             style={{ y }}
             className="absolute inset-0 w-full h-[120%] -top-[10%] bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl tracking-widest transition-colors duration-500 group-hover:bg-gray-300 dark:group-hover:bg-gray-700"
           >
             <AnimatePresence mode='wait'>
                <motion.span
                    key={currentImageLabel}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="block text-center px-4"
                >
                    {currentImageLabel}
                </motion.span>
             </AnimatePresence>
           </motion.div>
        </div>

        {/* Text Side */}
        <motion.div
          style={{ opacity }}
          className="w-full md:w-1/2 space-y-8"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-mieno-navy text-xl font-medium tracking-wide border-l-4 border-mieno-navy pl-3">{unit.role}</h3>

                {unit.isSpecial && unit.toggleLabels && (
                    <div className="flex items-center bg-gray-100 rounded-full p-1 relative">
                        {/* Animated Background Pill */}
                        <motion.div
                            className="absolute top-1 bottom-1 bg-mieno-navy rounded-full shadow-sm z-0"
                            initial={false}
                            animate={{
                                left: mode === 'primary' ? '4px' : '50%',
                                right: mode === 'primary' ? '50%' : '4px',
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button
                            onClick={() => setMode('primary')}
                            className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 w-1/2 text-center whitespace-nowrap ${mode === 'primary' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {unit.toggleLabels.primary}
                        </button>
                        <button
                            onClick={() => setMode('secondary')}
                            className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 w-1/2 text-center whitespace-nowrap ${mode === 'secondary' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {unit.toggleLabels.secondary}
                        </button>
                    </div>
                )}
            </div>

            <div className="min-h-[120px] flex flex-col justify-center">
                <AnimatePresence mode='wait'>
                    <motion.h2
                        key={currentName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-mieno-text leading-tight"
                    >
                        {displayName}
                    </motion.h2>
                </AnimatePresence>
            </div>
          </div>

          <div className="min-h-[160px]">
              <AnimatePresence mode='wait'>
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-6"
                >
                    <p className="text-xl md:text-2xl font-light leading-snug text-gray-800 border-l-2 border-gray-200 pl-4">
                        {currentCopy}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        {currentDesc}
                    </p>

                    {/* DB Info Card */}
                    {dbUnit && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm group/card"
                        >
                            {/* Edit Button */}
                            {isAdmin && (
                                <button
                                    onClick={() => onEdit(dbUnit)}
                                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors opacity-0 group-hover/card:opacity-100"
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Gauge size={18} className="text-mieno-navy" />
                                    <span>{dbUnit.odometer.toLocaleString()} km</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Calendar size={18} className="text-mieno-navy" />
                                    <span>Next: {dbUnit.next_oil_change || 'N/A'}</span>
                                </div>
                                <div className="col-span-2 flex items-center gap-2 text-gray-600 text-xs border-t border-gray-100 pt-2 mt-1">
                                   <User size={14} className="text-mieno-navy" />
                                   <span>Owner ID: {dbUnit.owner_id}</span>
                               </div>
                            </div>
                            {dbUnit.maintenance_note && (
                                <div className="flex items-start gap-2 text-xs text-gray-500 border-t border-gray-200 pt-3">
                                    <Wrench size={14} className="mt-0.5 text-orange-500 shrink-0" />
                                    <span>{dbUnit.maintenance_note}</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
              </AnimatePresence>
          </div>

          <Link
            href={`/units/${currentSlug}`}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-mieno-navy text-white rounded-full font-bold text-sm tracking-wide hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            詳細を見る
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default function StrategicUnits({ units: dbUnits = [], isAdmin = false }: { units?: Unit[], isAdmin?: boolean }) {
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editForm, setEditForm] = useState<Partial<Unit>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setEditForm({
      odometer: unit.odometer,
      next_oil_change: unit.next_oil_change,
      maintenance_note: unit.maintenance_note
    });
  };

  const handleSave = async () => {
    if (!editingUnit) return;
    setIsSaving(true);
    try {
        await updateUnit(editingUnit.id, editForm);
        setEditingUnit(null);
    } catch (e) {
        console.error(e);
        alert('Failed to update');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="bg-white text-mieno-text">
      {/* Title Section */}
      <section className="py-24 text-center bg-gray-50">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4"
        >
            <h2 className="text-sm font-bold tracking-[0.3em] text-mieno-navy uppercase mb-4 bg-gray-200 w-fit mx-auto px-4 py-1 rounded-full">
                STRATEGIC UNITS
            </h2>
            <p className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-mieno-text">
                機動戦力
            </p>
            <p className="text-gray-500 text-lg font-light tracking-widest uppercase">
                Power / Precision / Prestige
            </p>
        </motion.div>
      </section>

      {/* Units */}
      {units.map((unit, index) => (
        <UnitSection
            key={unit.id}
            unit={unit}
            index={index}
            dbUnits={dbUnits}
            isAdmin={isAdmin}
            onEdit={handleEdit}
        />
      ))}

      {/* Edit Modal Portal */}
      {mounted && createPortal(
        <AnimatePresence>
            {editingUnit && (
                <motion.div
                    key="edit-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setEditingUnit(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">
                                Update {editingUnit.unit_name}
                            </h3>
                            <button onClick={() => setEditingUnit(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Odometer (km)</label>
                                <input
                                    type="number"
                                    value={editForm.odometer ?? ''}
                                    onChange={(e) => setEditForm({...editForm, odometer: Number(e.target.value)})}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Next Oil Change</label>
                                <input
                                    type="date"
                                    value={editForm.next_oil_change || ''}
                                    onChange={(e) => setEditForm({...editForm, next_oil_change: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Maintenance Note</label>
                                <textarea
                                    value={editForm.maintenance_note || ''}
                                    onChange={(e) => setEditForm({...editForm, maintenance_note: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 h-24 resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingUnit(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : (
                                    <>
                                        <Save size={16} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
