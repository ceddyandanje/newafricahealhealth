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
  
  const typingSpeed = 150;
  const deletingSpeed = 75;
  const delaySpeed = 1500;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
      } else {
        setText(currentWord.substring(0, text.length + 1));
      }

      if (!isDeleting && text === currentWord) {
        // Word fully typed, pause before deleting
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
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className={cn("inline-block", className)}>
      {text}
      <span className="animate-ping">|</span>
    </span>
  );
};

export default Typewriter;
