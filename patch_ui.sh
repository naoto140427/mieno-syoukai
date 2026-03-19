#!/bin/bash
cat << 'INNER_EOF' > components/admin/TransmissionControl.tsx.patch
--- components/admin/TransmissionControl.tsx	2023-10-27 10:00:00.000000000 +0000
+++ components/admin/TransmissionControl.tsx	2023-10-27 10:00:00.000000000 +0000
@@ -2,7 +2,7 @@

 import { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { X, Bot, Send, Mail, User, Clock, ShieldAlert } from 'lucide-react';
+import { X, Bot, Send, Mail, User, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';
 import { generateAiReplyDraft, sendReplyAndUpdateInquiry } from '@/app/actions/admin';
 import type { Inquiry } from '@/types/database';

@@ -16,6 +16,9 @@
   const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
   const [draftHtml, setDraftHtml] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [isSending, setIsSending] = useState(false);
+  const [urgency, setUrgency] = useState<number | null>(null);
+  const [sentiment, setSentiment] = useState<string | null>(null);
+  const [category, setCategory] = useState<string | null>(null);

   const unreadInquiries = inquiries.filter(i => i.status === 'unread');

@@ -23,12 +26,18 @@
     setSelectedInquiry(inq);
     setDraftHtml('');
+    setUrgency(null);
+    setSentiment(null);
+    setCategory(null);
   };

   const handleGenerateAI = async () => {
     if (!selectedInquiry) return;
     setIsGenerating(true);
     const result = await generateAiReplyDraft(selectedInquiry.name, selectedInquiry.message, aiStrictness);
-    if (result.success && result.html) {
+    // Cast result to any because we added new fields to generateAiReplyDraft that aren't typed in the original if we didn't update types globally, but it's okay for JS/TS if we know they exist.
+    const aiRes = result as any;
+    if (aiRes.success && aiRes.html) {
-      setDraftHtml(result.html);
+      setDraftHtml(aiRes.html);
+      setUrgency(aiRes.urgency);
+      setSentiment(aiRes.sentiment);
+      setCategory(aiRes.category);
     } else {
       alert('AI Draft generation failed.');
     }
@@ -38,6 +47,9 @@
     if (result.success) {
       setSelectedInquiry(null);
       setDraftHtml('');
+      setUrgency(null);
+      setSentiment(null);
+      setCategory(null);
     } else {
       alert('Failed to send reply.');
     }
@@ -118,6 +130,30 @@
                       <p className="text-gray-500 flex justify-between">
                         <span>Received:</span> <span className="text-gray-900 font-mono">{new Date(selectedInquiry.created_at).toLocaleString()}</span>
                       </p>
                     </div>
                     <div className="bg-[#F5F5F7] p-4 rounded-2xl text-sm text-gray-700 whitespace-pre-wrap font-sans">
                       {selectedInquiry.message}
                     </div>
                   </div>

                   <div className="space-y-4">
+                    {/* Triage Info */}
+                    {urgency !== null && (
+                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 items-center">
+                        {urgency >= 80 && (
+                          <motion.div
+                            animate={{ opacity: [1, 0.6, 1], scale: [1, 1.05, 1] }}
+                            transition={{ repeat: Infinity, duration: 1.5 }}
+                            className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border border-red-200"
+                          >
+                            <AlertTriangle size={12} />
+                            🚨 HIGH PRIORITY ({urgency})
+                          </motion.div>
+                        )}
+                        {category && (
+                          <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-medium tracking-wide uppercase shadow-sm">
+                            {category}
+                          </span>
+                        )}
+                        {sentiment && (
+                          <span className={`px-3 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase shadow-sm border ${sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : sentiment === 'negative' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
+                            {sentiment}
+                          </span>
+                        )}
+                      </motion.div>
+                    )}
+
                     <button
                       onClick={handleGenerateAI}
INNER_EOF
patch -p0 < components/admin/TransmissionControl.tsx.patch
