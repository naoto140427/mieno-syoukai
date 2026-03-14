const fs = require('fs');
const file = 'components/Archives.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              作戦記録
            </h1>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
              Archives
            </p>
          </div>
          {isAdmin && (
            <button
                onClick={() => {
                    if (showForm && editingId) {
                        resetForm();
                    } else {
                        setShowForm(!showForm);
                        if (!showForm) resetForm();
                    }
                }}
                className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 rounded-full text-xs font-bold tracking-wide"
            >
                <Plus className={\`w-4 h-4 transition-transform duration-300 \${showForm && !editingId ? "rotate-45" : ""}\`} />
                {showForm ? "キャンセル" : "新規記録作成"}
            </button>
          )}
        </div>`,
  `        {/* Tactical Dropzone Modal */}
        <TacticalDropzoneModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSave={async (data) => {
            await addArchive(data);
            setIsUploadModalOpen(false);
          }}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              作戦記録
            </h1>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
              Archives
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-bold text-xs tracking-widest shadow-sm hover:shadow-md"
              >
                <Upload className="w-4 h-4" />
                UPLOAD TACTICAL DATA
              </button>
              <button
                  onClick={() => {
                      if (showForm && editingId) {
                          resetForm();
                      } else {
                          setShowForm(!showForm);
                          if (!showForm) resetForm();
                      }
                  }}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 rounded-full text-xs font-bold tracking-wide"
              >
                  <Plus className={\`w-4 h-4 transition-transform duration-300 \${showForm && !editingId ? "rotate-45" : ""}\`} />
                  {showForm ? "キャンセル" : "新規手動入力"}
              </button>
            </div>
          )}
        </div>`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Patched Archives.tsx part 5');
