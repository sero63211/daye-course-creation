"use client";
import React, { useState, useRef } from "react";
import { VocabularyItem } from "../utils/vocabularyUtils";
import InputField from "./InputField";
import VocabularySelector from "./VocabularySelector";
import { Image, Mic, MicOff, Music } from "lucide-react";
import storageService from "../services/StorageService";

interface VocabularyInputProps {
  onAddContent: (vocabularyData: any) => void;
  languageName: string;
}

const VocabularyInput: React.FC<VocabularyInputProps> = ({
  onAddContent,
  languageName,
}) => {
  // State für Vokabel-Daten
  const [newText, setNewText] = useState<string>("");
  const [newTranslation, setNewTranslation] = useState<string>("");

  // Media states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  // Validation states
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs für File-Inputs und Media-Recorder
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-hide error after 3 seconds
  React.useEffect(() => {
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

  // Handle vocabulary selection from selector
  const handleSelectVocabularyFromSelector = (item: VocabularyItem) => {
    setNewText(item.word);
    setNewTranslation(item.translation);

    // Handle audio
    if (item.audioURL) {
      setAudioURL(item.audioURL);
    }

    // Handle image
    if (item.imageURL) {
      setImagePreview(item.imageURL);
    }
  };

  // Media handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      // Register blob with storageService
      storageService.registerBlobForUpload(url, file);
      setImagePreview(url);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      // Register blob with storageService
      storageService.registerBlobForUpload(url, file);
      setAudioURL(url);
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
        // Register blob with storageService
        storageService.registerBlobForUpload(audioUrl, audioBlob);
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

  // Validate required fields for vocabulary
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

  // Handle adding vocabulary content
  const handleAddVocabularyContent = () => {
    if (!validateVocabularyFields()) {
      return;
    }

    const contentData = {
      text: newText,
      translation: newTranslation,
      examples: [],
      audioUrl: audioURL,
      imageUrl: imagePreview,
      soundFileName: audioFile?.name,
      contentType: "vocabulary",
      type: "vocabulary",
      uniqueId: crypto.randomUUID(),
    };

    onAddContent(contentData);

    // Reset media states
    setImagePreview(null);
    setImageFile(null);
    setAudioURL(null);
    setAudioFile(null);

    // Reset input fields
    setNewText("");
    setNewTranslation("");
  };

  return (
    <div className="flex flex-col gap-3 mb-2">
      {/* Error message popup */}
      {showError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 shadow-md">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Vocabulary Selector */}
      <VocabularySelector
        languageName={languageName}
        onSelect={handleSelectVocabularyFromSelector}
      />

      <div className="flex flex-col md:flex-row gap-2">
        <InputField
          value={newText}
          onChange={setNewText}
          placeholder="Vokabel"
          required
        />
        <InputField
          value={newTranslation}
          onChange={setNewTranslation}
          placeholder="Übersetzung"
          required
        />
      </div>

      {/* Media Buttons */}
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
        onClick={handleAddVocabularyContent}
      >
        Als Vokabel hinzufügen
      </button>
    </div>
  );
};

export default VocabularyInput;
