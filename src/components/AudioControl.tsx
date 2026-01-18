import { useAudioIdentity } from '@/hooks/useAudioIdentity';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useState } from 'react';

const AudioControl = () => {
  const { isMuted, toggleMute, isLoading, currentTrack, volume, updateVolume, hasInteracted } = useAudioIdentity();
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      {/* Volume slider */}
      <div 
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-primary/90 backdrop-blur-md border border-accent/20
          transition-all duration-500 ease-out
          ${showVolume ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}
      >
        <input
          type="range"
          min="0"
          max="0.4"
          step="0.01"
          value={volume}
          onChange={(e) => updateVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-accent/30 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125"
        />
      </div>

      {/* Track info tooltip */}
      <div 
        className={`
          absolute bottom-full right-0 mb-3 px-4 py-2
          bg-primary/95 backdrop-blur-md rounded-lg
          border border-accent/20 shadow-xl
          transition-all duration-300 ease-out
          ${showVolume && currentTrack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
      >
        <p className="text-[10px] uppercase tracking-widest text-accent/60 mb-1">
          Identité Sonore
        </p>
        <p className="text-xs font-medium text-accent whitespace-nowrap">
          {currentTrack?.name || 'Aucune piste'}
        </p>
      </div>

      {/* Main control button */}
      <button
        onClick={toggleMute}
        className="group relative p-4 rounded-full bg-primary/90 backdrop-blur-md
          border border-accent/20 shadow-2xl
          hover:border-accent/40 hover:scale-105
          active:scale-95
          transition-all duration-300 ease-out"
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Ripple animation when playing */}
        {!isMuted && hasInteracted && !isLoading && (
          <>
            <div className="absolute inset-0 rounded-full border border-accent/30 animate-ping opacity-50" />
            <div className="absolute inset-[-4px] rounded-full border border-accent/20 animate-pulse" />
          </>
        )}

        {/* Icon */}
        <div className="relative z-10">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          ) : isMuted ? (
            <VolumeX className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-accent group-hover:text-accent/80 transition-colors" />
          )}
        </div>

        {/* Loading progress ring */}
        {isLoading && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent/30"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="75"
              className="text-accent animate-spin origin-center"
              style={{ animationDuration: '3s' }}
            />
          </svg>
        )}
      </button>

      {/* First interaction hint */}
      {!hasInteracted && (
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2
          bg-accent/95 text-primary text-xs font-medium
          rounded-lg shadow-xl animate-bounce">
          Cliquez pour activer l'audio
        </div>
      )}
    </div>
  );
};

export default AudioControl;
