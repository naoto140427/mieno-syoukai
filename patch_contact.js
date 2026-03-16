const fs = require('fs');
let content = fs.readFileSync('app/actions/contact.ts', 'utf8');

// Update to insert `status: 'unread'`
content = content.replace(
  /message: formData.message,/,
  "message: formData.message,\n        status: 'unread',"
);

// We need to keep auto-reply in contact.ts, OR we remove the simple auto-reply since we are doing AI auto-reply now.
// The instructions said "既存の inquiries への保存処理（app/actions/contact.ts）に加え、上記で作った processAndReplyContact を非同期で呼び出し"
// So the AI reply *is* the auto-reply now, or we keep both. The task implies the AI reply replaces or augments the auto-reply.
// For now I'll just leave `app/actions/contact.ts` untouched on the auto-reply part, except adding the status: 'unread'.
fs.writeFileSync('app/actions/contact.ts', content);
console.log('patched contact.ts');

let contactTsx = fs.readFileSync('components/Contact.tsx', 'utf8');

// Add import
contactTsx = contactTsx.replace(
  "import { submitInquiry } from '@/app/actions/contact';",
  "import { submitInquiry } from '@/app/actions/contact';\nimport { processAndReplyContact } from '@/app/actions/contact-ai';"
);

// Call processAndReplyContact asynchronously
contactTsx = contactTsx.replace(
  "if (result.success) {\n        setFormState('success');",
  "if (result.success) {\n        setFormState('success');\n        // Asynchronously call AI reply without blocking the success UI\n        processAndReplyContact(formData.name, formData.email, formData.message).catch(console.error);"
);

fs.writeFileSync('components/Contact.tsx', contactTsx);
console.log('patched Contact.tsx');
