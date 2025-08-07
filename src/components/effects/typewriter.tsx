"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  words: string[];
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ words, className }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  const typingSpeed = 150;
  const deletingSpeed = 75;
  const delaySpeed = 1500;
  const pauseDuration = 2 * 60 * 1000; // 2 minutes

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
        // Word fully typed
        if (wordIndex === words.length - 1) {
            // Last word in the list, increment loop count
            const newLoopNum = loopNum + 1;
            setLoopNum(newLoopNum);
            if (newLoopNum % 3 === 0) {
                // Pause after 3 cycles
                setIsPaused(true);
                timeoutRef.current = setTimeout(() => {
                    setIsPaused(false);
                    // After pause, start deleting
                    setIsDeleting(true);
                }, pauseDuration);
                return; // Stop further execution until pause is over
            }
        }
        // Pause before deleting
        timeoutRef.current = setTimeout(() => setIsDeleting(true), delaySpeed);

      } else if (isDeleting && text === '') {
        // Word fully deleted
        setIsDeleting(false);
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    };

    timeoutRef.current = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isDeleting, isPaused, wordIndex, loopNum, words, pauseDuration]);

  return (
    <span className={cn("inline-block", className)}>
      {text}
      <span className="animate-ping">|</span>
    </span>
  );
};

export default Typewriter;
