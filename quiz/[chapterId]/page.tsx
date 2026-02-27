'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import storyData from '@/data/story.json';

// Quiz-Daten für jedes Kapitel
const quizData: Record<number, {
  question: string;
  options: string[];
  correctAnswer: number;
}[]> = {
  1: [
    {
      question: "Was ist die wichtigste Tugend eines Samurai?",
      options: ["Reichtum", "Ehre", "Macht", "Berühmtheit"],
      correctAnswer: 1
    },
    {
      question: "Welche Waffe ist traditionell mit Samurai verbunden?",
      options: ["Bogen", "Speer", "Katana", "Axt"],
      correctAnswer: 2
    },
    {
      question: "Was bedeutet 'Bushido'?",
      options: ["Der Weg des Kriegers", "Die Kunst des Kampfes", "Der Code der Ehre", "Die Schule der Samurai"],
      correctAnswer: 0
    }
  ],
  2: [
    {
      question: "In welcher Periode lebten die Samurai hauptsächlich?",
      options: ["Edo-Zeit", "Meiji-Zeit", "Heian-Zeit", "Alle genannten"],
      correctAnswer: 3
    },
    {
      question: "Was trugen Samurai typischerweise?",
      options: ["Rüstung", "Kimono", "Beides", "Nichts davon"],
      correctAnswer: 2
    }
  ],
  3: [
    {
      question: "Was ist ein Daimyo?",
      options: ["Ein Bauer", "Ein Feudalherr", "Ein Händler", "Ein Mönch"],
      correctAnswer: 1
    }
  ],
  4: [
    {
      question: "Was bedeutet 'Seppuku'?",
      options: ["Eine Meditationstechnik", "Ein ritueller Selbstmord", "Eine Kampftechnik", "Ein Fest"],
      correctAnswer: 1
    }
  ],
  5: [
    {
      question: "Welche Farbe symbolisiert oft Mut bei Samurai?",
      options: ["Blau", "Rot", "Grün", "Weiß"],
      correctAnswer: 1
    }
  ],
  6: [
    {
      question: "Was war die Hauptpflicht eines Samurai?",
      options: ["Handeln", "Farming", "Dienen", "Lehren"],
      correctAnswer: 2
    }
  ]
};

export default function QuizPage() {
  const { chapterId } = useParams();
  const chapter = storyData.find(ch => ch.id === parseInt(chapterId as string));
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const questions = quizData[parseInt(chapterId as string)] || quizData[1];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">Quiz nicht gefunden</h1>
          <Link href="/" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900/20 pt-16 px-4">
        <ProgressBar currentChapter={chapter.id} />
        
        <div className="container mx-auto max-w-2xl mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-amber-800/30 text-center"
          >
            <h1 className="text-4xl font-bold text-amber-400 mb-4">Quiz Abgeschlossen! 🎉</h1>
            
            <div className="text-6xl font-bold text-white mb-4">
              {score}/{questions.length}
            </div>
            
            <p className="text-2xl text-gray-300 mb-8">
              {percentage}% richtig
            </p>

            <div className="mb-8">
              {percentage >= 80 && (
                <p className="text-green-400 text-xl">Ausgezeichnet! Du bist ein wahrer Samurai! 🥷</p>
              )}
              {percentage >= 50 && percentage < 80 && (
                <p className="text-amber-400 text-xl">Gut gemacht! Weiter so! ⚔️</p>
              )}
              {percentage < 50 && (
                <p className="text-red-400 text-xl">Übung macht den Meister! Versuche es nochmal! 📖</p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Link href={`/story/${chapterId}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Zurück zur Geschichte
                </motion.button>
              </Link>
              
              {chapter.id < 6 && (
                <Link href={`/story/${chapter.id + 1}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all"
                  >
                    Nächstes Kapitel →
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900/20 pt-16 px-4">
      <ProgressBar currentChapter={chapter.id} />
      
      <div className="container mx-auto max-w-2xl mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-amber-800/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-amber-400 font-bold">
              Kapitel {chapterId} - Quiz
            </h2>
            <span className="text-gray-400">
              Frage {currentQuestion + 1} von {questions.length}
            </span>
          </div>

          <div className="mb-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="h-full bg-amber-500"
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-8 mt-6">
            {question.question}
          </h1>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-600 border-green-400'
                      : 'bg-red-600 border-red-400'
                    : selectedAnswer !== null && index === question.correctAnswer
                    ? 'bg-green-600 border-green-400'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                } border-2`}
              >
                <span className="text-white font-medium">{option}</span>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <Link href={`/story/${chapterId}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-gray-400 hover:text-white transition-all"
              >
                ← Zurück zur Geschichte
              </motion.button>
            </Link>
            
            <div className="text-amber-400 font-bold">
              Punkte: {score}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
