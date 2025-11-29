"use client";

import { useState, useRef, useEffect } from "react";
import { Theme, ThemeRef } from "../theme/theme";
import { Subtopic, SubtopicRef } from "./subtopic/subtopic";

interface ThemeData {
  id?: string;
  title: string;
  description: string;
  isNew: boolean;
}

interface SubtopicData {
  id?: string;
  subTopic: string;
  description: string;
  isNew: boolean;
}


interface SetQuizProps {
  onThemeChange: (theme: ThemeData | null) => void;
  onSubtopicChange: (subtopic: SubtopicData | null) => void;
  onSubmit?: () => void;
}

export default function SetQuiz({ onThemeChange, onSubtopicChange, onSubmit }: SetQuizProps) {
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  
  const themeRef = useRef<ThemeRef>(null);
  const subtopicRef = useRef<SubtopicRef>(null);

  const handleThemeChange = (theme: ThemeData | null) => {
    setThemeData(theme);
    onThemeChange(theme);
  };

  // Global keydown listener to capture arrow keys when no element is focused
  // This ensures that if the user clicks outside or the focus is lost,
  // pressing an arrow key will bring focus back to the form.
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only act if the body is the active element (nothing focused)
      if (document.activeElement === document.body) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          themeRef.current?.focusFirst();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div>
      <Theme 
        ref={themeRef}
        onThemeChange={handleThemeChange} 
        onSubmit={onSubmit}
        onExitDown={() => subtopicRef.current?.focusFirst()}
      />
      
      <div className="my-10" />
      
      <Subtopic
        ref={subtopicRef}
        themeId={themeData?.isNew ? undefined : themeData?.id}
        onSubtopicChange={onSubtopicChange}
        onSubmit={onSubmit}
        onExitUp={() => themeRef.current?.focusLast()}
      />
    </div>
  );
}