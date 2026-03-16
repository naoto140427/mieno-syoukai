'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Loader2, Save } from 'lucide-react';
import { News as NewsType } from '@/types/database';

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<NewsType, 'id' | 'created_at'>) => Promise<void>;
    onDelete?: () => Promise<void>;
    initialData?: NewsType | null;
}

export default function NewsModal({ isOpen, onClose, onSave, onDelete, initialData }: NewsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<NewsType>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: 'UPDATE',
        content: '',
        image_url: ''
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    date: initialData.date,
                    category: initialData.category,
                    content: initialData.content,
                    image_url: initialData.image_url || ''
                });
            } else {
                setFormData({
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    category: 'UPDATE',
                    content: '',
                    image_url: ''
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!formData.title || !formData.date || !formData.category || !formData.content) {
                return;
            }
            await onSave(formData as Omit<NewsType, 'id' | 'created_at'>);
            onClose();
        } catch (error) {
            console.error("Failed to save news", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete || !confirm("Are you sure you want to delete this item?")) return;
        setIsSubmitting(true);
        try {
            await onDelete();
            onClose();
        } catch (error) {
            console.error("Failed to delete news", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">{initialData ? 'EDIT ENTRY' : 'NEW ENTRY'}</h3>
                                <p className="text-xs text-gray-400 mt-1 font-mono">{initialData ? 'UPDATE SYSTEM RECORDS' : 'INITIALIZE NEW BROADCAST'}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors self-start">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="news-form" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600 font-medium"
                                        placeholder="Enter transmission title..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white font-mono text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value as NewsType['category']})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white font-bold"
                                        >
                                            <option value="UPDATE" className="bg-gray-900">UPDATE</option>
                                            <option value="PRESS" className="bg-gray-900">PRESS</option>
                                            <option value="REPORT" className="bg-gray-900">REPORT</option>
                                            <option value="OTHER" className="bg-gray-900">OTHER</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Image URL <span className="text-gray-600 font-normal">(Optional)</span></label>
                                    <input
                                        type="url"
                                        value={formData.image_url || ''}
                                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600 font-mono text-sm"
                                        placeholder="https://mieno-images.s3.../image.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 tracking-widest uppercase">Content</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600 resize-y min-h-[150px]"
                                        placeholder="Enter transmission details..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-black/50 shrink-0 flex justify-between items-center">
                            {initialData && onDelete ? (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg text-sm font-bold tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">DELETE RECORD</span>
                                </button>
                            ) : (
                                <div />
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-gray-400 font-bold text-sm tracking-wider hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                    disabled={isSubmitting}
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    form="news-form"
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 bg-blue-600 text-white font-bold text-sm tracking-wider rounded-xl shadow-lg hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {initialData ? 'UPDATE' : 'PUBLISH'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
