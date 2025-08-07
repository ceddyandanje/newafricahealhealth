"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  words: string[];
  className?: string;
  cycles?: number;
  pauseDuration?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  words, 
  className, 
  cycles = 3, 
  pauseDuration = 120000 // 2 minutes
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  
  const typingSpeed = 150;
  const deletingSpeed = 75;
  const delaySpeed = 1500;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTyping = () => {
      if (isPaused) return;

      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
      } else {
        setText(currentWord.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), delaySpeed);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        const nextWordIndex = (wordIndex + 1);

        if (nextWordIndex === words.length) {
            const nextCycle = currentCycle + 1;
            setCurrentCycle(nextCycle);

            if (nextCycle >= cycles) {
                setIsPaused(true);
                setText(words.join(', '));
                timeoutRef.current = setTimeout(() => {
                    setCurrentCycle(0);
                    setWordIndex(0);
                    setIsPaused(false);
                }, pauseDuration);
                return;
            }
        }
        setWordIndex(nextWordIndex % words.length);
      }
    };

    if (!isPaused) {
        timeoutRef.current = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isDeleting, wordIndex, words, isPaused, currentCycle, cycles, pauseDuration]);
  
  const fullSentence = `We offer: ${isPaused ? text : ''}`;

  return (
    <span className={cn("inline-block", className)}>
        {isPaused ? (
            fullSentence
        ) : (
            <>
                {text}
                <span className="animate-ping">|</span>
            </>
        )}
    </span>
  );
};

export default Typewriter;
