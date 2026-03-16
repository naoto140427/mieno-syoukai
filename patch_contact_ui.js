const fs = require('fs');
let content = fs.readFileSync('components/Contact.tsx', 'utf8');

// The original contact success animation was:
/*
<motion.div
  key="success"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.5 }}
  className="flex flex-col items-center justify-center py-12 text-center"
>
*/
// The user asked for "送信完了の美しいFramer Motionサクセスアニメーション". We will enhance it.
const newSuccessAnimation = `
<motion.div
  key="success"
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: -20 }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  className="flex flex-col items-center justify-center py-20 text-center"
>
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/20"
  >
    <CheckCircle className="w-12 h-12 text-white" />
  </motion.div>
  <motion.h3
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="text-3xl font-bold text-gray-900 mb-3 tracking-tight"
  >
    送信完了
  </motion.h3>
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="text-gray-400 font-mono text-xs tracking-[0.2em] uppercase mb-8"
  >
    TRANSMISSION COMPLETE
  </motion.p>
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="text-gray-600 max-w-md mx-auto mb-10 leading-relaxed"
  >
    お問い合わせを受け付けました。<br />
    自律型AIエージェント、または担当役員より<br />
    暗号化通信にて返信いたしますので、しばらくお待ちください。
  </motion.p>
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
    onClick={() => setFormState('idle')}
    className="px-8 py-4 rounded-full bg-gray-900 hover:bg-black text-white text-sm font-bold tracking-widest transition-all shadow-lg hover:-translate-y-1"
  >
    新しい通信を開始する
  </motion.button>
</motion.div>
`;

content = content.replace(
  /<motion\.div\s+key="success"[\s\S]*?<\/motion\.div>/m,
  newSuccessAnimation.trim()
);

fs.writeFileSync('components/Contact.tsx', content);
console.log('Patched Contact.tsx success animation');
