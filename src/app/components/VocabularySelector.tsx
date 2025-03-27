// components/vocabularyselector.tsx
import React, { useState, useEffect } from "react";
import {
  useVocabulary,
  VocabularyItem,
  useDebounce,
} from "../utils/vocabularyUtils";

interface VocabularySelectorProps {
  languageName: string;
  onSelect: (item: VocabularyItem) => void;
}

const VocabularySelector: React.FC<VocabularySelectorProps> = ({
  languageName,
  onSelect,
}) => {
  const languageKey = languageName ? languageName.toLowerCase().trim() : "";
  const [vocabularyAvailable, setVocabularyAvailable] =
    useState<boolean>(false);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>("german");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Überprüfe, ob für die Sprache ein Vokabelfile existiert
  useEffect(() => {
    const checkVocabularyAvailability = async () => {
      if (!languageKey) {
        setVocabularyAvailable(false);
        return;
      }
      try {
        const response = await fetch(
          `/assets/vocabulary-list-${languageKey}.json`,
          { method: "HEAD" }
        );
        setVocabularyAvailable(response.ok);
      } catch (error) {
        setVocabularyAvailable(false);
      }
    };
    checkVocabularyAvailability();
  }, [languageKey]);

  const { groupedItems, isLoading, error } = useVocabulary(
    languageKey,
    targetLanguage
  );

  const filteredTopics =
    debouncedSearchTerm.trim() === ""
      ? Object.keys(groupedItems)
      : Object.keys(groupedItems).filter(
          (topic) =>
            topic.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            groupedItems[topic].some(
              (item) =>
                item.word
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()) ||
                item.translation
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
            )
        );

  const filteredItems =
    debouncedSearchTerm.trim() === ""
      ? []
      : Object.values(groupedItems)
          .flat()
          .filter(
            (item) =>
              item.word
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              item.translation
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              (item.synonym &&
                item.synonym.some((syn) =>
                  syn.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                ))
          );

  const handleSelectVocabulary = (item: VocabularyItem) => {
    onSelect(item);
    setShowSelector(false);
  };

  if (!vocabularyAvailable) return null;

  return (
    <div className="mb-3">
      <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
        <label className="text-sm font-medium text-black">
          Sprache: {languageName || "Nicht definiert"}
        </label>
        <select
          className="p-2 border rounded text-black cursor-pointer text-sm"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
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
          className="px-3 py-1.5 bg-blue-500 text-sm text-white rounded hover:bg-blue-600 cursor-pointer"
          onClick={() => setShowSelector(!showSelector)}
        >
          {showSelector ? "Vokabelauswahl schließen" : "Vokabel auswählen"}
        </button>
      </div>
      {showSelector && (
        <div className="mt-2 p-3 border rounded bg-white">
          <div className="mb-3">
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Vokabeln durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading ? (
            <p className="text-black">Lade Vokabeldaten...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {debouncedSearchTerm.trim() !== "" && (
                <div className="mb-2">
                  <h3 className="font-semibold text-blue-600 mb-2 text-sm">
                    Suchergebnisse
                  </h3>
                  {filteredItems.length === 0 ? (
                    <p className="text-gray-500 p-2 text-black">
                      Keine Ergebnisse gefunden.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {filteredItems.map((item) => (
                        <li
                          key={item.id}
                          className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded bg-yellow-50 text-sm"
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
              )}
              {debouncedSearchTerm.trim() !== "" &&
                filteredItems.length === 0 &&
                filteredTopics.length === 0 && (
                  <p className="text-gray-500 p-2 text-black mb-2">
                    Keine Ergebnisse für "{debouncedSearchTerm}" gefunden.
                  </p>
                )}
              {(debouncedSearchTerm.trim() === ""
                ? Object.keys(groupedItems)
                : filteredTopics
              ).map((topic) => (
                <div key={topic} className="mb-2">
                  <h3
                    className="font-semibold text-blue-600 cursor-pointer text-sm"
                    onClick={() =>
                      setSelectedTopic(selectedTopic === topic ? null : topic)
                    }
                  >
                    {topic} ({groupedItems[topic].length})
                  </h3>
                  {selectedTopic === topic && (
                    <ul className="ml-4 mt-1">
                      {groupedItems[topic].map((item) => (
                        <li
                          key={item.id}
                          className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularySelector;
