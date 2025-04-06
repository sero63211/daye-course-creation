// components/MediaUploader.tsx
import React, { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { VocabularyItem } from "../utils/vocabularyUtils";
import storageService from "../services/StorageService"; // Import storageService

interface MediaUploaderProps {
  audioFile: File | null;
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  recordedAudio: Blob | null;
  setRecordedAudio: React.Dispatch<React.SetStateAction<Blob | null>>;
  currentVocabItem: VocabularyItem | null;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  audioFile,
  setAudioFile,
  imageFile,
  setImageFile,
  recordedAudio,
  setRecordedAudio,
  currentVocabItem,
}) => {
  // State for audio recording
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Media file handlers
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setRecordedAudio(null); // Clear any recorded audio

      // Create blob URL and register it with storage service
      const audioUrl = URL.createObjectURL(file);
      storageService.registerBlobForUpload(audioUrl, file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create blob URL and register it with storage service
      const imageUrl = URL.createObjectURL(file);
      storageService.registerBlobForUpload(imageUrl, file);
    }
  };

  // Audio recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setRecordedAudio(audioBlob);
        setAudioFile(null); // Clear any uploaded audio

        // Create blob URL and register it with storage service
        const audioUrl = URL.createObjectURL(audioBlob);
        storageService.registerBlobForUpload(audioUrl, audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Zugriff auf das Mikrofon fehlgeschlagen. Bitte Mikrofonberechtigung erteilen."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks of the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-md font-medium text-black mb-2">
        Medien hinzufügen (optional)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Audio section */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Audio
          </label>

          <div className="flex flex-col space-y-2">
            {/* Display existing audio from selected vocabulary if available */}
            {(currentVocabItem?.audioURL || currentVocabItem?.audioURL) && (
              <div className="mb-2">
                <p className="text-sm text-black mb-1">
                  Vorhandene Audiodatei:
                </p>
                <audio controls className="w-full">
                  <source
                    src={currentVocabItem.audioURL || currentVocabItem.audioURL}
                  />
                  Dein Browser unterstützt das Audio-Element nicht.
                </audio>
              </div>
            )}

            {/* Audio recording when no vocabulary audio is available */}
            {!(currentVocabItem?.audioURL || currentVocabItem?.audioURL) && (
              <>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-3 py-2 rounded-md flex items-center ${
                      isRecording
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff size={16} className="mr-1" />
                        <span>Aufnahme stoppen</span>
                      </>
                    ) : (
                      <>
                        <Mic size={16} className="mr-1" />
                        <span>Audio aufnehmen</span>
                      </>
                    )}
                  </button>

                  {recordedAudio && !isRecording && (
                    <button
                      onClick={() => setRecordedAudio(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Aufnahme löschen
                    </button>
                  )}
                </div>

                {/* Recorded audio preview */}
                {recordedAudio && !isRecording && (
                  <div className="mt-2">
                    <audio controls className="w-full">
                      <source
                        src={URL.createObjectURL(recordedAudio)}
                        type="audio/wav"
                      />
                      Dein Browser unterstützt das Audio-Element nicht.
                    </audio>
                  </div>
                )}

                {/* Or text */}
                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-sm text-gray-500">ODER</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Audio file upload */}
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="audio/x-m4a,audio/*"
                    onChange={handleAudioUpload}
                    className="text-black w-full p-2 border border-gray-300 rounded-md"
                  />
                  {audioFile && (
                    <button
                      onClick={() => setAudioFile(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Uploaded audio preview */}
                {audioFile && (
                  <div className="mt-2">
                    <audio controls className="w-full">
                      <source
                        src={URL.createObjectURL(audioFile)}
                        type={audioFile.type}
                      />
                      Dein Browser unterstützt das Audio-Element nicht.
                    </audio>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Bild
          </label>

          {/* Display existing image from selected vocabulary if available */}
          {(currentVocabItem?.imageURL || currentVocabItem?.imageURL) && (
            <div className="mb-3">
              <p className="text-sm text-black mb-1">Vorhandenes Bild:</p>
              <img
                src={currentVocabItem.imageURL || currentVocabItem.imageURL}
                alt="Vorhandenes Bild"
                className="max-h-32 rounded-md"
              />
            </div>
          )}

          {/* Image upload when no vocabulary image is available */}
          {!(currentVocabItem?.imageURL || currentVocabItem?.imageURL) && (
            <div>
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-black w-full p-2 border border-gray-300 rounded-md"
                />
                {imageFile && (
                  <button
                    onClick={() => setImageFile(null)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* New image preview */}
              {imageFile && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Vorschau"
                    className="max-h-32 rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;
