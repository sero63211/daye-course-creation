// components/VocabularySelector.tsx
import React, { useState, useEffect } from "react";
import { VocabularyItem } from "../utils/vocabularyUtils";

interface VocabularySelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: any) => void;
  groupedItems: Record<string, VocabularyItem[]>;
  isLoading: boolean;
  handleSelectVocabulary: (item: VocabularyItem) => void;
}

const VocabularySelector: React.FC<VocabularySelectorProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  groupedItems,
  isLoading,
  handleSelectVocabulary,
}) => {
  // State for vocabulary selection
  const [showVocabularySelector, setShowVocabularySelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [targetLanguage, setTargetLanguage] = useState<string>("german");
  const [searchResults, setSearchResults] = useState<VocabularyItem[]>([]);

  // Process search results separately
  useEffect(() => {
    if (!searchTerm.trim() || !groupedItems) {
      setSearchResults([]);
      return;
    }

    const results: VocabularyItem[] = [];
    const searchLower = searchTerm.toLowerCase();

    // Search through all topics and items
    Object.values(groupedItems).forEach((items) => {
      items.forEach((item) => {
        if (
          item.word.toLowerCase().includes(searchLower) ||
          item.translation.toLowerCase().includes(searchLower) ||
          (item.synonym &&
            item.synonym.some((syn) => syn.toLowerCase().includes(searchLower)))
        ) {
          results.push(item);
        }
      });
    });

    setSearchResults(results);
  }, [searchTerm, groupedItems]);

  return (
    <div className="mb-4 border p-4 rounded-md bg-gray-50">
      <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
        <label className="text-sm font-medium text-black">Sprache:</label>
        <select
          className="p-2 border rounded cursor-pointer text-black"
          value={selectedLanguage}
          onChange={(e) => {
            console.log("🔍 Language selection changed to:", e.target.value);
            setSelectedLanguage(e.target.value as any);
          }}
        >
          <option value="german">Deutsch</option>
          <option value="english">Englisch</option>
          <option value="arabic">Arabisch</option>
          <option value="french">Französisch</option>
          <option value="italian">Italienisch</option>
          <option value="dutch">Niederländisch</option>
          <option value="turkish">Türkisch</option>
        </select>

        <select
          className="p-2 border rounded cursor-pointer text-black"
          value={targetLanguage}
          onChange={(e) => {
            setTargetLanguage(e.target.value);
          }}
        >
          <option value="german">Deutsch</option>
          <option value="english">Englisch</option>
          <option value="arabic">Arabisch</option>
          <option value="french">Französisch</option>
          <option value="italian">Italienisch</option>
          <option value="dutch">Niederländisch</option>
          <option value="turkish">Türkisch</option>
        </select>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          onClick={() => {
            console.log("🔍 Toggle vocabulary selector button clicked");
            setShowVocabularySelector(!showVocabularySelector);
          }}
        >
          {showVocabularySelector
            ? "Vokabelauswahl schließen"
            : "Aus Vokabelliste wählen"}
        </button>
      </div>

      {/* Vocabulary Selection Panel */}
      {showVocabularySelector && (
        <div className="mt-2 p-4 border rounded bg-white">
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Vokabeln, Übersetzungen oder Synonyme durchsuchen..."
              value={searchTerm}
              onChange={(e) => {
                console.log("🔍 Search term changed:", e.target.value);
                setSearchTerm(e.target.value);
              }}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p>Lade Vokabeln...</p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {/* Show direct search results when searching */}
              {searchTerm.trim() !== "" && (
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-600 mb-2">
                    Suchergebnisse
                  </h3>
                  {searchResults.length === 0 ? (
                    <p className="text-gray-500 p-2">
                      Keine Ergebnisse gefunden.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {searchResults.map((item) => (
                        <li
                          key={item.id}
                          className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded bg-yellow-50"
                          onClick={() => handleSelectVocabulary(item)}
                        >
                          <span className="font-medium text-black">
                            {item.word}
                          </span>{" "}
                          -{" "}
                          <span className="text-black">{item.translation}</span>
                          {item.synonym?.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Synonyme: {item.synonym.join(", ")}
                            </div>
                          )}
                          <div className="text-xs text-gray-600">
                            Kategorie: {item.topic}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Only show topics when not searching or when explicitly requested */}
              {searchTerm.trim() === "" && (
                <>
                  {Object.keys(groupedItems).length === 0 ? (
                    <p className="text-gray-500 p-2">
                      Keine Vokabeln gefunden.
                    </p>
                  ) : (
                    Object.keys(groupedItems).map((topic) => (
                      <div key={topic} className="mb-2">
                        <h3
                          className="font-semibold text-blue-600 cursor-pointer flex items-center"
                          onClick={() => {
                            setExpandedTopics((prev) => ({
                              ...prev,
                              [topic]: !prev[topic],
                            }));
                          }}
                        >
                          <span
                            className={`mr-1 transition-transform ${
                              expandedTopics[topic] ? "transform rotate-90" : ""
                            }`}
                          >
                            ▶
                          </span>
                          {topic} ({groupedItems[topic].length})
                        </h3>

                        {/* Show items when topic is expanded */}
                        {expandedTopics[topic] && (
                          <ul className="ml-4 mt-1">
                            {groupedItems[topic].map((item) => (
                              <li
                                key={item.id}
                                className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
                                onClick={() => handleSelectVocabulary(item)}
                              >
                                <span className="font-medium text-black">
                                  {item.word}
                                </span>{" "}
                                -{" "}
                                <span className="text-black">
                                  {item.translation}
                                </span>
                                {item.synonym?.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Synonyme: {item.synonym.join(", ")}
                                  </div>
                                )}
                                {(item.audioURL || item.imageURL) && (
                                  <div className="text-xs text-black mt-1 flex gap-2">
                                    {item.audioURL && (
                                      <span className="text-blue-500">
                                        🔊 Audio verfügbar
                                      </span>
                                    )}
                                    {item.imageURL && (
                                      <span className="text-green-500">
                                        🖼️ Bild verfügbar
                                      </span>
                                    )}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularySelector;
