'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export function ProjectVideoPlayer({ src, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const syncPlayingState = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setIsPlaying(!video.paused && !video.ended);
  }, []);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused || video.ended) {
        await video.play();
      } else {
        video.pause();
      }
    } catch {
      // noop
    } finally {
      syncPlayingState();
    }
  }, [syncPlayingState]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    syncPlayingState();

    video.addEventListener('play', syncPlayingState);
    video.addEventListener('pause', syncPlayingState);
    video.addEventListener('ended', syncPlayingState);

    return () => {
      video.removeEventListener('play', syncPlayingState);
      video.removeEventListener('pause', syncPlayingState);
      video.removeEventListener('ended', syncPlayingState);
    };
  }, [syncPlayingState]);

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        preload="metadata"
        playsInline
        poster={poster}
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-orange/90 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition hover:bg-brand-orange"
      >
        {isPlaying ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
