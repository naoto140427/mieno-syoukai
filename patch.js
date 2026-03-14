const fs = require('fs');

const file = 'components/Archives.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import TacticalDropzoneModal
content = content.replace(
  `import { getLocationName } from "@/lib/gpx/geocoding";`,
  `import { getLocationName } from "@/lib/gpx/geocoding";\nimport TacticalDropzoneModal from "./TacticalDropzoneModal";`
);

// Add isUploadModalOpen state
content = content.replace(
  `const [editingId, setEditingId] = useState<number | null>(null);`,
  `const [editingId, setEditingId] = useState<number | null>(null);\n  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);`
);

// Add UPLOAD TACTICAL DATA button
content = content.replace(
  `<h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operation Archives</h1>`,
  `<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Operation Archives</h1>
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

// Add TacticalDropzoneModal component and remove old upload form
content = content.replace(
  `{isAdmin && !showForm && (
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
  `{/* Tactical Dropzone Modal */}
        <TacticalDropzoneModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSave={async (data) => {
            await addArchive(data);
            setIsUploadModalOpen(false);
          }}
        />

        {/* Form component hidden in favor of modal for adds, but kept for edit */}
        <AnimatePresence>
          {isAdmin && showForm && (
            <motion.div`
);


// Replace the remaining edit form close logic
content = content.replace(
  `{/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <button
                                        onClick={() => handleEditClick(archive)}`,
  `{/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <button
                                        onClick={() => handleEditClick(archive)}`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched Archives.tsx');
