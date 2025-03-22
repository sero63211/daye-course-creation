// components/ExerciseTypeSelector.tsx
import React from "react";
import { StepType } from "../types/model";
import { ExerciseType } from "./ExerciseType";

interface ExerciseTypeSelectorProps {
  exerciseTypes: ExerciseType[];
  onSelect: (type: StepType) => void;
}

const ExerciseTypeSelector: React.FC<ExerciseTypeSelectorProps> = ({
  exerciseTypes,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {exerciseTypes.map((type) => (
        <button
          key={type.type}
          onClick={() => onSelect(type.type)}
          className={`${type.color} hover:bg-opacity-80 p-3 rounded-lg text-left transition-colors`}
        >
          <div className="flex items-center">
            <span className="text-2xl mr-2">{type.icon}</span>
            <div>
              <div className="font-medium text-black">{type.title}</div>
              <div className="text-xs text-black">{type.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ExerciseTypeSelector;
