import React from 'react';
import { Heart, Sparkles, PhoneCall, ShieldCheck, MapPin } from 'lucide-react';
import { playTempleBell } from '../utils/soundEffects';

export default function Footer({ settings, onNavigate, onOpenUpi, setIsAuthModalOpen, onOpenContact, t }) {
  return (
    <footer className="bg-gradient-to-b from-amber-900 via-stone-900 to-black text-amber-100/90 border-t-4 border-amber-500 relative select-none">
      
      {/* Decorative Marigold & Diya Ribbon */}
      <div className="w-full flex justify-between items-center px-2 py-1 bg-amber-950/80 border-b border-amber-600/30 overflow-hidden text-xs">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="opacity-80">
            {i % 2 === 0 ? '🪔' : '🏵️'}
          </span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About Samiti */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <img src="/diya-icon.svg" alt="Diya" className="w-8 h-8 animate-diya-flame" />
              <h3 className="text-xl font-bold font-heading text-amber-200">
                {settings.payeeName || 'श्री गोवर्धन पूजा समिति 2026'}
              </h3>
            </div>
            
            <p className="text-xs text-amber-100/80 leading-relaxed font-hindi">
              गोवर्धन धराधार गोकुल त्राणकारक। विष्णुबाहु कृतोच्छ्राय गवां कोटिप्रदो भव॥<br />
              भगवान श्री गिरिराज महाराज के पावन अन्नकूट एवं गोवर्धन पूजा महोत्सव को सुव्यवस्थित, पारदर्शी एवं जन-जन के सहयोग से सफल बनाने हेतु समर्पित स्मार्ट प्रबंधन पोर्टल।
            </p>

            <div className="flex items-center space-x-2 text-xs text-amber-300/80 pt-1">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.templeAddress}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-heading">
              त्वरित लिंक
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-100/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors">
                  • {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('members')} className="hover:text-amber-300 transition-colors">
                  • {t.navMembers}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contributions')} className="hover:text-amber-300 transition-colors">
                  • {t.navContributions} (₹7)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-amber-300 transition-colors">
                  • {t.navPrograms}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('messages')} className="hover:text-amber-300 transition-colors">
                  • {t.navMessages}
                </button>
              </li>
              <li>
                <button onClick={onOpenContact || (() => onNavigate('contact'))} className="hover:text-amber-300 transition-colors">
                  • संपर्क एवं सेवा केंद्र
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Portal Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-heading">
              सहयोग एवं संपर्क
            </h4>
            
            <p className="text-xs text-amber-100/80">
              संयोजक: <strong>{settings.organizerName}</strong>
            </p>

            <a
              href={`tel:+91${settings.organizerPhone}`}
              className="inline-flex items-center space-x-2 bg-amber-800/80 hover:bg-amber-700 text-amber-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-amber-500/40 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>कॉल करें ({settings.organizerPhone})</span>
            </a>

            <div>
              <button
                onClick={onOpenUpi}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-yellow-400 hover:text-yellow-300 underline"
              >
                <span>UPI QR कोड स्कैन करें →</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1 text-xs text-amber-300/80 hover:text-amber-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>व्यवस्थापक / सदस्य लॉगिन</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Exact Requirement Text: “जय श्री कृष्ण 🙏 | Govardhan Puja Samiti 2026” */}
        <div className="mt-10 pt-6 border-t border-amber-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/80 gap-3 text-center sm:text-left">
          <div className="text-base sm:text-lg font-bold font-heading text-yellow-300 tracking-wide">
            जय श्री कृष्ण 🙏 | Govardhan Puja Samiti 2026 (रमन डिहरा)
          </div>

          <div className="text-[11px] text-amber-300/60">
            {t.allRightsReserved}
          </div>
        </div>

      </div>
    </footer>
  );
}
