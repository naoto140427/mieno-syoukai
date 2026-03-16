const fs = require('fs');
let content = fs.readFileSync('app/admin/AdminDashboardClient.tsx', 'utf8');

content = content.replace(
  'type: "spring"',
  'type: "spring" as const'
);

fs.writeFileSync('app/admin/AdminDashboardClient.tsx', content);
console.log('patched framer types');
