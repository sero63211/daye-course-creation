// VocabularySelector.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  VocabularyItem,
  normalizeText,
  useDebounce,
} from "../utils/vocabularyUtils";

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
  const [showVocabularySelector, setShowVocabularySelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [searchResults, setSearchResults] = useState<VocabularyItem[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showPreviewImage, setShowPreviewImage] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const performSearch = (
    term: string,
    items: VocabularyItem[]
  ): VocabularyItem[] => {
    if (!term.trim()) return [];
    const normalizedTerm = normalizeText(term.trim().toLowerCase());
    return items.filter((item) => {
      const normalizedWord = normalizeText(item.word);
      const normalizedTranslation = normalizeText(item.translation);
      const normalizedSynonyms = item.synonym?.map(normalizeText) || [];
      return (
        normalizedWord.includes(normalizedTerm) ||
        normalizedTranslation.includes(normalizedTerm) ||
        normalizedSynonyms.some((syn) => syn.includes(normalizedTerm))
      );
    });
  };

  const filteredTopics = useMemo(() => {
    if (!debouncedSearchTerm.trim() || !groupedItems) {
      return Object.keys(groupedItems);
    }
    const normalizedSearchTerm = normalizeText(
      debouncedSearchTerm.trim().toLowerCase()
    );
    return Object.keys(groupedItems).filter((topic) => {
      return (
        normalizeText(topic).includes(normalizedSearchTerm) ||
        groupedItems[topic].some((item) => {
          const normalizedWord = normalizeText(item.word);
          const normalizedTranslation = normalizeText(item.translation);
          const normalizedSynonyms = item.synonym?.map(normalizeText) || [];
          return (
            normalizedWord.includes(normalizedSearchTerm) ||
            normalizedTranslation.includes(normalizedSearchTerm) ||
            normalizedSynonyms.some((syn) => syn.includes(normalizedSearchTerm))
          );
        })
      );
    });
  }, [debouncedSearchTerm, groupedItems]);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const newExpandedTopics: Record<string, boolean> = {};
      filteredTopics.forEach((topic) => {
        newExpandedTopics[topic] = true;
      });
      setExpandedTopics(newExpandedTopics);
    } else if (Object.keys(groupedItems).length > 0) {
      const hasExpandedTopics = Object.values(expandedTopics).some(
        (isExpanded) => isExpanded
      );
      if (!hasExpandedTopics) {
        setExpandedTopics({ [Object.keys(groupedItems)[0]]: true });
      }
    }
  }, [debouncedSearchTerm, filteredTopics, groupedItems]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim() || !groupedItems) {
      setSearchResults([]);
      return;
    }
    const allItems = Object.values(groupedItems).flat();
    const results = performSearch(debouncedSearchTerm, allItems);
    setSearchResults(results);
    console.log(
      `Found ${results.length} direct search results for "${debouncedSearchTerm}"`
    );
  }, [debouncedSearchTerm, groupedItems]);

  const playAudio = (audioURL: string, itemId: string) => {
    if (playingAudio === itemId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioURL;
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
        setPlayingAudio(itemId);
      }
    }
  };

  useEffect(() => {
    const handleEnded = () => {
      setPlayingAudio(null);
    };
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [audioRef]);

  useEffect(() => {
    console.log("Available topics:", Object.keys(groupedItems));
    Object.entries(groupedItems).forEach(([topic, items]) => {
      console.log(`Topic: ${topic}, Items: ${items.length}`);
    });
    console.log(
      "Total vocabulary items:",
      Object.values(groupedItems).reduce((sum, items) => sum + items.length, 0)
    );
  }, [groupedItems]);

  return (
    <div className="mb-4 border p-4 rounded-md bg-gray-50">
      <audio ref={audioRef} className="hidden" />
      <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
        <label className="text-sm font-medium text-black">Sprache:</label>
        <select
          className="p-2 border rounded cursor-pointer bg-white text-black"
          value={selectedLanguage}
          onChange={(e) => {
            console.log("🔍 Language selection changed to:", e.target.value);
            setSelectedLanguage(e.target.value);
          }}
        >
          <option value="english">Englisch</option>
          <option value="german">Deutsch</option>
          <option value="arabic">Arabisch</option>
          <option value="french">Französisch</option>
          <option value="italian">Italienisch</option>
          <option value="dutch">Niederländisch</option>
          <option value="turkish">Türkisch</option>
          <option value="kurdish">Kurdisch</option>
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
      <div className="text-xs text-gray-500 mb-2">
        {Object.keys(groupedItems).length > 0 ? (
          <span>
            Verfügbare Themen: {Object.keys(groupedItems).length}, Wörter:{" "}
            {Object.values(groupedItems).reduce(
              (sum, items) => sum + items.length,
              0
            )}
          </span>
        ) : (
          <span>Keine Vokabeldaten geladen</span>
        )}
      </div>
      {showPreviewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setShowPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-screen p-2 bg-white rounded">
            <button
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowPreviewImage(null);
              }}
            >
              ✕
            </button>
            <img
              src={showPreviewImage}
              alt="Vocabulary preview"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      {showVocabularySelector && (
        <div className="mt-2 p-4 border rounded bg-white">
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded bg-white text-black"
              placeholder="Vokabeln, Übersetzungen oder Synonyme durchsuchen..."
              value={searchTerm}
              onChange={(e) => {
                console.log("🔍 Search term changed:", e.target.value);
                setSearchTerm(e.target.value);
              }}
            />
            <div className="text-xs text-gray-500 mt-1">
              Suche startet 0,3 Sekunden nach der letzten Eingabe...
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-black">Lade Vokabeln...</p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {debouncedSearchTerm.trim() !== "" && (
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-600 mb-2">
                    Suchergebnisse
                  </h3>
                  {searchResults.length === 0 ? (
                    <p className="text-gray-500 p-2 text-black">
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
                          <div className="flex justify-between">
                            <span className="font-medium text-black">
                              {item.word}
                            </span>
                            <span className="text-black">
                              {item.translation}
                            </span>
                          </div>
                          {item.synonym?.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Synonyme: {item.synonym.join(", ")}
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-gray-600">
                              Kategorie: {item.topic}
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              {item.audioURL && (
                                <button
                                  className="text-blue-500 p-1 rounded hover:bg-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playAudio(item.audioURL!, item.id);
                                  }}
                                >
                                  {playingAudio === item.id
                                    ? "🔊 Stop"
                                    : "🔈 Abspielen"}
                                </button>
                              )}
                              {item.imageURL && (
                                <button
                                  className="text-green-500 p-1 rounded hover:bg-green-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPreviewImage(item.imageURL);
                                  }}
                                >
                                  🖼️ Bild anzeigen
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <>
                {debouncedSearchTerm.trim() !== "" &&
                  searchResults.length === 0 &&
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
                    {expandedTopics[topic] && (
                      <ul className="ml-4 mt-1">
                        {groupedItems[topic].map((item) => (
                          <li
                            key={item.id}
                            className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => handleSelectVocabulary(item)}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-black">
                                {item.word}
                              </span>
                              <span className="text-black">
                                {item.translation}
                              </span>
                            </div>
                            {item.synonym?.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Synonyme: {item.synonym.join(", ")}
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-xs text-gray-600">
                                Kategorie: {item.topic}
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                {item.audioURL && (
                                  <button
                                    className="text-blue-500 p-1 rounded hover:bg-blue-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playAudio(item.audioURL!, item.id);
                                    }}
                                  >
                                    {playingAudio === item.id
                                      ? "🔊 Stop"
                                      : "🔈 Abspielen"}
                                  </button>
                                )}
                                {item.imageURL && (
                                  <button
                                    className="text-green-500 p-1 rounded hover:bg-green-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowPreviewImage(item.imageURL);
                                    }}
                                  >
                                    🖼️ Bild anzeigen
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularySelector;
