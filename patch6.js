const fs = require('fs');
const file = 'components/TacticalDropzoneModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import { motion, AnimatePresence } from "framer-motion";`,
  `import { motion, AnimatePresence, Variants } from "framer-motion";`
);

content = content.replace(
  `  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };`,
  `  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched TacticalDropzoneModal.tsx framer motion type errors');
