import { m, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, XCircle, Users } from 'lucide-react';
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

    // Grouping by status
    const joins = surveys.filter(s => s.attendance_status === 'JOIN');
    const pendings = surveys.filter(s => s.attendance_status === 'PENDING');
    const declines = surveys.filter(s => s.attendance_status === 'DECLINE');

    const renderList = (list: ExtendedSurvey[], colorClass: string, icon: React.ReactNode) => (
        <div className="space-y-3 mb-6">
            <h3 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 mb-4 ${colorClass}`}>
                {icon}
                {list.length} Agents
            </h3>
            {list.length > 0 ? list.map(survey => (
                <div key={survey.id} className="p-4 rounded-2xl bg-[#F5F5F7] border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-900">{survey.agent_name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{survey.news_title}</p>
                        </div>
                        {survey.vehicle_info && (
                            <span className="px-2 py-1 bg-white rounded-lg text-[10px] font-bold text-gray-600 border border-gray-200">
                                {survey.vehicle_info}
                            </span>
                        )}
                    </div>
                    {survey.message && (
                        <p className="text-xs text-gray-600 bg-white p-2 rounded-xl mt-1 italic border border-gray-100">
                            &quot;{survey.message}&quot;
                        </p>
                    )}
                </div>
            )) : (
                <p className="text-xs text-gray-400 italic py-2">No agents in this category.</p>
            )}
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
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                />

                <m.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                RSVP Monitor
                            </h2>
                            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mt-1">
                                Deployment Status & Visibility HUD
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
                        {surveys.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Users className="w-16 h-16 text-gray-200 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No RSVP Data</h3>
                                <p className="text-sm text-gray-500">現在、応答したエージェントはいません</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* JOIN */}
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-green-100">
                                    {renderList(joins, 'text-green-600', <CheckCircle2 className="w-4 h-4" />)}
                                </div>
                                {/* PENDING */}
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-yellow-100">
                                    {renderList(pendings, 'text-yellow-600', <Clock className="w-4 h-4" />)}
                                </div>
                                {/* DECLINE */}
                                <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100">
                                    {renderList(declines, 'text-red-600', <XCircle className="w-4 h-4" />)}
                                </div>
                            </div>
                        )}
                    </div>
                </m.div>
            </div>
        </AnimatePresence>
    );
}
