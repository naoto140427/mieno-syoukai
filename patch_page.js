const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

content = content.replace(
  /import { createClient } from "@\/lib\/supabase\/server";\nimport { News as NewsType } from "@\/types\/database";/,
  `import { createClient } from "@/lib/supabase/server";\nimport { getNews } from "@/app/actions/news";`
);

content = content.replace(
  /const { data } = await supabase\n\s+\.from\('news'\)\n\s+\.select\('\*'\)\n\s+\.order\('date', { ascending: false }\);\n\n\s+const news = \(data as NewsType\[\]\) \|\| \[\];/,
  `const news = await getNews(3);`
);

fs.writeFileSync('app/page.tsx', content);
