import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SkillGraphModal } from './components/common/SkillGraphModal';
import { TrackSelector } from './components/common/TrackSelector';
import { LandingPage } from './components/public/LandingPage';
import { AuthPage } from './components/public/AuthPage';
import { CrucibleAssessment } from './components/onboarding/CrucibleAssessment';
import { CrucibleResult } from './components/onboarding/CrucibleResult';

// Trailhead components
import { TrailheadDashboard } from './components/trailhead/TrailheadDashboard';
import { CodingArena } from './components/trailhead/CodingArena';
import { AptitudeArena } from './components/trailhead/AptitudeArena';
import { VideoHub } from './components/trailhead/VideoHub';
import { ResumeStudio } from './components/trailhead/ResumeStudio';
import { MockInterview } from './components/trailhead/MockInterview';
import { ExpeditionRoadmap } from './components/trailhead/ExpeditionRoadmap';
import { JobsPortal } from './components/trailhead/JobsPortal';
import { Leaderboard } from './components/trailhead/Leaderboard';
import { AdminPortal } from './components/trailhead/AdminPortal';
import { CandidateProfileView } from './components/trailhead/CandidateProfileView';

// Crucible components
import { CrucibleWorkflow } from './components/crucible/CrucibleWorkflow';
import { RoastMyRepo } from './components/crucible/RoastMyRepo';
import { GapAnalyzer } from './components/crucible/GapAnalyzer';
import { HelpCenterWidget } from './components/common/HelpCenterWidget';

const MainContent: React.FC = () => {
  const { currentRoute, track, profile } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hasCompletedTrailhead = profile?.trailheadCompletedWaypoints >= profile?.totalWaypoints;

  const renderRoute = () => {
    switch (currentRoute) {
      // Public / Auth / Onboarding
      case '/':
        return <LandingPage />;
      case '/login':
        return <AuthPage />;
      case '/track-selection':
      case '/tracks':
        return <TrackSelector />;
      case '/crucible-assessment':
        return <CrucibleAssessment />;
      case '/crucible-result':
        return <CrucibleResult />;

      // Common / Global
      case '/profile':
        return <CandidateProfileView />;

      // Trailhead Routes
      case '/dashboard':
        return <TrailheadDashboard />;
      case '/coding':
      case '/coding/problem':
        return <CodingArena />;
      case '/aptitude':
      case '/aptitude/result':
        return <AptitudeArena />;
      case '/video-hub':
        return <VideoHub />;
      case '/resume':
        return <ResumeStudio />;
      case '/interview':
        return <MockInterview />;
      case '/roadmap':
        return <ExpeditionRoadmap />;
      case '/jobs':
        return <JobsPortal />;
      case '/leaderboard':
        return <Leaderboard />;
      case '/readiness':
        return <AdminPortal />;

      // Crucible Routes
      case '/crucible/workflow':
        return <CrucibleWorkflow />;
      case '/crucible/roast-my-repo':
        return <RoastMyRepo />;
      case '/crucible/gap-analyzer':
        return <GapAnalyzer />;

      default:
        // Default fallback based on track
        return track === 'crucible' ? <CrucibleWorkflow /> : <TrailheadDashboard />;
    }
  };

  const fullScreenRoutes = ['/', '/login', '/track-selection', '/tracks', '/crucible-assessment', '/crucible-result'];
  const isFullScreenRoute = fullScreenRoutes.includes(currentRoute);

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {!isFullScreenRoute && <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />}

      <div className="flex-1 flex overflow-hidden">
        {!isFullScreenRoute && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
        <main
          id="main-app-content"
          tabIndex={-1}
          className={`flex-1 overflow-y-auto focus:outline-none ${
            isFullScreenRoute ? 'p-0' : 'p-4 sm:p-6 lg:p-8 bg-gray-50/50'
          }`}
        >
          {renderRoute()}
        </main>
      </div>

      <SkillGraphModal />
      
      {/* AI Tutor Widget */}
      {!isFullScreenRoute && <HelpCenterWidget />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
