"use client";
import React, { useState, useEffect } from "react";
import { useVocabulary, VocabularyItem } from "../utils/vocabularyUtils";

interface ContentInputProps {
  newText: string;
  setNewText: (val: string) => void;
  newTranslation: string;
  setNewTranslation: (val: string) => void;
  newExample: string;
  setNewExample: (val: string) => void;
  newExampleTranslation: string;
  setNewExampleTranslation: (val: string) => void;
  newExamples: { text: string; translation: string }[];
  handleAddExample: () => void;
  handleRemoveExample: (index: number) => void;
  onAddContent: () => void;
  languageName: string;
}

const ContentInput: React.FC<ContentInputProps> = ({
  newText,
  setNewText,
  newTranslation,
  setNewTranslation,
  newExample,
  setNewExample,
  newExampleTranslation,
  setNewExampleTranslation,
  newExamples,
  handleAddExample,
  handleRemoveExample,
  onAddContent,
  languageName,
}) => {
  // State for language selection
  const [vocabularyAvailable, setVocabularyAvailable] =
    useState<boolean>(false);
  const [showVocabularySelector, setShowVocabularySelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Normalize the language name for consistent file naming
  // Safely handle undefined or empty language names
  const languageKey = languageName ? languageName.toLowerCase().trim() : "";

  console.log(
    `ContentInput: Using language key: "${languageKey}" from language name: "${languageName}"`
  );

  // Check if vocabulary file exists for this language
  useEffect(() => {
    const checkVocabularyAvailability = async () => {
      if (!languageKey) {
        console.log(
          "ContentInput: No language key available, vocabulary not available"
        );
        setVocabularyAvailable(false);
        return;
      }

      try {
        // Try to dynamically import the vocabulary file
        await import(`../assets/vocabulary-list-${languageKey}.json`);
        console.log(
          `ContentInput: Vocabulary file for "${languageKey}" is available`
        );
        setVocabularyAvailable(true);
      } catch (error) {
        console.log(
          `ContentInput: Vocabulary file for "${languageKey}" not available:`,
          error
        );
        setVocabularyAvailable(false);
        // Hide vocabulary selector if showing
        setShowVocabularySelector(false);
      }
    };

    checkVocabularyAvailability();
  }, [languageKey]);

  // Load vocabulary data based on the selected language
  const { groupedItems, isLoading, error } = useVocabulary(languageKey);

  // Set vocabulary in input fields
  const handleSelectVocabulary = (item: VocabularyItem) => {
    setNewText(item.word);
    setNewTranslation(item.translation);
    if (item.synonym && item.synonym.length > 0) {
      // Add synonyms as examples if available
      const currentExamples = [...newExamples];
      item.synonym.forEach((syn) => {
        currentExamples.push({
          text: syn,
          translation: item.translation,
        });
      });
      // These would need to be handled in the parent component
    }
    setShowVocabularySelector(false);
  };

  // Filter vocabulary based on search term
  const filteredTopics =
    searchTerm.trim() === ""
      ? Object.keys(groupedItems)
      : Object.keys(groupedItems).filter(
          (topic) =>
            topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            groupedItems[topic].some(
              (item) =>
                item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.translation
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
        );

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 cursor-pointer text-black">
        1. Inhalte hinzufügen
      </h2>

      {/* Language and vocabulary selection - only show if vocabulary is available */}
      {vocabularyAvailable && (
        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
            <label className="text-sm font-medium text-black">
              Sprache: {languageName || "Nicht definiert"}
            </label>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              onClick={() => setShowVocabularySelector(!showVocabularySelector)}
            >
              {showVocabularySelector
                ? "Vokabelauswahl schließen"
                : "Vokabel auswählen"}
            </button>
          </div>

          {/* Vocabulary selector */}
          {showVocabularySelector && (
            <div className="mt-2 p-4 border rounded bg-white">
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Vokabeln durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <p className="text-black">Lade Vokabeldaten...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : filteredTopics.length === 0 ? (
                <p className="text-black">Keine Vokabeln gefunden</p>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {filteredTopics.map((topic) => (
                    <div key={topic} className="mb-2">
                      <h3
                        className="font-semibold text-blue-600 cursor-pointer"
                        onClick={() =>
                          setSelectedTopic(
                            selectedTopic === topic ? null : topic
                          )
                        }
                      >
                        {topic} ({groupedItems[topic].length})
                      </h3>

                      {selectedTopic === topic && (
                        <ul className="ml-4 mt-1">
                          {groupedItems[topic].map((item) => (
                            <li
                              key={item.id}
                              className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-black"
                              onClick={() => handleSelectVocabulary(item)}
                            >
                              <span className="font-medium">{item.word}</span> -{" "}
                              {item.translation}
                              {item.synonym.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Synonyme: {item.synonym.join(", ")}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Original input fields */}
      <div className="flex flex-col gap-4 mb-4 bg-white">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded bg-white text-black cursor-pointer"
            placeholder="Inhalt (z. B. Vokabel, Satz)"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <input
            type="text"
            className="flex-1 p-2 border rounded bg-white text-black cursor-pointer"
            placeholder="Übersetzung"
            value={newTranslation}
            onChange={(e) => setNewTranslation(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Beispielsatz"
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            className="flex-1 p-2 border rounded bg-white text-black cursor-pointer"
          />
          <input
            type="text"
            placeholder="Beispielsatz Übersetzung"
            value={newExampleTranslation}
            onChange={(e) => setNewExampleTranslation(e.target.value)}
            className="flex-1 p-2 border rounded bg-white text-black cursor-pointer"
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            onClick={handleAddExample}
          >
            +
          </button>
          {newExamples.length > 0 && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={() => handleRemoveExample(newExamples.length - 1)}
            >
              -
            </button>
          )}
        </div>
        {newExamples.length > 0 && (
          <ul className="list-disc ml-4">
            {newExamples.map((ex, idx) => (
              <li key={idx} className="text-sm cursor-pointer text-black">
                {ex.text} – {ex.translation}
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          onClick={onAddContent}
        >
          Hinzufügen
        </button>
      </div>
    </div>
  );
};

export default ContentInput;
