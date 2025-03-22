"use client";
import React from "react";
import { LearningStep } from "../types/model";
import { ExerciseType } from "./ExerciseTypeSelector";

interface CreatedExercisesProps {
  selectedSteps: LearningStep[];
  availableStepTypes: ExerciseType[];
  onRemoveExercise: (id: string) => void;
}

const CreatedExercises: React.FC<CreatedExercisesProps> = ({
  selectedSteps,
  availableStepTypes,
  onRemoveExercise,
}) => {
  const formatKey = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const renderValue = (key: string, value: any) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") {
      if (value.trim() === "") return null;
      return (
        <div key={key}>
          {formatKey(key)}: {value}
        </div>
      );
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return (
        <div key={key}>
          {formatKey(key)}: {value.toString()}
        </div>
      );
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <div key={key}>
          <div>{formatKey(key)}:</div>
          <div className="pl-4">
            {value.map((item, idx) =>
              typeof item === "object" ? (
                <div key={idx}>{renderStepData(item)}</div>
              ) : (
                <div key={idx}>{item.toString()}</div>
              )
            )}
          </div>
        </div>
      );
    }
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) return null;
      return (
        <div key={key}>
          <div>{formatKey(key)}:</div>
          <div className="pl-4">
            {entries.map(([subKey, subValue]) => renderValue(subKey, subValue))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderStepData = (data: any) => {
    if (!data || typeof data !== "object") return null;
    return (
      <div className="text-gray-600 text-sm">
        {Object.entries(data).map(([key, value]) => renderValue(key, value))}
      </div>
    );
  };

  return (
    <div>
      {selectedSteps.length === 0 ? (
        <p className="text-gray-500 italic cursor-pointer">
          Noch keine Übungen erstellt.
        </p>
      ) : (
        <ul className="space-y-4">
          {selectedSteps.map((step) => {
            const typeInfo = availableStepTypes.find(
              (t) => t.type === step.type
            );
            return (
              <li
                key={step.id}
                className="relative p-3 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">
                      {typeInfo?.icon} {typeInfo?.title || step.type}
                    </div>
                    {renderStepData(step.data)}
                  </div>
                  <button
                    onClick={() => onRemoveExercise(step.id)}
                    className="ml-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                    title="Übung entfernen"
                  >
                    X
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CreatedExercises;
