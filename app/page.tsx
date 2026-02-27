'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MonSVG = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" className="text-gray-300">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="5" fill="currentColor"/>
  </svg>
);

export default function Home() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  useEffect(() => {
    // Load player names from localStorage on component mount
    const savedPlayer1Name = localStorage.getItem('player1Name');
    const savedPlayer2Name = localStorage.getItem('player2Name');
    
    if (savedPlayer1Name) setPlayer1Name(savedPlayer1Name);
    if (savedPlayer2Name) setPlayer2Name(savedPlayer2Name);
  }, []);

  const handleStartAdventure = () => {
    // Save player names to localStorage
    localStorage.setItem('player1Name', player1Name || 'Samurai 1');
    localStorage.setItem('player2Name', player2Name || 'Samurai 2');
    // Navigate to story/1
  };

  // Create falling cherry blossom petals
  const petals = Array.from({ length: 10 }).map((_, i) => (
    <div 
      key={i}
      className="absolute text-pink-300 opacity-70 animate-fall"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        fontSize: `${Math.random() * 20 + 10}px`,
      }}
    >
      ❀
    </div>
  ));

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Cherry blossom petals */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 8s linear infinite;
        }
      `}</style>
      
      {petals}

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
        {/* Centered mon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <MonSVG />
        </motion.div>

        {/* Title with fade-in animation */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-center text-white mb-12"
        >
          Die Welt der Samurai
        </motion.h1>

        {/* Player name inputs */}
        <div className="w-full max-w-md space-y-6 mb-12">
          <div>
            <label htmlFor="player1" className="block text-gray-300 mb-2">Spieler 1 Name</label>
            <input
              type="text"
              id="player1"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Gib deinen Namen ein..."
            />
          </div>
          
          <div>
            <label htmlFor="player2" className="block text-gray-300 mb-2">Spieler 2 Name</label>
            <input
              type="text"
              id="player2"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Gib deinen Namen ein..."
            />
          </div>
        </div>

        {/* Start adventure button */}
        <Link href="/story/1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAdventure}
            className="px-12 py-4 bg-gradient-to-r from-yellow-700 to-yellow-800 text-white text-xl font-bold rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
          >
            Abenteuer beginnen
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
