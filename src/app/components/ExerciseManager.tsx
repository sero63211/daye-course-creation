// components/ExerciseManager.tsx
import React from "react";
import { StepType, LearningStep } from "../types/model";
import { ExerciseType } from "./ExerciseType";
import { ChevronUp, ChevronDown, Edit } from "lucide-react";

interface ExerciseManagerProps {
  steps: LearningStep[];
  availableStepTypes: ExerciseType[];
  previewStepId: string | undefined;
  onEditStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void;
  onMoveStep: (index: number, direction: "up" | "down") => void;
  onSelectPreviewStep: (step: LearningStep) => void;
}

const ExerciseManager: React.FC<ExerciseManagerProps> = ({
  steps,
  availableStepTypes,
  previewStepId,
  onEditStep,
  onDeleteStep,
  onMoveStep,
  onSelectPreviewStep,
}) => {
  // Helper function to render a preview of the step content
  const renderStepPreview = (step: LearningStep) => {
    switch (step.type) {
      case StepType.ListenVocabulary:
        return `${step.data.mainText || "Keine Vokabel"} (${
          step.data.secondaryText || "Keine Übersetzung"
        })`;
      case StepType.FillInTheBlanks:
        return `${step.data.question || "Kein Lückentext"}`;
      case StepType.TrueFalse:
        return `${step.data.statement || "Keine Aussage"}`;
      case StepType.LanguageQuestion:
        return `${step.data.questionText || "Keine Frage"}`;
      case StepType.LessonInformation:
        return `${step.data.title || "Kein Titel"}`;
      case StepType.LanguagePhrases:
        return `${step.data.title || "Keine Phrasen"} (${
          step.data.phrases?.length || 0
        } Phrasen)`;
      case StepType.MatchingPairs:
        return `${step.data.title || "Keine Paare"} (${
          step.data.pairs?.length || 0
        } Paare)`;
      case StepType.FillInChat:
        return `${step.data.title || "Kein Chat"} (${
          step.data.conversations?.length || 0
        } Nachrichten)`;
      case StepType.SentenceCompletion:
        return `${step.data.question || "Kein Satz"}`;
      case StepType.WordOrdering:
        return `${step.data.question || "Keine Wörter"}`;
      default:
        return "Übungsinhalt";
    }
  };

  return (
    <>
      {steps.length === 0 ? (
        <div className="text-black text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="mb-2 text-gray-500">Noch keine Übungen erstellt</p>
          <p className="text-sm text-gray-500">
            Wähle einen Übungstyp aus dem obigen Bereich, um zu beginnen
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {steps.map((step, index) => {
            const stepType = availableStepTypes.find(
              (t) => t.type === step.type
            );
            return (
              <div
                key={step.id}
                className={`
                  p-3 rounded-lg border transition-all
                  ${
                    previewStepId === step.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }
                `}
              >
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-2 text-lg bg-gray-100 text-black">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="mr-1">{stepType?.icon || "🔄"}</span>
                      <span className="font-medium text-black">
                        {stepType?.title || step.type}
                      </span>
                    </div>
                    <div className="text-xs text-black truncate">
                      {renderStepPreview(step)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-1 pt-1 border-t border-gray-100">
                  {/* Reorder buttons */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onMoveStep(index, "up")}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      title="Nach oben verschieben"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => onMoveStep(index, "down")}
                      disabled={index === steps.length - 1}
                      className={`p-1 rounded ${
                        index === steps.length - 1
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      title="Nach unten verschieben"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditStep(step.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      <span>Bearbeiten</span>
                    </button>
                    <button
                      onClick={() => onSelectPreviewStep(step)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Vorschau
                    </button>
                    <button
                      onClick={() => onDeleteStep(step.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ExerciseManager;
