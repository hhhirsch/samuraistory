import React from 'react';

interface ProgressBarProps {
  currentChapter: number;
  totalChapters?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentChapter, 
  totalChapters = 5 
}) => {
  const progressPercentage = (currentChapter / totalChapters) * 100;

  return (
    <div className="fixed top-0 left-0 w-full h-2 bg-gray-800 z-50">
      <div 
        className="h-full bg-gradient-to-r from-yellow-600 to-yellow-700 transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      
      {/* Japanese scroll effect */}
      <div className="absolute top-0 right-0 w-4 h-2 bg-yellow-800 flex items-center justify-center">
        <span className="text-xs text-white font-bold">{currentChapter}/{totalChapters}</span>
      </div>
    </div>
  );
};

export default ProgressBar;