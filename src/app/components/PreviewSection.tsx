// components/PreviewSection.tsx
import React from "react";
import IPhonePreview from "./IPhonePreview";
import { LearningStep } from "../types/model";

interface PreviewSectionProps {
  previewStep: LearningStep | null;
  getPreviewStepTitle: () => string;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewStep,
  getPreviewStepTitle,
}) => {
  if (previewStep) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-black mb-4">
          Vorschau: {getPreviewStepTitle()}
        </h2>
        <div className="flex justify-center">
          <IPhonePreview
            stepType={previewStep.type}
            stepData={previewStep.data}
            showFacts={true}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-full p-6 text-gray-500">
        <div className="text-center">
          <p className="mb-2 text-lg">Noch keine Vorschau verfügbar</p>
          <p className="text-sm">
            Erstelle eine Übung oder wähle eine bestehende aus,
            <br />
            um eine Vorschau anzuzeigen
          </p>
        </div>
      </div>
    );
  }
};

export default PreviewSection;
