const fs = require('fs');
let content = fs.readFileSync('app/actions/news.ts', 'utf8');

content = content.replace(/revalidatePath\('\/'\);/g, "revalidatePath('/');\n    revalidatePath('/news');");

fs.writeFileSync('app/actions/news.ts', content);
