'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { upsertSurvey } from '@/app/actions/survey';
import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import type { TouringSurvey } from '@/types/database';

interface DeploymentRSVPProps {
    newsId: number;
    initialSurvey: TouringSurvey | null;
}

type StatusOption = 'JOIN' | 'PENDING' | 'DECLINE';

const VEHICLES = [
    'Main Unit (CBR600RR)',
    'City Commuter (Monkey 125)',
    'Transport (Serena)',
    'Other / Rental'
];

export default function DeploymentRSVP({ newsId, initialSurvey }: DeploymentRSVPProps) {
    const [status, setStatus] = useState<StatusOption>(initialSurvey?.attendance_status || 'PENDING');
    const [vehicle, setVehicle] = useState(initialSurvey?.vehicle_info || VEHICLES[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleStatusChange = (newStatus: StatusOption) => {
        setStatus(newStatus);
        // Auto-clear vehicle if not joining to keep UI clean
        if (newStatus !== 'JOIN') {
             // We can keep the state but maybe default it back to empty or first option,
             // but keeping it as is works too.
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await upsertSurvey({
                news_id: newsId,
                attendance_status: status,
                vehicle_info: status === 'JOIN' ? vehicle : undefined,
                message: ''
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error: unknown) {
            console.error('RSVP Submission failed', error);
            setErrorMsg(error instanceof Error ? error.message : 'Unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-12 mb-8 bg-[#F5F5F7] rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-sm relative overflow-hidden">
            {/* Cyber / Tactical accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mieno-navy via-mieno-blue to-mieno-gray opacity-50"></div>

            <div className="flex items-center gap-3 mb-6">
                <ShieldAlert size={20} className="text-mieno-blue" />
                <h3 className="text-sm font-bold tracking-widest text-gray-800 uppercase">Deployment RSVP</h3>
            </div>

            <div className="space-y-6">
                {/* Segmented Control */}
                <div className="flex p-1 bg-white rounded-xl shadow-inner border border-gray-100">
                    {(['JOIN', 'PENDING', 'DECLINE'] as StatusOption[]).map((option) => (
                        <button
                            key={option}
                            onClick={() => handleStatusChange(option)}
                            disabled={isSubmitting}
                            className={`flex-1 relative py-3 text-xs md:text-sm font-bold tracking-wider rounded-lg transition-all duration-300 z-10
                                ${status === option ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                        >
                            {status === option && (
                                <motion.div
                                    layoutId="rsvp-active-pill"
                                    className={`absolute inset-0 rounded-lg -z-10 ${
                                        option === 'JOIN' ? 'bg-emerald-500' :
                                        option === 'PENDING' ? 'bg-amber-500' :
                                        'bg-rose-500'
                                    }`}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-20 flex items-center justify-center gap-2">
                                {option === 'JOIN' && '🟢 '}
                                {option === 'PENDING' && '🟡 '}
                                {option === 'DECLINE' && '🔴 '}
                                {option}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Optional Vehicle Selection for JOIN */}
                <AnimatePresence>
                    {status === 'JOIN' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">DEPLOYMENT VEHICLE</label>
                                <select
                                    value={vehicle}
                                    onChange={(e) => setVehicle(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mieno-blue focus:border-transparent appearance-none"
                                >
                                    {VEHICLES.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col items-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || (status === initialSurvey?.attendance_status && vehicle === initialSurvey?.vehicle_info)}
                        className="w-full md:w-auto min-w-[200px] bg-mieno-navy hover:bg-mieno-blue disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="tracking-widest text-xs">TRANSMITTING...</span>
                            </>
                        ) : (
                            <span className="tracking-widest text-xs">CONFIRM STATUS</span>
                        )}
                    </button>

                    {errorMsg && (
                        <p className="text-rose-500 text-xs mt-3 font-mono">{errorMsg}</p>
                    )}

                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                            >
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-bold tracking-wider">STATUS UPDATED</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
