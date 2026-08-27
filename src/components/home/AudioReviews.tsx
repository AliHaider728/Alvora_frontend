"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { api } from "../../services/api";
import { AudioReview } from "../../types";
import { motion } from "framer-motion";

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
        setReviews(data);
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

  if (loading) return null;
  if (reviews.length === 0) return null; // Empty state hiding

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="alvora-container">
        <div className="mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-[#1A1A1A] text-center font-medium">
            Hear From Our Community
          </h2>
        </div>

        <audio 
          ref={audioRef} 
          onEnded={() => setPlayingId(null)} 
          className="hidden" 
        />

        <div className="flex overflow-x-auto gap-4 pb-8 pt-4 px-4 snap-x snap-mandatory hide-scrollbar -mx-4 md:mx-0">
          {reviews.map((r) => (
            <motion.div 
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[280px] snap-center bg-[#1A1A1A] rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#F1C9BD] font-medium text-lg uppercase">
                  {r.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{r.customerName}</p>
                  <p className="text-[#A1A7AA] text-xs">Verified Buyer</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => togglePlay(r.audioUrl, r.id)}
                  className="w-10 h-10 rounded-full bg-[#C48B80] text-white flex items-center justify-center hover:bg-[#A86249] transition-colors"
                >
                  {playingId === r.id ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Decorative static waveform */}
                <div className="flex items-center gap-1 mx-4 flex-1 h-6">
                  {[...Array(12)].map((_, i) => {
                    const isPlaying = playingId === r.id;
                    const h = isPlaying 
                      ? Math.max(3, Math.random() * 24)
                      : [4,8,12,16,12,20,14,10,22,12,8,4][i];
                    return (
                      <div 
                        key={i} 
                        className={`w-1 rounded-full transition-all duration-150 ${isPlaying ? 'bg-[#C48B80]' : 'bg-[#444]'}`}
                        style={{ height: `${h}px` }}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[#A1A7AA] text-xs font-medium">{r.duration}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#333] text-white">1x</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
