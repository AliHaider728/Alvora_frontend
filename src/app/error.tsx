"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#FAF6F2] p-4 text-center font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#EDE5DC] max-w-md w-full">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-3">Something went wrong</h2>
        <p className="text-[#1A1A1A]/70 mb-8">We couldn't connect to the server. Please try again.</p>
        <button
          onClick={() => reset()}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-[#D4784F] to-[#9C4122] text-white rounded-xl font-medium tracking-wide hover:shadow-lg transition-all active:scale-[0.98]"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}
