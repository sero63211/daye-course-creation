"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";
import { Plus, Upload, Trash2, X, Volume2, Lightbulb } from "lucide-react";
import ContentItemSelector from "./vocabulary-components/ContentItemSelector";

interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
}

export interface SentenceCompletionModel {
  instructionText: string;
  imageUrl: string;
  soundFileName: string;
  sentenceParts: string[];
  blankIndex: number;
  correctAnswer: string;
  facts?: InfoItem[];
}

interface ContentItem {
  id: string;
  text: string;
  translation?: string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
  type?: string;
  contentType?: string;
}

interface SentenceCompletionStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems: ContentItem[];
}

const SentenceCompletionStepDialog: React.FC<
  SentenceCompletionStepDialogProps
> = ({ dialogData, setDialogData, contentItems }) => {
  // State for selected sentence and blank word
  const [selectedSentence, setSelectedSentence] = useState<string | null>(
    dialogData.question || null
  );
  const [blankWord, setBlankWord] = useState<string | null>(
    dialogData.correctAnswer || null
  );
  const [customSentence, setCustomSentence] = useState<string>("");

  // State for ContentItemSelector
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState({
    isProcessing: false,
    message: "",
  });

  // Zusätzliche Formulardaten (Instruktionstext, Bild, Audio, Fakten)
  const [formData, setFormData] = useState({
    instructionText: dialogData.instructionText || "Vervollständige den Satz.",
    imageUrl: dialogData.imageUrl || "",
    soundFileName: dialogData.soundFileName || "",
    facts: dialogData.facts || ([] as InfoItem[]),
  });
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  // Process content items once
  // Process content items once with automatic type detection
  useEffect(() => {
    if (contentItems.length === 0) return;

    // Log the incoming content items
    console.log("Original content items:", contentItems);

    const processed = contentItems.map((item) => {
      // Create the base processed item
      const processedItem: any = {
        id: item.id,
        text: item.text || "",
        translation: item.translation || "",
        _examples: item.examples,
        imageUrl: item.imageUrl,
        audioUrl: item.audioUrl,
      };

      // First check if the item already has type information
      if ((item as any).type) {
        processedItem.type = (item as any).type;
      }

      if ((item as any).contentType) {
        processedItem.contentType = (item as any).contentType;
      }

      // If no type information exists, try to detect the type based on content
      if (!processedItem.type && !processedItem.contentType) {
        // Heuristic: If the text contains spaces, it's likely a sentence
        // Otherwise, it's likely a vocabulary item
        if (processedItem.text.includes(" ")) {
          processedItem.type = "sentence";
          processedItem.contentType = "sentence";
          console.log(`Auto-detected "${processedItem.text}" as a sentence`);
        } else {
          processedItem.type = "vocabulary";
          processedItem.contentType = "vocabulary";
          console.log(`Auto-detected "${processedItem.text}" as vocabulary`);
        }
      }

      return processedItem;
    });

    console.log("Processed items with type detection:", processed);
    setOrderedItems(processed);
  }, [contentItems]);

  // Update when ContentItemSelector selection changes
  useEffect(() => {
    if (selectedIds.length === 0) return;

    const selectedItem = orderedItems.find(
      (item) => item.id === selectedIds[0]
    );
    if (!selectedItem) return;

    setSelectedSentence(selectedItem.text);
    setBlankWord(null); // Reset blank word when selecting new sentence

    // Update media if available
    if (selectedItem.imageUrl) {
      setFormData((prev) => ({ ...prev, imageUrl: selectedItem.imageUrl }));
    }
    if (selectedItem.audioUrl) {
      setFormData((prev) => ({
        ...prev,
        soundFileName: selectedItem.audioUrl,
      }));
    }
  }, [selectedIds, orderedItems]);

  // Wenn ein Satz ausgewählt oder eingegeben wurde, speichere ihn und teile ihn in Wörter
  useEffect(() => {
    if (selectedSentence) {
      const parts = selectedSentence
        .split(" ")
        .filter((word) => word.trim() !== "");
      setDialogData((prev: any) => ({
        ...prev,
        question: selectedSentence,
        sentenceParts: parts,
        correctAnswer: null,
        blankIndex: -1,
        instructionText: formData.instructionText,
      }));
      setBlankWord(null);
    }
  }, [selectedSentence, setDialogData, formData.instructionText]);

  // Wenn ein Wort als Lücke ausgewählt wurde, speichere es und ermittle den Index
  useEffect(() => {
    if (blankWord && selectedSentence) {
      const parts = selectedSentence
        .split(" ")
        .filter((word) => word.trim() !== "");
      const blankIndex = parts.findIndex((word) => word === blankWord);
      setDialogData((prev: any) => ({
        ...prev,
        correctAnswer: blankWord,
        blankIndex,
      }));
    }
  }, [blankWord, selectedSentence, setDialogData]);

  const handleWordClick = (word: string) => {
    setBlankWord(word);
  };

  const handleCustomSentenceSubmit = () => {
    if (customSentence.trim() !== "") {
      setSelectedSentence(customSentence);
    }
  };

  // Form-Handler für Instruktion, Bild-URL und Audio
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDialogData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Bild-Upload
  const imageInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl }));
    setDialogData((prev: any) => ({ ...prev, imageUrl }));
  };

  // Audio-Upload
  const audioInputRef = useRef<HTMLInputElement>(null);
  const handleAudioUpload = () => {
    audioInputRef.current?.click();
  };
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, soundFileName: file.name }));
    setDialogData((prev: any) => ({ ...prev, soundFileName: file.name }));
  };

  // Fact-Handler
  const handleNewFactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFact((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFact = () => {
    if (!newFact.term || !newFact.definition) {
      alert("Bitte mindestens Begriff und Definition eingeben!");
      return;
    }
    const factToAdd: InfoItem = {
      id: uuid(),
      term: newFact.term,
      definition: newFact.definition,
      usage: newFact.usage || "",
      pronunciation: newFact.pronunciation || "",
    };
    setFormData((prev) => ({
      ...prev,
      facts: [...(prev.facts || []), factToAdd],
    }));
    setDialogData((prev: any) => ({
      ...prev,
      facts: [...(prev.facts || []), factToAdd],
    }));
    setNewFact({
      id: "",
      term: "",
      definition: "",
      usage: "",
      pronunciation: "",
    });
  };

  const handleRemoveFact = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      facts: (prev.facts || []).filter((fact: InfoItem) => fact.id !== id),
    }));
    setDialogData((prev: any) => ({
      ...prev,
      facts: (prev.facts || []).filter((fact: InfoItem) => fact.id !== id),
    }));
  };

  // Preview-Daten für die iPhonePreview
  const previewData = useMemo(
    () => ({
      instructionText: formData.instructionText,
      imageUrl: formData.imageUrl,
      soundFileName: formData.soundFileName,
      sentenceParts: dialogData.sentenceParts || [],
      blankIndex: dialogData.blankIndex || -1,
      correctAnswer: dialogData.correctAnswer || "",
      facts: formData.facts || [],
      question: dialogData.question || "",
    }),
    [formData, dialogData]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Konfiguration */}
      <div className="w-full md:w-3/5">
        {/* Content selector */}

        {/* Satzauswahl und -eingabe */}
        <div className="p-6 bg-white rounded-lg mb-6">
          <h2 className="text-xl font-bold text-center mb-4 text-black">
            Satz vervollständigen
          </h2>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-black">
              Eigenen Satz eingeben:
            </label>
            <div className="flex">
              <input
                type="text"
                value={customSentence}
                onChange={(e) => setCustomSentence(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-l-md text-black"
                placeholder="Deinen Satz hier eingeben"
              />
              <button
                onClick={handleCustomSentenceSubmit}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-r-md"
              >
                Übernehmen
              </button>
            </div>
          </div>

          {selectedSentence && (
            <div className="mt-4">
              <p className="mb-2 text-black">
                Gewählter Satz: {selectedSentence}
              </p>
              <p className="mb-2 text-black">
                Klicke auf das Wort, das die Lücke füllen soll:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSentence.split(" ").map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(word)}
                    className={`px-3 py-2 border rounded cursor-pointer hover:bg-gray-200 text-black ${
                      blankWord === word ? "bg-green-200" : ""
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {blankWord && (
                <p className="mt-2 text-green-600">
                  Ausgewähltes Wort: {blankWord}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Formular für zusätzliche Details */}
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-black">
            Zusätzliche Informationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="form-group">
              <label
                className="block text-black mb-2"
                htmlFor="instructionText"
              >
                Instruktionstext
              </label>
              <textarea
                id="instructionText"
                name="instructionText"
                value={formData.instructionText || ""}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500"
                placeholder="z.B. Vervollständige den Satz."
              />
            </div>
            <div className="form-group">
              <label className="block text-black mb-2" htmlFor="imageUrl">
                Bild
              </label>
              <div className="flex items-center">
                <div className="flex-grow">
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-black placeholder-gray-500"
                    placeholder="URL oder Datei hochladen"
                  />
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r-md flex items-center"
                >
                  <Upload size={20} />
                </button>
              </div>
              {formData.imageUrl && (
                <div className="mt-2 relative">
                  <img
                    src={formData.imageUrl}
                    alt="Vorschau"
                    className="w-full max-h-40 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, imageUrl: "" }))
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="block text-black mb-2" htmlFor="soundFileName">
                Audio
              </label>
              <div className="flex items-center">
                <div className="flex-grow">
                  <input
                    type="text"
                    id="soundFileName"
                    name="soundFileName"
                    value={formData.soundFileName || ""}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-black placeholder-gray-500"
                    placeholder="Datei hochladen"
                  />
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={handleAudioFileChange}
                    accept="audio/*"
                    className="hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAudioUpload}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r-md flex items-center"
                >
                  <Upload size={20} />
                </button>
              </div>
              {formData.soundFileName && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 size={20} className="text-blue-500 mr-2" />
                    <span className="text-black">{formData.soundFileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, soundFileName: "" }))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fakten-Bereich */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Zusätzliche Informationen
            </h3>

            {(formData.facts || []).length > 0 && (
              <div className="mb-4 space-y-3">
                {(formData.facts || []).map((fact: InfoItem) => (
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

            <div className="border p-4 rounded bg-blue-50">
              <h4 className="font-medium mb-3 text-black">
                Neue Information hinzufügen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
              <div className="flex justify-end">
                <button
                  onClick={handleAddFact}
                  className="flex items-center bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                >
                  <Plus size={16} className="mr-1" /> Information hinzufügen
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
            stepType={StepType.SentenceCompletion}
            stepData={previewData}
            showFacts={true}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SentenceCompletionStepDialog);
