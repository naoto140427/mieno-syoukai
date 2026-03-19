const fs = require('fs');
const path = 'components/NewsDetailClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

const stateInsert = `    const [hasSentPreviously, setHasSentPreviously] = useState(false);

    useEffect(() => {
        const sent = localStorage.getItem(\`rsvp_sent_\${news.id}\`);
        if (sent) {
            setHasSentPreviously(true);
        }
    }, [news.id]);`;

content = content.replace("const [isSubmitted, setIsSubmitted] = useState(false);", "const [isSubmitted, setIsSubmitted] = useState(false);\n" + stateInsert);

// update submit success
const submitSuccess = `            setIsSubmitted(true);
            setHasSentPreviously(true);
            localStorage.setItem(\`rsvp_sent_\${news.id}\`, 'true');`;
content = content.replace("            setIsSubmitted(true);", submitSuccess);

// update render logic for receipt
const receiptUI = `
                        {hasSentPreviously || isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative z-10 flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl pointer-events-none"></div>
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest mb-3 uppercase">Deployment Status:<br/>Transmitted</h3>
                                <p className="text-emerald-300/80 font-mono text-xs md:text-sm tracking-widest uppercase mb-6 px-4 py-2 bg-emerald-900/30 rounded-lg border border-emerald-500/20">あなたが送信したステータスは司令部に記録されました</p>
                                <div className="w-16 h-[1px] bg-white/20 mb-6"></div>
                                <p className="text-gray-500 font-mono text-[10px] tracking-[0.2em] uppercase">Mieno Corp. Strategic HQ</p>
                            </motion.div>
                        ) : (`;

content = content.replace(`                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center relative z-10"
                            >
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-widest mb-2">STATUS TRANSMITTED</h3>
                                <p className="text-gray-400 font-mono text-sm uppercase">通信完了：ご協力感謝します</p>
                            </motion.div>
                        ) : (`, receiptUI);

// Clean up duplicate touring section block that was created in previous step by mistake
// Let's find the first instance of {news.category === 'TOURING' && (
const splitContent = content.split("{news.category === 'TOURING' && (");
if (splitContent.length > 3) {
    // Looks like we have duplicates.
    // The first one is the operation details
    // The second and third are the RSVP section duplicates
    // We can just keep the first and the last one.
    content = splitContent[0] + "{news.category === 'TOURING' && (" + splitContent[1] + "{news.category === 'TOURING' && (" + splitContent[3];
}

fs.writeFileSync(path, content);
