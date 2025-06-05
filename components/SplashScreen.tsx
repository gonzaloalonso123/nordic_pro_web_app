"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start fade-in animation after component mounts
    setIsAnimating(true);

  }, [onFinish]);


  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-700 to-slate-900 transition-opacity duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        // Ensure it covers the entire screen including safe areas
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/icon-192x192.png"
                alt="Nordic Pro"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white font-montserrat">
            Nordic Pro
          </h1>
          <p className="text-slate-300 text-lg font-inter">
            Keep Players In The Game
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex space-x-2 mt-8">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

