import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LearnDemoModal } from './components/LearnDemoModal';
import { ToastProvider, useToast } from './components/ui/Toast';
import { CommandPalette } from './components/ui/CommandPalette';
import { NotificationsDrawer } from './components/ui/NotificationsDrawer';

import { LandingPage } from './views/LandingPage';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { ClientsView } from './views/ClientsView';
import { ClientProfileView } from './views/ClientProfileView';
import { MeetingsView } from './views/MeetingsView';
import { MeetingDetailsView } from './views/MeetingDetailsView';
import { AddMeetingView } from './views/AddMeetingView';
import { MemoryCenterView } from './views/MemoryCenterView';
import { AIAssistantView } from './views/AIAssistantView';
import { PrepareMeView } from './views/PrepareMeView';
import { FollowUpEmailView } from './views/FollowUpEmailView';
import { SettingsView } from './views/SettingsView';

import { User, Client, Meeting, Memory } from './types';
import { getCurrentUser, getClients, getMeetings, getAllMemories } from './api';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user_demo_1',
    email: 'demo@meetmind.ai',
    name: 'Alex Vance',
    role: 'Senior Solutions Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Global search data
  const [clients, setClients] = useState<Client[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  // Dialog & drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);

  // Scoped view parameters
  const [selectedClientId, setSelectedClientId] = useState<string>('client_sarah');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('meet_sarah_3');
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');

  useEffect(() => {
    // Attempt session restore
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch(() => {});

    // Pre-fetch for global search palette
    getClients().then(setClients).catch(() => {});
    getMeetings().then(setMeetings).catch(() => {});
    getAllMemories().then((res) => setMemories(res.memories)).catch(() => {});
  }, []);

  const handleNavigate = (view: string, clientId?: string, meetingId?: string) => {
    if (clientId) setSelectedClientId(clientId);
    if (meetingId) setSelectedMeetingId(meetingId);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrepareClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('prepare');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('client_profile');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewMeetingForClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('add_meeting');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView('meeting_details');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateFollowUp = (clientId: string, meetingId?: string) => {
    setSelectedClientId(clientId);
    if (meetingId) setSelectedMeetingId(meetingId);
    setCurrentView('followups');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAI = (clientId: string, prompt?: string) => {
    setSelectedClientId(clientId);
    if (prompt) setAssistantPrompt(prompt);
    setCurrentView('assistant');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If public landing page is selected
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => setCurrentView('dashboard')}
          onOpenLearnDemo={() => setIsLearnModalOpen(true)}
        />
        <LearnDemoModal
          isOpen={isLearnModalOpen}
          onClose={() => setIsLearnModalOpen(false)}
          onLaunchPrepare={() => {
            setSelectedClientId('client_sarah');
            setCurrentView('prepare');
          }}
        />
      </>
    );
  }

  // If login view is selected or user is logged out
  if (currentView === 'login' || !currentUser) {
    return (
      <>
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView('dashboard');
          }}
          onOpenLearnDemo={() => setIsLearnModalOpen(true)}
          onViewLanding={() => setCurrentView('landing')}
        />
        <LearnDemoModal
          isOpen={isLearnModalOpen}
          onClose={() => setIsLearnModalOpen(false)}
          onLaunchPrepare={() => {
            setCurrentUser({
              id: 'user_demo_1',
              email: 'demo@meetmind.ai',
              name: 'Alex Vance',
              role: 'Senior Solutions Director',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            });
            setSelectedClientId('client_sarah');
            setCurrentView('prepare');
          }}
        />
      </>
    );
  }

  const getViewHeaderMeta = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Overview', subtitle: 'Executive Meeting Overview & Hindsight Activity' };
      case 'clients':
        return { title: 'Clients', subtitle: 'Accounts, Meeting Histories & Stored Context' };
      case 'client_profile':
        return { title: 'Client Profile', subtitle: 'Overview, Hindsight Memories & Timeline' };
      case 'meetings':
        return { title: 'Meetings', subtitle: 'Past & Upcoming Client Conversations' };
      case 'meeting_details':
        return { title: 'Meeting Details', subtitle: 'Notes, Analysis & Retained Facts' };
      case 'add_meeting':
        return { title: 'Add Meeting', subtitle: 'Analyze Raw Notes & Retain Facts' };
      case 'memory':
        return { title: 'Memory Center', subtitle: 'Persistent Hindsight Memory Stream' };
      case 'assistant':
        return { title: 'AI Assistant', subtitle: 'Contextual Chat Grounded in Hindsight Memories' };
      case 'prepare':
        return { title: 'Prepare Me', subtitle: 'Executive Pre-Meeting Intelligence Briefing' };
      case 'followups':
        return { title: 'Follow-ups', subtitle: 'Personalized Post-Meeting Email Drafting' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Hindsight Configuration & Engine Health' };
      default:
        return { title: 'MeetMind', subtitle: 'Your meetings are remembered.' };
    }
  };

  const headerMeta = getViewHeaderMeta();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
      {/* Desktop Navigation Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentView('login');
          }}
          onOpenLearnDemo={() => setIsLearnModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Navigation Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-xs">
          <div className="w-64 h-full bg-slate-950">
            <Sidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              currentUser={currentUser}
              onLogout={() => {
                setCurrentUser(null);
                setCurrentView('login');
              }}
              onOpenLearnDemo={() => setIsLearnModalOpen(true)}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
          onNewMeeting={() => handleNavigate('add_meeting')}
          onPrepareMe={() => handlePrepareClient('client_sarah')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          currentUser={currentUser}
        />

        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onPrepareClient={handlePrepareClient}
              onOpenLearnDemo={() => setIsLearnModalOpen(true)}
              userName={currentUser.name.split(' ')[0]}
            />
          )}

          {currentView === 'clients' && (
            <ClientsView
              onSelectClient={handleSelectClient}
              onPrepareClient={handlePrepareClient}
              onNewMeetingForClient={handleNewMeetingForClient}
            />
          )}

          {currentView === 'client_profile' && (
            <ClientProfileView
              clientId={selectedClientId}
              onBack={() => handleNavigate('clients')}
              onPrepareMe={handlePrepareClient}
              onNewMeeting={handleNewMeetingForClient}
              onAskAI={handleAskAI}
              onViewMeeting={handleSelectMeeting}
            />
          )}

          {currentView === 'meetings' && (
            <MeetingsView
              onSelectMeeting={handleSelectMeeting}
              onPrepareClient={handlePrepareClient}
              onNewMeeting={() => handleNavigate('add_meeting')}
            />
          )}

          {currentView === 'meeting_details' && (
            <MeetingDetailsView
              meetingId={selectedMeetingId}
              onBack={() => handleNavigate('meetings')}
              onGenerateFollowUp={handleGenerateFollowUp}
              onPrepareClient={handlePrepareClient}
            />
          )}

          {currentView === 'add_meeting' && (
            <AddMeetingView
              initialClientId={selectedClientId}
              onMeetingCreated={(mId) => handleSelectMeeting(mId)}
              onPrepareClient={handlePrepareClient}
            />
          )}

          {currentView === 'memory' && (
            <MemoryCenterView
              onPrepareClient={handlePrepareClient}
              onSelectClient={handleSelectClient}
              onAskAI={handleAskAI}
            />
          )}

          {currentView === 'assistant' && (
            <AIAssistantView
              initialClientId={selectedClientId}
              initialPrompt={assistantPrompt}
              onPrepareClient={handlePrepareClient}
            />
          )}

          {currentView === 'prepare' && (
            <PrepareMeView
              initialClientId={selectedClientId}
              onGenerateFollowUp={handleGenerateFollowUp}
            />
          )}

          {currentView === 'followups' && (
            <FollowUpEmailView
              initialClientId={selectedClientId}
              initialMeetingId={selectedMeetingId}
            />
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        clients={clients}
        meetings={meetings}
        memories={memories}
        onNavigate={handleNavigate}
        onPrepareClient={handlePrepareClient}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onPrepareClient={handlePrepareClient}
        onNavigate={handleNavigate}
      />

      {/* Interactive Showcase Modal */}
      <LearnDemoModal
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
        onLaunchPrepare={() => handlePrepareClient('client_sarah')}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

export default App;
