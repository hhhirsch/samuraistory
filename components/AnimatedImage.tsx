import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
}

const WaveSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 L200,100 L0,100 Z" fill="#f0f0f0" opacity="0.3"/>
    <path d="M0,60 Q25,40 50,60 T100,60 T150,60 T200,60 L200,100 L0,100 Z" fill="#f0f0f0" opacity="0.4"/>
    <path d="M0,70 Q25,50 50,70 T100,70 T150,70 T200,70 L200,100 L0,100 Z" fill="#f0f0f0" opacity="0.5"/>
  </svg>
);

const AnimatedImage = ({ src, alt }: AnimatedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded-lg"></div>
      )}
      
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <WaveSVG />
        </div>
      )}
      
      {!isLoading && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default AnimatedImage;