import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Waypoint } from '../../types';
import { Compass, CheckCircle2, Lock, ArrowUpRight, Flame, MapPin } from 'lucide-react';

interface TopographicTrailProps {
  waypoints: Waypoint[];
  readinessScore: number;
  onSelectWaypoint?: (wp: Waypoint) => void;
}

export const TopographicTrail: React.FC<TopographicTrailProps> = ({
  waypoints,
  readinessScore,
  onSelectWaypoint,
}) => {
  const { navigate } = useApp();
  const [selectedPin, setSelectedPin] = useState<Waypoint | null>(waypoints[3]);

  // Compute avatar marker location along the smooth path based on readiness score (0 - 100)
  // Waypoint x percentages: 10, 26, 44, 62, 80, 94
  const getAvatarPosition = (score: number) => {
    // Map score (0 - 100) along the parametric curve
    const t = Math.max(0, Math.min(100, score)) / 100;
    const x = 10 + t * 84; // 10% to 94%
    // Sine wave contour elevation calculation
    const y = 50 - Math.sin(t * Math.PI * 2.5) * 22 + Math.cos(t * Math.PI * 1.5) * 8;
    return { x, y: Math.max(18, Math.min(78, y)) };
  };

  const avatarPos = getAvatarPosition(readinessScore);

  // SVG path connecting waypoints smoothly
  const pathD = `M 10 65 C 18 45, 20 35, 26 35 C 34 35, 38 55, 44 55 C 52 55, 54 25, 62 25 C 70 25, 74 48, 80 48 C 86 48, 90 25, 94 20`;

  return (
    <div className="relative w-full rounded-2xl bg-[#1F3A34] text-[#EFE9D8] p-6 lg:p-8 overflow-hidden shadow-sm border border-[#2A4D45]">
      {/* Topographic Background Contour Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 Q250,20 500,100 T1000,60"
          fill="none"
          stroke="#C9962C"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M0,140 Q280,60 520,160 T1000,120"
          fill="none"
          stroke="#EFE9D8"
          strokeWidth="0.8"
        />
        <path
          d="M0,210 Q320,120 600,240 T1000,180"
          fill="none"
          stroke="#C9962C"
          strokeWidth="0.8"
        />
        <path
          d="M0,280 Q350,180 650,320 T1000,240"
          fill="none"
          stroke="#EFE9D8"
          strokeWidth="0.6"
        />
        <path
          d="M0,350 Q400,250 700,380 T1000,300"
          fill="none"
          stroke="#2E6E8E"
          strokeWidth="0.8"
          strokeDasharray="6 8"
        />
      </svg>

      {/* Header Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#2A4D45] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#C9962C]/20 text-[#C9962C] border border-[#C9962C]/30 font-medium">
              <Compass className="w-3.5 h-3.5" />
              EXPEDITION ROUTE
            </span>
            <span className="text-xs text-[#EFE9D8]/70 font-mono">
              ELEVATION: MILESTONE 4 OF 6
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-display font-bold tracking-tight text-[#EFE9D8]">
            Placement Ascent Trail
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-[#162B26] px-4 py-2.5 rounded-xl border border-[#2A4D45]">
          <div className="text-right">
            <div className="text-xs text-[#EFE9D8]/60 font-mono">CURRENT READINESS</div>
            <div className="text-xl font-bold font-mono text-[#C9962C]">{readinessScore}%</div>
          </div>
          <div className="w-px h-8 bg-[#2A4D45]" />
          <div>
            <div className="text-xs text-[#EFE9D8]/60 font-mono">NEXT SUMMIT GATE</div>
            <div className="text-sm font-semibold text-[#EFE9D8]">Crucible Assessment</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Trail Stage */}
      <div className="relative w-full h-56 sm:h-64 my-2 select-none">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Base Trail Path Outline */}
          <path
            d={pathD}
            fill="none"
            stroke="#162B26"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Completed Segment of Trail */}
          <path
            d={pathD}
            fill="none"
            stroke="#C9962C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="100 100"
            strokeDashoffset={100 - readinessScore}
            className="transition-all duration-1000 ease-out"
          />

          {/* Glowing Trail Dashes */}
          <path
            d={pathD}
            fill="none"
            stroke="#EFE9D8"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            opacity="0.6"
          />
        </svg>

        {/* Waypoint Pins */}
        {waypoints.map((wp) => {
          const isCompleted = wp.status === 'completed';
          const isInProgress = wp.status === 'in-progress';
          const isSelected = selectedPin?.id === wp.id;

          // Color calculation
          let pinBg = '#4A5A63';
          let pinBorder = '#677A85';
          let textColor = '#EFE9D8';

          if (isCompleted) {
            if (wp.score >= 90) {
              pinBg = '#C9962C';
              pinBorder = '#F2B705';
              textColor = '#1A1D1B';
            } else {
              pinBg = '#2E6E8E';
              pinBorder = '#4A90B2';
              textColor = '#EFE9D8';
            }
          } else if (isInProgress) {
            pinBg = '#1F3A34';
            pinBorder = '#C9962C';
            textColor = '#C9962C';
          }

          return (
            <button
              key={wp.id}
              id={`waypoint-pin-${wp.id}`}
              onClick={() => {
                setSelectedPin(wp);
                if (onSelectWaypoint) onSelectWaypoint(wp);
              }}
              style={{
                left: `${wp.coordinate.x}%`,
                top: `${wp.coordinate.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute group z-20 flex flex-col items-center focus:outline-none transition-transform duration-200 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
              title={`${wp.title} (${wp.score}%)`}
            >
              {/* Pulse effect for in-progress pin */}
              {isInProgress && (
                <span className="absolute w-10 h-10 rounded-full bg-[#C9962C]/30 animate-ping pointer-events-none" />
              )}

              {/* Pin Disk */}
              <div
                style={{ backgroundColor: pinBg, borderColor: pinBorder }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center shadow-sm font-mono text-xs font-bold transition-shadow ${
                  isSelected ? 'ring-4 ring-[#C9962C]/50' : ''
                }`}
              >
                <span style={{ color: textColor }}>
                  {isCompleted ? (
                    <span className="text-[11px] font-bold">{wp.number}</span>
                  ) : isInProgress ? (
                    <Flame className="w-3.5 h-3.5 text-[#C9962C] animate-pulse" />
                  ) : (
                    <Lock className="w-3 h-3 text-[#EFE9D8]/50" />
                  )}
                </span>
              </div>

              {/* Waypoint Label */}
              <span
                className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border shadow-sm transition-colors ${
                  isSelected
                    ? 'bg-[#162B26] text-[#C9962C] border-[#C9962C] font-semibold'
                    : 'bg-[#1F3A34]/90 text-[#EFE9D8]/80 border-[#2A4D45] group-hover:text-[#EFE9D8]'
                }`}
              >
                {wp.title.split(' ')[0]} {wp.score > 0 ? `Â· ${wp.score}%` : ''}
              </span>
            </button>
          );
        })}

        {/* Candidate Avatar Marker Positioned by Overall Readiness % */}
        <div
          style={{
            left: `${avatarPos.x}%`,
            top: `${avatarPos.y}%`,
            transform: 'translate(-50%, -100%)',
          }}
          className="absolute z-30 pointer-events-none flex flex-col items-center transition-all duration-700 ease-out"
        >
          <div className="relative mb-1">
            <div className="px-2.5 py-1 rounded-md bg-[#C9962C] text-[#1A1D1B] font-mono text-[10px] font-bold shadow-sm flex items-center gap-1 border border-[#F2B705]">
              <MapPin className="w-3 h-3" />
              YOU ({readinessScore}%)
            </div>
            {/* Pointer arrow down */}
            <div className="w-2 h-2 bg-[#C9962C] rotate-45 mx-auto -mt-1" />
          </div>
          <div className="w-7 h-7 rounded-full bg-[#EFE9D8] border-2 border-[#C9962C] shadow-sm flex items-center justify-center font-bold text-xs text-[#1F3A34]">
            AS
          </div>
        </div>
      </div>

      {/* Selected Waypoint Drilldown Card */}
      {selectedPin && (
        <div className="relative z-10 mt-2 bg-[#162B26] rounded-xl p-4 border border-[#2A4D45] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#C9962C] uppercase tracking-wider font-semibold">
                Waypoint {selectedPin.number} Â· {selectedPin.category}
              </span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  selectedPin.status === 'completed'
                    ? 'bg-[#2E6E8E]/30 text-[#4A90B2]'
                    : selectedPin.status === 'in-progress'
                    ? 'bg-[#C9962C]/20 text-[#C9962C]'
                    : 'bg-[#4A5A63]/30 text-[#EFE9D8]/50'
                }`}
              >
                {selectedPin.status.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-display font-semibold text-[#EFE9D8]">
              {selectedPin.title}
            </h3>
            <p className="text-xs text-[#EFE9D8]/70 max-w-2xl">
              {selectedPin.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedPin.status === 'completed' && (
              <div className="text-right mr-2 hidden sm:block">
                <div className="text-[10px] text-[#EFE9D8]/60 font-mono">MODULE SCORE</div>
                <div className="text-base font-bold font-mono text-[#C9962C]">
                  {selectedPin.score}/100
                </div>
              </div>
            )}

            <button
              id={`launch-waypoint-${selectedPin.id}`}
              onClick={() => {
                if (selectedPin.number === 1 || selectedPin.number === 2) {
                  navigate('/coding');
                } else if (selectedPin.number === 3) {
                  navigate('/aptitude');
                } else if (selectedPin.number === 4) {
                  navigate('/resume');
                } else if (selectedPin.number === 5) {
                  navigate('/crucible/workflow');
                } else {
                  navigate('/interview');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C9962C] text-[#1A1D1B] font-medium text-xs hover:bg-[#B58422] transition-colors focus:ring-2 focus:ring-[#C9962C] focus:outline-none"
            >
              <span>{selectedPin.status === 'completed' ? 'Review Drills' : 'Enter Module'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

