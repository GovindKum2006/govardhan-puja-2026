import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BannerHero from './components/BannerHero';
import HomeOverview from './components/HomeOverview';
import MembersManagement from './components/MembersManagement';
import AddMemberModal from './components/AddMemberModal';
import ContributionsPage from './components/ContributionsPage';
import ProgramsPage from './components/ProgramsPage';
import CallingSystem from './components/CallingSystem';
import MessagingPage from './components/MessagingPage';
import ReportsPage from './components/ReportsPage';
import AdminSettingsPage from './components/AdminSettingsPage';
import ReceiptModal from './components/ReceiptModal';
import UpiModal from './components/UpiModal';
import AuthModal from './components/AuthModal';
import PhotoGalleryBox from './components/PhotoGalleryBox';
import ContactModal from './components/ContactModal';
import FestiveEffects from './components/FestiveEffects';
import Footer from './components/Footer';

import { StorageService } from './services/storage';
import { translations } from './translations/i18n';

export default function App() {
  const [lang, setLang] = useState('hi');
  const t = translations[lang];

  // Current view tab
  const [currentTab, setCurrentTab] = useState('home');

  // Role: 'admin' (default for ease of management), 'member', 'public'
  const [role, setRole] = useState(() => StorageService.getCurrentRole());
  const [currentMember, setCurrentMember] = useState(null);

  // Core Data State
  const [settings, setSettings] = useState(() => StorageService.getSettings());
  const [members, setMembers] = useState(() => StorageService.getMembers());
  const [programs, setPrograms] = useState(() => StorageService.getPrograms());
  const [announcements, setAnnouncements] = useState(() => StorageService.getAnnouncements());
  const [contactLogs, setContactLogs] = useState(() => StorageService.getContactLogs());

  // Modal States
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptMember, setReceiptMember] = useState(null);
  const [isUpiOpen, setIsUpiOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [broadcastNoticeData, setBroadcastNoticeData] = useState(null);

  // Refresh data from storage
  const refreshData = () => {
    setSettings(StorageService.getSettings());
    setMembers(StorageService.getMembers());
    setPrograms(StorageService.getPrograms());
    setAnnouncements(StorageService.getAnnouncements());
    setContactLogs(StorageService.getContactLogs());
  };

  // Scroll to top on navigation
  const handleNavigate = (tabId) => {
    if (tabId === 'add-member') {
      setIsAddMemberOpen(true);
      return;
    }
    if (tabId === 'contact') {
      setIsContactOpen(true);
      return;
    }
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Receipt
  const handleViewReceipt = (member) => {
    setReceiptMember(member);
    setIsReceiptOpen(true);
  };

  // Handle Broadcast Schedule Notice
  const handleBroadcastNotice = (noticeData) => {
    setBroadcastNoticeData(noticeData);
    setCurrentTab('messages');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] font-sans text-gray-900 selection:bg-amber-300 selection:text-amber-950 relative">
      {/* Lightweight Floating Petals & Golden Particles */}
      <FestiveEffects />

      {/* Sticky Header / Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        lang={lang}
        setLang={setLang}
        t={t}
        role={role}
        setRole={setRole}
        setIsAuthModalOpen={setIsAuthOpen}
        onOpenContact={() => setIsContactOpen(true)}
        currentMember={currentMember}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Banner Hero is visible on Home */}
        {currentTab === 'home' && (
          <BannerHero
            t={t}
            lang={lang}
            settings={settings}
            onOpenUpi={() => setIsUpiOpen(true)}
            onNavigate={handleNavigate}
            onAddMember={() => setIsAddMemberOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          
          {/* Tab 1: Home Overview */}
          {currentTab === 'home' && (
            <HomeOverview
              members={members}
              programs={programs}
              announcements={announcements}
              settings={settings}
              t={t}
              role={role}
              onNavigate={handleNavigate}
              onOpenUpi={() => setIsUpiOpen(true)}
              onAddMember={() => setIsAddMemberOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
            />
          )}

          {/* Tab: Photo Gallery & Darshan Box */}
          {currentTab === 'photos' && (
            <div className="space-y-6 pb-12">
              <PhotoGalleryBox role={role} t={t} />
            </div>
          )}

          {/* Tab 2: All Members */}
          {currentTab === 'members' && (
            <MembersManagement
              members={members}
              onMembersChange={refreshData}
              onAddMember={() => setIsAddMemberOpen(true)}
              onViewReceipt={handleViewReceipt}
              role={role}
              settings={settings}
              t={t}
            />
          )}

          {/* Tab 3: Contributions & Donations */}
          {currentTab === 'contributions' && (
            <ContributionsPage
              members={members}
              onMembersChange={refreshData}
              onViewReceipt={handleViewReceipt}
              onOpenUpi={() => setIsUpiOpen(true)}
              settings={settings}
              role={role}
              t={t}
            />
          )}

          {/* Tab 4: Puja Programs & Schedule */}
          {currentTab === 'programs' && (
            <ProgramsPage
              programs={programs}
              onProgramsChange={refreshData}
              onBroadcastNotice={handleBroadcastNotice}
              role={role}
              t={t}
            />
          )}

          {/* Tab 5: Calling System */}
          {currentTab === 'calling' && (
            <CallingSystem
              members={members}
              onMembersChange={refreshData}
              contactLogs={contactLogs}
              onLogsChange={refreshData}
              settings={settings}
              role={role}
              t={t}
            />
          )}

          {/* Tab 6: Messages & Announcements */}
          {currentTab === 'messages' && (
            <MessagingPage
              announcements={announcements}
              onAnnouncementsChange={refreshData}
              members={members}
              settings={settings}
              role={role}
              initialBroadcastNotice={broadcastNoticeData}
              t={t}
            />
          )}

          {/* Tab 7: Reports & Stats */}
          {currentTab === 'reports' && (
            <ReportsPage
              members={members}
              settings={settings}
              t={t}
            />
          )}

          {/* Tab 8: Admin Settings */}
          {currentTab === 'settings' && (
            <AdminSettingsPage
              settings={settings}
              onSettingsChange={refreshData}
              onResetDemo={() => {
                StorageService.resetToDemo();
                refreshData();
              }}
              t={t}
            />
          )}

        </div>
      </main>

      {/* Global Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onMemberAdded={(newMember) => {
          refreshData();
        }}
        defaultContribution={settings.defaultContribution}
        t={t}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        member={receiptMember}
        settings={settings}
        t={t}
      />

      <UpiModal
        isOpen={isUpiOpen}
        onClose={() => setIsUpiOpen(false)}
        settings={settings}
        onPaymentLogged={refreshData}
        t={t}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        role={role}
        setRole={setRole}
        currentMember={currentMember}
        setCurrentMember={setCurrentMember}
        settings={settings}
        members={members}
        t={t}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        settings={settings}
        onOpenUpi={() => setIsUpiOpen(true)}
        t={t}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenUpi={() => setIsUpiOpen(true)}
        setIsAuthModalOpen={setIsAuthOpen}
        onOpenContact={() => setIsContactOpen(true)}
        t={t}
      />

    </div>
  );
}
