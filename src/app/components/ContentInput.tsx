// components/ContentInput.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  useVocabulary,
  VocabularyItem,
  useDebounce,
} from "../utils/vocabularyUtils";
import SentenceInput from "./SentenceInput";
import ExplanationInput from "./ExplanationInput";
import VocabularySelector from "./VocabularySelector";

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

  // Refs für File-Inputs und MediaRecorder
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Explanation text
  const [explanationTitle, setExplanationTitle] = useState("");
  const [explanationText, setExplanationText] = useState("");

  // Vokabel-spezifische Zustände (nur falls noch benötigt)
  const [vocabularyAvailable, setVocabularyAvailable] =
    useState<boolean>(false);
  const [showVocabularySelector, setShowVocabularySelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [targetLanguage, setTargetLanguage] = useState<string>("german");

  // Sprache normalisieren
  const languageKey = languageName ? languageName.toLowerCase().trim() : "";
  console.log(
    `ContentInput: Using language key: "${languageKey}" from language name: "${languageName}"`
  );

  // Entferne den bisherigen Vokabel-Block und setze stattdessen den neuen, wiederverwendbaren Selector ein
  const handleSelectVocabularyFromSelector = (item: VocabularyItem) => {
    setNewText(item.word);
    setNewTranslation(item.translation);
    if (item.audioURL) setAudioURL(item.audioURL);
    if (item.imageURL) setImagePreview(item.imageURL);
  };

  // Media-Handling
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
        const file = new File([audioBlob], "recorded-audio.m4a", {
          type: "audio/m4a",
        });
        setAudioFile(file);
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

  // Wrapper für onAddContent, der auch Media-States zurücksetzt
  const handleAddContent = () => {
    onAddContent();
    // Reset der Media-Eingaben
    setImagePreview(null);
    setImageFile(null);
    setAudioURL(null);
    setAudioFile(null);
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

      {/* Vokabel-Tab */}
      {activeTab === "vocabulary" && (
        <>
          {/* Wiederverwendbarer VocabularySelector */}
          <VocabularySelector
            languageName={languageName}
            onSelect={handleSelectVocabularyFromSelector}
          />
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
              onClick={handleAddContent}
            >
              Hinzufügen
            </button>
          </div>
        </>
      )}

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

      {activeTab === "explanation" && (
        <ExplanationInput onAddContent={onAddContent} />
      )}
    </div>
  );
};

export default ContentInput;
