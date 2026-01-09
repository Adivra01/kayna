import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => Promise<boolean>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({ isFavorite, onToggle, size = 'md', className }: FavoriteButtonProps) {
  const [isActive, setIsActive] = useState(isFavorite);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setIsActive(isFavorite);
  }, [isFavorite]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return;
    setIsAnimating(true);

    // Optimistic update
    const willBeActive = !isActive;
    setIsActive(willBeActive);

    // Animate
    if (heartRef.current && buttonRef.current) {
      if (willBeActive) {
        // Adding animation - burst effect
        gsap.timeline()
          .to(heartRef.current, {
            scale: 0,
            duration: 0.1,
            ease: 'power2.in',
          })
          .to(heartRef.current, {
            scale: 1.4,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)',
          })
          .to(heartRef.current, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
          });

        // Create burst particles
        for (let i = 0; i < 6; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-2 h-2 rounded-full bg-accent';
          buttonRef.current.appendChild(particle);
          
          const angle = (i * 60) * (Math.PI / 180);
          gsap.fromTo(particle, 
            { x: 0, y: 0, scale: 1, opacity: 1 },
            {
              x: Math.cos(angle) * 30,
              y: Math.sin(angle) * 30,
              scale: 0,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => particle.remove(),
            }
          );
        }
      } else {
        // Removing animation - simple bounce
        gsap.to(heartRef.current, {
          scale: 0.8,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      }
    }

    // Call the toggle function
    const result = await onToggle();
    setIsActive(result);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn(
        'relative rounded-full flex items-center justify-center transition-all duration-300',
        'bg-secondary/90 backdrop-blur-sm hover:bg-secondary',
        sizeClasses[size],
        isActive && 'bg-accent/20 hover:bg-accent/30',
        className
      )}
      aria-label={isActive ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        ref={heartRef as any}
        className={cn(
          iconSizes[size],
          'transition-colors duration-300',
          isActive 
            ? 'fill-accent text-accent' 
            : 'text-primary hover:text-accent'
        )}
      />
    </button>
  );
}
