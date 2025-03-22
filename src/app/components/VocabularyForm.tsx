// components/VocabularyForm.tsx
import React, { useState } from "react";
import { VocabularyItem } from "../utils/vocabularyUtils";
import ExamplesManager from "./ExamplesManager";

interface VocabularyFormProps {
  newText: string;
  setNewText: (text: string) => void;
  newTranslation: string;
  setNewTranslation: (translation: string) => void;
  currentVocabItem: VocabularyItem | null;
  handleSelectSynonym: (synonym: string) => void;
  newExamples: { text: string; translation: string }[];
  setNewExamples: React.Dispatch<
    React.SetStateAction<{ text: string; translation: string }[]>
  >;
}

const VocabularyForm: React.FC<VocabularyFormProps> = ({
  newText,
  setNewText,
  newTranslation,
  setNewTranslation,
  currentVocabItem,
  handleSelectSynonym,
  newExamples,
  setNewExamples,
}) => {
  return (
    <div>
      {/* Basic vocabulary form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Vokabel
          </label>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="z.B. 'Hallo'"
            className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Übersetzung
          </label>
          <input
            type="text"
            value={newTranslation}
            onChange={(e) => setNewTranslation(e.target.value)}
            placeholder="z.B. 'Hello'"
            className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Display synonyms if available for the selected vocabulary item */}
      {currentVocabItem?.synonym && currentVocabItem.synonym.length > 0 && (
        <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="text-sm font-medium text-black mb-2">
            Verfügbare Synonyme:
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentVocabItem.synonym.map((synonym: string, index: number) => (
              <button
                key={index}
                onClick={() => handleSelectSynonym(synonym)}
                className={`px-3 py-1 rounded-md text-sm ${
                  newText === synonym
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {synonym}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Klicke auf ein Synonym, um es als Hauptvokabel zu verwenden.
          </p>
        </div>
      )}

      {/* Examples manager */}
      <ExamplesManager
        newExamples={newExamples}
        setNewExamples={setNewExamples}
      />
    </div>
  );
};

export default VocabularyForm;
