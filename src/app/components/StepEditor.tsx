// File: app/components/StepEditor.tsx
"use client";
import React, { useState } from "react";
import { Info, Check } from "lucide-react";
import { StepType, LearningStep } from "../types/lessonTypes";

interface StepEditorProps {
  step: LearningStep;
  onUpdate: (updatedStep: LearningStep) => void;
  onCancel: () => void;
}

const StepEditor: React.FC<Step--EditorProps> = ({
  step,
  onUpdate,
  onCancel,
}) => {
  const [stepData, setStepData] = useState<any>(step.data || {});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setStepData({
      ...stepData,
      [name]: value,
    });
  };

  const handleDataAssignment = () => {
    let updatedData = { ...stepData };

    switch (step.type) {
      case StepType.ListenVocabulary:
        updatedData = {
          imageUrl: "",
          soundFileName: "",
          mainText: "Beispielwort",
          secondaryText: "Beispielübersetzung",
          facts: [],
        };
        break;
      case StepType.FillInTheBlanks:
        updatedData = {
          question: "Satz mit Lücke",
          imageUrl: "",
          soundFileName: "",
          options: [],
          correctAnswer: "",
          translation: "",
          pronunciationTip: "",
        };
        break;
      case StepType.WordOrdering:
        updatedData = {
          instructionText: "Ordne die Wörter richtig an",
          imageUrl: "",
          soundFileName: "",
          wordOptions: [],
          correctSentence: "",
        };
        break;
      case StepType.LanguageQuestion:
        updatedData = {
          questionText: "Frage",
          imageUrl: "",
          soundFileName: "",
          options: [],
          correctOption: "",
        };
        break;
      case StepType.LessonInformation:
        updatedData = {
          title: "Neue Information",
          mainText: "Haupttext der Information",
          secondaryText: "Zusätzliche Details zur Information",
        };
        break;
      case StepType.LanguagePhrases:
        updatedData = {
          title: "Wichtige Sätze und Ausdrücke",
          explanation:
            "Hier sind einige wichtige Sätze und Ausdrücke für diese Lektion:",
          phrases: [],
        };
        break;
      case StepType.MatchingPairs:
        updatedData = {
          title: "Ordne die passenden Paare zu",
          pairs: [],
        };
        break;
      default:
        break;
    }

    onUpdate({
      ...step,
      data: updatedData,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {getStepTypeName(step.type)} konfigurieren
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleDataAssignment}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Check size={18} className="mr-1 inline" />
            Daten zuweisen
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Abbrechen
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
        <div className="flex items-start gap-2">
          <Info size={18} className="text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p>
              {step.type === StepType.ListenVocabulary &&
                "Wähle ein Vokabel, das der Benutzer hören und lernen soll."}
              {step.type === StepType.FillInTheBlanks &&
                "Wähle einen Satz, bei dem der Benutzer ein fehlendes Wort ergänzen soll."}
              {step.type === StepType.WordOrdering &&
                "Wähle einen Satz, dessen Wörter der Benutzer in die richtige Reihenfolge bringen soll."}
              {step.type === StepType.LanguageQuestion &&
                "Erstelle eine Multiple-Choice-Frage zu einem Vokabel."}
              {step.type === StepType.LessonInformation &&
                "Füge eine Informationsseite zur Lektion hinzu."}
              {step.type === StepType.LanguagePhrases &&
                "Zeige eine Liste wichtiger Sätze und Ausdrücke an."}
              {step.type === StepType.MatchingPairs &&
                "Erstelle ein Zuordnungsspiel mit Vokabeln und ihren Übersetzungen."}
            </p>
            <p className="mt-1">
              Klicke auf "Daten zuweisen", um{" "}
              {step.type === StepType.ListenVocabulary ||
              step.type === StepType.LanguageQuestion ||
              step.type === StepType.MatchingPairs
                ? "Vokabeln"
                : "Sätze"}{" "}
              automatisch zu diesem Schritt zuzuweisen.
            </p>
          </div>
        </div>
      </div>

      {step.type === StepType.LessonInformation && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titel
            </label>
            <input
              type="text"
              name="title"
              value={stepData.title || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Haupttext
            </label>
            <textarea
              name="mainText"
              value={stepData.mainText || ""}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zusätzlicher Text
            </label>
            <textarea
              name="secondaryText"
              value={stepData.secondaryText || ""}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
        </>
      )}

      <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="text-sm font-medium mb-3">
          Vorschau der Zuweisungsdaten:
        </h4>
        <pre className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-xs overflow-auto max-h-64">
          {JSON.stringify(stepData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

function getStepTypeName(type: StepType): string {
  switch (type) {
    case StepType.ListenVocabulary:
      return "Vokabel hören";
    case StepType.FillInTheBlanks:
      return "Lückentext";
    case StepType.TrueFalse:
      return "Wahr oder Falsch";
    case StepType.LanguageQuestion:
      return "Sprachfrage";
    case StepType.SentenceCompletion:
      return "Satz vervollständigen";
    case StepType.WordOrdering:
      return "Wörter ordnen";
    case StepType.LessonInformation:
      return "Lektion Information";
    case StepType.LanguagePhrases:
      return "Sprachwendungen";
    case StepType.MatchingPairs:
      return "Paare zuordnen";
    case StepType.Conversation:
      return "Konversation";
    case StepType.Completed:
      return "Abgeschlossen";
    case StepType.FillInChat:
      return "Chat ergänzen";
    default:
      return "Unbekannter Typ";
  }
}

export default StepEditor;
