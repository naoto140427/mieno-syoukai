const fs = require('fs');
const content = fs.readFileSync('types/database.ts', 'utf8');

const updated = content.replace(
  /export interface Inquiry {\n  id: number;\n  name: string;\n  email: string;\n  subject: string;\n  message: string;\n  created_at: string;\n}/,
  `export interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
}`
);

fs.writeFileSync('types/database.ts', updated);
console.log('patched database.ts');
