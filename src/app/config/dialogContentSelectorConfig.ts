// config/dialogContentSelectorConfig.ts
import { StepType } from "../types/model";

export const dialogContentSelectorConfig: Partial<{
  [key in StepType]: { renderSelector: boolean; acceptedTypes: string[] };
}> = {
  [StepType.TrueFalse]: { renderSelector: false, acceptedTypes: [] },
  [StepType.FillInTheBlanks]: {
    renderSelector: true,
    acceptedTypes: ["sentence"],
  },
  [StepType.ListenVocabulary]: {
    renderSelector: true,
    acceptedTypes: ["sentence", "vocabulary"],
  },
  [StepType.LanguageQuestion]: { renderSelector: false, acceptedTypes: [] },
  [StepType.SentenceCompletion]: {
    renderSelector: true,
    acceptedTypes: ["sentence"],
  },
  [StepType.WordOrdering]: {
    renderSelector: true,
    acceptedTypes: ["sentence"],
  },
  [StepType.LessonInformation]: {
    renderSelector: true,
    acceptedTypes: ["information"],
  },
  [StepType.LanguagePhrases]: {
    renderSelector: true,
    acceptedTypes: ["sentence"],
  },
  [StepType.MatchingPairs]: {
    renderSelector: true,
    acceptedTypes: ["vocabulary"],
  },
  [StepType.FillInChat]: { renderSelector: false, acceptedTypes: [] },
  [StepType.Completed]: { renderSelector: false, acceptedTypes: [] },
};
