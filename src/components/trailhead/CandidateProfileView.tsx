import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CandidateProfile, SkillScore } from '../../types';
import {
  User,
  ShieldCheck,
  Target,
  Award,
  BookOpen,
  Building,
  Flame,
  Compass,
  CheckCircle2,
  Edit2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react';

export const CandidateProfileView: React.FC = () => {
  const { profile, setProfile, track, setIsSkillGraphOpen, showToast } = useApp();
  const isCrucible = track === 'crucible';

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile.name,
    avatar: profile.avatar,
    phone: profile.phone || '',
    location: profile.location || '',
    college: profile.college,
    degree: profile.degree || '',
    department: profile.branch, // Map branch to department
    gradYear: profile.batch, // Map batch to gradYear
    cgpa: String(profile.cgpa || ''),
    bio: profile.bio || '',
    github: profile.github || '',
    linkedin: profile.linkedin || '',
    portfolio: profile.portfolio || '',
    targetRole: profile.targetRoles[0] || '',
    weaknesses: profile.weaknesses?.join(', ') || '',
    strongLanguages: profile.strongLanguages?.join(', ') || '',
    strongFrameworks: profile.strongFrameworks?.join(', ') || '',
  });

  // Check completion
  const completionFields = [
    { key: 'name', label: 'Full Name', val: profile.name },
    { key: 'avatar', label: 'Profile Photo', val: profile.avatar },
    { key: 'phone', label: 'Phone Number', val: profile.phone },
    { key: 'location', label: 'Location', val: profile.location },
    { key: 'college', label: 'College', val: profile.college },
    { key: 'degree', label: 'Degree', val: profile.degree },
    { key: 'department', label: 'Department', val: profile.branch },
    { key: 'gradYear', label: 'Graduation Year', val: profile.batch },
    { key: 'cgpa', label: 'CGPA', val: profile.cgpa ? String(profile.cgpa) : '' },
    { key: 'bio', label: 'Bio', val: profile.bio },
    { key: 'targetRole', label: 'Target Role', val: profile.targetRoles[0] },
    { key: 'github', label: 'GitHub Profile', val: profile.github },
    { key: 'linkedin', label: 'LinkedIn Profile', val: profile.linkedin },
    { key: 'portfolio', label: 'Portfolio/Website', val: profile.portfolio },
  ];

  const completedCount = completionFields.filter(f => f.val && f.val.length > 0).length;
  const completionPercentage = Math.round((completedCount / completionFields.length) * 100);
  const missingFields = completionFields.filter(f => !f.val || f.val.length === 0);

  const buildUpdatedProfile = (prev: CandidateProfile): CandidateProfile => {
    const strongLanguages = formData.strongLanguages.split(',').map(s => s.trim()).filter(Boolean);
    const strongFrameworks = formData.strongFrameworks.split(',').map(s => s.trim()).filter(Boolean);
    const weaknesses = formData.weaknesses.split(',').map(s => s.trim()).filter(Boolean);
    const updatedBase: CandidateProfile = {
      ...prev,
      name: formData.name,
      avatar: formData.avatar,
      phone: formData.phone,
      location: formData.location,
      college: formData.college,
      degree: formData.degree,
      branch: formData.department,
      batch: formData.gradYear,
      cgpa: Math.max(0, Math.min(10, Number(formData.cgpa) || 0)),
      bio: formData.bio,
      github: formData.github,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      targetRoles: formData.targetRole ? [formData.targetRole] : prev.targetRoles,
      weaknesses,
      strongLanguages,
      strongFrameworks,
    };

    const nextFields = [
      updatedBase.name,
      updatedBase.avatar,
      updatedBase.phone,
      updatedBase.location,
      updatedBase.college,
      updatedBase.degree,
      updatedBase.branch,
      updatedBase.batch,
      updatedBase.cgpa ? String(updatedBase.cgpa) : '',
      updatedBase.bio,
      updatedBase.targetRoles[0],
      updatedBase.github,
      updatedBase.linkedin,
      updatedBase.portfolio,
    ];
    const nextCompletion = Math.round((nextFields.filter(Boolean).length / nextFields.length) * 100);
    const communicationScore = Math.min(88, 30 + Math.round(nextCompletion * 0.45));
    const projectsScore = Math.min(86, 24 + Math.round(nextCompletion * 0.35) + (updatedBase.github ? 6 : 0) + (updatedBase.portfolio ? 6 : 0));
    const systemDesignScore = Math.min(82, 28 + strongFrameworks.length * 6 + (updatedBase.targetRoles[0] ? 8 : 0));
    const algorithmsScore = Math.min(80, 30 + strongLanguages.length * 5);
    const aptitudeScore = Math.min(82, 34 + (updatedBase.college ? 8 : 0) + (updatedBase.batch ? 6 : 0) + (updatedBase.cgpa ? Math.round(updatedBase.cgpa * 2) : 0));

    const graphUpdates: SkillScore[] = [
      { name: 'Profile Completeness', category: 'Communication', score: communicationScore, target: 75, level: communicationScore >= 75 ? 'Proficient' : 'Competent' },
      { name: 'Portfolio Evidence', category: 'Projects', score: projectsScore, target: 72, level: projectsScore >= 72 ? 'Proficient' : 'Competent' },
      { name: 'Framework Confidence', category: 'System Design', score: systemDesignScore, target: 70, level: systemDesignScore >= 70 ? 'Proficient' : 'Competent' },
      { name: 'Language Foundation', category: 'Algorithms', score: algorithmsScore, target: 70, level: algorithmsScore >= 70 ? 'Proficient' : 'Competent' },
      { name: 'Academic Baseline', category: 'Aptitude', score: aptitudeScore, target: 68, level: aptitudeScore >= 68 ? 'Proficient' : 'Competent' },
    ];

    const nextSkills = [...(prev.skills || [])];
    graphUpdates.forEach((skill) => {
      const index = nextSkills.findIndex((existing) => existing.name === skill.name);
      if (index >= 0) nextSkills[index] = skill;
      else nextSkills.push(skill);
    });

    const readinessFromProfile = Math.round(
      graphUpdates.reduce((sum, skill) => sum + skill.score, 0) / graphUpdates.length
    );
    const nextReadiness = Math.max(prev.readinessScore, Math.min(92, Math.round(readinessFromProfile * 0.85)));

    return {
      ...updatedBase,
      skills: nextSkills,
      readinessScore: nextReadiness,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      setProfile(prev => buildUpdatedProfile(prev));
      setIsSaving(false);
      setIsEditing(false);
      showToast('Profile updated. Skill graph recalibrated slightly.');
    }, 1200);
  };

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm font-sans focus:outline-none focus:border-current/50 transition-colors ${
    isCrucible ? 'bg-[#161311] border-[#4A5A63]/70 text-[#EFE9D8]' : 'bg-white border-[#DCD4C0] text-[#1A1D1B]'
  }`;

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 transition-colors ${
        isCrucible
          ? 'crucible-theme bg-[#211D1B] text-[#EFE9D8]'
          : 'bg-[#EFE9D8] text-[#1A1D1B]'
      }`}
    >
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                isCrucible
                  ? 'bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30'
                  : 'bg-[#1F3A34] text-[#C9962C]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              VERIFIED CANDIDATE IDENTITY
            </span>
            <span className="text-xs font-mono opacity-60">ID: {profile.id}</span>
          </div>
          <h1 className="text-3xl font-display font-bold">
            {isEditing ? 'Edit Profile' : profile.name}
          </h1>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSkillGraphOpen(true)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors shadow-sm flex items-center gap-2 ${
                isCrucible
                  ? 'bg-[#161311] text-[#E8622C] hover:bg-white/5 border border-[#4A5A63]/70'
                  : 'bg-white text-[#1F3A34] hover:bg-white/50 border border-[#DCD4C0]'
              }`}
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Skill Graph</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors shadow-sm flex items-center gap-2 ${
                isCrucible
                  ? 'bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705]'
                  : 'bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26]'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Completion Widget (Only show if not 100% and not editing) */}
        {!isEditing && completionPercentage < 100 && (
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-6 ${isCrucible ? 'bg-[#161311] border-[#4A5A63]/70' : 'bg-[#FAF8F2] border-[#C9962C]/40 shadow-sm'}`}>
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-current opacity-20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className={isCrucible ? 'text-[#E8622C]' : 'text-[#C9962C]'} strokeDasharray={`${completionPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <span className="absolute text-sm font-bold font-mono">{completionPercentage}%</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-lg mb-1 flex items-center justify-center sm:justify-start gap-2">
                Profile Incomplete <AlertCircle className={`w-4 h-4 ${isCrucible ? 'text-[#F2B705]' : 'text-amber-600'}`} />
              </h3>
              <p className="text-sm opacity-70 mb-2">You are missing {missingFields.length} fields. Complete your profile to unlock full placement opportunities.</p>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {missingFields.map(f => (
                  <span key={f.key} className="text-[10px] font-mono px-2 py-0.5 rounded border border-current/20 opacity-80">{f.label}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-colors shadow-sm ${isCrucible ? 'bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705]' : 'bg-[#C9962C] text-[#1F3A34] hover:bg-[#B58422]'}`}
            >
              Complete Now
            </button>
          </div>
        )}

        {isEditing ? (
          /* Editor Form */
          <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${isCrucible ? 'bg-[#161311] border-[#4A5A63]/70' : 'bg-[#FAF8F2] border-[#DCD4C0] shadow-sm'}`}>
            <div className="grid sm:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h3 className="font-bold border-b border-current/10 pb-2 mb-4">Basic Details</h3>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-mono opacity-70 mb-1">Avatar Initials</label><input type="text" name="avatar" maxLength={2} value={formData.avatar} onChange={handleInputChange} className={inputClass} /></div>
                  <div><label className="block text-xs font-mono opacity-70 mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} /></div>
                </div>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className={inputClass} /></div>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Professional Bio</label><textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className={inputClass}></textarea></div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b border-current/10 pb-2 mb-4">Academic & Career</h3>
                <div><label className="block text-xs font-mono opacity-70 mb-1">College/University</label><input type="text" name="college" value={formData.college} onChange={handleInputChange} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-mono opacity-70 mb-1">Degree</label><input type="text" name="degree" value={formData.degree} onChange={handleInputChange} className={inputClass} /></div>
                  <div><label className="block text-xs font-mono opacity-70 mb-1">Department</label><input type="text" name="department" value={formData.department} onChange={handleInputChange} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-mono opacity-70 mb-1">Graduation Year</label><input type="text" name="gradYear" value={formData.gradYear} onChange={handleInputChange} className={inputClass} /></div>
                  <div><label className="block text-xs font-mono opacity-70 mb-1">CGPA</label><input type="number" name="cgpa" min="0" max="10" step="0.01" value={formData.cgpa} onChange={handleInputChange} className={inputClass} placeholder="8.50" /></div>
                </div>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Target Role</label><input type="text" name="targetRole" value={formData.targetRole} onChange={handleInputChange} className={inputClass} /></div>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Weaknesses (comma separated)</label><input type="text" name="weaknesses" value={formData.weaknesses} onChange={handleInputChange} className={inputClass} /></div>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Strong Languages (comma separated)</label><input type="text" name="strongLanguages" value={formData.strongLanguages} onChange={handleInputChange} className={inputClass} /></div>
                <div><label className="block text-xs font-mono opacity-70 mb-1">Strong Frameworks (comma separated)</label><input type="text" name="strongFrameworks" value={formData.strongFrameworks} onChange={handleInputChange} className={inputClass} /></div>
              </div>

              <div className="sm:col-span-2 space-y-4">
                <h3 className="font-bold border-b border-current/10 pb-2 mb-4">Links & Social</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-mono opacity-70 mb-1">GitHub URL</label><input type="text" name="github" value={formData.github} onChange={handleInputChange} className={inputClass} placeholder="github.com/..." /></div>
                  <div><label className="block text-xs font-mono opacity-70 mb-1">LinkedIn URL</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className={inputClass} placeholder="linkedin.com/in/..." /></div>
                  <div><label className="block text-xs font-mono opacity-70 mb-1">Portfolio URL</label><input type="text" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className={inputClass} placeholder="yourwebsite.com" /></div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-current/10 mt-6">
              <button onClick={() => setIsEditing(false)} disabled={isSaving} className="px-5 py-2 rounded-xl text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${isCrucible ? 'bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705]' : 'bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26]'}`}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className={`p-6 rounded-2xl border space-y-6 ${isCrucible ? 'bg-[#161311] border-[#4A5A63]/70' : 'bg-[#FAF8F2] border-[#DCD4C0] shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-sm border ${isCrucible ? 'bg-[#211D1B] text-[#E8622C] border-[#E8622C]/40' : 'bg-[#1F3A34] text-[#C9962C] border-[#2A4D45]'}`}>
                  {profile.avatar}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">{profile.name}</h3>
                  <p className="text-xs font-mono opacity-70">{profile.email}</p>
                </div>
              </div>
              
              {profile.bio && <p className="text-sm opacity-80 leading-relaxed italic border-l-2 border-current/20 pl-3">{profile.bio}</p>}

              <div className="space-y-3 pt-4 border-t border-current/10">
                {profile.phone && <div className="flex items-center gap-3 text-sm opacity-80"><Phone className="w-4 h-4 opacity-50" /> {profile.phone}</div>}
                {profile.location && <div className="flex items-center gap-3 text-sm opacity-80"><MapPin className="w-4 h-4 opacity-50" /> {profile.location}</div>}
                {profile.github && <div className="flex items-center gap-3 text-sm opacity-80"><Github className="w-4 h-4 opacity-50" /> {profile.github}</div>}
                {profile.linkedin && <div className="flex items-center gap-3 text-sm opacity-80"><Linkedin className="w-4 h-4 opacity-50" /> {profile.linkedin}</div>}
                {profile.portfolio && <div className="flex items-center gap-3 text-sm opacity-80"><LinkIcon className="w-4 h-4 opacity-50" /> {profile.portfolio}</div>}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              
              <div className={`p-6 rounded-2xl border space-y-6 ${isCrucible ? 'bg-[#161311] border-[#4A5A63]/70' : 'bg-[#FAF8F2] border-[#DCD4C0] shadow-sm'}`}>
                <h3 className="font-display font-bold text-lg mb-2 border-b border-current/10 pb-2">Academic Overview</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-sm"><span className="opacity-60 text-xs font-mono block">COLLEGE</span><span className="font-semibold">{profile.college}</span></div>
                  <div className="space-y-1 text-sm"><span className="opacity-60 text-xs font-mono block">DEGREE & DEPT</span><span className="font-semibold">{profile.degree ? `${profile.degree}, ` : ''}{profile.branch}</span></div>
                  <div className="space-y-1 text-sm"><span className="opacity-60 text-xs font-mono block">GRADUATION</span><span className="font-semibold">{profile.batch}</span></div>
                  <div className="space-y-1 text-sm"><span className="opacity-60 text-xs font-mono block">CGPA</span><span className="font-semibold">{profile.cgpa} / 10.0</span></div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border space-y-6 ${isCrucible ? 'bg-[#161311] border-[#4A5A63]/70' : 'bg-[#FAF8F2] border-[#DCD4C0] shadow-sm'}`}>
                <div className="flex items-center justify-between border-b border-current/10 pb-3">
                  <span className="text-xs font-mono font-bold uppercase">PLACEMENT READINESS</span>
                  <span className={`text-2xl font-mono font-bold ${isCrucible ? 'text-[#E8622C]' : 'text-[#1F3A34]'}`}>{profile.readinessScore}%</span>
                </div>
                
                <div className="space-y-3">
                  <span className="text-xs font-mono opacity-70 uppercase block">TARGET ROLES</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.targetRoles.map(r => (
                      <span key={r} className={`text-xs font-mono px-3 py-1 rounded-lg border font-medium ${isCrucible ? 'bg-[#211D1B] border-[#4A5A63] text-[#F2B705]' : 'bg-[#EFE9D8] border-[#DCD4C0] text-[#1F3A34]'}`}>{r}</span>
                    ))}
                  </div>
                </div>
                
                {(profile.weaknesses?.length > 0 || profile.strongLanguages?.length > 0 || profile.strongFrameworks?.length > 0) && (
                  <div className="space-y-4 pt-4 border-t border-current/10">
                    {profile.weaknesses?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono opacity-70 uppercase block">WEAKNESSES</span>
                        <div className="flex flex-wrap gap-2">
                          {profile.weaknesses.map(r => (
                            <span key={r} className={`text-xs font-mono px-2 py-0.5 rounded border ${isCrucible ? 'bg-[#211D1B] border-[#E8622C]/30 text-[#E8622C]' : 'bg-[#FAF8F2] border-[#DCD4C0] text-[#1A1D1B]'}`}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.strongLanguages?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono opacity-70 uppercase block">STRONG LANGUAGES</span>
                        <div className="flex flex-wrap gap-2">
                          {profile.strongLanguages.map(r => (
                            <span key={r} className={`text-xs font-mono px-2 py-0.5 rounded border ${isCrucible ? 'bg-[#211D1B] border-[#4A5A63] text-[#EFE9D8]' : 'bg-[#FAF8F2] border-[#DCD4C0] text-[#1F3A34]'}`}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.strongFrameworks?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-mono opacity-70 uppercase block">STRONG FRAMEWORKS</span>
                        <div className="flex flex-wrap gap-2">
                          {profile.strongFrameworks.map(r => (
                            <span key={r} className={`text-xs font-mono px-2 py-0.5 rounded border ${isCrucible ? 'bg-[#211D1B] border-[#4A5A63] text-[#EFE9D8]' : 'bg-[#FAF8F2] border-[#DCD4C0] text-[#1F3A34]'}`}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-xs font-mono opacity-70 uppercase block">VERIFIED BADGES</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.crucibleBadges.map(badge => (
                      <span key={badge} className="text-xs font-mono px-3 py-1 rounded-full bg-[#E8622C]/15 text-[#E8622C] border border-[#E8622C]/30 flex items-center gap-1.5 font-semibold">
                        <Flame className="w-3.5 h-3.5" />{badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
