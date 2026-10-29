import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  IndianRupee, 
  Calendar, 
  MessageSquare, 
  PhoneCall, 
  Lock, 
  Menu, 
  X, 
  Globe, 
  Bell, 
  Images,
  ShieldCheck
} from 'lucide-react';
import { playTempleBell } from '../utils/soundEffects';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  t, 
  role, 
  setRole, 
  setIsAuthModalOpen,
  onOpenContact,
  currentMember
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation items requested in Section 6:
  // Home | Members | Contributions | Puja Program | Messages | Contact | Admin Login
  const navItems = [
    { id: 'home', label: lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home', icon: Home },
    { id: 'members', label: lang === 'hi' ? 'सदस्य' : 'Members', icon: Users },
    { id: 'contributions', label: lang === 'hi' ? 'योगदान' : 'Contributions', icon: IndianRupee },
    { id: 'programs', label: lang === 'hi' ? 'पूजा कार्यक्रम' : 'Puja Program', icon: Calendar },
    { id: 'photos', label: lang === 'hi' ? 'फोटो दर्शन' : 'Photos', icon: Images },
    { id: 'messages', label: lang === 'hi' ? 'संदेश व सूचना' : 'Messages', icon: MessageSquare },
    { id: 'contact', label: lang === 'hi' ? 'संपर्क' : 'Contact', icon: PhoneCall, isContactAction: true },
  ];

  const handleNavClick = (item) => {
    if (item.isContactAction) {
      onOpenContact();
      setMobileMenuOpen(false);
      return;
    }
    setCurrentTab(item.id);
    setMobileMenuOpen(false);
  };

  const handleBellRing = () => {
    playTempleBell();
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#241104] via-[#381a07] to-[#241104] text-white shadow-xl border-b-2 border-amber-500/80">
      
      {/* Sacred Top Ribbon */}
      <div className="bg-black/50 px-3 sm:px-6 py-1 text-xs flex justify-between items-center text-amber-200/90 font-medium border-b border-amber-600/30">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-amber-400">🚩</span>
          <span className="truncate">॥ श्री गोवर्धन धराधार गोकुल त्राणकारक ॥</span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {/* Temple Bell */}
          <button 
            onClick={handleBellRing}
            title="पवित्र मंदिर घंटी बजाएं (Ring Bell)"
            className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/40 px-2 py-0.5 rounded text-amber-200 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline text-[11px]">घंटी</span>
          </button>

          {/* Bilingual Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="flex items-center space-x-1 bg-amber-500/30 hover:bg-amber-500/50 px-2 py-0.5 rounded text-amber-100 font-bold transition-all shadow-sm"
          >
            <Globe className="w-3 h-3 text-amber-300" />
            <span className="text-xs">{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Admin / Role Badge & Login */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white px-2.5 py-0.5 rounded-full border border-amber-400/50 text-xs font-bold transition-all shadow-sm"
          >
            <Lock className="w-3 h-3 text-amber-300" />
            <span>
              {role === 'admin' ? (lang === 'hi' ? 'व्यवस्थापक (Admin)' : 'Admin') : (lang === 'hi' ? 'व्यवस्थापक लॉगिन' : 'Admin Login')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Samiti Title */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <img 
                src="/diya-icon.svg" 
                alt="Diya" 
                className="w-8 h-8 sm:w-10 sm:h-10 animate-diya-flame"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold font-heading text-amber-100 tracking-wide group-hover:text-yellow-300 transition-colors drop-shadow leading-tight">
                {t.samitiTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-amber-300/80 font-medium">
                {t.samitiSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md border border-amber-400/60'
                      : 'text-amber-100/90 hover:bg-amber-900/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-200' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Login Quick Link */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ml-1"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{role === 'admin' ? (lang === 'hi' ? 'सेटिंग्स' : 'Settings') : (lang === 'hi' ? 'लॉगिन' : 'Login')}</span>
            </button>
          </nav>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-amber-900/80 text-amber-200 hover:text-white hover:bg-amber-800 border border-amber-500/50 shadow-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-gradient-to-b from-[#241104] to-[#150902] border-t border-amber-600/50 shadow-2xl px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white border-l-4 border-yellow-300 shadow-md'
                    : 'text-amber-100 hover:bg-amber-900/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-200' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-amber-700/60 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>{role === 'admin' ? 'व्यवस्थापक सेटिंग्स (Admin Settings)' : 'व्यवस्थापक लॉगिन (Admin Login)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
