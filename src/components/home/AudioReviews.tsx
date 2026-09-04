"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
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

  if (loading || reviews.length === 0) return null;

  // Duplicate reviews enough times to ensure the container height is exceeded 
  // for a smooth infinite scroll (at least 20 items per column)
  const baseRepeated = Array(15).fill(reviews).flat();
  
  // Prepare 4 columns with slight variations in order
  const col1 = [...baseRepeated];
  const col2 = [...baseRepeated].reverse();
  const col3 = [...baseRepeated.slice(2), ...baseRepeated.slice(0, 2)];
  const col4 = [...baseRepeated].reverse().slice(1).concat([...baseRepeated].reverse().slice(0, 1));

  const PlayerPill = ({ r, isPlaying, uniqueKey }: { r: AudioReview, isPlaying: boolean, uniqueKey: string }) => (
    <div key={uniqueKey} className="flex items-center gap-3 bg-[#1A1A1A] rounded-full p-2 pr-4 w-full shadow-sm flex-shrink-0 cursor-pointer hover:bg-[#2A2A2A] transition-colors" onClick={() => togglePlay(r.audioUrl, r.id)}>
      <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0 text-[#F1C9BD] font-medium text-lg uppercase">
        {r.customerName.charAt(0)}
      </div>
      <button className="w-8 h-8 rounded-full bg-[#C48B80] text-white flex items-center justify-center hover:bg-[#A86249] transition-colors flex-shrink-0">
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>
      <div className="flex-1 flex flex-col justify-center h-full gap-0.5 mx-1">
        <div className="flex items-center gap-[2px] h-4 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            const h = isPlaying 
              ? Math.max(2, Math.random() * 12)
              : [3,6,9,12,8,14,10,6,12,8,4,3,3,6,9,12,8,14,10,6][i];
            return (
              <div 
                key={i} 
                className={`w-[2px] rounded-full transition-all duration-150 ${isPlaying ? 'bg-[#F1C9BD]' : 'bg-[#444]'}`}
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>
        <span className="text-[10px] text-[#A1A7AA] font-medium truncate" title={r.customerName}>
          {r.customerName} • {r.duration || '0:15'}
        </span>
      </div>
      <button className="w-7 h-7 rounded-full bg-[#333] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
        1x
      </button>
    </div>
  );

  return (
    <section className="py-16 bg-[#FAF6F2] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-down {
          animation: scroll-down 45s linear infinite;
        }
        .animate-scroll-up {
          animation: scroll-up 45s linear infinite;
        }
        .group:hover .animate-scroll-down,
        .group:hover .animate-scroll-up {
          animation-play-state: paused;
        }
        .mask-vertical-fades {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
      `}} />
      <div className="w-full">
        
        <div className="alvora-container">
          <div className="flex flex-col items-center justify-center mb-12">
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

        {/* 4 Column Vertical Masonry Layout - Edge to Edge */}
        <div className="relative h-[650px] w-full overflow-hidden flex gap-4 lg:gap-6 justify-center mask-vertical-fades group cursor-default px-4">
          
          {/* Column 1 - Top to Bottom (Down) */}
          <div className="flex-1 flex flex-col gap-4 animate-scroll-down">
            {col1.map((r, i) => (
              <PlayerPill key={`col1-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c1-${i}`} />
            ))}
          </div>

          {/* Column 2 - Bottom to Top (Up) */}
          <div className="flex-1 hidden sm:flex flex-col gap-4 animate-scroll-up">
            {col2.map((r, i) => (
              <PlayerPill key={`col2-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c2-${i}`} />
            ))}
          </div>

          {/* Column 3 - Top to Bottom (Down) */}
          <div className="flex-1 hidden md:flex flex-col gap-4 animate-scroll-down">
            {col3.map((r, i) => (
              <PlayerPill key={`col3-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c3-${i}`} />
            ))}
          </div>

          {/* Column 4 - Bottom to Top (Up) */}
          <div className="flex-1 hidden lg:flex flex-col gap-4 animate-scroll-up">
            {col4.map((r, i) => (
              <PlayerPill key={`col4-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} uniqueKey={`c4-${i}`} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
