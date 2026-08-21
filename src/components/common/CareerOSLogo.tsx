import React from 'react';

interface CareerOSLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  className?: string;
}

export const CareerOSLogo: React.FC<CareerOSLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  showTagline = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[7px]', gap: 'gap-1.5' },
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[9.5px]', gap: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[11px]', gap: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-[13px]', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  const isDarkBg = theme === 'dark';
  const careerColor = isDarkBg ? 'text-white' : 'text-[#14231E]';
  const osColor = 'text-[#2D6A4F]';
  const taglineColor = isDarkBg ? 'text-white/70' : 'text-[#52796F]';
  const dotColor = 'text-[#2D6A4F]';

  const IconImage = (
    <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center`}>
      <img
        src="/logo-transparent.png"
        alt="CareerOS Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {IconImage}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${currentSize.gap} ${className}`}>
        {IconImage}
        <div className="flex flex-col items-center">
          <div className={`font-bold tracking-tight font-sans ${currentSize.text} leading-tight`}>
            <span className={careerColor}>Career</span>
            <span className={osColor}>OS</span>
          </div>
          {showTagline && (
            <div
              className={`font-mono uppercase tracking-[0.25em] font-semibold ${currentSize.sub} ${taglineColor} mt-1 flex items-center justify-center gap-1.5`}
            >
              <span>LEARN</span>
              <span className={dotColor}>•</span>
              <span>BUILD</span>
              <span className={dotColor}>•</span>
              <span>PLACE</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (Default)
  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {IconImage}
      <div className="flex flex-col text-left">
        <div className={`font-bold tracking-tight font-sans ${currentSize.text} leading-none`}>
          <span className={careerColor}>Career</span>
          <span className={osColor}>OS</span>
        </div>
        {showTagline && (
          <div
            className={`font-mono uppercase tracking-[0.22em] font-semibold ${currentSize.sub} ${taglineColor} mt-1 flex items-center gap-1 leading-none`}
          >
            <span>LEARN</span>
            <span className={dotColor}>•</span>
            <span>BUILD</span>
            <span className={dotColor}>•</span>
            <span>PLACE</span>
          </div>
        )}
      </div>
    </div>
  );
};
