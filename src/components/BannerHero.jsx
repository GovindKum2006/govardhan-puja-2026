import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  HeartHandshake, 
  UserPlus, 
  Flame, 
  MapPin, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function BannerHero({ 
  t, 
  lang, 
  onOpenUpi, 
  onNavigate, 
  onAddMember, 
  onOpenContact,
  settings 
}) {
  // Countdown to Govardhan Puja 2026 (target: Nov 10, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 20 });

  useEffect(() => {
    const targetDate = new Date(`${settings.eventDate || '2026-11-10'}T07:00:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.eventDate]);

  return (
    <div className="relative overflow-hidden bg-festival-dark text-white border-b-4 border-amber-500 shadow-2xl">
      
      {/* Decorative Traditional Marigold & Leaf Garland across top */}
      <div className="w-full flex justify-between items-center px-2 py-1.5 bg-black/40 border-b border-amber-500/30 overflow-hidden select-none">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="text-sm md:text-base opacity-90 mx-1 transform hover:scale-125 transition-transform inline-block">
            {i % 2 === 0 ? '🏵️' : '🌼'}
          </span>
        ))}
      </div>

      {/* Hero Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Festival Text, Shimmer Title & 4 Animated CTA Buttons */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left animate-fade-in-up">
            
            {/* Sacred Tagline Badge with Diya */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border border-amber-400/50 px-4 py-1.5 rounded-full text-amber-200 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg">
              <Flame className="w-4 h-4 text-yellow-300 animate-diya-flame" />
              <span>श्री गिरिराज जी महाराज की जय | अन्नकूट महामहोत्सव 2026</span>
              <span className="text-amber-400">🚩</span>
            </div>

            {/* Main Shimmer Animated Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-wide leading-tight drop-shadow-lg">
                <span className="animate-title-shimmer block">
                  {t.samitiTitle}
                </span>
              </h1>
            </div>

            {/* Welcoming Subtitle (Section 1 Requirement) */}
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-yellow-300 leading-snug drop-shadow-md">
              “{t.welcomeHero}”
            </p>

            {/* Sacred Sanskrit Shloka Box */}
            <div className="p-3.5 bg-amber-950/60 rounded-2xl border border-amber-400/40 text-amber-100 text-xs sm:text-sm italic font-hindi shadow-inner max-w-xl mx-auto lg:mx-0">
              ॥ {t.festivalTagline} ॥
            </div>

            {/* Date & Location Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-amber-200 font-semibold pt-1">
              <div className="flex items-center space-x-2 bg-black/40 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>महोत्सव दिनांक: 10 नवंबर 2026 (गोवर्धन पूजा)</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span className="truncate max-w-[260px]">{settings.templeAddress}</span>
              </div>
            </div>

            {/* 4 Animated Buttons Requested in Section 1 */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              
              {/* 1. सदस्य जोड़ें */}
              <button
                onClick={onAddMember}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold px-5 py-3 rounded-2xl text-sm sm:text-base shadow-xl hover:shadow-emerald-500/40 border border-emerald-400/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <UserPlus className="w-5 h-5 text-emerald-200" />
                <span>सदस्य जोड़ें</span>
              </button>

              {/* 2. योगदान देखें */}
              <button
                onClick={() => onNavigate('contributions')}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 font-black px-5 py-3 rounded-2xl text-sm sm:text-base shadow-xl hover:shadow-yellow-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0 btn-glow"
              >
                <HeartHandshake className="w-5 h-5 text-amber-900" />
                <span>योगदान देखें (₹7)</span>
              </button>

              {/* 3. कार्यक्रम देखें */}
              <button
                onClick={() => onNavigate('programs')}
                className="flex items-center space-x-2 bg-amber-900/80 hover:bg-amber-800 text-amber-100 font-bold px-4 py-3 rounded-2xl text-sm sm:text-base border border-amber-400/50 shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <Calendar className="w-5 h-5 text-amber-300" />
                <span>कार्यक्रम देखें</span>
              </button>

              {/* 4. संपर्क करें */}
              <button
                onClick={onOpenContact}
                className="flex items-center space-x-2 bg-orange-700/80 hover:bg-orange-600 text-white font-bold px-4 py-3 rounded-2xl text-sm sm:text-base border border-orange-400/50 shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <PhoneCall className="w-4 h-4 text-orange-200" />
                <span>संपर्क करें</span>
              </button>

            </div>
          </div>

          {/* Right Column: Golden Govardhana Puja Celebration Artwork Poster */}
          <div className="lg:col-span-5 flex flex-col items-center animate-fade-in-up">
            
            {/* The Main Govardhan Puja Artwork Frame */}
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer Golden Aura Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse-slow"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-300 shadow-2xl">
                <img 
                  src="/assets/golden-govardhan-puja.png" 
                  alt="Golden Govardhana Puja Celebration 2026" 
                  className="w-full h-64 sm:h-80 object-cover object-center transform group-hover:scale-105 transition duration-700"
                  onError={(e) => {
                    // Fallback to Krishna Govardhan illustration
                    e.currentTarget.src = '/assets/krishna-govardhan.png';
                  }}
                />
                
                {/* Floating Bottom Ribbon on the Artwork */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 text-center">
                  <div className="flex items-center justify-center space-x-1 text-xs sm:text-sm font-bold text-amber-200">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>श्री गिरिराज धरण की जय | 56 भोग अन्नकूट</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Countdown Box */}
            <div className="mt-5 w-full max-w-sm bg-gradient-to-br from-amber-950/90 to-stone-950/90 backdrop-blur-md rounded-2xl p-4 border border-amber-400/50 shadow-2xl">
              <div className="text-center text-xs text-amber-300 font-bold mb-2 uppercase tracking-wider flex items-center justify-center space-x-1.5">
                <Flame className="w-4 h-4 text-yellow-400 animate-diya-flame" />
                <span>गोवर्धन पूजा महोत्सव - उल्टी गिनती (Countdown)</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-amber-900/80 rounded-xl p-2 border border-amber-500/40 shadow-inner">
                  <div className="text-xl sm:text-2xl font-black font-heading text-yellow-300">{timeLeft.days}</div>
                  <div className="text-[10px] text-amber-200 font-semibold">दिन (Days)</div>
                </div>
                <div className="bg-amber-900/80 rounded-xl p-2 border border-amber-500/40 shadow-inner">
                  <div className="text-xl sm:text-2xl font-black font-heading text-yellow-300">{timeLeft.hours}</div>
                  <div className="text-[10px] text-amber-200 font-semibold">घंटे (Hrs)</div>
                </div>
                <div className="bg-amber-900/80 rounded-xl p-2 border border-amber-500/40 shadow-inner">
                  <div className="text-xl sm:text-2xl font-black font-heading text-yellow-300">{timeLeft.minutes}</div>
                  <div className="text-[10px] text-amber-200 font-semibold">मिनट (Min)</div>
                </div>
                <div className="bg-amber-900/80 rounded-xl p-2 border border-amber-500/40 shadow-inner">
                  <div className="text-xl sm:text-2xl font-black font-heading text-yellow-300">{timeLeft.seconds}</div>
                  <div className="text-[10px] text-amber-200 font-semibold">सेकंड (Sec)</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
