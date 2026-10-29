import React from 'react';
import { 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Bell, 
  QrCode, 
  PhoneCall, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import PhotoGalleryBox from './PhotoGalleryBox';

export default function HomeOverview({ 
  members, 
  programs, 
  announcements, 
  settings, 
  t, 
  onNavigate, 
  onOpenUpi, 
  role,
  onAddMember,
  onOpenContact
}) {
  // Financial & Member Calculations
  const totalMembers = members.length;
  const paidMembers = members.filter(m => m.paymentStatus === 'paid').length;
  const partialMembers = members.filter(m => m.paymentStatus === 'partially_paid').length;
  const pendingMembers = members.filter(m => m.paymentStatus === 'pending').length;

  const totalExpected = members.reduce((sum, m) => sum + (Number(m.contributionRequired) || 0), 0);
  const totalCollected = members.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0);
  const totalRemaining = members.reduce((sum, m) => sum + (Number(m.balance) || 0), 0);
  const collectionPercentage = totalExpected > 0 ? Math.min(100, Math.round((totalCollected / totalExpected) * 100)) : 0;

  // Upcoming programs preview (first 3)
  const upcomingPrograms = [...programs].slice(0, 3);
  // Latest announcements preview (first 2)
  const latestNotices = [...announcements].slice(0, 2);

  return (
    <div className="space-y-8 pb-12">
      
      {/* 6 Key Stat Cards Requested in Section 3 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-950 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <span>समिति लाइव डैशबोर्ड (Live Dashboard)</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              गोवर्धन पूजा 2026 की वास्तविक समय सहयोग एवं सदस्य स्थिति
            </p>
          </div>

          <button
            onClick={() => onNavigate('contributions')}
            className="text-xs sm:text-sm text-amber-700 hover:text-amber-800 font-semibold flex items-center space-x-1 hover:underline"
          >
            <span>विस्तृत देखें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* 1. Total Registered Members */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">कुल सदस्य</span>
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading">
              {totalMembers}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">पंजीकृत सदस्य</div>
          </div>

          {/* 2. Paid Members */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-200/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">पूर्ण भुगतान</span>
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-heading">
              {paidMembers}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">सहयोग प्राप्त</div>
          </div>

          {/* 3. Pending Members */}
          <div className="bg-white p-4 rounded-2xl border border-rose-200/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">बकाया सदस्य</span>
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-heading">
              {pendingMembers}
            </div>
            <div className="text-[11px] text-rose-600 mt-1">
              {partialMembers > 0 ? `(${partialMembers} आंशिक)` : 'सहयोग प्रतीक्षारत'}
            </div>
          </div>

          {/* 4. Expected Collection */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">अपेक्षित संग्रह</span>
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-heading">
              ₹{totalExpected}
            </div>
            <div className="text-[11px] text-blue-600 mt-1">न्यूनतम लक्ष्य</div>
          </div>

          {/* 5. Total Collected */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100/60 p-4 rounded-2xl border border-amber-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-xs font-bold">कुल प्राप्त राशि</span>
              <div className="p-1.5 bg-amber-500 text-white rounded-lg shadow-sm">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-heading">
              ₹{totalCollected}
            </div>
            <div className="text-[11px] text-amber-800 font-semibold mt-1">
              {collectionPercentage}% लक्ष्य पूर्ण
            </div>
          </div>

          {/* 6. Remaining Amount */}
          <div className="bg-white p-4 rounded-2xl border border-orange-200/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium">शेष बकाया राशि</span>
              <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-800 font-heading">
              ₹{totalRemaining}
            </div>
            <div className="text-[11px] text-orange-600 mt-1">एकत्रित करना शेष</div>
          </div>

        </div>

        {/* Collection Progress Bar */}
        <div className="mt-4 bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-sm">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-amber-900">सहयोग संग्रह प्रगति (Collection Progress):</span>
            <span className="text-amber-700">₹{totalCollected} / ₹{totalExpected} ({collectionPercentage}%)</span>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-600 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${collectionPercentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Organizer Quick Call & WhatsApp Banner */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg border-2 border-amber-300/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 text-center md:text-left">
          <div className="p-3.5 bg-white/20 rounded-2xl shrink-0 shadow-inner">
            <PhoneCall className="w-6 h-6 text-yellow-200 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 block">
              श्री गोवर्धन पूजा समिति 2026 (रमन डिहरा)
            </span>
            <h3 className="text-base sm:text-lg font-bold font-heading text-white">
              {settings.organizerName === 'समिति मुख्य संयोजक' 
                ? 'समिति मुख्य संयोजक से संपर्क करें (रमन डिहरा)' 
                : `समिति मुख्य संयोजक से संपर्क करें: ${settings.organizerName}`}
            </h3>
            <p className="text-xs text-amber-100 font-hindi mt-0.5">
              पूजा सामग्री, सेवा दायित्व अथवा सहयोग संबंधी किसी भी जानकारी के लिए सीधे कॉल या व्हाट्सएप करें।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full md:w-auto">
          {/* Direct Phone Call Button */}
          <a
            href={`tel:+91${settings.organizerPhone}`}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-transform transform active:scale-95 text-xs sm:text-sm"
          >
            <PhoneCall className="w-4 h-4 text-amber-900" />
            <span>कॉल करें ({settings.organizerPhone})</span>
          </a>

          {/* Direct WhatsApp Button */}
          <a
            href={`https://wa.me/91${settings.organizerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`जय श्री कृष्ण 🙏 ${settings.organizerName} जी, मैं गोवर्धन पूजा महोत्सव 2026 (रमन डिहरा) की पूजा सामग्री, सेवा दायित्व अथवा सहयोग के संबंध में जानकारी चाहता/चाहती हूँ।`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-transform transform active:scale-95 text-xs sm:text-sm border border-emerald-400/40"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>व्हाट्सएप संदेश</span>
          </a>

          {/* Full Contact / Inquiry Info */}
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors border border-white/30"
            >
              <span>संपर्क केंद्र ℹ️</span>
            </button>
          )}
        </div>
      </section>

      {/* All Festival Photos in One Interactive Box */}
      <PhotoGalleryBox role={role} t={t} />

      {/* Two Column Grid: Schedule & UPI Donation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Puja Schedule Highlights */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold font-heading text-amber-950">
                प्रमुख पूजा कार्यक्रम (Program Highlights)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('programs')}
              className="text-xs text-amber-700 font-semibold hover:underline flex items-center space-x-1"
            >
              <span>पूर्ण सारणी</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingPrograms.map((prog, index) => (
              <div 
                key={prog.id}
                className="flex items-start space-x-3 p-3 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/60 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {prog.nameHi || prog.name}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {prog.startTime} - {prog.endTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                    {prog.description}
                  </p>
                  <div className="text-[11px] text-amber-700 font-medium mt-1">
                    प्रभारी: {prog.responsibleMember} | स्थान: {prog.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 flex justify-end">
            <button
              onClick={() => onNavigate('programs')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
            >
              <span>सभी 8+ कार्यक्रम एवं समय-सारणी देखें →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Quick UPI QR Code Contribution */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold font-heading text-amber-950">
                  त्वरित ऑनलाइन सहयोग (UPI QR)
                </h3>
              </div>
              <span className="bg-amber-200/80 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                न्यूनतम ₹7
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              PhonePe, Google Pay, Paytm अथवा किसी भी UPI ऐप से सीधे स्कैन कर गोवर्धन पूजा में सहयोग दें।
            </p>

            {/* QR Card */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 text-center shadow-inner max-w-[240px] mx-auto">
              <div className="relative mx-auto w-36 h-36 bg-amber-100 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-400 p-2">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.payeeName)}&am=7&cu=INR&tn=Govardhan%20Puja%202026`)}`} 
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-2 text-xs font-bold text-gray-800 truncate">
                {settings.payeeName}
              </div>
              <div className="text-[11px] font-mono text-amber-700 truncate">
                {settings.upiId}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 space-y-2">
            <button
              onClick={onOpenUpi}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>बड़ा QR कोड व भुगतान रसीद देखें</span>
            </button>
          </div>
        </div>

      </div>

      {/* Latest Announcements Notice Board Snippet */}
      <section className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold font-heading text-amber-950">
              ताज़ा सूचनाएं व घोषणाएं (Notice Board)
            </h3>
          </div>
          <button
            onClick={() => onNavigate('messages')}
            className="text-xs text-amber-700 font-semibold hover:underline flex items-center space-x-1"
          >
            <span>सभी सूचनाएं</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestNotices.map((notice) => (
            <div 
              key={notice.id}
              className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    notice.priority === 'high' 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {notice.priority === 'high' ? 'अति महत्वपूर्ण' : 'सामान्य सूचना'}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">{notice.date}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  {notice.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {notice.body}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>प्रेषक: {notice.senderName}</span>
                <button
                  onClick={() => onNavigate('messages')}
                  className="text-amber-700 font-bold hover:underline"
                >
                  व्हाट्सएप पर शेयर करें →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
