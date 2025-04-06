"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Upload, Trash2, Volume2, CheckCircle2, X, Plus } from "lucide-react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";

interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
}

interface FillInTheBlanksModel {
  question: string;
  imageUrl?: string;
  soundFileName: string;
  options: string[];
  correctAnswer: string;
  translation: string;
  pronunciationTip?: string;
  facts?: InfoItem[];
}

interface FillInTheBlanksStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems?: {
    id: string;
    text: string;
    translation?: string;
    examples?: any[];
    imageUrl?: string;
    audioUrl?: string;
  }[];
  stepType?: StepType;
  isEditMode?: boolean;
}

const FillInTheBlanksStepDialog: React.FC<FillInTheBlanksStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems = [],
  isEditMode = false,
}) => {
  // Lokaler State für alle Felder
  const [sentence, setSentence] = useState<string>(dialogData.question || "");
  const [blankWord, setBlankWord] = useState<string | null>(
    dialogData.correctAnswer || null
  );
  const [distractorWords, setDistractorWords] = useState<string[]>(
    dialogData.options && dialogData.options.length > 0
      ? dialogData.options.filter(
          (word: string) => word !== dialogData.correctAnswer
        )
      : ["", ""]
  );
  const [translation, setTranslation] = useState<string>(
    dialogData.translation || ""
  );
  const [imageUrl, setImageUrl] = useState<string>(dialogData.imageUrl || "");
  const [soundFileName, setSoundFileName] = useState<string>(
    dialogData.soundFileName || ""
  );
  const [pronunciationTip, setPronunciationTip] = useState<string>(
    dialogData.pronunciationTip || ""
  );
  const [facts, setFacts] = useState<InfoItem[]>(dialogData.facts || []);
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  // Refs für Datei-Uploads
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // New effect to respond to dialogData changes from parent's ContentItemSelector
  useEffect(() => {
    // Check if we have mainText data (this would be set by parent's selection)
    if (dialogData.mainText) {
      setSentence(dialogData.mainText);
      setTranslation(dialogData.secondaryText || "");

      // If the parent selection included media, update those too
      if (dialogData.imageUrl) {
        setImageUrl(dialogData.imageUrl);
      }
      if (dialogData.soundFileName) {
        setSoundFileName(dialogData.soundFileName);
      }

      // Reset blank word since we have a new sentence
      setBlankWord(null);
    }
  }, [dialogData]);

  // Update dialogData, sobald sich Konfigurationswerte ändern
  useEffect(() => {
    const allDistractorsValid = distractorWords.every(
      (word) => word.trim() !== ""
    );
    const isComplete =
      !!sentence &&
      !!blankWord &&
      allDistractorsValid &&
      translation.trim() !== "";

    const updatedOptions = blankWord
      ? [blankWord, ...distractorWords.filter((w) => w.trim() !== "")]
      : [];

    setDialogData({
      ...dialogData,
      question: sentence || "",
      correctAnswer: blankWord || "",
      options: updatedOptions,
      translation,
      imageUrl,
      soundFileName,
      pronunciationTip,
      facts,
      isComplete,
    });
  }, [
    sentence,
    blankWord,
    distractorWords,
    translation,
    imageUrl,
    soundFileName,
    pronunciationTip,
    facts,
    setDialogData,
  ]);

  // Sobald ein Wort als Lücke ausgewählt wird, wird der Index ermittelt
  useEffect(() => {
    if (blankWord && sentence) {
      const parts = sentence.split(" ").filter((word) => word.trim() !== "");
      const blankIndex = parts.findIndex((word) => word === blankWord);
      setDialogData((prev: any) => ({
        ...prev,
        blankIndex,
      }));
    }
  }, [blankWord, sentence, setDialogData]);

  const handleWordSelect = (word: string) => {
    if (word.length > 2) {
      setBlankWord(word);
    }
  };

  const handleDistractorWordChange = (index: number, value: string) => {
    const newDistractors = [...distractorWords];
    newDistractors[index] = value;
    setDistractorWords(newDistractors);
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newImageUrl = URL.createObjectURL(file);
    setImageUrl(newImageUrl);
  };

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

  // Erzeuge den Satz mit Lücke für die Vorschau
  const getSentenceWithBlank = () => {
    if (!sentence || !blankWord) return sentence || "";
    return sentence.replace(blankWord, "___________");
  };

  // Funktion zum Hinzufügen eines weiteren Distraktors
  const addDistractor = () => {
    setDistractorWords([...distractorWords, ""]);
  };

  // Funktion zum Entfernen eines Distraktors
  const removeDistractor = (index: number) => {
    if (distractorWords.length <= 2) return; // Mindestens 2 Distraktoren beibehalten
    const newDistractors = [...distractorWords];
    newDistractors.splice(index, 1);
    setDistractorWords(newDistractors);
  };

  // Preview-Daten für IPhonePreview
  const previewData = useMemo(
    () => ({
      question: sentence || "Vervollständige den Satz.",
      options: blankWord
        ? [blankWord, ...distractorWords.filter((w) => w.trim() !== "")]
        : [],
      correctAnswer: blankWord || "",
      translation,
      imageUrl,
      soundFileName,
      pronunciationTip,
      facts,
    }),
    [
      sentence,
      blankWord,
      distractorWords,
      translation,
      imageUrl,
      soundFileName,
      pronunciationTip,
      facts,
    ]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Konfiguration */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-black mb-2" htmlFor="sentence">
              Satz:
            </label>
            <input
              id="sentence"
              type="text"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Gib einen vollständigen Satz ein"
            />
          </div>

          {sentence && (
            <div>
              <p className="mb-2 text-black">
                Klicke auf das Wort, das als Lücke erscheinen soll:
              </p>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg">
                {sentence.split(" ").map(
                  (word, idx) =>
                    word.trim() && (
                      <button
                        key={idx}
                        onClick={() => handleWordSelect(word)}
                        className={`px-3 py-2 border rounded cursor-pointer hover:bg-gray-200 text-black ${
                          blankWord === word
                            ? "bg-green-200 border-green-500"
                            : ""
                        }`}
                      >
                        {word}
                      </button>
                    )
                )}
              </div>
            </div>
          )}

          {blankWord && (
            <div>
              <p className="text-green-600 flex items-center">
                <CheckCircle2 size={16} className="mr-1" />
                Ausgewähltes Wort:{" "}
                <span className="font-bold ml-1">{blankWord}</span>
              </p>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-black">Ablenkungswörter:</p>
              <button
                onClick={addDistractor}
                className="px-2 py-1 bg-blue-500 text-white rounded flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Hinzufügen
              </button>
            </div>
            <div className="space-y-2">
              {distractorWords.map((word, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Ablenkungswort ${index + 1}`}
                    value={word}
                    onChange={(e) =>
                      handleDistractorWordChange(index, e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded text-black placeholder-gray-500"
                  />
                  {distractorWords.length > 2 && (
                    <button
                      onClick={() => removeDistractor(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-black mb-2" htmlFor="translation">
              Übersetzung:
            </label>
            <input
              type="text"
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
              placeholder="Übersetzung eingeben"
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
                placeholder="URL oder Datei hochladen"
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

          <div>
            <label className="block text-black mb-2" htmlFor="pronunciationTip">
              Aussprache-Tipp (optional):
            </label>
            <input
              type="text"
              id="pronunciationTip"
              value={pronunciationTip}
              onChange={(e) => setPronunciationTip(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
              placeholder="z.B. 'ji' wird wie 'schi' ausgesprochen"
            />
          </div>

          {sentence && blankWord && (
            <div>
              <p className="text-black mb-2">Vorschau Satz mit Lücke:</p>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-center text-black font-medium">
                  {getSentenceWithBlank()}
                </p>
              </div>
            </div>
          )}

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
            stepType={StepType.FillInTheBlanks}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(FillInTheBlanksStepDialog);
