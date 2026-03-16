const fs = require('fs');
let content = fs.readFileSync('components/News.tsx', 'utf8');

// Update getLinkForCategory at the bottom
content = content.replace(
/function getLinkForCategory\(category: string\) \{[\s\S]*?\}/,
`function getLinkForCategory(id: number) {
    return \`/news/\${id}\`;
}`
);

// Update Link href in the map
content = content.replace(
/href=\{getLinkForCategory\(item\.category\)\}/g,
"href={getLinkForCategory(item.id)}"
);

// Update "View All" Link
content = content.replace(
/<Link href="\/logistics"/,
'<Link href="/news"'
);

// Replace Modal inline logic with NewsModal component
// First remove the old state, handlers, and form
// We need to be careful with the replacement. I will rewrite the component cleanly.
