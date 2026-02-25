'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  FileText,
  Download,
  Wrench,
  Calendar,
  Activity,
  ShieldCheck,
  Zap,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  UploadCloud,
  Loader2,
  DollarSign
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis
} from 'recharts';
import { Unit, UnitDocument, MaintenanceLog } from '@/types/database';
import {
  updateUnit,
  addMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
  addUnitDocument,
  deleteUnitDocument
} from '@/app/actions/units';

// --- Types ---

export type SpecItem = {
  label: string;
  value: string;
  progress?: number; // 0-100 for visual bars
  icon?: React.ReactNode;
};

// --- Helpers ---

const getThemeClasses = (color: string) => {
  const map: Record<string, {
    gradientTo: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    tabIndicator: string;
    stroke: string;
    fill: string;
  }> = {
    cyan: {
      gradientTo: 'to-cyan-900',
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-300',
      badgeBorder: 'border-cyan-500/30',
      tabIndicator: 'bg-cyan-500',
      stroke: '#06b6d4',
      fill: '#06b6d4',
    },
    blue: {
      gradientTo: 'to-blue-900',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300',
      badgeBorder: 'border-blue-500/30',
      tabIndicator: 'bg-blue-500',
      stroke: '#3b82f6',
      fill: '#3b82f6',
    },
    red: {
      gradientTo: 'to-red-900',
      badgeBg: 'bg-red-500/20',
      badgeText: 'text-red-300',
      badgeBorder: 'border-red-500/30',
      tabIndicator: 'bg-red-500',
      stroke: '#ef4444',
      fill: '#ef4444',
    },
  };
  return map[color] || map.blue;
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  const getColorClass = (c: string) => {
    switch(c) {
      case 'cyan': return 'bg-cyan-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${getColorClass(color)}`}
      />
    </div>
  );
}

function SpecCard({ spec, color }: { spec: SpecItem; color: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-bold tracking-wider uppercase">
        <Activity size={16} />
        {spec.label}
      </div>
      <div className="text-lg md:text-xl font-bold text-mieno-navy dark:text-white mb-1">
        {spec.value}
      </div>
      {spec.progress !== undefined && (
        <ProgressBar value={spec.progress} color={color} />
      )}
    </div>
  );
}

interface DocCardProps {
  doc: UnitDocument;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

function DocCard({ doc, isAdmin, onDelete }: DocCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 group cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="p-3 bg-gray-200 dark:bg-white/10 rounded-lg text-mieno-navy dark:text-white">
          <FileText size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm md:text-base text-mieno-navy dark:text-white group-hover:underline decoration-1 underline-offset-4 truncate">
            {doc.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 flex gap-2">
            <span>{doc.document_type}</span>
            <span>•</span>
            {/* file_size removed as it's not in DB */}
            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 group-hover:text-mieno-navy dark:group-hover:text-white transition-colors"
        >
          <Download size={20} />
        </a>
        {isAdmin && (
           <button
             onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
             className="text-gray-400 hover:text-red-500 transition-colors p-1"
           >
             <Trash2 size={20} />
           </button>
        )}
      </div>
    </div>
  );
}

interface LogItemViewProps {
  log: MaintenanceLog;
  isLast: boolean;
  isAdmin: boolean;
  onEdit: (log: MaintenanceLog) => void;
  onDelete: (id: number) => void;
}

function LogItemView({ log, isLast, isAdmin, onEdit, onDelete }: LogItemViewProps) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'maintenance': return <Wrench size={16} />;
      case 'inspection': return <ShieldCheck size={16} />;
      case 'upgrade': return <Zap size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'maintenance': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'inspection': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'upgrade': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="relative pl-8 md:pl-10 py-2 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[13px] top-8 bottom-0 w-[2px] bg-gray-200 dark:bg-white/10" />
      )}

      {/* Timeline Dot */}
      <div className={`absolute left-0 top-3 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-sm ${getColor(log.log_type)}`}>
        {getIcon(log.log_type)}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm relative hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
        {isAdmin && (
           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(log)} className="p-1 hover:text-blue-500 text-gray-400"><Edit2 size={14} /></button>
              <button onClick={() => onDelete(log.id)} className="p-1 hover:text-red-500 text-gray-400"><Trash2 size={14} /></button>
           </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-1 pr-12">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(log.date).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
             {log.cost !== undefined && log.cost > 0 && (
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                   <DollarSign size={10} /> {log.cost.toLocaleString()}
                </span>
             )}
             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${getColor(log.log_type)}`}>
               {log.log_type}
             </span>
          </div>
        </div>
        <h4 className="font-bold text-mieno-navy dark:text-white mb-1">
          {log.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {log.details}
        </p>
      </div>
    </div>
  );
}

// --- Main Client Component ---

type Props = {
  unit: Unit & {
    docs: UnitDocument[];
    logs: MaintenanceLog[];
  };
  isAdmin: boolean;
};

export default function UnitDetailClient({ unit, isAdmin }: Props) {
  const [activeTab, setActiveTab] = useState<'specs' | 'docs' | 'logs'>('specs');

  // Safe parsing of specs
  const parseSpecs = (specsData: any): SpecItem[] => {
     if (Array.isArray(specsData)) return specsData;
     // If it's an object/map, potentially convert it or just return empty
     // For now, assuming if it's not an array, we start fresh or show nothing
     return [];
  };

  // Edit Specs/Description State
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(unit.description || '');
  const [specs, setSpecs] = useState<SpecItem[]>(parseSpecs(unit.specs));

  // Maintenance Log State
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    log_type: 'maintenance',
    details: '',
    cost: 0
  });

  // Document Upload State
  const [isUploading, setIsUploading] = useState(false);

  const themeColor = unit.slug.includes('cbr') || unit.slug.includes('monkey') ? 'red' :
                     unit.slug.includes('serena') ? 'cyan' : 'blue';

  const themeClasses = getThemeClasses(themeColor);

  const tabs = [
    { id: 'specs', label: '機体仕様', sub: 'SPECS' },
    { id: 'docs', label: 'マニュアル・書類', sub: 'DOCUMENTS' },
    { id: 'logs', label: '整備・運用履歴', sub: 'MAINTENANCE LOG' },
  ] as const;

  // --- Handlers ---

  const handleSaveSpecs = async () => {
    try {
       await updateUnit(unit.id, {
         description,
         specs: specs as any, // Send as array, Postgres JSONB will handle it
         slug: unit.slug
       });
       setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save specs');
    }
  };

  const addSpec = () => {
    setSpecs([...specs, { label: 'New Spec', value: '', progress: 50 }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: keyof SpecItem, value: any) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLogId) {
        await updateMaintenanceLog(editingLogId, logForm);
      } else {
        await addMaintenanceLog({ ...logForm, unit_id: unit.id });
      }
      setIsLogFormOpen(false);
      resetLogForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save log');
    }
  };

  const handleDeleteLog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    try {
      await deleteMaintenanceLog(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete log');
    }
  };

  const handleEditLogClick = (log: MaintenanceLog) => {
    setLogForm({
      date: log.date,
      title: log.title,
      log_type: log.log_type,
      details: log.details,
      cost: log.cost || 0
    });
    setEditingLogId(log.id);
    setIsLogFormOpen(true);
  };

  const resetLogForm = () => {
    setLogForm({
      date: new Date().toISOString().split('T')[0],
      title: '',
      log_type: 'maintenance',
      details: '',
      cost: 0
    });
    setEditingLogId(null);
  };

  const handleDeleteDoc = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteUnitDocument(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete document');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploading(true);
    const supabase = createClient();

    try {
      for (const file of acceptedFiles) {
        // 1. Upload to Storage
        const filePath = `units/${unit.slug}/${Date.now()}_${file.name}`;
        // Using 'mieno-images' bucket for now as it's known, but ideally should be 'documents'
        let bucket = 'documents';

        // Try uploading to 'documents'
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
           console.error('Upload failed to documents bucket, trying mieno-images', uploadError);
           bucket = 'mieno-images';
           const { error: uploadError2 } = await supabase.storage
             .from(bucket)
             .upload(filePath, file);

           if (uploadError2) throw uploadError2;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        // 3. Save to DB
        await addUnitDocument({
          unit_id: unit.id,
          title: file.name,
          file_url: publicUrl,
          document_type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check if "documents" bucket exists.');
    } finally {
      setIsUploading(false);
    }
  }, [unit.id, unit.slug]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">

      {/* --- Header Section --- */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-mieno-navy">
        <div className={`absolute inset-0 bg-gradient-to-br from-mieno-navy via-black ${themeClasses.gradientTo} opacity-80`} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 pb-16 container mx-auto">
          <Link
            href="/units"
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit mb-6"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wider">機動戦力一覧へ戻る</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeClasses.badgeBg} ${themeClasses.badgeText} border ${themeClasses.badgeBorder} text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md`}>
              <ShieldCheck size={14} />
              {unit.owner_id}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
              {unit.unit_name}
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light tracking-widest font-mono uppercase">
              {unit.slug}
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">

        {/* Unit Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-[#0a0a0a] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 mb-8 relative"
        >
          {isAdmin && (
             <button
               onClick={() => setIsEditing(!isEditing)}
               className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-mieno-navy dark:hover:text-white"
             >
               {isEditing ? <X size={20} /> : <Edit2 size={20} />}
             </button>
          )}

          {isEditing ? (
             <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-400">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-white/20 bg-transparent text-gray-700 dark:text-gray-300 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
          ) : (
             <div className="flex flex-col md:flex-row gap-6 items-start">
               <div className="flex-1">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Unit Overview</h3>
                 <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                   {description}
                 </p>
               </div>
               <div className="w-full md:w-auto flex flex-row md:flex-col gap-4">
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-400 uppercase">Status</span>
                     <span className="font-medium text-green-500 flex items-center gap-1">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       OPERATIONAL
                     </span>
                  </div>
               </div>
             </div>
          )}
        </motion.div>

        {/* --- Tabs Navigation --- */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 mb-6">
          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 min-w-fit rounded-t-lg transition-colors flex flex-col items-center ${
                  activeTab === tab.id
                    ? 'text-mieno-navy dark:text-white'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <span className="font-bold text-sm md:text-base whitespace-nowrap">{tab.label}</span>
                <span className="text-[10px] font-mono tracking-wider uppercase opacity-70">{tab.sub}</span>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${themeClasses.tabIndicator}`}
                  />
                )}
              </button>
            ))}
          </div>
          {isAdmin && isEditing && activeTab === 'specs' && (
            <button
               onClick={handleSaveSpecs}
               className="flex items-center gap-2 px-4 py-2 bg-mieno-navy text-white rounded-lg text-sm font-bold shadow-lg hover:bg-black transition-colors mr-2 mb-2"
            >
               <Save size={16} /> Save Changes
            </button>
          )}
        </div>

        {/* --- Tab Content --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Chart Section */}
                 <div className="lg:col-span-1 bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center min-h-[300px]">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 w-full">Performance Analysis</h3>
                    {specs.length >= 3 ? (
                      <div className="h-[250px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={specs}>
                             <PolarGrid stroke="#374151" strokeOpacity={0.2} />
                             <PolarAngleAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                             <Radar
                               name={unit.unit_name}
                               dataKey="progress"
                               stroke={themeClasses.stroke}
                               fill={themeClasses.fill}
                               fillOpacity={0.3}
                             />
                           </RadarChart>
                         </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-sm">
                        Not enough data for chart (min 3 specs).
                      </div>
                    )}
                 </div>

                 {/* Specs List / Editor */}
                 <div className="lg:col-span-2 space-y-4">
                    {isEditing ? (
                       <div className="space-y-4">
                          {specs.map((spec, index) => (
                             <div key={index} className="flex gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
                                <div className="flex-1 space-y-2">
                                   <input
                                     value={spec.label}
                                     onChange={(e) => updateSpec(index, 'label', e.target.value)}
                                     placeholder="Label"
                                     className="w-full text-sm font-bold bg-transparent border-b border-gray-200 dark:border-white/20 focus:outline-none"
                                   />
                                   <input
                                     value={spec.value}
                                     onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                     placeholder="Value (Display)"
                                     className="w-full text-lg font-bold bg-transparent border-b border-gray-200 dark:border-white/20 focus:outline-none"
                                   />
                                </div>
                                <div className="w-24">
                                   <label className="text-[10px] text-gray-400">Progress</label>
                                   <input
                                     type="number"
                                     min="0"
                                     max="100"
                                     value={spec.progress || 0}
                                     onChange={(e) => updateSpec(index, 'progress', parseInt(e.target.value))}
                                     className="w-full text-sm font-bold bg-transparent border-b border-gray-200 dark:border-white/20 focus:outline-none"
                                   />
                                </div>
                                <button onClick={() => removeSpec(index)} className="text-red-500 hover:text-red-700">
                                   <Trash2 size={18} />
                                </button>
                             </div>
                          ))}
                          <button onClick={addSpec} className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl text-gray-500 hover:text-mieno-navy dark:hover:text-white transition-colors">
                             <Plus size={20} /> Add Spec
                          </button>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {specs.map((spec, index) => (
                            <SpecCard key={index} spec={spec} color={themeColor} />
                          ))}
                       </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-6">
                 {isAdmin && (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                        isDragActive
                          ? 'border-mieno-navy bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30'
                      }`}
                    >
                       <input {...getInputProps()} />
                       <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                          {isUploading ? (
                             <Loader2 size={32} className="animate-spin text-mieno-navy dark:text-white" />
                          ) : (
                             <UploadCloud size={32} />
                          )}
                          <p className="font-bold">
                            {isUploading ? 'Uploading...' : isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
                          </p>
                          {!isUploading && (
                            <p className="text-xs">PDF, Excel, Images supported</p>
                          )}
                       </div>
                    </div>
                 )}

                <div className="space-y-3">
                  {unit.docs.map((doc, index) => (
                    <DocCard
                      key={index}
                      doc={doc}
                      isAdmin={isAdmin}
                      onDelete={handleDeleteDoc}
                    />
                  ))}
                  {unit.docs.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No documents available for this unit.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6">
                {isAdmin && (
                   <div className="flex justify-end">
                      <button
                        onClick={() => { resetLogForm(); setIsLogFormOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-mieno-navy text-white rounded-lg shadow hover:bg-black transition-colors"
                      >
                         <Plus size={16} /> Add Log Entry
                      </button>
                   </div>
                )}

                {/* Log Form Modal/Inline */}
                {isLogFormOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-200 dark:border-white/20 shadow-xl mb-6"
                   >
                      <h4 className="font-bold text-lg mb-4 text-mieno-navy dark:text-white">
                         {editingLogId ? 'Edit Log Entry' : 'New Log Entry'}
                      </h4>
                      <form onSubmit={handleLogSubmit} className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                               <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Date</label>
                               <input
                                 type="date"
                                 value={logForm.date}
                                 onChange={e => setLogForm({...logForm, date: e.target.value})}
                                 className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                                 required
                               />
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Title</label>
                               <input
                                 type="text"
                                 value={logForm.title}
                                 onChange={e => setLogForm({...logForm, title: e.target.value})}
                                 className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                                 required
                               />
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Type</label>
                                <select
                                value={logForm.log_type}
                                onChange={e => setLogForm({...logForm, log_type: e.target.value})}
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                                >
                                <option value="maintenance">Maintenance</option>
                                <option value="inspection">Inspection</option>
                                <option value="upgrade">Upgrade</option>
                                <option value="incident">Incident</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Cost (Optional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={logForm.cost}
                                    onChange={e => setLogForm({...logForm, cost: parseInt(e.target.value) || 0})}
                                    className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                                />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Details</label>
                            <textarea
                               value={logForm.details}
                               onChange={e => setLogForm({...logForm, details: e.target.value})}
                               className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 h-24"
                               required
                            />
                         </div>
                         <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setIsLogFormOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-mieno-navy text-white rounded-lg hover:bg-black">Save Log</button>
                         </div>
                      </form>
                   </motion.div>
                )}

                <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/10">
                  {unit.logs.map((log, index) => (
                    <LogItemView
                      key={index}
                      log={log}
                      isLast={index === unit.logs.length - 1}
                      isAdmin={isAdmin}
                      onEdit={handleEditLogClick}
                      onDelete={handleDeleteLog}
                    />
                  ))}
                  {unit.logs.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No maintenance logs recorded.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
