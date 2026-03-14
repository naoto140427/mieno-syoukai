const fs = require('fs');
const file = 'components/Archives.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operation Archives</h1>
          <p className="text-gray-500 mt-2">Tactical operation records and field data analysis.</p>
        </div>`,
  `        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operation Archives</h1>
            <p className="text-gray-500 mt-2">Tactical operation records and field data analysis.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-bold text-xs tracking-widest shadow-sm hover:shadow-md"
            >
              <Upload className="w-4 h-4" />
              UPLOAD TACTICAL DATA
            </button>
          )}
        </div>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched Archives.tsx part 2');
