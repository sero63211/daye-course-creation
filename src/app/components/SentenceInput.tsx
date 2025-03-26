// components/SentenceInput.tsx
import React, { useState, useRef } from "react";

interface SentenceInputProps {
  newExample: string;
  setNewExample: (val: string) => void;
  newExampleTranslation: string;
  setNewExampleTranslation: (val: string) => void;
  newExamples: { text: string; translation: string }[];
  handleAddExample: () => void;
  handleRemoveExample: (index: number) => void;
  onAddContent: () => void;
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
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  // Refs for file inputs and media recorder
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Media handling functions
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
    <div className="flex flex-col gap-3 mb-2">
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
        <div className="flex gap-1">
          <button
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            onClick={handleAddExample}
          >
            +
          </button>
          {newExamples.length > 0 && (
            <button
              className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={() => handleRemoveExample(newExamples.length - 1)}
            >
              -
            </button>
          )}
        </div>
      </div>

      {/* Audio recording for sentences */}
      <div className="flex gap-2 mt-2">
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
        onClick={onAddContent}
      >
        Hinzufügen
      </button>
    </div>
  );
};

export default SentenceInput;
