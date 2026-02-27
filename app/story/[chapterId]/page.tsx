'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import AnimatedImage from '@/components/AnimatedImage';
import storyData from '@/data/story.json';

export default function ChapterPage() {
  const { chapterId } = useParams();
  const [words, setWords] = useState<string[]>([]);
  const [showQuizButton, setShowQuizButton] = useState(false);
  
  // Find the current chapter data
  const chapter = storyData.find(ch => ch.id === parseInt(chapterId as string));
  
  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">Kapitel nicht gefunden</h1>
          <Link href="/" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (chapter?.storyText) {
      // Split the story into words
      const textWords = chapter.storyText.split(/\s+/);
      setWords(textWords);
      
      // Show quiz button after animation completes
      const totalAnimationTime = textWords.length * 50; // 50ms per word
      
      const timer = setTimeout(() => {
        setShowQuizButton(true);
      }, totalAnimationTime);
      
      return () => clearTimeout(timer);
    }
  }, [chapter]);

  return (
    <div 
      className="min-h-screen bg-gradient-radial from-amber-900/20 via-gray-900 to-gray-900 pt-16 pb-24 px-4"
      style={{
        background: 'radial-gradient(circle, rgba(45,45,45,0.8) 0%, rgba(20,20,20,0.9) 100%)'
      }}
    >
      <ProgressBar currentChapter={chapter.id} />
      
      <div className="container mx-auto max-w-6xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Story text */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-800/30 h-full">
            <h1 className="text-2xl font-bold text-amber-400 mb-4">{chapter.title}</h1>
            <p className="text-gray-300 italic mb-4">{chapter.era}</p>
            
            <div className="prose prose-invert max-w-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${chapterId}-text`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg leading-relaxed text-gray-200"
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={`${chapterId}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: index * 0.05, // 50ms delay per word
                        duration: 0.1
                      }}
                      className="inline-block mr-1"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right column: Image */}
          <div className="h-full">
            <AnimatedImage 
              src={`/generated/chapter-${chapter.id}.jpg`} 
              alt={`Bild zum Kapitel ${chapter.title}`} 
            />
            
            {/* Quiz button - appears only after text animation completes */}
            <AnimatePresence>
              {showQuizButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 flex justify-end"
                >
                  <Link href={`/quiz/${chapterId}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-bold rounded-lg shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all"
                    >
                      Zum Quiz
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}