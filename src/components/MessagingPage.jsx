import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Clock, 
  Users, 
  Bell, 
  ShieldAlert, 
  MessageCircle, 
  Smartphone,
  ExternalLink,
  Sparkles,
  Calendar
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function MessagingPage({ 
  announcements, 
  onAnnouncementsChange, 
  members, 
  settings, 
  role, 
  initialBroadcastNotice, 
  t 
}) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: initialBroadcastNotice?.title || '',
    body: initialBroadcastNotice?.body || '',
    date: new Date().toISOString().split('T')[0],
    category: initialBroadcastNotice?.category || 'general',
    priority: 'normal',
    senderName: settings.organizerName || 'समिति संयोजक',
    targetGroup: 'all'
  });

  // Ready-to-use message templates
  const templates = [
    {
      id: 'tpl_meeting',
      title: 'गोवर्धन पूजा तैयारी बैठक',
      category: 'meeting',
      body: 'जय श्री कृष्ण 🙏 सभी सदस्यों को सूचित किया जाता है कि गोवर्धन पूजा की तैयारी के लिए बैठक कल शाम 6:00 बजे मंदिर प्रांगण में रखी गई है। कृपया समय पर उपस्थित हों।',
    },
    {
      id: 'tpl_payment',
      title: 'सहयोग राशि जमा कराने हेतु विनम्र निवेदन',
      category: 'payment',
      body: `जय श्री कृष्ण 🙏 श्री गोवर्धन पूजा 2026 हेतु अपनी स्वीकृत सहयोग राशि (न्यूनतम ₹7 या इच्छानुसार) समिति UPI: ${settings.upiId} पर भेजकर पुण्य के भागी बनें।`,
    },
    {
      id: 'tpl_volunteer',
      title: 'सेवादार दायित्व सूचना',
      category: 'volunteer',
      body: 'जय श्री कृष्ण 🙏 गोवर्धन पूजा, 56 भोग अन्नकूट एवं महाप्रसाद वितरण हेतु सेवादारों की सूची जारी कर दी गई है। कृपया अपनी सेवा का समय सुनिश्चित करें।',
    },
    {
      id: 'tpl_puja_timing',
      title: 'मुख्य गोवर्धन महापूजा व अन्नकूट समय',
      category: 'timing',
      body: 'जय श्री कृष्ण 🙏 10 नवंबर 2026 को प्रातः 11:30 बजे से श्री गोवर्धन जी की महापूजा एवं छप्पन भोग दर्शन होगा। सपरिवार पधारकर पुण्य लाभ प्राप्त करें।',
    }
  ];

  // Apply template
  const handleUseTemplate = (tpl) => {
    setFormData(prev => ({
      ...prev,
      title: tpl.title,
      body: tpl.body,
      category: tpl.category
    }));
    setIsPublishModalOpen(true);
  };

  // Submit announcement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    StorageService.addAnnouncement(formData);
    onAnnouncementsChange();
    setIsPublishModalOpen(false);

    setFormData({
      title: '',
      body: '',
      date: new Date().toISOString().split('T')[0],
      category: 'general',
      priority: 'normal',
      senderName: settings.organizerName,
      targetGroup: 'all'
    });
  };

  // Delete announcement
  const handleDelete = (id) => {
    StorageService.deleteAnnouncement(id);
    onAnnouncementsChange();
  };

  // Copy notice text
  const handleCopyNotice = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open WhatsApp with text
  const handleOpenWhatsApp = (text, mobile = '') => {
    const encoded = encodeURIComponent(text);
    const cleanMobile = mobile ? mobile.replace(/\D/g, '') : '';
    const url = cleanMobile ? `https://wa.me/91${cleanMobile}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Open SMS with text
  const handleOpenSms = (text, mobile = '') => {
    const encoded = encodeURIComponent(text);
    const cleanMobile = mobile ? mobile.replace(/\D/g, '') : '';
    window.open(`sms:${cleanMobile}?body=${encoded}`, '_self');
  };

  // Filtered announcements
  const filteredAnnouncements = announcements.filter(a => {
    if (filterCategory === 'all') return true;
    return a.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-amber-600" />
            <span>{t.announcementsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            समिति सदस्यों को पूजा समय, बैठक, सेवा दायित्व व सहयोग की आवश्यक सूचनाएं एवं WhatsApp/SMS प्रसारण
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ नई सूचना प्रकाशित करें</span>
          </button>
        )}
      </div>

      {/* Messaging Disclaimer (Section 6 Requirement) */}
      <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 flex items-start space-x-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">दूरसंचार व संदेश सुरक्षा नीति (Messaging Policy):</p>
          <p className="text-gray-700 mt-0.5">
            {t.messagingDisclaimer} WhatsApp अथवा SMS बटन क्लिक करने पर संदेश आपके डिवाइस के ऐप में पूर्व-लिखित (Pre-filled) रूप में खुलेगा। जब तक आप स्वयं प्रेषित नहीं करेंगे, तब तक कोई संदेश स्वचालित रूप से नहीं भेजा जाता।
          </p>
        </div>
      </div>

      {/* Ready-to-use Templates Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs sm:text-sm font-bold text-amber-950 font-heading">
            त्वरित संदेश प्रारूप (Ready-to-use Message Templates):
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {templates.map(tpl => (
            <div 
              key={tpl.id}
              className="p-3 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200 text-xs flex flex-col justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-amber-900 block mb-1">{tpl.title}</span>
                <p className="text-gray-600 line-clamp-2 text-[11px]">{tpl.body}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="text-amber-800 font-bold hover:underline text-[11px]"
                >
                  उपयोग करें →
                </button>
                <button
                  onClick={() => handleOpenWhatsApp(tpl.body)}
                  className="text-emerald-700 font-bold hover:underline text-[11px] flex items-center space-x-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs text-gray-500 font-medium">श्रेणी:</span>
        {[
          { id: 'all', label: 'सभी सूचनाएं' },
          { id: 'timing', label: 'पूजा व आरती समय' },
          { id: 'meeting', label: 'समिति बैठक' },
          { id: 'payment', label: 'सहयोग व दान' },
          { id: 'volunteer', label: 'सेवादार दायित्व' },
          { id: 'general', label: 'सामान्य' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Announcements Board List */}
      <div className="space-y-4">
        {filteredAnnouncements.map(notice => {
          const isCopied = copiedId === notice.id;

          return (
            <div
              key={notice.id}
              className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {notice.priority === 'high' && (
                <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  अति महत्वपूर्ण (High Priority)
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                <span className="font-mono text-gray-600 font-semibold">{notice.date}</span>
                <span>•</span>
                <span className="capitalize text-amber-800 font-medium">
                  {notice.category === 'timing' ? 'पूजा समय' : notice.category === 'meeting' ? 'बैठक' : notice.category === 'payment' ? 'सहयोग' : notice.category === 'volunteer' ? 'सेवादार' : 'सामान्य'}
                </span>
                <span>•</span>
                <span>लक्षित: {notice.targetGroup === 'all' ? 'सभी सदस्य' : notice.targetGroup === 'pending' ? 'बकाया सदस्य' : 'भुगतान पूर्ण'}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-heading mb-2">
                {notice.title}
              </h3>

              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 text-sm text-gray-800 whitespace-pre-line leading-relaxed mb-4 font-hindi">
                {notice.body}
              </div>

              {/* Notice Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  जारीकर्ता: <strong className="text-gray-800">{notice.senderName}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyNotice(`${notice.title}\n\n${notice.body}\n\n- ${notice.senderName} | श्री गोवर्धन पूजा समिति 2026`, notice.id)}
                    className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-600" />}
                    <span>{isCopied ? 'कॉपी हो गया!' : 'संदेश कॉपी करें'}</span>
                  </button>

                  {/* WhatsApp Share Button */}
                  <button
                    onClick={() => handleOpenWhatsApp(`*${notice.title}*\n\n${notice.body}\n\n- _${notice.senderName}_ | *श्री गोवर्धन पूजा समिति 2026*`)}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp पर भेजें</span>
                  </button>

                  {/* SMS Share Button */}
                  <button
                    onClick={() => handleOpenSms(`${notice.title}: ${notice.body} - ${notice.senderName}`)}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </button>

                  {/* Admin Delete */}
                  {role === 'admin' && (
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                      title="सूचना हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Announcement Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base font-heading">
                नई सूचना प्रकाशित करें (Publish Notice)
              </h3>
              <button onClick={() => setIsPublishModalOpen(false)} className="p-1 rounded hover:bg-white/10 text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  सूचना का शीर्षक (Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. गोवर्धन पूजा की तैयारी हेतु विशेष बैठक"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  >
                    <option value="general">सामान्य सूचना</option>
                    <option value="timing">पूजा व आरती समय</option>
                    <option value="meeting">समिति बैठक</option>
                    <option value="payment">सहयोग व दान अंतिम तिथि</option>
                    <option value="volunteer">सेवादार दायित्व</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">प्राथमिकता</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  >
                    <option value="normal">सामान्य (Normal)</option>
                    <option value="high">अति महत्वपूर्ण (High)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">प्रेषक का नाम / पद</label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">किन्हें भेजें (Target)</label>
                  <select
                    value={formData.targetGroup}
                    onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  >
                    <option value="all">सभी सदस्य (All)</option>
                    <option value="pending">बकाया सदस्य (Pending Only)</option>
                    <option value="paid">पूर्ण भुगतान सदस्य (Paid Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  संदेश सामग्री (Message Body) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="जय श्री कृष्ण 🙏 सभी सदस्यों को सूचित किया जाता है कि..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs font-hindi leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow"
                >
                  प्रकाशित करें (Publish Notice)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
