"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Upload, Trash2, Volume2, X, Plus } from "lucide-react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";

// Typdefinition für ein erstelltes Inhaltselement
export interface EnhancedContentItem {
  id: string;
  text: string;
  translation?: string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
}

interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
}

interface DialogData {
  questionText?: string;
  correctOption?: string;
  imageUrl?: string;
  soundFileName?: string;
  additionalField1?: string;
  additionalField2?: string;
  additionalField3?: string;
  facts?: InfoItem[];
  isComplete?: boolean;
}

interface LanguageQuestionStepDialogProps {
  dialogData: DialogData;
  setDialogData: (data: DialogData) => void;
  contentItems: EnhancedContentItem[];
  stepType?: StepType;
  isEditMode?: boolean;
}

const LanguageQuestionStepDialog: React.FC<LanguageQuestionStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems,
  isEditMode = false,
}) => {
  // Lokaler State
  const [questionText, setQuestionText] = useState<string>(
    dialogData.questionText || ""
  );
  const [correctOption, setCorrectOption] = useState<string>(
    dialogData.correctOption || ""
  );
  const [imageUrl, setImageUrl] = useState<string>(dialogData.imageUrl || "");
  const [soundFileName, setSoundFileName] = useState<string>(
    dialogData.soundFileName || ""
  );
  const [additionalField1, setAdditionalField1] = useState<string>(
    dialogData.additionalField1 || ""
  );
  const [additionalField2, setAdditionalField2] = useState<string>(
    dialogData.additionalField2 || ""
  );
  const [additionalField3, setAdditionalField3] = useState<string>(
    dialogData.additionalField3 || ""
  );
  const [facts, setFacts] = useState<InfoItem[]>(dialogData.facts || []);
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  // Effect to respond to dialogData changes from parent's ContentItemSelector
  useEffect(() => {
    // For question types, the parent sets questionText and correctOption
    if (dialogData.questionText && dialogData.questionText !== questionText) {
      setQuestionText(dialogData.questionText);
    }

    if (
      dialogData.correctOption &&
      dialogData.correctOption !== correctOption
    ) {
      setCorrectOption(dialogData.correctOption);
    }

    // If the parent selection included media, update those too
    if (dialogData.imageUrl && dialogData.imageUrl !== imageUrl) {
      setImageUrl(dialogData.imageUrl);
    }

    if (
      dialogData.soundFileName &&
      dialogData.soundFileName !== soundFileName
    ) {
      setSoundFileName(dialogData.soundFileName);
    }
  }, [dialogData, questionText, correctOption, imageUrl, soundFileName]);

  // Refs für Datei-Uploads
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Update dialogData, sobald sich Konfigurationswerte ändern
  useEffect(() => {
    const isComplete =
      questionText.trim() !== "" &&
      correctOption.trim() !== "" &&
      additionalField1.trim() !== "" &&
      additionalField2.trim() !== "" &&
      additionalField3.trim() !== "";

    setDialogData({
      questionText,
      correctOption,
      imageUrl,
      soundFileName,
      additionalField1,
      additionalField2,
      additionalField3,
      facts,
      isComplete,
    });
  }, [
    questionText,
    correctOption,
    imageUrl,
    soundFileName,
    additionalField1,
    additionalField2,
    additionalField3,
    facts,
    setDialogData,
  ]);

  // Handler für Bild-Upload
  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newImageUrl = URL.createObjectURL(file);
    setImageUrl(newImageUrl);
  };

  // Handler für Audio-Upload
  const handleAudioUpload = () => {
    audioInputRef.current?.click();
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSoundFileName(file.name);
  };

  // Funktion zum Hinzufügen eines neuen Facts
  const handleNewFactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFact((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFact = () => {
    if (!newFact.term || !newFact.definition) return;
    const fact: InfoItem = {
      id: uuid(),
      term: newFact.term || "",
      definition: newFact.definition || "",
      usage: newFact.usage || "",
      pronunciation: newFact.pronunciation || "",
    };
    setFacts((prev) => [...prev, fact]);
    setNewFact({
      id: "",
      term: "",
      definition: "",
      usage: "",
      pronunciation: "",
    });
  };

  const handleRemoveFact = (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id));
  };

  // Filter: Nur Inhalte mit >= 2 Wörtern
  const validContentItems = contentItems.filter(
    (item) => item.text.trim().split(/\s+/).length >= 2
  );

  // Preview-Daten für IPhonePreview
  const previewData = useMemo(
    () => ({
      questionText,
      correctOption,
      imageUrl,
      soundFileName,
      additionalField1,
      additionalField2,
      additionalField3,
      facts,
    }),
    [
      questionText,
      correctOption,
      imageUrl,
      soundFileName,
      additionalField1,
      additionalField2,
      additionalField3,
      facts,
    ]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Konfiguration */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-black mb-2" htmlFor="questionText">
              Frage:
            </label>
            <input
              id="questionText"
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Geben Sie die Frage ein"
            />
          </div>

          {/* Klickbare Inhalte */}
          {validContentItems.length > 0 && (
            <div>
              <p className="text-black mb-2">Wählen Sie eine Option:</p>
              <div className="flex flex-wrap gap-2">
                {validContentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCorrectOption(item.text)}
                    className={`px-4 py-2 rounded border transition-colors duration-200 ${
                      correctOption === item.text
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Drei zusätzliche Pflichtfelder */}
          <div>
            <label className="block text-black mb-2" htmlFor="additionalField1">
              Antwortmöglichkeit 1:
            </label>
            <input
              id="additionalField1"
              type="text"
              value={additionalField1}
              onChange={(e) => setAdditionalField1(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Erste Antwortmöglichkeit eingeben"
            />
          </div>

          <div>
            <label className="block text-black mb-2" htmlFor="additionalField2">
              Antwortmöglichkeit 2:
            </label>
            <input
              id="additionalField2"
              type="text"
              value={additionalField2}
              onChange={(e) => setAdditionalField2(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Zweite Antwortmöglichkeit eingeben"
            />
          </div>

          <div>
            <label className="block text-black mb-2" htmlFor="additionalField3">
              Antwortmöglichkeit 3:
            </label>
            <input
              id="additionalField3"
              type="text"
              value={additionalField3}
              onChange={(e) => setAdditionalField3(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Dritte Antwortmöglichkeit eingeben"
            />
          </div>

          <div>
            <label className="block text-black mb-2" htmlFor="imageUrl">
              Bild:
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-black placeholder-gray-500"
                placeholder="Bild-URL oder Datei hochladen"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="bg-blue-500 text-white px-3 py-2 rounded-r-md"
              >
                <Upload size={20} />
              </button>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {imageUrl && (
              <div className="mt-2 relative">
                <img
                  src={imageUrl}
                  alt="Vorschau"
                  className="w-full max-h-40 object-contain rounded"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-black mb-2" htmlFor="soundFileName">
              Audio:
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="soundFileName"
                value={soundFileName}
                onChange={(e) => setSoundFileName(e.target.value)}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-black placeholder-gray-500"
                placeholder="Datei hochladen"
              />
              <button
                type="button"
                onClick={handleAudioUpload}
                className="bg-blue-500 text-white px-3 py-2 rounded-r-md"
              >
                <Upload size={20} />
              </button>
              <input
                type="file"
                ref={audioInputRef}
                onChange={handleAudioFileChange}
                accept="audio/*"
                className="hidden"
              />
            </div>
            {soundFileName && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 size={20} className="text-blue-500 mr-2" />
                  <span className="text-black">{soundFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundFileName("")}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Zusätzliche Informationen */}
          <div className="p-4 bg-white border rounded">
            <h3 className="text-black font-bold mb-2">
              Zusätzliche Informationen
            </h3>
            {facts.length > 0 && (
              <div className="mb-4 space-y-3">
                {facts.map((fact) => (
                  <div
                    key={fact.id}
                    className="border p-3 rounded bg-gray-50 relative"
                  >
                    <button
                      onClick={() => handleRemoveFact(fact.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-black">
                          Begriff:
                        </p>
                        <p className="text-black">{fact.term}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          Definition:
                        </p>
                        <p className="text-black">{fact.definition}</p>
                      </div>
                      {fact.usage && (
                        <div>
                          <p className="text-sm font-medium text-black">
                            Verwendung:
                          </p>
                          <p className="text-black">{fact.usage}</p>
                        </div>
                      )}
                      {fact.pronunciation && (
                        <div>
                          <p className="text-sm font-medium text-black">
                            Aussprache:
                          </p>
                          <p className="text-black">{fact.pronunciation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border p-3 rounded bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-sm text-black mb-1"
                    htmlFor="term"
                  >
                    Begriff*
                  </label>
                  <input
                    type="text"
                    id="term"
                    name="term"
                    value={newFact.term || ""}
                    onChange={handleNewFactChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
                    placeholder="z.B. Artikel"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-black mb-1"
                    htmlFor="definition"
                  >
                    Definition*
                  </label>
                  <input
                    type="text"
                    id="definition"
                    name="definition"
                    value={newFact.definition || ""}
                    onChange={handleNewFactChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
                    placeholder="z.B. Der Artikel ist 'der'"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-black mb-1"
                    htmlFor="usage"
                  >
                    Verwendung
                  </label>
                  <input
                    type="text"
                    id="usage"
                    name="usage"
                    value={newFact.usage || ""}
                    onChange={handleNewFactChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
                    placeholder="z.B. Der Baum ist groß."
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-black mb-1"
                    htmlFor="pronunciation"
                  >
                    Aussprache
                  </label>
                  <input
                    type="text"
                    id="pronunciation"
                    name="pronunciation"
                    value={newFact.pronunciation || ""}
                    onChange={handleNewFactChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black placeholder-gray-500"
                    placeholder="z.B. dɛɐ̯ baʊ̯m"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddFact}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex items-center hover:bg-blue-600"
                >
                  <Plus size={16} className="mr-1" />
                  Info hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rechte Seite: iPhone-Vorschau */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="sticky top-8">
          <IPhonePreview
            stepType={StepType.LanguageQuestion}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default LanguageQuestionStepDialog;
