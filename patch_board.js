const fs = require('fs');
const path = 'components/admin/OperationBoard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { X, Kanban, CheckCircle2, Clock, Activity, GripVertical } from 'lucide-react';",
  "import { X, Kanban, CheckCircle2, Clock, Activity, GripVertical, Users, MapPin, Calendar, FileText } from 'lucide-react';\nimport { getSurveysByNewsId } from '@/app/actions/survey';\nimport type { TouringSurvey } from '@/types/database';"
);

// Add state for selected operation and roster
const stateInsert = `
  const [selectedOp, setSelectedOp] = useState<News | null>(null);
  const [roster, setRoster] = useState<TouringSurvey[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  const handleOpClick = async (op: News) => {
    setSelectedOp(op);
    setIsLoadingRoster(true);
    try {
      const surveys = await getSurveysByNewsId(op.id);
      setRoster(surveys);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingRoster(false);
    }
  };
`;
content = content.replace("const [completed, setCompleted] = useState<News[]>([]);", "const [completed, setCompleted] = useState<News[]>([]);\n" + stateInsert);

// Update OperationCard to be clickable
content = content.replace(
  "className=\"bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 cursor-grab active:cursor-grabbing group transition-colors mb-3\"",
  "className=\"bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 cursor-grab active:cursor-grabbing group transition-colors mb-3\"\n      onClick={() => handleOpClick(op)}"
);

// Add the Roster UI overlay
const rosterOverlay = `
            {/* Roster Overlay */}
            <AnimatePresence>
              {selectedOp && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-0 right-0 w-[400px] h-full bg-white shadow-2xl z-20 border-l border-gray-200 flex flex-col"
                >
                  <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase mb-1 block">Roster Control</span>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedOp.title}</h3>
                    </div>
                    <button onClick={() => setSelectedOp(null)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-400">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-[#F5F5F7]">
                    {isLoadingRoster ? (
                      <div className="flex justify-center py-12">
                        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Bento Box: Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-emerald-600 mb-1">{roster.filter(r => r.attendance_status === 'JOIN').length}</span>
                            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> JOIN</span>
                          </div>
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-amber-500 mb-1">{roster.filter(r => r.attendance_status === 'PENDING').length}</span>
                            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1"><Clock size={12} className="text-amber-500"/> PENDING</span>
                          </div>
                        </div>

                        {/* Roster List */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-2">
                            <Users size={14} /> Agent List
                          </h4>
                          {roster.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm font-mono">No responses yet.</div>
                          ) : (
                            roster.map(r => (
                              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-bold text-gray-900 text-sm">{r.agent_name}</span>
                                  <span className={\`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider \${
                                    r.attendance_status === 'JOIN' ? 'bg-emerald-50 text-emerald-700' :
                                    r.attendance_status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                                    'bg-rose-50 text-rose-700'
                                  }\`}>
                                    {r.attendance_status}
                                  </span>
                                </div>
                                {r.vehicle_info && (
                                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <Activity size={10} className="text-blue-400"/> {r.vehicle_info}
                                  </div>
                                )}
                                {r.message && (
                                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mt-2 border border-gray-100">
                                    <FileText size={10} className="inline mr-1 text-gray-400"/>
                                    {r.message}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
`;

content = content.replace("              </div>\n            </div>\n          </motion.div>\n        </>\n      )}\n    </AnimatePresence>\n  );\n}", "              </div>\n            </div>\n" + rosterOverlay + "          </motion.div>\n        </>\n      )}\n    </AnimatePresence>\n  );\n}");

fs.writeFileSync(path, content);
