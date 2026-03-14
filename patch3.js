const fs = require('fs');
const file = 'components/Archives.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `        {isAdmin && !showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mb-8 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Archive Log
          </button>
        )}

        {/* Upload Form (Admin Only) */}
        <AnimatePresence>`,
  `        {/* Tactical Dropzone Modal */}
        <TacticalDropzoneModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSave={async (data) => {
            await addArchive(data);
            setIsUploadModalOpen(false);
          }}
        />

        {isAdmin && !showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="mb-8 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Custom Log
          </button>
        )}

        {/* Upload Form (Admin Only) */}
        <AnimatePresence>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched Archives.tsx part 3');
