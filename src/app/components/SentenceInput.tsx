// components/SentenceInput.tsx
import React, { useState, useRef, useEffect } from "react";
import { Plus, Minus, Upload, Music, Mic, MicOff, Image } from "lucide-react";
import storageService from "../services/StorageService"; // Import storageService

interface SentenceInputProps {
  newExample: string;
  setNewExample: (val: string) => void;
  newExampleTranslation: string;
  setNewExampleTranslation: (val: string) => void;
  newExamples: { text: string; translation: string }[];
  handleAddExample: () => void;
  handleRemoveExample: (index: number) => void;
  onAddContent: (contentData?: any) => void;
}

const SentenceInput: React.FC<SentenceInputProps> = ({
  newExample,
  setNewExample,
  newExampleTranslation,
  setNewExampleTranslation,
  newExamples,
  handleAddExample,
  handleRemoveExample,
  onAddContent,
}) => {
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

  // Media handling functions
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

  // Validate required fields and show appropriate error message
  const validateFields = () => {
    if (!newExample || newExample.trim() === "") {
      setErrorMessage("Bitte geben Sie einen Text ein");
      setShowError(true);
      return false;
    }

    if (!newExampleTranslation || newExampleTranslation.trim() === "") {
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

  // Handle add content with audio
  const handleAddContentWithAudio = () => {
    if (!validateFields()) {
      return;
    }

    onAddContent({
      text: newExample,
      translation: newExampleTranslation,
      examples: newExamples,
      audioUrl: audioURL,
      imageUrl: imagePreview,
      soundFileName: audioFile?.name,
    });

    // Reset media states
    setImagePreview(null);
    setImageFile(null);
    setAudioURL(null);
    setAudioFile(null);

    // Reset input fields
    setNewExample("");
    setNewExampleTranslation("");
  };

  return (
    <div className="flex flex-col gap-3 mb-2 relative">
      {/* Error message popup - positioned at the top but not overlaying inputs */}
      {showError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 shadow-md">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Beispielsatz"
          value={newExample}
          onChange={(e) => setNewExample(e.target.value)}
          className="flex-1 p-2 border rounded bg-white text-black text-sm"
        />
        <input
          type="text"
          placeholder="Beispielsatz Übersetzung"
          value={newExampleTranslation}
          onChange={(e) => setNewExampleTranslation(e.target.value)}
          className="flex-1 p-2 border rounded bg-white text-black text-sm"
        />
        <div className="flex space-x-2">
          <button
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer flex items-center"
            onClick={handleAddExample}
          >
            <Plus size={18} />
          </button>
          {newExamples.length > 0 && (
            <button
              className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer flex items-center"
              onClick={() => handleRemoveExample(newExamples.length - 1)}
            >
              <Minus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Media options now including image upload - in grid layout */}
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

      {/* Display media previews */}
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
          <div className="relative flex-1">
            <audio controls src={audioURL} className="h-10 w-full"></audio>
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

      {newExamples.length > 0 && (
        <ul className="list-disc ml-4 mb-2">
          {newExamples.map((ex, idx) => (
            <li key={idx} className="text-sm cursor-pointer text-black">
              {ex.text} – {ex.translation}
            </li>
          ))}
        </ul>
      )}

      <button
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        onClick={handleAddContentWithAudio}
      >
        Hinzufügen
      </button>
    </div>
  );
};

export default SentenceInput;
