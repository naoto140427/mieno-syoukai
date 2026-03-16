'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Loader2 } from 'lucide-react';
import { News as NewsType } from '@/types/database';
import { addNews, updateNews, deleteNews } from '@/app/actions/news';

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentNews: NewsType | null;
}

export default function NewsModal({ isOpen, onClose, currentNews }: NewsModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<NewsType>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: 'UPDATE',
        content: '',
        image_url: '',
        event_date: '',
        location: '',
        requirements: ''
    });

    useEffect(() => {
        if (currentNews) {
            setFormData({
                title: currentNews.title,
                date: currentNews.date,
                category: currentNews.category,
                content: currentNews.content,
                image_url: currentNews.image_url || '',
                event_date: currentNews.event_date || '',
                location: currentNews.location || '',
                requirements: currentNews.requirements || ''
            });
        } else {
            setFormData({
                title: '',
                date: new Date().toISOString().split('T')[0],
                category: 'UPDATE',
                content: '',
                image_url: '',
                event_date: '',
                location: '',
                requirements: ''
            });
        }
    }, [currentNews, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const submitData = { ...formData };
            if (submitData.category !== 'TOURING') {
                delete submitData.event_date;
                delete submitData.location;
                delete submitData.requirements;
            }

            if (currentNews) {
                await updateNews(currentNews.id, submitData);
            } else {
                if (!submitData.title || !submitData.date || !submitData.category || !submitData.content) {
                    setIsSubmitting(false);
                    return;
                }
                await addNews(submitData as Omit<NewsType, 'id' | 'created_at'>);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save news", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentNews || !confirm("Are you sure you want to delete this item?")) return;
        setIsSubmitting(true);
        try {
            await deleteNews(currentNews.id);
            onClose();
        } catch (error) {
            console.error("Failed to delete news", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                        className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] text-white"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{currentNews ? 'Edit News' : 'New Entry'}</h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value as NewsType['category']})}
                                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                                    >
                                        <option value="UPDATE">UPDATE</option>
                                        <option value="PRESS">PRESS</option>
                                        <option value="REPORT">REPORT</option>
                                        <option value="TOURING">TOURING</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                            </div>

                            <AnimatePresence>
                                {formData.category === 'TOURING' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Event Date (開催日時)</label>
                                            <input
                                                type="text"
                                                value={formData.event_date || ''}
                                                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                                placeholder="e.g. 2024.10.15 09:00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Location (集合場所/目的地)</label>
                                            <input
                                                type="text"
                                                value={formData.location || ''}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                                placeholder="e.g. 第3京浜 保土ヶ谷PA"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Requirements (参加条件/持ち物)</label>
                                            <input
                                                type="text"
                                                value={formData.requirements || ''}
                                                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                                placeholder="e.g. フルフェイスヘルメット必須"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.image_url || ''}
                                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                    placeholder="Details..."
                                />
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                {currentNews ? (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                ) : (
                                    <div />
                                )}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-400 font-medium hover:text-white transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {currentNews ? 'Update' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
