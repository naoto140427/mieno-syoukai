import { m, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, XCircle, Users, Activity } from 'lucide-react';
import type { TouringSurvey } from '@/types/database';

type ExtendedSurvey = TouringSurvey & {
    news_title?: string;
};

interface RSVPMonitorProps {
    isOpen: boolean;
    onClose: () => void;
    surveys: ExtendedSurvey[];
}

export default function RSVPMonitor({ isOpen, onClose, surveys }: RSVPMonitorProps) {
    if (!isOpen) return null;

    // Grouping by news_title
    const groupedSurveys = surveys.reduce((acc, survey) => {
        const title = survey.news_title || 'Unknown Operation';
        if (!acc[title]) {
            acc[title] = [];
        }
        acc[title].push(survey);
        return acc;
    }, {} as Record<string, ExtendedSurvey[]>);

    const renderList = (list: ExtendedSurvey[], colorClass: string, icon: React.ReactNode, title: string) => (
        <div className="flex-1 min-w-[200px] mb-4">
            <h4 className={`text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 mb-3 ${colorClass}`}>
                {icon}
                {title}: {list.length}名
            </h4>
            <div className="space-y-2">
                {list.length > 0 ? list.map(survey => (
                    <div key={survey.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-col gap-1.5 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-white/90">{survey.agent_name}</p>
                            {survey.vehicle_info && (
                                <span className="px-1.5 py-0.5 bg-white/10 rounded-md text-[9px] font-mono text-white/70 border border-white/5">
                                    {survey.vehicle_info}
                                </span>
                            )}
                        </div>
                        {survey.message && (
                            <p className="text-[11px] text-white/50 bg-white/[0.02] p-2 rounded-lg mt-0.5 border border-white/[0.05] italic">
                                &quot;{survey.message}&quot;
                            </p>
                        )}
                    </div>
                )) : (
                    <p className="text-[10px] text-white/20 italic py-1 font-mono">データなし</p>
                )}
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <m.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="relative w-full max-w-5xl bg-black/80 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 bg-black/40 backdrop-blur-lg">
                        <div>
                            <h2 className="text-xl font-bold tracking-widest text-white flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                参加可否モニタリング
                            </h2>
                            <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">
                                Operation RSVP Monitor
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                        >
                            <X className="w-5 h-5 text-white/40 group-hover:text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {Object.keys(groupedSurveys).length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Activity className="w-12 h-12 text-white/10 mb-4" />
                                <h3 className="text-sm font-bold text-white/50 mb-1 tracking-widest">NO DATA AVAILABLE</h3>
                                <p className="text-[10px] font-mono text-white/30">現在、応答したエージェントはいません</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedSurveys).map(([title, groupSurveys]) => {
                                    const joins = groupSurveys.filter(s => s.attendance_status === 'JOIN');
                                    const pendings = groupSurveys.filter(s => s.attendance_status === 'PENDING');
                                    const declines = groupSurveys.filter(s => s.attendance_status === 'DECLINE');

                                    return (
                                        <div key={title} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                                            {/* Accent line */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-mieno-blue to-transparent opacity-50" />
                                            
                                            <h3 className="text-base font-bold text-white/90 mb-5 flex items-center gap-2 tracking-wider">
                                                <span className="text-mieno-blue">■</span> {title}
                                            </h3>
                                            
                                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                                {renderList(joins, 'text-emerald-400', <CheckCircle2 className="w-3.5 h-3.5" />, '参加')}
                                                {renderList(pendings, 'text-amber-400', <Clock className="w-3.5 h-3.5" />, '未定')}
                                                {renderList(declines, 'text-rose-400', <XCircle className="w-3.5 h-3.5" />, '不参加')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </m.div>
            </div>
        </AnimatePresence>
    );
}
