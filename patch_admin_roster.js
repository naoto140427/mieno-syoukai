const fs = require('fs');
const path = 'components/admin/OperationBoard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { getSurveysByNewsId } from '@/app/actions/survey';",
  "import { getSurveysByNewsId, deleteSurvey } from '@/app/actions/survey';"
).replace(
  "import { X, Kanban, CheckCircle2, Clock, Activity, GripVertical, Users, MapPin, Calendar, FileText } from 'lucide-react';",
  "import { X, Kanban, CheckCircle2, Clock, Activity, GripVertical, Users, MapPin, Calendar, FileText, Trash2, Download } from 'lucide-react';"
);

const newLogic = `
  const handleDeleteSurvey = async (id: number) => {
    if (!confirm('このエージェントの記録を削除しますか？')) return;
    try {
      await deleteSurvey(id);
      setRoster(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error('Failed to delete survey:', e);
      alert('削除に失敗しました。');
    }
  };

  const handleExportCSV = () => {
    if (!roster.length || !selectedOp) return;
    const headers = ['Name', 'Status', 'Vehicle', 'Notes', 'Date'];
    const rows = roster.map(r => [
      r.agent_name,
      r.attendance_status,
      r.vehicle_info || '',
      (r.message || '').replace(/\\n/g, ' '),
      new Date(r.created_at || '').toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\\n");
    const blob = new Blob(["\\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", \`roster_operation_\${selectedOp.id}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

content = content.replace("  const handleOpClick = async (op: News) => {", newLogic + "\n  const handleOpClick = async (op: News) => {");

// Add Export button to header
content = content.replace(
  `<button onClick={() => setSelectedOp(null)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-400">
                      <X size={16} />
                    </button>`,
  `<div className="flex items-center gap-2">
                      <button onClick={handleExportCSV} title="Export CSV" className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm border border-blue-200 text-[10px] font-bold tracking-widest uppercase">
                        <Download size={12} /> CSV
                      </button>
                      <button onClick={() => setSelectedOp(null)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-400 border border-gray-100 transition-colors">
                        <X size={16} />
                      </button>
                    </div>`
);

// Roster list updates to include delete button and AnimatePresence
content = content.replace(
  `{roster.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm font-mono">No responses yet.</div>
                          ) : (
                            roster.map(r => (
                              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">`,
  `{roster.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm font-mono">No responses yet.</div>
                          ) : (
                            <AnimatePresence>
                            {roster.map(r => (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors overflow-hidden group"
                              >`
);

content = content.replace(
  `<span className={\`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider \${`,
  `<div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleDeleteSurvey(r.id)}
                                      className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                      title="Delete Record"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                    <span className={\`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider \${`
);

content = content.replace(
  `</span>
                                </div>
                                {r.vehicle_info && (`,
  `</span>
                                  </div>
                                </div>
                                {r.vehicle_info && (`
);

content = content.replace(
  `}
                              </div>
                            ))
                          )}`,
  `}
                              </motion.div>
                            ))}
                            </AnimatePresence>
                          )}`
);

fs.writeFileSync(path, content);
