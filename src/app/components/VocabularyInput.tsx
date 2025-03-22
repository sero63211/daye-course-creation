// File: app/components/VocabularyInput.tsx
"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { v4 as uuid } from "uuid";

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example: string;
  audioURL?: string;
  isLearned: boolean;
}

interface VocabularyInputProps {
  vocabulary: VocabularyItem[];
  setVocabulary: React.Dispatch<React.SetStateAction<VocabularyItem[]>>;
  onSave: () => void;
}

const VocabularyInput: React.FC<VocabularyInputProps> = ({
  vocabulary,
  setVocabulary,
  onSave,
}) => {
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExample, setNewExample] = useState("");

  const addVocabularyItem = () => {
    if (newWord.trim() && newTranslation.trim()) {
      const newItem: VocabularyItem = {
        id: uuid(),
        word: newWord,
        translation: newTranslation,
        example: newExample,
        isLearned: false,
      };
      setVocabulary([...vocabulary, newItem]);
      setNewWord("");
      setNewTranslation("");
      setNewExample("");
    }
  };

  const removeVocabularyItem = (id: string) => {
    setVocabulary(vocabulary.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium">Vokabeln</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wort
          </label>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="Neues Wort"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Übersetzung
          </label>
          <input
            type="text"
            value={newTranslation}
            onChange={(e) => setNewTranslation(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="Übersetzung"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Beispiel
          </label>
          <input
            type="text"
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="Beispielsatz"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={addVocabularyItem}
          disabled={!newWord.trim() || !newTranslation.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
        >
          Hinzufügen
        </button>
      </div>

      {vocabulary.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Hinzugefügte Vokabeln:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {vocabulary.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <div>
                  <div className="font-medium">{item.word}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.translation} {item.example && `• "${item.example}"`}
                  </div>
                </div>
                <button
                  onClick={() => removeVocabularyItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Vokabeln speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyInput;
