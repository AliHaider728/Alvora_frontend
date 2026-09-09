"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, User } from "lucide-react";
import { api, API_BASE_URL } from "../../services/api";
import { AudioReview } from "../../types";

export const AudioReviews: React.FC = () => {
  const [reviews, setReviews] = useState<AudioReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
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

  const togglePlay = (url: string, id: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingId(id);
      }
    }
  };

  const formatDuration = (val: any) => {
    if (!val) return '0:15';
    const str = String(val);
    if (str.includes(':')) return str;
    const sec = parseInt(str, 10);
    if (!isNaN(sec)) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
    return '0:15';
  };

  if (loading || reviews.length === 0) return null;

  // Guarantee enough items to overflow the new smaller container height safely.
  // 15 items ensures the array is ~1200px tall. The half-shift is 600px, which safely clears the 240px wrapper.
  const minItemsToFill = 15;
  const repeatCount = Math.ceil(minItemsToFill / Math.max(reviews.length, 1));
  const baseBlock = Array(repeatCount).fill(reviews).flat();

  const getColumnItems = (offset: number) => {
    const rotated = [...baseBlock.slice(offset), ...baseBlock.slice(0, offset)];
    return [...rotated, ...rotated]; // Exactly duplicated once for seamless scroll
  };
  
  const col1 = getColumnItems(0);
  const col2 = getColumnItems(1).reverse(); 
  const col3 = getColumnItems(2);
  const col4 = getColumnItems(3).reverse();

  const PlayerPill = ({ r, isPlaying, uniqueKey }: { r: AudioReview, isPlaying: boolean, uniqueKey: string }) => (
    <div key={uniqueKey} className="player-pill flex items-center gap-3 bg-[#1e272e] rounded-full p-2 pr-4 w-full shadow-sm flex-shrink-0 cursor-pointer hover:bg-[#2c3e50] transition-colors" onClick={() => togglePlay(r.audioUrl, r.id)}>
      <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0 text-gray-500">
        <User className="w-5 h-5" />
      </div>
      <button className="text-gray-300 hover:text-white flex-shrink-0 transition-colors">
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>
      <div className="flex-1 flex flex-col justify-center h-full gap-0.5">
        <div className="flex items-center gap-[2px] h-4 overflow-hidden opacity-60">
          {[...Array(24)].map((_, i) => {
            const h = isPlaying 
              ? Math.max(2, Math.random() * 12)
              : [3,6,9,12,8,14,10,6,12,8,4,3,3,6,9,12,8,14,10,6,12,8,4,3][i];
            return (
              <div 
                key={i} 
                className="w-[2px] rounded-full bg-white transition-all duration-150"
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>
        <span className="text-[10px] text-gray-400 font-medium truncate pr-2">
          {formatDuration(r.duration)}
        </span>
      </div>
      <button className="w-7 h-7 rounded-full bg-[#0ea5e9] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
        1x
      </button>
    </div>
  );

  return (
    <section className="py-12 bg-[#FAF6F2] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-down {
          0% { transform: translateY(calc(-50% - 12px)); }
          100% { transform: translateY(0); }
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 12px)); }
        }
        .animate-scroll-down {
          animation: scroll-down 20s linear infinite;
        }
        .animate-scroll-up {
          animation: scroll-up 20s linear infinite;
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
          onEnded={() => setPlayingId(null)} 
          className="hidden" 
        />

        {/* Reverted to Edge-to-Edge 4 Column Masonry Layout - Adjusted height to fit ~3 items */}
        <div className="relative h-[220px] md:h-[240px] w-full overflow-hidden flex gap-4 lg:gap-8 justify-center mask-vertical-fades group cursor-default px-4">
          
          {/* Column 1 - Top to Bottom (Down) */}
          <div className="flex-1 flex flex-col gap-6 animate-scroll-down">
            {col1.map((r, i) => (
              <PlayerPill key={`col1-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c1-${i}`} />
            ))}
          </div>

          {/* Column 2 - Bottom to Top (Up) */}
          <div className="flex-1 hidden sm:flex flex-col gap-6 animate-scroll-up">
            {col2.map((r, i) => (
              <PlayerPill key={`col2-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c2-${i}`} />
            ))}
          </div>

          {/* Column 3 - Top to Bottom (Down) */}
          <div className="flex-1 hidden md:flex flex-col gap-6 animate-scroll-down">
            {col3.map((r, i) => (
              <PlayerPill key={`col3-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c3-${i}`} />
            ))}
          </div>

          {/* Column 4 - Bottom to Top (Up) */}
          <div className="flex-1 hidden lg:flex flex-col gap-6 animate-scroll-up">
            {col4.map((r, i) => (
              <PlayerPill key={`col4-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c4-${i}`} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};