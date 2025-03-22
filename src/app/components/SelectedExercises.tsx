"use client";
import React from "react";
import { LearningStep, StepType } from "../types/model";
import { ExerciseType } from "./ExerciseTypeSelector";

interface SelectedExercisesProps {
  selectedSteps: LearningStep[];
  availableStepTypes: ExerciseType[];
  onRemoveStep: (stepId: string) => void;
  onGenerateExercises: () => void;
  onReorderSteps: (newSteps: LearningStep[]) => void;
}

const SelectedExercises: React.FC<SelectedExercisesProps> = ({
  selectedSteps,
  availableStepTypes,
  onRemoveStep,
  onGenerateExercises,
  onReorderSteps,
}) => {
  // Funktion zum Verschieben eines Steps in der Liste
  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...selectedSteps];
    if (direction === "up" && index > 0) {
      [newSteps[index - 1], newSteps[index]] = [
        newSteps[index],
        newSteps[index - 1],
      ];
      onReorderSteps(newSteps);
    } else if (direction === "down" && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [
        newSteps[index + 1],
        newSteps[index],
      ];
      onReorderSteps(newSteps);
    }
  };

  return (
    <div className="dark:bg-gray-750 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 cursor-pointer">
        3. Ausgewählte Übungen
      </h2>
      <div className="space-y-2">
        {selectedSteps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-3 dark:bg-gray-800 rounded border cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{index + 1}.</span>
              <span>
                {availableStepTypes.find((t) => t.type === step.type)?.icon ||
                  "🔶"}
              </span>
              <span>
                {availableStepTypes.find((t) => t.type === step.type)?.title ||
                  step.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => moveStep(index, "up")}
                disabled={index === 0}
                className="p-1 bg-gray-500 hover:bg-gray-500 rounded cursor-pointer"
                title="Nach oben verschieben"
              >
                ↑
              </button>
              <button
                onClick={() => moveStep(index, "down")}
                disabled={index === selectedSteps.length - 1}
                className="p-1 bg-gray-500 hover:bg-gray-500 rounded cursor-pointer"
                title="Nach unten verschieben"
              >
                ↓
              </button>
              <button
                onClick={() => onRemoveStep(step.id)}
                className="p-1 bg-red-100 hover:bg-red-200 rounded cursor-pointer"
                title="Entfernen"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={onGenerateExercises}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
        >
          Übungen generieren
        </button>
      </div>
    </div>
  );
};

export default SelectedExercises;
