"use client";

import { useEffect, useRef, useState } from "react";

export function useReviewAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const active = useRef<string | null>(null);
  const request = useRef(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => () => {
    request.current++;
    audioRef.current?.pause();
  }, []);

  const fail = (message: string) => {
    audioRef.current?.pause();
    setPlayingId(null);
    setError(message);
  };

  const togglePlay = (url: string, id: string, speed = 1) => {
    const audio = audioRef.current;
    if (!audio) return;
    const attempt = ++request.current;
    if (active.current === id && !audio.paused) {
      audio.pause();
      setPlayingId(null);
      return;
    }
    setError("");
    setPlayingId(null);
    if (!url?.trim()) {
      fail("This voice review has no audio file. Please try another review.");
      return;
    }
    if (active.current !== id || audio.error || audio.getAttribute("src") !== url) {
      audio.pause();
      audio.src = url;
      setCurrentTime(0);
      setDuration(0);
    }
    active.current = id;
    // Run synchronously within the click gesture; never start muted playback.
    audio.muted = false;
    audio.volume = 1;
    audio.playbackRate = speed;
    void audio.play().catch((cause: DOMException) => {
      if (attempt !== request.current || cause.name === "AbortError") return;
      console.error("Voice review playback failed", { name: cause.name, message: cause.message });
      fail(cause.name === "NotAllowedError"
        ? "Your browser blocked audio. Allow sound for this site, then press play again."
        : "This voice review could not play. Please try another review or a different browser.");
    });
  };

  const audioProps = {
    ref: audioRef,
    preload: "none" as const,
    onPlaying: () => { setError(""); setPlayingId(active.current); },
    onPause: () => setPlayingId(null),
    onWaiting: () => setPlayingId(null),
    onEnded: () => { setPlayingId(null); setCurrentTime(0); },
    onTimeUpdate: () => setCurrentTime(audioRef.current?.currentTime || 0),
    onLoadedMetadata: () => setDuration(audioRef.current?.duration || 0),
    onError: () => {
      const mediaError = audioRef.current?.error;
      if (!mediaError) return;
      console.error("Voice review media error", { code: mediaError.code, message: mediaError.message });
      fail(mediaError.code === 2
        ? "The audio download failed. Check your connection and try again."
        : "This audio file is unavailable or unsupported by your browser. Please try another review.");
    },
  };

  return { audioRef, audioProps, playingId, currentTime, duration, error, togglePlay };
}
