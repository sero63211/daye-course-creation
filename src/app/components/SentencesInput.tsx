// File: app/components/SentencesInput.tsx
"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { v4 as uuid } from "uuid";

export interface Sentence {
  id: string;
  text: string;
  translation: string;
}

interface SentencesInputProps {
  sentences: Sentence[];
  setSentences: React.Dispatch<React.SetStateAction<Sentence[]>>;
  onSave: () => void;
}

const SentencesInput: React.FC<SentencesInputProps> = ({
  sentences,
  setSentences,
  onSave,
}) => {
  const [newSentence, setNewSentence] = useState("");
  const [newTranslation, setNewTranslation] = useState("");

  const addSentence = () => {
    if (newSentence.trim() && newTranslation.trim()) {
      const newItem = {
        id: uuid(),
        text: newSentence,
        translation: newTranslation,
      };
      setSentences([...sentences, newItem]);
      setNewSentence("");
      setNewTranslation("");
    }
  };

  const removeSentence = (id: string) => {
    setSentences(sentences.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium">Grammatiksätze</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Satz
          </label>
          <input
            type="text"
            value={newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="Neuer Grammatiksatz"
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
      </div>

      <div className="flex justify-end">
        <button
          onClick={addSentence}
          disabled={!newSentence.trim() || !newTranslation.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
        >
          Hinzufügen
        </button>
      </div>

      {sentences.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Hinzugefügte Sätze:</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sentences.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <div>
                  <div className="font-medium">{item.text}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.translation}
                  </div>
                </div>
                <button
                  onClick={() => removeSentence(item.id)}
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
              Sätze speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentencesInput;
