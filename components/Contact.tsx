'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate network request
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <section className="min-h-screen bg-white text-mieno-text pt-32 pb-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-mieno-navy">
            Connect with Mieno Corp.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            新たな機動戦力（ライダー）の参画を歓迎します。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Headquarters</h3>
              <p className="text-lg leading-relaxed font-medium">
                Mieno Corp. Strategic HQ<br />
                Oita, Japan
              </p>
              <p className="mt-4 text-gray-500">
                Strategic Operations Division<br />
                Logistics Support Unit
              </p>
            </div>

            <div>
               <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Direct Comms</h3>
               <p className="text-lg font-medium">contact@mieno.example.com</p>
               <p className="mt-2 text-gray-500 text-sm">Response time: Within 24 hours (Standard Operational Procedure)</p>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-400 leading-relaxed">
                当社のミッション、または作戦行動（ツーリング）に関するお問い合わせは、
                こちらのセキュア回線（フォーム）をご利用ください。
                機密保持契約（NDA）に基づき、通信内容は厳重に保護されます。
              </p>
            </div>
          </motion.div>

          {/* Right Column: Input Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {formState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 rounded-3xl p-12 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-mieno-navy mb-4">送信完了</h3>
                <p className="text-gray-600">近日中に担当役員より通信を開きます。<br/>待機してください。</p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-8 text-sm text-gray-400 hover:text-mieno-navy transition-colors underline"
                >
                  新しい通信を開始する
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-mieno-navy/20 focus:ring-2 focus:ring-mieno-navy/10 transition-all duration-300 outline-none text-lg placeholder:text-gray-300"
                    placeholder="T. Mieno"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="asset" className="block text-sm font-medium text-gray-700">Current Asset (所有機材)</label>
                  <input
                    type="text"
                    id="asset"
                    className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-mieno-navy/20 focus:ring-2 focus:ring-mieno-navy/10 transition-all duration-300 outline-none text-lg placeholder:text-gray-300"
                    placeholder="CBR400R, SERENA LUXION, etc."
                  />
                </div>

                <div className="space-y-2">
                   <label htmlFor="type" className="block text-sm font-medium text-gray-700">Inquiry Type (要件)</label>
                   <div className="relative">
                     <select
                       id="type"
                       className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-mieno-navy/20 focus:ring-2 focus:ring-mieno-navy/10 transition-all duration-300 outline-none text-lg appearance-none cursor-pointer"
                       defaultValue=""
                     >
                       <option value="" disabled>Select an option</option>
                       <option value="touring">共同フィールドワーク（ツーリング）への参加申請</option>
                       <option value="asset">アセット（車両）の調達・運用に関する相談</option>
                       <option value="other">その他</option>
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                     </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-mieno-navy/20 focus:ring-2 focus:ring-mieno-navy/10 transition-all duration-300 outline-none text-lg resize-none placeholder:text-gray-300"
                    placeholder="作戦の詳細を記入してください..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={formState === 'submitting'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors duration-300 ${
                    formState === 'submitting'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-mieno-navy text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {formState === 'submitting' ? 'Transmitting...' : 'Submit Request'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
