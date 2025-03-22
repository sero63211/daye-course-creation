// components/ExerciseTypeSection.tsx
import React from "react";
import ExerciseTypeSelector from "../components/ExerciseTypeSelector";
import { StepType } from "../types/model";

interface ExerciseTypeDefinition {
  type: StepType;
  title: string;
  description: string;
  icon: string;
}

interface ExerciseTypeSectionProps {
  exerciseTypes: ExerciseTypeDefinition[];
  onSelect: (type: StepType) => void;
}

const ExerciseTypeSection: React.FC<ExerciseTypeSectionProps> = ({
  exerciseTypes,
  onSelect,
}) => {
  return (
    <div className="p-6 border-t border-gray-200">
      <h2 className="text-xl font-bold text-black mb-4">
        2. Übungstyp auswählen
      </h2>
      <ExerciseTypeSelector exerciseTypes={exerciseTypes} onSelect={onSelect} />
    </div>
  );
};

export default ExerciseTypeSection;
