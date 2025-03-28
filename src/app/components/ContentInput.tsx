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
import { Image, Upload, Mic, MicOff, Music } from "lucide-react";

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
  onAddContent: (contentData: any) => void;
  onAddVocabulary?: (contentData: any) => void;
  onAddSentence?: (contentData: any) => void;
  onAddExplanation?: (contentData: any) => void;
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
  onAddVocabulary,
  onAddSentence,
  onAddExplanation,
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

  // Validation states
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs for file inputs and media recorder
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Vocabulary-specific states (only if still needed)
  const [vocabularyAvailable, setVocabularyAvailable] =
    useState<boolean>(false);
  const [showVocabularySelector, setShowVocabularySelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [targetLanguage, setTargetLanguage] = useState<string>("german");

  // Auto-hide error after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showError]);

  // Normalize language
  const languageKey = languageName ? languageName.toLowerCase().trim() : "";
  console.log(
    `ContentInput: Using language key: "${languageKey}" from language name: "${languageName}"`
  );

  // Handle vocabulary selection
  const handleSelectVocabularyFromSelector = (item: VocabularyItem) => {
    console.log("Selected vocabulary item:", item);
    setNewText(item.word);
    setNewTranslation(item.translation);

    // Handle audio
    if (item.audioURL) {
      console.log("Setting audio URL:", item.audioURL);
      setAudioURL(item.audioURL);
    }

    // Handle image
    if (item.imageURL) {
      console.log("Setting image URL:", item.imageURL);
      setImagePreview(item.imageURL);
    }
  };

  // Media handling
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
      setErrorMessage(
        "Fehler beim Starten der Aufnahme. Bitte Mikrofonzugriff erlauben."
      );
      setShowError(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Validate required fields for vocabulary tab
  const validateVocabularyFields = () => {
    if (!newText || newText.trim() === "") {
      setErrorMessage("Bitte geben Sie eine Vokabel ein");
      setShowError(true);
      return false;
    }

    if (!newTranslation || newTranslation.trim() === "") {
      setErrorMessage("Bitte geben Sie eine Übersetzung ein");
      setShowError(true);
      return false;
    }

    if (!audioURL) {
      setErrorMessage(
        "Bitte laden Sie eine Audio-Datei hoch oder nehmen Sie Audio auf"
      );
      setShowError(true);
      return false;
    }

    return true;
  };

  // Modified to pass complete content data including media URLs and correct content types
  const handleAddContent = () => {
    // Validate fields based on active tab
    if (activeTab === "vocabulary" && !validateVocabularyFields()) {
      return;
    }

    // Map tab types to correct content types
    let contentType: string;
    let type: string;

    switch (activeTab) {
      case "vocabulary":
        contentType = "vocabulary";
        type = "vocabulary";
        break;
      case "sentences":
        contentType = "sentence";
        type = "sentence";
        break;
      case "explanation":
        contentType = "information";
        type = "explanation";
        break;
      default:
        contentType = "vocabulary";
        type = "vocabulary";
    }

    // Create the content data object with both type and contentType
    const contentData = {
      text: newText,
      translation: newTranslation,
      examples: newExamples,
      audioUrl: audioURL,
      imageUrl: imagePreview,
      soundFileName: audioFile?.name,
      contentType: contentType, // Add the new contentType property
      type: type, // Keep the original type for backward compatibility
    };

    // Use the specific handlers if available, otherwise fallback to the general handler
    if (activeTab === "vocabulary" && onAddVocabulary) {
      onAddVocabulary(contentData);
    } else if (activeTab === "sentences" && onAddSentence) {
      onAddSentence(contentData);
    } else if (activeTab === "explanation" && onAddExplanation) {
      onAddExplanation(contentData);
    } else {
      // Fallback to the general handler
      onAddContent(contentData);
    }

    // Reset media states
    setImagePreview(null);
    setImageFile(null);
    setAudioURL(null);
    setAudioFile(null);

    // Reset input fields
    setNewText("");
    setNewTranslation("");
  };

  // Update tab handlers for SentenceInput and ExplanationInput
  const handleSentenceAdd = (sentenceData: any) => {
    const enhancedData = {
      ...sentenceData,
      contentType: "sentence",
      type: "sentence",
    };

    if (onAddSentence) {
      onAddSentence(enhancedData);
    } else {
      onAddContent(enhancedData);
    }
  };

  const handleExplanationAdd = (explanationData: any) => {
    console.log("Explanation data received:", explanationData);

    // Make sure we have the correct structure that matches what CreatedContentDisplay expects
    const enhancedData = {
      ...explanationData,
      // Ensure these fields exist and are properly named
      text: explanationData.title || explanationData.text,
      translation: explanationData.text || explanationData.translation,
      contentType: "information",
      type: "explanation",
      // Generate a unique ID if needed
      uniqueId: explanationData.uniqueId || Date.now().toString(),
    };

    console.log("Enhanced explanation data:", enhancedData);

    if (onAddExplanation) {
      onAddExplanation(enhancedData);
    } else {
      onAddContent(enhancedData);
    }
  };

  return (
    <div className="p-4 relative">
      {/* Error message popup - modified to not overlay inputs */}
      {showError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 shadow-md">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

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

            {/* Media Buttons - New vertical layout with grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              <button
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image size={18} className="mr-2" />
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
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                onClick={() => audioInputRef.current?.click()}
              >
                <Music size={18} className="mr-2" />
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
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                  onClick={startRecording}
                >
                  <Mic size={18} className="mr-2" />
                  Audio aufnehmen
                </button>
              ) : (
                <button
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 animate-pulse flex items-center justify-center"
                  onClick={stopRecording}
                >
                  <MicOff size={18} className="mr-2" />
                  Aufnahme stoppen
                </button>
              )}
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
              Als Vokabel hinzufügen
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
          onAddContent={handleSentenceAdd}
        />
      )}

      {activeTab === "explanation" && (
        <ExplanationInput onAddContent={handleExplanationAdd} />
      )}
    </div>
  );
};

export default ContentInput;
