// components/ExerciseSection.tsx
import React from "react";
import ExerciseManager from "./ExerciseManager";
import { LearningStep, StepType } from "../types/model";

interface ExerciseTypeDefinition {
  type: StepType;
  title: string;
  description: string;
  icon: string;
}

interface ExerciseSectionProps {
  steps: LearningStep[];
  availableStepTypes: ExerciseTypeDefinition[];
  previewStepId: string | undefined;
  onEditStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void;
  onMoveStep: (index: number, direction: "up" | "down") => void;
  onSelectPreviewStep: (step: LearningStep) => void;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  steps,
  availableStepTypes,
  previewStepId,
  onEditStep,
  onDeleteStep,
  onMoveStep,
  onSelectPreviewStep,
}) => {
  return (
    <ExerciseManager
      steps={steps}
      availableStepTypes={availableStepTypes}
      previewStepId={previewStepId}
      onEditStep={onEditStep}
      onDeleteStep={onDeleteStep}
      onMoveStep={onMoveStep}
      onSelectPreviewStep={onSelectPreviewStep}
    />
  );
};

export default ExerciseSection;
