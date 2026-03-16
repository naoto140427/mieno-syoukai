const fs = require('fs');
const content = fs.readFileSync('types/database.ts', 'utf8');

const updated = content.replace(
  /export interface News {[\s\S]*?created_at\?: string;\n}/,
  `export interface News {
  id: number;
  date: string;
  category: 'PRESS' | 'UPDATE' | 'REPORT' | 'OTHER' | 'TOURING';
  title: string;
  content: string;
  image_url?: string;
  event_date?: string;
  location?: string;
  requirements?: string;
  created_at?: string;
}`
);

fs.writeFileSync('types/database.ts', updated);
