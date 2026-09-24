"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, User } from "lucide-react";
import { api, API_BASE_URL } from "../../services/api";
import { AudioReview } from "../../types";

export const AudioReviews: React.FC = () => {
  const [reviews, setReviews] = useState<AudioReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingCol, setPlayingCol] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/audio-reviews`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load audio reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const togglePlay = (url: string, id: string, colIndex: number) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setPlayingCol(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio playback interrupted or blocked:", error);
          });
        }
        setPlayingId(id);
        setPlayingCol(colIndex);
      }
    }
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatDuration = (val: any) => {
    if (!val) return '0:15';
    const str = String(val);
    if (str.includes(':')) return str;
    const sec = parseFloat(str);
    if (!isNaN(sec)) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
    return '0:15';
  };

  if (loading || reviews.length === 0) return null;

  const minItemsToFill = 15;
  const repeatCount = Math.ceil(minItemsToFill / Math.max(reviews.length, 1));
  const baseBlock = Array(repeatCount).fill(reviews).flat();

  const getColumnItems = (offset: number) => {
    const rotated = [...baseBlock.slice(offset), ...baseBlock.slice(0, offset)];
    return [...rotated, ...rotated]; 
  };
  
  const col1 = getColumnItems(0);
  const col2 = getColumnItems(1).reverse(); 
  const col3 = getColumnItems(2);
  const col4 = getColumnItems(3).reverse();

  const PlayerPill = ({ r, isPlaying, uniqueKey, colIndex }: { r: AudioReview, isPlaying: boolean, uniqueKey: string, colIndex: number }) => {

    return (
    <div key={uniqueKey} className="player-pill flex items-center gap-3 bg-[#1e272e] rounded-full p-2 pr-4 w-full shadow-sm flex-shrink-0 cursor-pointer hover:bg-[#2c3e50] transition-colors" onClick={() => togglePlay(r.audioUrl, r.id, colIndex)} >
      <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0 text-gray-500">
        <User className="w-5 h-5" />
      </div>
      <button className="text-gray-300 hover:text-white flex-shrink-0 transition-colors">
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>
      <div className="flex-1 flex flex-col justify-center h-full gap-0.5">
        <div className="flex items-center justify-between gap-[1px] sm:gap-[2px] w-full h-6 overflow-hidden pr-2">
          {[...Array(38)].map((_, i) => {
            const pattern = [3,6,9,12,8,14,10,6,12,8,4,3,3,6,9,12,8,14,10,6,12,8,4,3,6,10,14,8,12,6,4,3,6,9,12,8,4,3];
            const h = pattern[i % pattern.length];
            const delay = (i * 0.13) % 1.2;
            return (
              <div 
                key={i} 
                className={`flex-1 max-w-[2.5px] min-w-[1.5px] rounded-full ${isPlaying ? 'bg-[#0ea5e9] animate-audio-bar' : 'bg-gray-500 transition-all duration-300'}`}
                style={{ 
                  height: `${h}px`,
                  animationDelay: isPlaying ? `${delay}s` : '0s'
                }}
              />
            );
          })}
        </div>
        <span className="text-[10px] text-gray-400 font-medium truncate pr-2 mt-0.5">
          {isPlaying ? `${formatDuration(currentTime)} / ${formatDuration(r.duration)}` : formatDuration(r.duration)}
        </span>
      </div>
      <button onClick={cycleSpeed} className="w-7 h-7 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-colors">
        {playbackSpeed}x
      </button>
    </div>
    );
  };

  return (
    <section className="py-12 bg-[#FAF6F2] overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <style dangerouslySetInnerHTML={{__html: `
                @keyframes audio-bar-pulse {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-audio-bar {
          animation: audio-bar-pulse 0.8s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes scroll-down {
          0% { transform: translateY(calc(-50% - 12px)); }
          100% { transform: translateY(0); }
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 12px)); }
        }
        .animate-scroll-down {
          animation: scroll-down 6s linear infinite;
        }
                .animate-scroll-up {
          animation: scroll-up 6s linear infinite;
        }
        
        .is-paused {
          animation-play-state: paused !important;
        }
        .mask-vertical-fades {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}} />
      <div className="w-full">
        
        <div className="alvora-container">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A] text-center font-bold px-6">
              Hear From Our Community
            </h2>
            <p className="text-sm font-medium text-[#A1A7AA] mt-2">Listen to what our customers have to say</p>
          </div>
        </div>

        <audio 
          ref={audioRef} 
          onEnded={() => { setPlayingId(null); setPlayingCol(null); setCurrentTime(0); }} 
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          className="hidden" 
        />

        <div className="relative h-[220px] md:h-[240px] w-full overflow-hidden flex gap-4 lg:gap-8 justify-center mask-vertical-fades cursor-default px-4">
          
          <div className={`flex-1 flex flex-col gap-6 animate-scroll-down ${(playingCol === 1 || (isHovered && !playingId)) ? "is-paused" : ""}`}>
            {col1.map((r, i) => (
              <PlayerPill key={`col1-${r.id}-${i}`} r={r} isPlaying={playingId === r.id && playingCol === 1} uniqueKey={`c1-${i}`} colIndex={1} />
            ))}
          </div>

          <div className={`flex-1 hidden sm:flex flex-col gap-6 animate-scroll-up ${(playingCol === 2 || (isHovered && !playingId)) ? "is-paused" : ""}`}>
            {col2.map((r, i) => (
              <PlayerPill key={`col2-${r.id}-${i}`} r={r} isPlaying={playingId === r.id && playingCol === 2} uniqueKey={`c2-${i}`} colIndex={2} />
            ))}
          </div>

          <div className={`flex-1 hidden md:flex flex-col gap-6 animate-scroll-down ${(playingCol === 3 || (isHovered && !playingId)) ? "is-paused" : ""}`}>
            {col3.map((r, i) => (
              <PlayerPill key={`col3-${r.id}-${i}`} r={r} isPlaying={playingId === r.id && playingCol === 3} uniqueKey={`c3-${i}`} colIndex={3} />
            ))}
          </div>

          <div className={`flex-1 hidden lg:flex flex-col gap-6 animate-scroll-up ${(playingCol === 4 || (isHovered && !playingId)) ? "is-paused" : ""}`}>
            {col4.map((r, i) => (
              <PlayerPill key={`col4-${r.id}-${i}`} r={r} isPlaying={playingId === r.id && playingCol === 4} uniqueKey={`c4-${i}`} colIndex={4} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};