// src/components/LessonStepContainer.tsx
"use client";

import { LearningStep, StepType } from "../types/model";
import LessonInformation from "./learning-steps/LessonInformation";
import ListenVocabulary from "./learning-steps/ListenVocabulary";

interface LessonStepContainerProps {
  currentStep: LearningStep;
}

export default function LessonStepContainer({
  currentStep,
}: LessonStepContainerProps) {
  // Based on the step type, render the appropriate component
  switch (currentStep.type) {
    case StepType.LessonInformation:
      return <LessonInformation data={currentStep.data} />;

    case StepType.ListenVocabulary:
      return <ListenVocabulary data={currentStep.data} />;

    // Add cases for other step types

    default:
      return (
        <div className="p-4 bg-yellow-100 rounded-md">
          <p>Step type "{currentStep.type}" not yet implemented</p>
        </div>
      );
  }
}
