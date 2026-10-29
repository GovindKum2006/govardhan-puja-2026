import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Radio, 
  Send, 
  ListFilter,
  X,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function ProgramsPage({ 
  programs, 
  onProgramsChange, 
  onBroadcastNotice, 
  role, 
  t 
}) {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'calendar'
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProgram, setEditingProgram] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    date: '2026-11-10',
    startTime: '09:00',
    endTime: '11:00',
    location: 'मुख्य मंदिर प्रांगण',
    description: '',
    responsibleMember: '',
    status: 'planned'
  });

  // Filtered programs
  const filtered = programs.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  // Open Edit Modal
  const handleOpenEdit = (prog) => {
    setEditingProgram(prog);
    setFormData({ ...prog });
  };

  // Submit Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProgram) {
      StorageService.updateProgram(editingProgram.id, formData);
      setEditingProgram(null);
    } else {
      StorageService.addProgram(formData);
      setIsAddModalOpen(false);
    }

    onProgramsChange();
    setFormData({
      name: '',
      nameHi: '',
      date: '2026-11-10',
      startTime: '09:00',
      endTime: '11:00',
      location: 'मुख्य मंदिर प्रांगण',
      description: '',
      responsibleMember: '',
      status: 'planned'
    });
  };

  // Delete program
  const handleDelete = (id) => {
    StorageService.deleteProgram(id);
    onProgramsChange();
    setDeleteConfirmId(null);
  };

  // Quick change status (e.g. from planned -> in_progress -> completed)
  const handleStatusChange = (progId, newStatus) => {
    StorageService.updateProgram(progId, { status: newStatus });
    onProgramsChange();
  };

  // Broadcast schedule change
  const handleBroadcastChange = (prog) => {
    const text = `जय श्री कृष्ण 🙏 गोवर्धन पूजा 2026: कार्यक्रम "${prog.nameHi || prog.name}" का समय ${prog.startTime} - ${prog.endTime} निर्धारित किया गया है। प्रभारी: ${prog.responsibleMember}। कृपया समय पर उपस्थित रहें।`;
    onBroadcastNotice({
      title: `कार्यक्रम समय-सारणी अद्यतन: ${prog.nameHi || prog.name}`,
      body: text,
      category: 'timing'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-amber-600" />
            <span>{t.programsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            गोवर्धन पूजा, 56 भोग अन्नकूट, भजन संध्या एवं महाप्रसाद वितरण की आधिकारिक समय-सारणी
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {role === 'admin' && (
            <button
              onClick={() => {
                setEditingProgram(null);
                setFormData({
                  name: '',
                  nameHi: '',
                  date: '2026-11-10',
                  startTime: '09:00',
                  endTime: '11:00',
                  location: 'मुख्य मंदिर प्रांगण',
                  description: '',
                  responsibleMember: '',
                  status: 'planned'
                });
                setIsAddModalOpen(true);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया कार्यक्रम जोड़ें</span>
            </button>
          )}

          {/* Toggle View */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline' ? 'bg-white text-amber-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              समय-रेखा (Timeline)
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-white text-amber-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              कैलेंडर व्यू (Cards)
            </button>
          </div>
        </div>
      </div>

      {/* Filter by Status */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs text-gray-500 font-medium">स्थिति फ़िल्टर:</span>
        {[
          { id: 'all', label: 'सभी कार्यक्रम' },
          { id: 'planned', label: 'नियोजित (Planned)' },
          { id: 'in_progress', label: 'प्रगति पर (In Progress)' },
          { id: 'completed', label: 'संपन्न (Completed)' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === filter.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:inset-0 before:left-2.5 sm:before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-orange-400 before:to-amber-200">
          {filtered.map((prog, index) => {
            const isCompleted = prog.status === 'completed';
            const isInProgress = prog.status === 'in_progress';

            return (
              <div 
                key={prog.id} 
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 100, 800)}ms` }}
              >
                
                {/* Node marker on timeline */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10 transition-transform group-hover:scale-110 ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : isInProgress 
                    ? 'bg-amber-500 text-white animate-pulse' 
                    : 'bg-amber-100 text-amber-900 border-2 border-amber-500'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Content Box */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isCompleted ? 'संपन्न (Completed)' : isInProgress ? 'चल रहा है (In Progress)' : 'नियोजित (Planned)'}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {prog.date}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1 font-heading">
                        {prog.nameHi || prog.name}
                      </h3>
                      {prog.nameHi && prog.name && prog.nameHi !== prog.name && (
                        <p className="text-xs text-gray-500">({prog.name})</p>
                      )}
                    </div>

                    {/* Time Badge */}
                    <div className="flex items-center space-x-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-mono text-xs sm:text-sm font-bold shrink-0 self-start sm:self-auto">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{prog.startTime} - {prog.endTime}</span>
                    </div>
                  </div>

                  {/* Description & Responsibilities */}
                  <div className="py-3 space-y-2 text-xs sm:text-sm">
                    {prog.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {prog.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span><strong>स्थान:</strong> {prog.location}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>प्रभारी/व्यवस्थापक:</strong> <span className="font-semibold text-gray-900">{prog.responsibleMember}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    {/* Status Toggle Buttons */}
                    {role === 'admin' ? (
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] text-gray-400">स्थिति बदलें:</span>
                        <button
                          onClick={() => handleStatusChange(prog.id, 'planned')}
                          className={`text-[11px] px-2 py-0.5 rounded font-semibold ${prog.status === 'planned' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          नियोजित
                        </button>
                        <button
                          onClick={() => handleStatusChange(prog.id, 'in_progress')}
                          className={`text-[11px] px-2 py-0.5 rounded font-semibold ${prog.status === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          चल रहा है
                        </button>
                        <button
                          onClick={() => handleStatusChange(prog.id, 'completed')}
                          className={`text-[11px] px-2 py-0.5 rounded font-semibold ${prog.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          संपन्न
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex items-center space-x-2">
                      {/* Broadcast button */}
                      <button
                        onClick={() => handleBroadcastChange(prog)}
                        className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors"
                        title="सूचना पट्ट पर इस कार्यक्रम की सूचना भेजें"
                      >
                        <Send className="w-3 h-3" />
                        <span>सूचना प्रसारित करें</span>
                      </button>

                      {/* Admin Edit/Delete */}
                      {role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(prog)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="संपादित करें"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(prog.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar / Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prog, index) => (
            <div 
              key={prog.id}
              className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm flex flex-col justify-between animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index * 90, 600)}ms` }}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-gray-500 font-bold">{prog.date}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prog.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : prog.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {prog.status === 'completed' ? 'संपन्न' : prog.status === 'in_progress' ? 'चल रहा है' : 'नियोजित'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 font-heading mb-1">
                  {prog.nameHi || prog.name}
                </h3>

                <div className="flex items-center space-x-1.5 text-xs text-amber-800 font-bold mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{prog.startTime} से {prog.endTime}</span>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  {prog.description}
                </p>

                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-gray-700 space-y-1 mb-3">
                  <div>📍 <strong>स्थान:</strong> {prog.location}</div>
                  <div>👤 <strong>प्रभारी:</strong> {prog.responsibleMember}</div>
                </div>
              </div>

              {role === 'admin' && (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleBroadcastChange(prog)}
                    className="text-xs text-amber-700 font-bold hover:underline"
                  >
                    सूचना भेजें
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prog)}
                      className="text-xs text-blue-700 font-semibold hover:underline"
                    >
                      संपादित करें
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(prog.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      हटाएं
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Program Modal */}
      {(isAddModalOpen || editingProgram) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                {editingProgram ? 'कार्यक्रम संपादित करें (Edit Program)' : 'नया कार्यक्रम जोड़ें (Add Program)'}
              </h3>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingProgram(null); }}
                className="p-1 rounded hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  गतिविधि / कार्यक्रम का नाम (हिंदी) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. श्री गोवर्धन पूजा एवं अन्नकूट दर्शन"
                  value={formData.nameHi}
                  onChange={(e) => setFormData({ ...formData, nameHi: e.target.value, name: formData.name || e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Program Name (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Govardhan Puja & Annakut"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">तारीख</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">आरंभ समय</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">समापन समय</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">स्थान / पंडाल</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. मुख्य मंदिर प्रांगण"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">प्रभारी सदस्य / सेवादार</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. सुरेश पटेल एवं युवा मंडल"
                    value={formData.responsibleMember}
                    onChange={(e) => setFormData({ ...formData, responsibleMember: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">स्थिति (Status)</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                >
                  <option value="planned">नियोजित (Planned)</option>
                  <option value="in_progress">चल रहा है (In Progress)</option>
                  <option value="completed">संपन्न (Completed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">विवरण (Description)</label>
                <textarea
                  rows="3"
                  placeholder="कार्यक्रम की विस्तृत रूपरेखा एवं आवश्यक तैयारी..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingProgram(null); }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow"
                >
                  {editingProgram ? 'अद्यतन करें (Update)' : '+ सुरक्षित करें (Save)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-xl border border-rose-300">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">कार्यक्रम हटाएं?</h3>
            <p className="text-xs text-gray-600 mb-4">
              क्या आप वाकई इस गतिविधि को समय-सारणी से हटाना चाहते हैं?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
              >
                हटाएं
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
