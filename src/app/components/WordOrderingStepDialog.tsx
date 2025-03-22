"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";
import { Upload, Trash2, X, Plus } from "lucide-react";

interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
}

export interface WordOrderingModel {
  instructionText: string;
  imageUrl: string;
  soundFileName: string;
  wordOptions: string[];
  correctSentence: string;
  facts?: InfoItem[];
}

interface WordOrderingStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems?: {
    id: string;
    text: string;
    translation?: string;
    examples?: string[];
    imageUrl?: string;
    audioUrl?: string;
  }[];
}

const WordOrderingStepDialog: React.FC<WordOrderingStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems = [],
}) => {
  // Debug contentItems
  useEffect(() => {
    console.log("ContentItems:", contentItems);
    if (contentItems && contentItems.length > 0) {
      contentItems.forEach((item) => {
        const wordCount = item.text ? item.text.split(" ").length : 0;
        console.log(`Item "${item.text}" has ${wordCount} words`);
      });
    }
  }, [contentItems]);

  // Alle Sätze aus den Content-Items (nur Sätze mit mehr als einem Wort)
  const availableSentences = useMemo(() => {
    if (
      !contentItems ||
      !Array.isArray(contentItems) ||
      contentItems.length === 0
    ) {
      console.log("No content items available");
      return [];
    }

    const sentences = contentItems
      .filter(
        (item) =>
          item.text &&
          typeof item.text === "string" &&
          item.text.trim().split(/\s+/).length >= 2
      )
      .map((item) => item.text);

    console.log("Available sentences after filtering:", sentences);
    return sentences;
  }, [contentItems]);

  // State für ausgewählten Satz oder eigenen Satz
  const [selectedSentence, setSelectedSentence] = useState<string>(
    dialogData.correctSentence || ""
  );
  const [customSentence, setCustomSentence] = useState<string>("");
  const [instructionText, setInstructionText] = useState<string>(
    dialogData.instructionText ||
      "Ordne die Wörter in die richtige Reihenfolge."
  );
  const [imageUrl, setImageUrl] = useState<string>(dialogData.imageUrl || "");
  const [soundFileName, setSoundFileName] = useState<string>(
    dialogData.soundFileName || ""
  );
  const [facts, setFacts] = useState<InfoItem[]>(dialogData.facts || []);
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sentenceToUse = selectedSentence || customSentence;
    const words = sentenceToUse
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w !== "");

    console.log("Setting dialogData with sentence:", sentenceToUse);
    console.log("Words for ordering:", words);

    setDialogData({
      ...dialogData,
      instructionText,
      imageUrl,
      soundFileName,
      wordOptions: words,
      correctSentence: sentenceToUse || "Satz nicht ausgewählt",
      facts,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    instructionText,
    imageUrl,
    soundFileName,
    selectedSentence,
    customSentence,
    facts,
  ]);

  const handleSelectSentence = (sentence: string) => {
    console.log("Selected sentence:", sentence);
    setSelectedSentence(sentence);
    setCustomSentence("");
  };

  const handleCustomSentenceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomSentence(e.target.value);
    setSelectedSentence("");
  };

  const imageUploadHandler = () => {
    imageInputRef.current?.click();
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const audioUploadHandler = () => {
    audioInputRef.current?.click();
  };
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSoundFileName(file.name);
    }
  };

  const handleNewFactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFact((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddFact = () => {
    if (!newFact.term || !newFact.definition) return;
    const fact: InfoItem = {
      id: uuid(),
      term: newFact.term,
      definition: newFact.definition,
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

  const previewData = useMemo(() => {
    const sentenceToUse = selectedSentence || customSentence;
    return {
      instructionText,
      imageUrl,
      soundFileName,
      wordOptions: sentenceToUse
        .split(" ")
        .map((w) => w.trim())
        .filter((w) => w !== ""),
      correctSentence: sentenceToUse || "Satz nicht ausgewählt",
      facts,
    };
  }, [
    instructionText,
    imageUrl,
    soundFileName,
    selectedSentence,
    customSentence,
    facts,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Konfiguration */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div>
          {/* Vorhandene Sätze anzeigen */}
          <p className="text-black mb-2">Wähle einen Satz aus:</p>
          {availableSentences.length > 0 ? (
            <div className="space-y-2 mb-4">
              {availableSentences.map((sentence, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSentence(sentence)}
                  className={`w-full text-left p-2 border rounded hover:bg-gray-200 cursor-pointer ${
                    selectedSentence === sentence
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-black border-gray-300"
                  }`}
                >
                  {sentence}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-4 p-3 bg-gray-100 text-gray-600 rounded text-center">
              Keine Sätze mit mindestens zwei Wörtern vorhanden
            </div>
          )}

          <div className="my-4 text-center text-black font-medium">oder</div>

          <div>
            <p className="text-black mb-2">Gib einen eigenen Satz ein:</p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={customSentence}
              onChange={handleCustomSentenceChange}
              placeholder="Eigenen Satz hier eingeben..."
            />
          </div>
        </div>

        <div>
          <label className="block text-black mb-2" htmlFor="instructionText">
            Instruktion
          </label>
          <input
            id="instructionText"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={instructionText}
            onChange={(e) => setInstructionText(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-black mb-2" htmlFor="imageUrl">
            Bild
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-black"
              placeholder="Bild-URL oder Datei hochladen"
            />
            <button
              type="button"
              onClick={imageUploadHandler}
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
            Audio
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="soundFileName"
              value={soundFileName}
              onChange={(e) => setSoundFileName(e.target.value)}
              className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-black"
              placeholder="Audio-Datei oder Datei hochladen"
            />
            <button
              type="button"
              onClick={audioUploadHandler}
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
              <span className="text-black">{soundFileName}</span>
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
                      <p className="text-sm font-medium text-black">Begriff:</p>
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
                <label className="block text-sm text-black mb-1" htmlFor="term">
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

      {/* Rechte Seite: Vorschau */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="sticky top-8">
          <IPhonePreview
            stepType={StepType.WordOrdering}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(WordOrderingStepDialog);
