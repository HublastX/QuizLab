"use client";

import { useState } from "react";
import { Theme } from "../theme/theme";
import { Subtopic } from "./subtopic/subtopic";

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

  const handleThemeChange = (theme: ThemeData | null) => {
    setThemeData(theme);
    onThemeChange(theme);
  };

  return (
    <div>
      <Theme onThemeChange={handleThemeChange} onSubmit={onSubmit} />
      
      <div className="my-10" />
      
      <Subtopic
        themeId={themeData?.isNew ? undefined : themeData?.id}
        onSubtopicChange={onSubtopicChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}