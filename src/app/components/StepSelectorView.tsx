// File: app/components/StepSelectorView.tsx
"use client";

import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { StepType, LearningStep } from "../types/model";
import StepTypeCard from "./StepTypeCard";

// Gemeinsames Interface für Vokabeln und Sätze
export interface ContentItem {
  id: string;
  text: string;
}

interface StepSelectorViewProps {
  items: ContentItem[];
  onStepsChange?: (steps: LearningStep[]) => void;
}

// Definierte Step-Typen, die du auswählen kannst
const availableStepTypes: {
  type: StepType;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    type: StepType.WordOrdering,
    title: "Wörter ordnen",
    description:
      "Ordne die übergebenen Wörter/Sätze in die richtige Reihenfolge.",
    color: "bg-blue-200",
    icon: <span>WO</span>, // Platzhalter-Icon
  },
  {
    type: StepType.FillInTheBlanks,
    title: "Lückentext",
    description: "Fülle die Lücke in einem Satz mit den übergebenen Inhalten.",
    color: "bg-green-200",
    icon: <span>FIB</span>, // Platzhalter-Icon
  },
  // Weitere Step-Typen können hier ergänzt werden
];

const StepSelectorView: React.FC<StepSelectorViewProps> = ({
  items,
  onStepsChange,
}) => {
  const [selectedSteps, setSelectedSteps] = useState<LearningStep[]>([]);

  // Erzeugt einen neuen Step mit Default-Daten basierend auf den übergebenen Items
  const createStep = (type: StepType): LearningStep => {
    let data: any = {};
    switch (type) {
      case StepType.WordOrdering:
        data = {
          instructionText: "Ordne die Wörter in die richtige Reihenfolge.",
          // Die übergebenen Items werden als Wortoptionen genutzt:
          wordOptions: items.map((item) => item.text),
          // Als Beispiel: Korrekte Reihenfolge als zusammengesetzter Satz
          correctSentence: items.map((item) => item.text).join(" "),
        };
        break;
      case StepType.FillInTheBlanks:
        data = {
          question: "Fülle die Lücke im Satz.",
          // Die Optionen stammen aus den Items:
          options: items.map((item) => item.text),
          // Beispiel: Der erste Eintrag als korrekte Antwort
          correctAnswer: items[0]?.text || "",
        };
        break;
      default:
        data = {};
        break;
    }
    return {
      id: uuid(),
      type,
      data,
    };
  };

  // Handler, der beim Klick auf einen Step-Typ einen neuen Step hinzufügt
  const handleStepClick = (type: StepType) => {
    const newStep = createStep(type);
    const updatedSteps = [...selectedSteps, newStep];
    setSelectedSteps(updatedSteps);
    if (onStepsChange) {
      onStepsChange(updatedSteps);
    }
  };

  return (
    <div className="space-y-6 dark:bg-gray-800">
      {/* Anzeige der übergebenen Inhalte */}
      <div>
        <h3 className="text-lg font-semibold">Übergebene Inhalte</h3>
        <ul className="list-disc pl-5">
          {items.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </div>

      {/* Auswahl der gewünschten Steps */}
      <div>
        <h3 className="text-lg font-semibold">Wähle die gewünschten Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableStepTypes.map((step) => (
            <StepTypeCard
              key={step.type}
              type={step.type}
              title={step.title}
              description={step.description}
              icon={step.icon}
              color={step.color}
              onClick={handleStepClick}
            />
          ))}
        </div>
      </div>

      {/* Vorschau der aktuell ausgewählten Steps */}
      <div>
        <h3 className="text-lg font-semibold">Ausgewählte Steps</h3>
        <pre className="bg-gray-50 p-4 rounded dark:bg-gray-800">
          {JSON.stringify(selectedSteps, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default StepSelectorView;
