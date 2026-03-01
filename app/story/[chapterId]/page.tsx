'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import storyData from '@/data/story.json';

export default function ChapterPage() {
  const { chapterId } = useParams();
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [showQuizButton, setShowQuizButton] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  const chapter = storyData.find(ch => ch.id === parseInt(chapterId as string));

  useEffect(() => {
    if (chapter?.storyText) {
      setParagraphs(chapter.storyText.split('\n\n'));
      setShowQuizButton(false);

      const timer = setTimeout(() => {
        setShowQuizButton(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [chapter]);

  useEffect(() => {
    if (!chapter?.id) return;

    setImageData(null);
    setImageLoading(true);

    const fetchImage = async (retry = false) => {
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: chapter.imagePrompt, width: 768, height: 512 }),
        });

        if (response.status === 503 && !retry) {
          await new Promise(resolve => setTimeout(resolve, 30000));
          return fetchImage(true);
        }

        const data = await response.json();
        if (data.success === true) {
          setImageData(`${data.imageData}`);
        }
      } finally {
        setImageLoading(false);
      }
    };

    fetchImage();
  }, [chapter?.id, chapter?.imagePrompt]);

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
                >
                  {paragraphs.map((paragraph, index) => (
                    <motion.p
                      key={`${chapterId}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3, duration: 0.5 }}
                      className="text-gray-200 leading-relaxed mb-6 text-base"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          <div className="h-full">
            <div className="aspect-video rounded-lg border border-amber-800/30 bg-gray-800/50 overflow-hidden flex items-center justify-center">
              {imageLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-amber-400 text-sm">Bild wird generiert…</span>
                </div>
              ) : imageData ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={`data:${imageData}`}
                  alt={`Bild zum Kapitel ${chapter.title}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Kein Bild verfügbar</span>
              )}
            </div>
            
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
