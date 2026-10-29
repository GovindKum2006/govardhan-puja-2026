import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  HeartHandshake, 
  ShieldCheck, 
  Clock, 
  Send, 
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function ContactModal({ 
  isOpen, 
  onClose, 
  settings, 
  onOpenUpi, 
  t 
}) {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('पूजा सेवा / सहयोग (Puja Seva)');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const organizerPhone = settings?.organizerPhone || '729485092';
  const organizerRole = settings?.organizerRole || 'समिति मुख्य संयोजक';
  const templeAddress = settings?.templeAddress || 'श्री कृष्ण मंदिर परिसर, ग्राम - रमन डिहरा';

  const handleCopy = () => {
    navigator.clipboard?.writeText(organizerPhone);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSendWhatsAppInquiry = (e) => {
    e.preventDefault();
    const text = `*गोवर्धन पूजा 2026 - पूछताछ / संदेश*\n\n` +
      `👤 *नाम:* ${inquiryName || 'भक्त'}\n` +
      `📱 *मोबाइल:* ${inquiryPhone || 'N/A'}\n` +
      `🏷️ *विषय:* ${inquiryTopic}\n` +
      `💬 *संदेश:* ${inquiryMessage || 'राधे राधे, मुझे गोवर्धन पूजा संबंधी जानकारी चाहिए।'}\n\n` +
      `📍 स्थान: ${templeAddress}`;
    
    const waUrl = `https://wa.me/91${organizerPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative bg-[#FFFDF9] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-amber-500/80">
        
        {/* Festive Header */}
        <div className="bg-gradient-to-r from-[#2c1303] via-[#451e06] to-[#2c1303] text-white p-5 border-b border-amber-500/50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-amber-100">
                समिति संपर्क एवं सेवा केंद्र
              </h2>
              <p className="text-xs text-amber-300/80">
                श्री गोवर्धन पूजा समिति 2026 (रमन डिहरा)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-amber-200/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Coordinator Contact Card */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-amber-300 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                  मुख्य संपर्क सूत्र
                </span>
                <h3 className="text-lg font-bold text-amber-950">
                  {organizerRole}
                </h3>
                <p className="text-2xl font-black text-amber-800 tracking-wider font-mono mt-1">
                  +91 {organizerPhone}
                </p>
                <p className="text-xs text-amber-700/80 mt-1">
                  पूजा सामग्री, सेवा दायित्व अथवा सहयोग संबंधी जानकारी के लिए सीधे संपर्क करें।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <a
                  href={`tel:+91${organizerPhone}`}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 text-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>सीधे कॉल करें</span>
                </a>
                <a
                  href={`https://wa.me/91${organizerPhone}?text=${encodeURIComponent('जय श्री कृष्ण 🙏 मुझे गोवर्धन पूजा महोत्सव 2026 के संबंध में जानकारी चाहिए।')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>व्हाट्सएप</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center space-x-1 text-xs bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold px-3 py-1.5 rounded-lg border border-amber-400 transition-colors"
                >
                  {copiedNumber ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-700" />
                      <span>नंबर कॉपी करें</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Temple Address & Venue Card */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-700 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">पूजा व महोत्सव स्थल</h4>
              <p className="text-xs sm:text-sm text-gray-700 font-medium mt-0.5">
                {templeAddress}
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-amber-800 font-semibold mt-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>कार्यालय समय: प्रातः 08:00 से रात्रि 09:00 बजे तक</span>
              </div>
            </div>
          </div>

          {/* Quick Inquiry / Message Form */}
          <form onSubmit={handleSendWhatsAppInquiry} className="space-y-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
            <h4 className="text-sm font-bold text-amber-950 flex items-center space-x-2 border-b border-amber-100 pb-2">
              <Send className="w-4 h-4 text-amber-600" />
              <span>समिति को ऑनलाइन संदेश / पूछताछ भेजें</span>
            </h4>

            {isSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">संदेश व्हाट्सएप पर तैयार हो गया है!</p>
                <p className="text-xs text-emerald-700">व्हाट्सएप विंडो खुल रही है...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">आपका शुभ नाम</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="उदा. राहुल कुमार"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">मोबाइल नंबर</label>
                    <input
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="10 अंकों का मोबाइल"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">विषय</label>
                  <select
                    value={inquiryTopic}
                    onChange={(e) => setInquiryTopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="पूजा सेवा / सहयोग (Puja Seva)">पूजा सेवा / दायित्व सहयोग</option>
                    <option value="प्रसाद वितरण सेवा (Prasad Seva)">प्रसाद वितरण सेवा</option>
                    <option value="दान व योगदान संबंधी (Contribution)">दान व योगदान संबंधी</option>
                    <option value="भजन कीर्तन प्रस्तुति (Bhajan Kirtan)">भजन कीर्तन प्रस्तुति</option>
                    <option value="अन्य सामान्य पूछताछ (General Inquiry)">अन्य सामान्य पूछताछ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">आपका संदेश</label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="लिखें कि आप किस प्रकार सेवा में भाग लेना चाहते हैं..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs sm:text-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>व्हाट्सएप द्वारा संदेश भेजें</span>
                </button>
              </>
            )}
          </form>

          {/* Quick UPI QR Button */}
          {onOpenUpi && (
            <button
              onClick={() => {
                onClose();
                onOpenUpi();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 font-black py-2.5 rounded-xl shadow border border-amber-300 text-xs sm:text-sm transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-amber-900" />
              <span>डिजिटल योगदान (UPI QR) खोलें</span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div className="bg-amber-100/60 px-5 py-3 border-t border-amber-200 flex justify-between items-center text-xs text-amber-900">
          <span className="font-semibold">॥ जय श्री राधे कृष्णा ॥</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-amber-200/50"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
}
