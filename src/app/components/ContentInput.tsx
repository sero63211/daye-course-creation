"use client";
import React, { useState, useEffect, useRef } from "react";
import { useVocabulary, VocabularyItem } from "../utils/vocabularyUtils";
import SentenceInput from "./SentenceInput";
import ExplanationInput from "./ExplanationInput";

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
  // Tab state
  const [activeTab, setActiveTab] = useState<
    "vocabulary" | "sentences" | "explanation"
  >("vocabulary");

  // Media states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  // Refs for file inputs and media recorder
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Explanation text formatting
  const [explanationTitle, setExplanationTitle] = useState("");
  const [explanationText, setExplanationText] = useState("");

  // State for language selection
  const [vocabularyAvailable, setVocabularyAvailable] =
    useState<boolean>(false);
  const [showVocabularySelector, setShowVocabularySelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetLanguage, setTargetLanguage] = useState<string>("german");

  // Normalize the language name for consistent file naming
  const languageKey = languageName ? languageName.toLowerCase().trim() : "";

  console.log(
    `ContentInput: Using language key: "${languageKey}" from language name: "${languageName}"`
  );

  // Check if vocabulary file exists for this language
  useEffect(() => {
    const checkVocabularyAvailability = async () => {
      if (!languageKey) {
        setVocabularyAvailable(false);
        return;
      }

      try {
        // Simple HEAD request to check if file exists
        const response = await fetch(
          `/assets/vocabulary-list-${languageKey}.json`,
          {
            method: "HEAD",
          }
        );

        setVocabularyAvailable(response.ok);

        if (response.ok) {
          console.log(
            `ContentInput: Vocabulary file for "${languageKey}" is available`
          );
        } else {
          console.log(
            `ContentInput: Vocabulary file for "${languageKey}" not available, but continuing without error`
          );
        }
      } catch (error) {
        // Don't throw errors, just mark as unavailable
        console.log(
          `ContentInput: Error checking vocabulary file for "${languageKey}"`
        );
        setVocabularyAvailable(false);
      }
    };

    checkVocabularyAvailability();
  }, [languageKey]);

  // Load vocabulary data based on the selected language
  const { groupedItems, isLoading, error } = useVocabulary(
    languageKey,
    targetLanguage
  );

  // Set vocabulary in input fields
  const handleSelectVocabulary = (item: VocabularyItem) => {
    setNewText(item.word);
    setNewTranslation(item.translation);

    // Set audio URL if available from vocabulary
    if (item.audioURL) {
      setAudioURL(item.audioURL);
    }

    // Set image preview if available from vocabulary
    if (item.imageURL) {
      setImagePreview(item.imageURL);
    }

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

  // Filtered items based on search term (for direct item display)
  const filteredItems =
    searchTerm.trim() === ""
      ? []
      : Object.values(groupedItems)
          .flat()
          .filter(
            (item) =>
              item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.translation
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (item.synonym &&
                item.synonym.some((syn) =>
                  syn.toLowerCase().includes(searchTerm.toLowerCase())
                ))
          );

  // Media handling functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/m4a",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        // Convert to File object
        const file = new File([audioBlob], "recorded-audio.m4a", {
          type: "audio/m4a",
        });
        setAudioFile(file);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Fehler beim Starten der Aufnahme. Bitte Mikrofonzugriff erlauben."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "vocabulary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("vocabulary")}
            >
              Vokabeln
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "sentences"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("sentences")}
            >
              Sätze
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "explanation"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("explanation")}
            >
              Erklärungstext
            </button>
          </li>
        </ul>
      </div>

      {/* Vocabulary Tab Content */}
      {activeTab === "vocabulary" && (
        <>
          {/* Language and vocabulary selection - only show if vocabulary is available */}
          {vocabularyAvailable && (
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
                  onClick={() =>
                    setShowVocabularySelector(!showVocabularySelector)
                  }
                >
                  {showVocabularySelector
                    ? "Vokabelauswahl schließen"
                    : "Vokabel auswählen"}
                </button>
              </div>

              {/* Vocabulary selector */}
              {showVocabularySelector && (
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
                      {/* Direct search results when searching */}
                      {searchTerm.trim() !== "" && (
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
                                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded bg-yellow-50"
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

                      {/* Always show all topics or filtered topics */}

                      <>
                        {/* If we're searching and have no direct results, show this message */}
                        {searchTerm.trim() !== "" &&
                          filteredItems.length === 0 &&
                          filteredTopics.length === 0 && (
                            <p className="text-gray-500 p-2 text-black mb-2">
                              Keine Ergebnisse für "{searchTerm}" gefunden.
                            </p>
                          )}

                        {/* Show all topics when not searching, or filtered topics when searching */}
                        {(searchTerm.trim() === ""
                          ? Object.keys(groupedItems)
                          : filteredTopics
                        ).map((topic) => (
                          <div key={topic} className="mb-2">
                            <h3
                              className="font-semibold text-blue-600 cursor-pointer text-sm"
                              onClick={() =>
                                setSelectedTopic(
                                  selectedTopic === topic ? null : topic
                                )
                              }
                            >
                              {topic} ({groupedItems[topic].length})
                            </h3>

                            {/* Always show items for the selected topic */}
                            {selectedTopic === topic && (
                              <ul className="ml-4 mt-1">
                                {groupedItems[topic].map((item) => (
                                  <li
                                    key={item.id}
                                    className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded text-black text-sm"
                                    onClick={() => handleSelectVocabulary(item)}
                                  >
                                    <span className="font-medium">
                                      {item.word}
                                    </span>{" "}
                                    - {item.translation}
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
                        ))}
                      </>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Input fields for vocabulary */}
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded bg-white text-black text-sm"
                placeholder="Vokabel"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 p-2 border rounded bg-white text-black text-sm"
                placeholder="Übersetzung"
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
              />
            </div>

            {/* Media upload section */}
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <div className="flex-1 flex gap-2">
                <button
                  className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => imageInputRef.current?.click()}
                >
                  Bild hochladen
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                />

                <button
                  className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => audioInputRef.current?.click()}
                >
                  Audio hochladen
                </button>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  ref={audioInputRef}
                  onChange={handleAudioUpload}
                />

                {!isRecording ? (
                  <button
                    className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={startRecording}
                  >
                    Audio aufnehmen
                  </button>
                ) : (
                  <button
                    className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 animate-pulse"
                    onClick={stopRecording}
                  >
                    Aufnahme stoppen
                  </button>
                )}
              </div>
            </div>

            {/* Media previews */}
            <div className="flex gap-4 mt-2">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Vorschau"
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {audioURL && (
                <div className="relative">
                  <audio controls src={audioURL} className="h-10"></audio>
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => {
                      setAudioURL(null);
                      setAudioFile(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              onClick={onAddContent}
            >
              Hinzufügen
            </button>
          </div>
        </>
      )}

      {/* Sentences Tab Content */}
      {activeTab === "sentences" && (
        <SentenceInput
          newExample={newExample}
          setNewExample={setNewExample}
          newExampleTranslation={newExampleTranslation}
          setNewExampleTranslation={setNewExampleTranslation}
          newExamples={newExamples}
          handleAddExample={handleAddExample}
          handleRemoveExample={handleRemoveExample}
          onAddContent={onAddContent}
        />
      )}

      {/* Explanation Text Tab */}
      {activeTab === "explanation" && (
        <ExplanationInput onAddContent={onAddContent} />
      )}
    </div>
  );
};

export default ContentInput;
