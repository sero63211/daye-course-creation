// components/SentenceForm.tsx
import React from "react";

interface SentenceFormProps {
  newText: string;
  setNewText: (text: string) => void;
  newTranslation: string;
  setNewTranslation: (translation: string) => void;
}

const SentenceForm: React.FC<SentenceFormProps> = ({
  newText,
  setNewText,
  newTranslation,
  setNewTranslation,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Satz
        </label>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="z.B. 'Wie geht es dir?'"
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
          placeholder="z.B. 'How are you?'"
          className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default SentenceForm;
