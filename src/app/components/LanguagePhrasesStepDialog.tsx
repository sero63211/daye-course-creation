"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { Plus } from "lucide-react";
export interface LanguagePhrasesModel {
  title: string;
  explanation: string;
  phrases: { foreignText: string; nativeText: string }[];
}
interface LanguagePhrasesStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems?: any[];
  stepType?: StepType;
  isEditMode?: boolean;
}
const LanguagePhrasesStepDialog: React.FC<LanguagePhrasesStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems = [],
  isEditMode = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with at least one empty row
  const [foreignPhrases, setForeignPhrases] = useState<string[]>(() => {
    if (
      dialogData.phrases &&
      Array.isArray(dialogData.phrases) &&
      dialogData.phrases.length > 0
    ) {
      return dialogData.phrases.map((p) => p.foreignText || "");
    }
    return [""]; // Default to one empty row
  });

  const [nativePhrases, setNativePhrases] = useState<string[]>(() => {
    if (
      dialogData.phrases &&
      Array.isArray(dialogData.phrases) &&
      dialogData.phrases.length > 0
    ) {
      return dialogData.phrases.map((p) => p.nativeText || "");
    }
    return [""]; // Default to one empty row
  });

  // Ensure dialogData has initial phrases if empty
  useEffect(() => {
    if (
      !dialogData.phrases ||
      !Array.isArray(dialogData.phrases) ||
      dialogData.phrases.length === 0
    ) {
      setDialogData({
        ...dialogData,
        phrases: [{ foreignText: "", nativeText: "" }],
      });
    }
  }, []);

  // Effect to respond to dialogData changes from parent's ContentItemSelector
  useEffect(() => {
    // When dialogData.mainText changes due to content selection in parent
    if (dialogData.mainText && dialogData.secondaryText) {
      // Update the first phrase with the selected content
      const newForeignPhrases = [...foreignPhrases];
      newForeignPhrases[0] = dialogData.mainText;
      setForeignPhrases(newForeignPhrases);

      // Update the translation
      const newNativePhrases = [...nativePhrases];
      newNativePhrases[0] = dialogData.secondaryText;
      setNativePhrases(newNativePhrases);

      // Make sure to update the dialog data with these phrases
      updateDialogData(newForeignPhrases, newNativePhrases);
    }
  }, [dialogData.mainText, dialogData.secondaryText]);

  // Update dialogData when phrases change
  const updateDialogData = (
    foreign = foreignPhrases,
    native = nativePhrases
  ) => {
    const maxLength = Math.max(foreign.length, native.length);
    const phrases = [];

    for (let i = 0; i < maxLength; i++) {
      phrases.push({
        foreignText: foreign[i] || "",
        nativeText: native[i] || "",
      });
    }

    setDialogData({ ...dialogData, phrases });
  };

  const handleForeignChange = (index: number, value: string) => {
    const newForeignPhrases = [...foreignPhrases];
    newForeignPhrases[index] = value;
    setForeignPhrases(newForeignPhrases);

    // Ensure nativePhrases is long enough
    if (nativePhrases.length <= index) {
      const newNativePhrases = [...nativePhrases];
      while (newNativePhrases.length <= index) {
        newNativePhrases.push("");
      }
      setNativePhrases(newNativePhrases);
    }

    updateDialogData(newForeignPhrases, nativePhrases);
  };

  const handleNativeChange = (index: number, value: string) => {
    const newNativePhrases = [...nativePhrases];
    newNativePhrases[index] = value;
    setNativePhrases(newNativePhrases);

    // Ensure foreignPhrases is long enough
    if (foreignPhrases.length <= index) {
      const newForeignPhrases = [...foreignPhrases];
      while (newForeignPhrases.length <= index) {
        newForeignPhrases.push("");
      }
      setForeignPhrases(newForeignPhrases);
    }

    updateDialogData(foreignPhrases, newNativePhrases);
  };

  const addNewRow = () => {
    const newForeign = [...foreignPhrases, ""];
    const newNative = [...nativePhrases, ""];
    setForeignPhrases(newForeign);
    setNativePhrases(newNative);
    updateDialogData(newForeign, newNative);
  };

  const removeRow = (index: number) => {
    if (foreignPhrases.length <= 1) return;

    const newForeignPhrases = [...foreignPhrases];
    newForeignPhrases.splice(index, 1);
    setForeignPhrases(newForeignPhrases);

    const newNativePhrases = [...nativePhrases];
    newNativePhrases.splice(index, 1);
    setNativePhrases(newNativePhrases);

    updateDialogData(newForeignPhrases, newNativePhrases);
  };

  // Use memoized preview data to avoid unnecessary renders
  const previewData = useMemo(
    () => ({
      title: dialogData.title || "",
      explanation: dialogData.explanation || "",
      phrases: dialogData.phrases || [],
    }),
    [dialogData.title, dialogData.explanation, dialogData.phrases]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left side: Form */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div className="space-y-4">
          <label className="block text-black">
            Titel:
            <input
              type="text"
              value={dialogData.title || ""}
              onChange={(e) =>
                setDialogData({ ...dialogData, title: e.target.value })
              }
              className="mt-1 block w-full border rounded p-2"
              placeholder="Titel der Phrasengruppe"
            />
          </label>
          <label className="block text-black">
            Erklärung:
            <textarea
              value={dialogData.explanation || ""}
              onChange={(e) =>
                setDialogData({ ...dialogData, explanation: e.target.value })
              }
              className="mt-1 block w-full border rounded p-2 h-24"
              placeholder="Erklärung oder Kontext"
            />
          </label>
          <div className="block">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-black">Phrasen:</label>
              <button
                type="button"
                onClick={addNewRow}
                className="bg-blue-500 text-white px-2 py-1 rounded flex items-center hover:bg-blue-600"
              >
                <Plus size={16} className="mr-1" />
                Neue Zeile
              </button>
            </div>
            <div className="border rounded overflow-hidden">
              {/* Table header */}
              <div className="flex border-b bg-gray-100">
                <div className="w-1/2 p-2 font-medium text-black border-r">
                  Fremdtext
                </div>
                <div className="w-1/2 p-2 font-medium text-black">
                  Deutscher Text
                </div>
              </div>
              {/* Table rows */}
              {foreignPhrases.map((phrase, index) => (
                <div key={index} className="flex border-b last:border-b-0">
                  {/* Left column (Foreign text) */}
                  <div className="w-1/2 p-1 border-r">
                    <input
                      type="text"
                      value={phrase}
                      onChange={(e) =>
                        handleForeignChange(index, e.target.value)
                      }
                      className="text-black w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Fremdtext"
                    />
                  </div>
                  {/* Right column (German text) */}
                  <div className="w-1/2 p-1 relative">
                    <input
                      type="text"
                      value={nativePhrases[index] || ""}
                      onChange={(e) =>
                        handleNativeChange(index, e.target.value)
                      }
                      className="text-black w-full p-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Deutscher Text"
                    />
                    {/* Delete button (except for the first row) */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                        title="Zeile löschen"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Gib den Fremdtext links und den deutschen Text rechts ein.
            </p>
          </div>
        </div>
      </div>
      {/* Right side: Preview */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="sticky top-8">
          <IPhonePreview
            stepType={StepType.LanguagePhrases}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default LanguagePhrasesStepDialog;
