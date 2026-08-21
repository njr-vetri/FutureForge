import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Track,
  CandidateProfile,
  Waypoint,
  CodingProblem,
  JobOpening,
  AuthUser,
} from '../types';
import {
  initialCandidateProfile,
  trailheadWaypoints,
  mockCodingProblems,
  mockJobOpenings,
} from '../data/mockData';

interface AppContextType {
  track: Track;
  setTrack: (t: Track) => void;
  currentRoute: string;
  navigate: (route: string) => void;
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  codingProblems: CodingProblem[];
  selectedProblemId: string;
  setSelectedProblemId: (id: string) => void;
  jobs: JobOpening[];
  setJobs: React.Dispatch<React.SetStateAction<JobOpening[]>>;
  isSkillGraphOpen: boolean;
  setIsSkillGraphOpen: (open: boolean) => void;
  activeEmberPanel: 'none' | 'editor' | 'mic' | 'chat' | 'problem';
  setActiveEmberPanel: (panel: 'none' | 'editor' | 'mic' | 'chat' | 'problem') => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAuthenticated: boolean;
  authUser: AuthUser | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  hasCompletedAssessment: boolean;
  setHasCompletedAssessment: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [track, setTrackState] = useState<Track>('trailhead');
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [profile, setProfile] = useState<CandidateProfile>(initialCandidateProfile);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(trailheadWaypoints);
  const [codingProblems] = useState<CodingProblem[]>(mockCodingProblems);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('p-101');
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobOpenings);
  const [isSkillGraphOpen, setIsSkillGraphOpen] = useState<boolean>(false);
  const [activeEmberPanel, setActiveEmberPanel] = useState<'none' | 'editor' | 'mic' | 'chat' | 'problem'>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean>(false);

  // Initialize auth and track from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('futureforge_auth');
    const storedTrack = localStorage.getItem('futureforge_track');
    const storedAssessment = localStorage.getItem('futureforge_assessment');
    
    let isAuthed = false;
    if (storedAuth) {
      try {
        const user = JSON.parse(storedAuth);
        setAuthUser(user);
        setIsAuthenticated(true);
        isAuthed = true;
      } catch (e) {
        // ignore
      }
    }

    if (storedAssessment === 'true') {
      setHasCompletedAssessment(true);
    }

    if (storedTrack === 'crucible' || storedTrack === 'trailhead') {
      setTrackState(storedTrack);
    }

    // Routing logic on mount based on auth
    const hash = window.location.hash.replace(/^#/, '');
    if (!isAuthed) {
      if (hash !== '/login' && hash !== '/') {
        setCurrentRoute('/');
        window.location.hash = '/';
      } else {
        setCurrentRoute(hash || '/');
      }
    } else {
      if (!storedTrack && hash !== '/track-selection') {
        setCurrentRoute('/track-selection');
        window.location.hash = '/track-selection';
      } else if (hash === '/' || hash === '/login') {
        // returning user, redirect to their track
        if (storedTrack === 'crucible') {
          setCurrentRoute('/crucible/workflow');
          window.location.hash = '/crucible/workflow';
        } else {
          setCurrentRoute('/dashboard');
          window.location.hash = '/dashboard';
        }
      } else if (hash) {
        setCurrentRoute(hash);
      }
    }
  }, []);

  // Sync hash routing if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentRoute(hash);
        if (hash.startsWith('/crucible') && hash !== '/crucible-assessment' && hash !== '/crucible-result') {
          setTrackState('crucible');
          localStorage.setItem('futureforge_track', 'crucible');
        } else if (hash !== '/login' && hash !== '/' && hash !== '/track-selection' && !hash.startsWith('/crucible')) {
          setTrackState('trailhead');
          localStorage.setItem('futureforge_track', 'trailhead');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    if (route.startsWith('/crucible') && route !== '/crucible-assessment' && route !== '/crucible-result') {
      setTrackState('crucible');
      localStorage.setItem('futureforge_track', 'crucible');
    } else if (route !== '/login' && route !== '/' && route !== '/track-selection' && !route.startsWith('/crucible')) {
      setTrackState('trailhead');
      localStorage.setItem('futureforge_track', 'trailhead');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setTrack = (newTrack: Track) => {
    setTrackState(newTrack);
    localStorage.setItem('futureforge_track', newTrack);
    if (newTrack === 'crucible' && !currentRoute.startsWith('/crucible')) {
      navigate('/crucible/workflow');
    } else if (newTrack === 'trailhead' && currentRoute.startsWith('/crucible')) {
      navigate('/dashboard');
    }
  };

  const login = (email: string, name: string) => {
    const user: AuthUser = { id: 'u1', email, name };
    setAuthUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('futureforge_auth', JSON.stringify(user));
    navigate('/track-selection');
  };

  const logout = () => {
    setAuthUser(null);
    setIsAuthenticated(false);
    setHasCompletedAssessment(false);
    setTrackState('trailhead');
    localStorage.removeItem('futureforge_auth');
    localStorage.removeItem('futureforge_track');
    localStorage.removeItem('futureforge_assessment');
    navigate('/');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        track,
        setTrack,
        currentRoute,
        navigate,
        profile,
        setProfile,
        waypoints,
        setWaypoints,
        codingProblems,
        selectedProblemId,
        setSelectedProblemId,
        jobs,
        setJobs,
        isSkillGraphOpen,
        setIsSkillGraphOpen,
        activeEmberPanel,
        setActiveEmberPanel,
        toastMessage,
        showToast,
        isAuthenticated,
        authUser,
        login,
        logout,
        hasCompletedAssessment,
        setHasCompletedAssessment: (val: boolean) => {
          setHasCompletedAssessment(val);
          localStorage.setItem('futureforge_assessment', val ? 'true' : 'false');
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
