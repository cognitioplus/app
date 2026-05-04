import React from 'react';
import { cn } from '@/lib/utils';

interface CognitioLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  invert?: boolean;
}

const sizeMap = {
  sm: { img: 'h-7 w-7', text: 'text-base' },
  md: { img: 'h-10 w-10', text: 'text-xl' },
  lg: { img: 'h-14 w-14', text: 'text-2xl' },
  xl: { img: 'h-20 w-20', text: 'text-3xl' },
};

const CognitioLogo: React.FC<CognitioLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className,
  invert = false,
}) => {
  const s = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src="https://appimize.app/assets/apps/user_1097/images/b2e254093bca_935_1097.png"
        alt="Cognitio+ Logo"
        className={cn(s.img, 'object-contain drop-shadow-sm')}
      />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display font-extrabold tracking-tight',
              s.text,
              invert ? 'text-white' : 'text-cognitio-ink'
            )}
          >
            Cognitio<span className="text-cognitio-gold">+</span>
          </span>
          {(size === 'lg' || size === 'xl') && (
            <span className={cn('text-[10px] font-body tracking-[0.2em] uppercase mt-0.5', invert ? 'text-white/70' : 'text-cognitio-primary/70')}>
              Mind · Culture · Care
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CognitioLogo;
