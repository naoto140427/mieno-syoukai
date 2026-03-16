'use client';

import { motion } from 'framer-motion';
import { News as NewsType } from '@/types/database';
import { ArrowLeft, Calendar, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface NewsDetailClientProps {
  news: NewsType;
}

export default function NewsDetailClient({ news }: NewsDetailClientProps) {
  const isTouring = news.category === 'TOURING';
  const hasOperationDetails = isTouring && (news.event_date || news.location || news.requirements);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            BACK TO ALL UPDATES
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <time className="font-mono text-gray-500">{news.date.replace(/-/g, '.')}</time>
            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
              {news.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            {news.title}
          </h1>
        </motion.div>

        {/* Image */}
        {news.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 aspect-video w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Operation Details Card (If TOURING) */}
        {hasOperationDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <h2 className="text-sm font-bold tracking-widest text-blue-600 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              OPERATION DETAILS <span className="text-gray-400 font-normal ml-2">作戦詳細</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.event_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Event Date</div>
                    <div className="font-medium text-gray-900">{news.event_date}</div>
                  </div>
                </div>
              )}
              {news.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Location</div>
                    <div className="font-medium text-gray-900">{news.location}</div>
                  </div>
                </div>
              )}
              {news.requirements && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Requirements</div>
                    <div className="font-medium text-gray-900">{news.requirements}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg max-w-none text-gray-600 leading-[2.2]"
        >
          {news.content.split('\n').map((line, i) => (
            <p key={i} className="mb-6">{line}</p>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
