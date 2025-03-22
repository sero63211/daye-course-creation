// components/ExamplesManager.tsx
import React, { useState } from "react";

interface ExamplesManagerProps {
  newExamples: { text: string; translation: string }[];
  setNewExamples: React.Dispatch<
    React.SetStateAction<{ text: string; translation: string }[]>
  >;
}

const ExamplesManager: React.FC<ExamplesManagerProps> = ({
  newExamples,
  setNewExamples,
}) => {
  const [newExample, setNewExample] = useState("");
  const [newExampleTranslation, setNewExampleTranslation] = useState("");

  // Handler for adding examples
  const handleAddExample = () => {
    if (newExample.trim() && newExampleTranslation.trim()) {
      setNewExamples([
        ...newExamples,
        { text: newExample.trim(), translation: newExampleTranslation.trim() },
      ]);
      setNewExample("");
      setNewExampleTranslation("");
    } else {
      alert("Bitte sowohl Beispielsatz als auch Übersetzung eingeben!");
    }
  };

  // Handler for removing examples
  const handleRemoveExample = (index: number) => {
    const updated = [...newExamples];
    updated.splice(index, 1);
    setNewExamples(updated);
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-md font-medium text-black mb-2">
        Beispielsätze (optional)
      </h3>

      <div className="grid grid-cols-1 gap-4 mb-2">
        <div>
          <input
            type="text"
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            placeholder="Beispielsatz"
            className="text-black w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={newExampleTranslation}
            onChange={(e) => setNewExampleTranslation(e.target.value)}
            placeholder="Übersetzung"
            className="text-black flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddExample}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>

      {/* List of examples */}
      {newExamples.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-black">
            Hinzugefügte Beispiele:
          </h4>
          <ul className="mt-1 space-y-1">
            {newExamples.map((example, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
              >
                <span className="text-black">
                  <strong>{example.text}</strong> - {example.translation}
                </span>
                <button
                  onClick={() => handleRemoveExample(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExamplesManager;
