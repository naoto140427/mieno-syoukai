'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Mail,
  MessageSquare,
  List,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const isValid = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.subject !== '' &&
      formData.message.trim().length > 0
    );
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setFormState('submitting');

    // Simulate network request
    setTimeout(() => {
      setFormState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-mieno-navy/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mieno-navy/20 border border-mieno-navy/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SECURE CHANNEL OPEN
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            通信回線
          </h1>
          <p className="text-mieno-navy/60 dark:text-gray-500 text-sm font-bold tracking-[0.2em] uppercase mb-6">
            SECURE CONTACT
          </p>

          <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
            株式会社三重野商会への各種お問い合わせ・作戦支援要請は<br className="hidden sm:block" />こちらから承ります。
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Border Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-mieno-navy to-transparent opacity-50" />

          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">送信完了</h3>
                <p className="text-gray-400 font-mono text-sm tracking-wider uppercase mb-6">TRANSMISSION COMPLETE</p>
                <p className="text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                  お問い合わせを受け付けました。<br />
                  担当役員より暗号化通信にて返信いたしますので、<br />
                  しばらくお待ちください。
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10"
                >
                  新しい通信を開始する
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-300">お名前</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">NAME</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-mieno-navy transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="例: 渡辺 直人"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-mieno-navy/50 focus:ring-1 focus:ring-mieno-navy/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-300">メールアドレス</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">EMAIL</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-mieno-navy transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="例: info@mieno-corp.com"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-mieno-navy/50 focus:ring-1 focus:ring-mieno-navy/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-300">お問い合わせ種別</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">SUBJECT</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-mieno-navy transition-colors pointer-events-none">
                      <List size={18} />
                    </div>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-white focus:outline-none focus:border-mieno-navy/50 focus:ring-1 focus:ring-mieno-navy/50 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-gray-500 bg-gray-900">選択してください</option>
                      <option value="business" className="bg-gray-900">業務提携・ご依頼</option>
                      <option value="units" className="bg-gray-900">機動戦力に関するお問い合わせ</option>
                      <option value="logistics" className="bg-gray-900">ロジスティクス・兵站支援</option>
                      <option value="other" className="bg-gray-900">その他</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-300">メッセージ内容</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">MESSAGE</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 text-gray-500 group-focus-within:text-mieno-navy transition-colors">
                      <MessageSquare size={18} />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="お問い合わせ内容をご記入ください..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-mieno-navy/50 focus:ring-1 focus:ring-mieno-navy/50 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isValid || formState === 'submitting'}
                  whileHover={isValid && formState !== 'submitting' ? { scale: 1.02 } : {}}
                  whileTap={isValid && formState !== 'submitting' ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                    !isValid || formState === 'submitting'
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                      : 'bg-mieno-navy text-white hover:bg-opacity-90 hover:shadow-mieno-navy/20 border border-transparent'
                  }`}
                >
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send size={18} className={isValid ? "animate-pulse" : ""} />
                      <span>送信する</span>
                      <span className="text-[10px] opacity-60 font-mono hidden sm:inline">SEND MESSAGE</span>
                    </>
                  )}
                </motion.button>

                {/* Secure Notice */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
                  <AlertCircle size={12} />
                  <span>この通信はSSL/TLSにより暗号化されています。</span>
                </div>

              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="text-center mt-8 text-gray-600 text-xs">
           &copy; 2025 MIENO CORP. STRATEGIC OPERATIONS.
        </motion.div>

      </motion.div>
    </div>
  );
}
