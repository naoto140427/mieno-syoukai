const fs = require('fs');
const file = 'components/Archives.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operation Archives</h1>
          <p className="text-gray-500 mt-2">Tactical operation records and field data analysis.</p>
        </div>`,
  `      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
        <AnimatePresence>
          {isAdmin && showForm && (
            <motion.div`,
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
        <AnimatePresence>
          {isAdmin && showForm && (
            <motion.div`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Patched Archives.tsx part 4');
