const fs = require('fs');
let content = fs.readFileSync('app/careers/page.tsx', 'utf8');

// The <main> wrapper currently has `bg-white`, which creates a stacking context issue with the sticky hero.
// We remove `bg-white` from `<main>` and let the child container have the white background.
content = content.replace(
  'className="bg-white text-gray-800 selection:bg-gray-200"',
  'className="text-gray-800 selection:bg-gray-200"'
);

// We change `-z-10` on the sticky hero to `z-0` so it acts as the base layer.
content = content.replace(
  'className="h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden -z-10 bg-[#F5F5F7]"',
  'className="h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden z-0 bg-[#F5F5F7]"'
);

// We verify the relative wrapper that comes next has `z-10 bg-white`, which it already does:
// <div className="relative z-10 bg-white rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] py-32">

fs.writeFileSync('app/careers/page.tsx', content);
console.log('Patched Careers page parallax stacking context');
