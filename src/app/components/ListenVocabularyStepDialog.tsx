"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { StepType } from "../types/model";
import { Info } from "lucide-react";

// Import components
import FactsManager from "./vocabulary-components/FactsManager";
import IPhonePreview from "./IPhonePreview";

interface ContentItem {
  id: string;
  text: string;
  translation?: string;
  examples?: any[];
  imageUrl?: string;
  audioUrl?: string;
  type?: string;
  contentType?: string;
}

interface ListenVocabularyStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems: ContentItem[];
  isEditMode?: boolean;
  stepType?: StepType;
}

const ListenVocabularyStepDialog: React.FC<ListenVocabularyStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems,
  isEditMode = false,
}) => {
  // State for form fields
  const [formState, setFormState] = useState({
    mainText: dialogData?.mainText || "",
    secondaryText: dialogData?.secondaryText || "",
    descriptionText: dialogData?.descriptionText || "",
    partOfSpeech: dialogData?.partOfSpeech || "",
    imageUrl: dialogData?.imageUrl || "",
    soundFileName: dialogData?.soundFileName || "",
    facts: dialogData?.facts || [],
  });

  // Effect to respond to dialogData changes from parent's ContentItemSelector
  useEffect(() => {
    // Check if we have data from parent's content selection
    if (
      dialogData.items &&
      Array.isArray(dialogData.items) &&
      dialogData.items.length > 0
    ) {
      const selectedItem = dialogData.items[0];

      if (!isEditMode) {
        // Only update text fields if not in edit mode
        setFormState((prev) => ({
          ...prev,
          mainText: selectedItem.text || "",
          secondaryText: selectedItem.translation || "",
          // Always set media fields from the selected item
          imageUrl: selectedItem.imageUrl || "",
          soundFileName: selectedItem.audioUrl || "",
        }));
      } else {
        // In edit mode, only update media fields
        setFormState((prev) => ({
          ...prev,
          // Only update media fields
          imageUrl: selectedItem.imageUrl || "",
          soundFileName: selectedItem.audioUrl || "",
        }));
      }
    }
  }, [dialogData.items, isEditMode]);

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Update dialog data on form changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDialogData({
        ...formState,
        isComplete: !!(formState.mainText && formState.secondaryText),
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [formState, setDialogData]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left side */}
      <div className="w-full md:w-3/5">
        {isEditMode && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded flex items-start">
            <Info
              className="text-yellow-500 mr-2 flex-shrink-0 mt-1"
              size={20}
            />
            <div>
              <p className="text-sm text-black">
                Du bearbeitest eine bestehende Vokabelübung. Die vorhandenen
                Bilder, Audio und zusätzlichen Informationen wurden bereits
                geladen.
              </p>
            </div>
          </div>
        )}

        {formState.mainText && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-black">
            <div className="font-medium">Ausgewählter Inhalt:</div>
            <div>{formState.mainText || "Keine Auswahl"}</div>
            <div className="text-sm mt-2">
              {formState.imageUrl ? "✅ Bild vorhanden" : "❌ Kein Bild"} |
              {formState.soundFileName ? "✅ Audio vorhanden" : "❌ Kein Audio"}
            </div>
          </div>
        )}

        {/* Form fields */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            Vokabeldetails
          </h3>

          <div className="grid gap-4">
            {/* Main Text */}
            <div>
              <label
                htmlFor="mainText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vokabel
              </label>
              <input
                type="text"
                id="mainText"
                name="mainText"
                value={formState.mainText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="Hauptvokabel"
              />
            </div>

            {/* Secondary Text */}
            <div>
              <label
                htmlFor="secondaryText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Übersetzung
              </label>
              <input
                type="text"
                id="secondaryText"
                name="secondaryText"
                value={formState.secondaryText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="Übersetzung"
              />
            </div>

            {/* Description Text */}
            <div>
              <label
                htmlFor="descriptionText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zusätzliche Beschreibung (optional)
              </label>
              <textarea
                id="descriptionText"
                name="descriptionText"
                value={formState.descriptionText}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="Zusätzliche Beschreibung oder Kontext zur Vokabel"
              />
            </div>

            {/* Part of Speech */}
            <div>
              <label
                htmlFor="partOfSpeech"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wortart (optional)
              </label>
              <input
                type="text"
                id="partOfSpeech"
                name="partOfSpeech"
                value={formState.partOfSpeech}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="z.B. Substantiv, Verb, Adjektiv"
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bild URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formState.imageUrl}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-black"
                placeholder="Kein Bild ausgewählt"
              />
            </div>

            {/* Sound File Name */}
            <div>
              <label
                htmlFor="soundFileName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Audio-Datei
              </label>
              <input
                type="text"
                id="soundFileName"
                name="soundFileName"
                value={formState.soundFileName}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-black"
                placeholder="Keine Audiodatei ausgewählt"
              />
            </div>
          </div>
        </div>

        {/* Facts Manager */}
        <FactsManager
          facts={formState.facts}
          setFacts={(facts) => setFormState((prev) => ({ ...prev, facts }))}
          isEditMode={isEditMode}
        />
      </div>

      {/* Right side: Preview */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="sticky top-8">
          <IPhonePreview
            stepType={StepType.ListenVocabulary}
            stepData={formState}
            showFacts={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ListenVocabularyStepDialog;
