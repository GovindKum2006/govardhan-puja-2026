import React, { useState } from 'react';
import { 
  PhoneCall, 
  PhoneForwarded, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  UserCheck, 
  ListPlus, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  ShieldAlert, 
  FileText,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function CallingSystem({ 
  members, 
  onMembersChange, 
  contactLogs, 
  onLogsChange, 
  settings, 
  role, 
  t 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, paid, pending, contacted, uncontacted
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Call Queue Wizard State
  const [isQueueActive, setIsQueueActive] = useState(false);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [callNoteInput, setCallNoteInput] = useState('');
  
  // Single Member Log Modal
  const [logModalMember, setLogModalMember] = useState(null);
  const [singleNoteInput, setSingleNoteInput] = useState('');

  // Filter members
  const filtered = members.filter(m => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (m.name && m.name.toLowerCase().includes(term)) ||
      (m.mobile && m.mobile.includes(term)) ||
      (m.address && m.address.toLowerCase().includes(term));

    let matchStatus = true;
    if (statusFilter === 'paid') matchStatus = m.paymentStatus === 'paid';
    else if (statusFilter === 'pending') matchStatus = m.paymentStatus === 'pending' || m.paymentStatus === 'partially_paid';
    else if (statusFilter === 'contacted') matchStatus = Boolean(m.lastContactDate);
    else if (statusFilter === 'uncontacted') matchStatus = !m.lastContactDate;

    return matchSearch && matchStatus;
  });

  // Toggle Member Selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(m => m.id));
    }
  };

  // Start Call Queue
  const startCallQueue = () => {
    if (selectedIds.length === 0) return;
    setIsQueueActive(true);
    setCurrentQueueIndex(0);
    setCallNoteInput('');
  };

  const queueMembers = members.filter(m => selectedIds.includes(m.id));
  const currentQueueMember = queueMembers[currentQueueIndex];

  // Log contact in Queue
  const handleLogQueueContact = () => {
    if (!currentQueueMember) return;
    StorageService.logContact(
      currentQueueMember.id,
      currentQueueMember.name,
      currentQueueMember.mobile,
      callNoteInput || 'कॉल संपन्न हुआ - सूचना दी गई',
      'call'
    );
    onMembersChange();
    onLogsChange();

    // Advance to next member
    if (currentQueueIndex < queueMembers.length - 1) {
      setCurrentQueueIndex(prev => prev + 1);
      setCallNoteInput('');
    } else {
      setIsQueueActive(false);
      setSelectedIds([]);
    }
  };

  // Log single member
  const handleLogSingleContact = (e) => {
    e.preventDefault();
    if (!logModalMember) return;
    StorageService.logContact(
      logModalMember.id,
      logModalMember.name,
      logModalMember.mobile,
      singleNoteInput || 'कॉल संपन्न हुआ',
      'call'
    );
    onMembersChange();
    onLogsChange();
    setLogModalMember(null);
    setSingleNoteInput('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <PhoneCall className="w-6 h-6 text-amber-600" />
            <span>{t.callingSystemTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {t.callingIntro}
          </p>
        </div>

        {/* Call & WhatsApp Organizer Main Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={`tel:+91${settings.organizerPhone}`}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            title={`कॉल करें: ${settings.organizerName}`}
          >
            <PhoneForwarded className="w-4 h-4 text-yellow-300" />
            <span>संयोजक को कॉल करें ({settings.organizerPhone})</span>
          </a>

          <a
            href={`https://wa.me/91${settings.organizerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`जय श्री कृष्ण 🙏 ${settings.organizerName} जी, मैं गोवर्धन पूजा समिति 2026 (रमन डिहरा) के संबंध में बात करना चाहता/चाहती हूँ।`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all border border-emerald-400/40"
            title="व्हाट्सएप पर बात करें"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Compliance Notice (Section 5 Requirement) */}
      <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300/80 flex items-start space-x-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">सहमति एवं गोपनीयता सूचना (Consent Notice):</p>
          <p className="text-gray-700 mt-0.5">
            {t.consentDisclaimer} फ़ोन कॉल आपके स्थानीय डिवाइस के आधिकारिक डायलर ऐप द्वारा की जाती है। बिना सहमति कोई भी रोबो-कॉल या रिकॉर्डिंग नहीं की जाती है।
          </p>
        </div>
      </div>

      {/* Streamlined Call Queue Wizard Banner if active */}
      {isQueueActive && currentQueueMember && (
        <div className="bg-gradient-to-br from-amber-800 to-orange-900 text-white p-5 rounded-2xl shadow-xl border-2 border-amber-400 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-600/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                कॉलिंग कतार (Calling Queue Active)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-heading mt-0.5">
                सदस्य {currentQueueIndex + 1} / {queueMembers.length}: {currentQueueMember.name}
              </h3>
            </div>
            
            <button
              onClick={() => setIsQueueActive(false)}
              className="text-xs text-amber-300 underline font-semibold self-start sm:self-auto"
            >
              कतार समाप्त करें
            </button>
          </div>

          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <div className="text-xs text-amber-200">
                <strong>मोबाइल:</strong> <span className="font-mono text-base font-bold text-white">{currentQueueMember.mobile}</span>
              </div>
              <div className="text-xs text-amber-200">
                <strong>सहयोग स्थिति:</strong> <span className="font-semibold text-white">{currentQueueMember.paymentStatus === 'paid' ? 'पूर्ण भुगतान' : `बकाया ₹${currentQueueMember.balance || 7}`}</span>
              </div>
              {currentQueueMember.address && (
                <div className="text-xs text-amber-200 truncate">
                  <strong>पता:</strong> {currentQueueMember.address}
                </div>
              )}

              <div className="pt-2">
                <a
                  href={`tel:+91${currentQueueMember.mobile}`}
                  className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold px-6 py-2.5 rounded-xl shadow-lg transition-transform transform active:scale-95"
                >
                  <PhoneCall className="w-5 h-5 text-amber-900 animate-bounce" />
                  <span>अभी डायल करें (Call {currentQueueMember.mobile})</span>
                </a>
              </div>
            </div>

            {/* Note & Next Member Stepper */}
            <div className="bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/40 space-y-2.5">
              <label className="block text-xs font-bold text-amber-200">
                बातचीत की संक्षिप्त टिप्पणी दर्ज करें:
              </label>
              <input
                type="text"
                placeholder="उदा. कल शाम को ₹7 UPI करेंगे, पंडाल सज्जा में आएंगे"
                value={callNoteInput}
                onChange={(e) => setCallNoteInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-amber-900/80 text-white placeholder-amber-300/60 text-xs border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (currentQueueIndex > 0) setCurrentQueueIndex(prev => prev - 1);
                  }}
                  disabled={currentQueueIndex === 0}
                  className="text-xs text-amber-300 hover:text-white disabled:opacity-30 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogQueueContact}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>कॉल दर्ज करें व अगला सदस्य ({currentQueueIndex + 1}/{queueMembers.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Multi-Select Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="नाम, मोबाइल या मोहल्ला खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'सभी सदस्य' },
            { id: 'pending', label: 'बकाया सदस्य' },
            { id: 'paid', label: 'भुगतान पूर्ण' },
            { id: 'uncontacted', label: 'अभी संपर्क नहीं हुआ' },
            { id: 'contacted', label: 'संपर्क किया जा चुका' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Multi-Select & Start Queue Action */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={selectAllFiltered}
            className="text-xs text-amber-800 font-semibold px-2 py-1 hover:underline"
          >
            {selectedIds.length === filtered.length ? 'सभी चयन हटाएं' : 'सभी चुनें'}
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={startCallQueue}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow transition-all animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>कॉल कतार शुरू करें ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Member Calling List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(member => {
          const isSelected = selectedIds.includes(member.id);

          return (
            <div
              key={member.id}
              className={`bg-white rounded-2xl p-4 border transition-all ${
                isSelected ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-400/40' : 'border-amber-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(member.id)}
                    className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{member.name}</h4>
                    <span className="font-mono text-[11px] text-amber-700 font-bold">{member.memberId}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  member.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {member.paymentStatus === 'paid' ? 'पूर्ण' : `बकाया ₹${member.balance || 7}`}
                </span>
              </div>

              <div className="py-2 space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>मोबाइल:</span>
                  <span className="font-mono font-bold text-gray-900">{member.mobile}</span>
                </div>
                {member.address && (
                  <div className="flex items-center justify-between">
                    <span>पता:</span>
                    <span className="truncate max-w-[170px]">{member.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>अंतिम संपर्क:</span>
                  <span className="font-medium text-amber-800">
                    {member.lastContactDate || 'अभी नहीं'}
                  </span>
                </div>
                {member.notes && (
                  <p className="text-[11px] text-gray-500 italic truncate pt-1">
                    टिप्पणी: {member.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:+91${member.mobile}`}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>कॉल करें</span>
                </a>

                <button
                  onClick={() => setLogModalMember(member)}
                  className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>नोट दर्ज करें</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Contact Logs History */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm mt-8">
        <h3 className="text-base font-bold font-heading text-amber-950 mb-3 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span>हालिया संपर्क व बातचीत इतिहास (Recent Call Logs)</span>
        </h3>

        <div className="space-y-2.5">
          {contactLogs.slice(0, 6).map(log => (
            <div 
              key={log.id} 
              className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-bold text-gray-900">{log.memberName}</span>{' '}
                <span className="font-mono text-gray-500">({log.memberMobile})</span>
                <p className="text-gray-700 mt-0.5">{log.notes}</p>
              </div>
              <div className="text-right text-[11px] text-gray-400 shrink-0 font-medium">
                {log.contactDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single Log Modal */}
      {logModalMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border-2 border-amber-400">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              संपर्क नोट दर्ज करें
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              सदस्य: <strong>{logModalMember.name}</strong> ({logModalMember.mobile})
            </p>

            <form onSubmit={handleLogSingleContact} className="space-y-3">
              <textarea
                rows="3"
                required
                placeholder="उदा. सदस्य ने बताया कि वे ₹7 ऑनलाइन भेज रहे हैं..."
                value={singleNoteInput}
                onChange={(e) => setSingleNoteInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-amber-500"
              ></textarea>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setLogModalMember(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
