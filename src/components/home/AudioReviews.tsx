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

  if (loading || reviews.length === 0) return null;

  // Split reviews into two arrays for two rows if there are enough, otherwise duplicate
  const row1 = [...reviews, ...reviews, ...reviews].slice(0, Math.max(6, reviews.length * 2));
  const row2 = [...reviews].reverse();
  const row2Duplicated = [...row2, ...row2, ...row2].slice(0, Math.max(6, reviews.length * 2));

  const PlayerPill = ({ r, isPlaying }: { r: AudioReview, isPlaying: boolean }) => (
    <div className="flex items-center gap-3 bg-[#1e272e] rounded-full p-2 pr-4 w-[320px] shadow-sm flex-shrink-0 cursor-pointer hover:bg-[#2c3e50] transition-colors" onClick={() => togglePlay(r.audioUrl, r.id)}>
      <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0 text-gray-500">
        <User className="w-5 h-5" />
      </div>
      <button className="text-gray-300 hover:text-white flex-shrink-0">
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
        <span className="text-[9px] text-gray-400 font-medium">{r.duration || '0:15'}</span>
      </div>
      <button className="w-7 h-7 rounded-full bg-[#0ea5e9] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
        1x
      </button>
    </div>
  );

  return (
    <section className="py-12 bg-white overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
        .group:hover .animate-marquee,
        .group:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}} />
      <div className="alvora-container">
        
        <div className="flex items-center justify-center mb-10">
          <div className="h-[1px] bg-gray-300 flex-1 max-w-[200px]"></div>
          <h2 className="font-display text-xl md:text-2xl text-[#1A1A1A] text-center font-bold px-6">
            User Audio Reviews
          </h2>
          <div className="h-[1px] bg-gray-300 flex-1 max-w-[200px]"></div>
        </div>

        <audio 
          ref={audioRef} 
          onEnded={() => setPlayingId(null)} 
          className="hidden" 
        />

        <div className="flex flex-col gap-4 group cursor-default">
          {/* Row 1 - Left */}
          <div className="w-[200%] sm:w-max flex animate-marquee gap-4">
            {row1.map((r, i) => (
              <PlayerPill key={`r1-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} />
            ))}
          </div>

          {/* Row 2 - Right */}
          <div className="w-[200%] sm:w-max flex animate-marquee-reverse gap-4">
            {row2Duplicated.map((r, i) => (
              <PlayerPill key={`r2-${r.id}-${i}`} r={r} isPlaying={playingId === r.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
