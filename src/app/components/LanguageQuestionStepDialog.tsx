"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  Trash2,
  Volume2,
  X,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";

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
  options?: string[];
  facts?: InfoItem[];
  isComplete?: boolean;
}

interface LanguageQuestionStepDialogProps {
  dialogData: DialogData;
  setDialogData: (data: DialogData) => void;
  contentItems: EnhancedContentItem[];
  stepType?: StepType;
  isEditMode?: boolean;
  showValidation?: boolean;
}

const LanguageQuestionStepDialog: React.FC<LanguageQuestionStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems,
  isEditMode = false,
  showValidation = false,
}) => {
  // Nur einmal initialisieren, danach eigenständig verwalten.
  const [questionText, setQuestionText] = useState<string>(
    dialogData.questionText || ""
  );
  const initialOptions =
    dialogData.options && dialogData.options.length >= 2
      ? dialogData.options
      : dialogData.options && dialogData.options.length === 1
      ? [...dialogData.options, ""]
      : ["", ""];
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [correctOption, setCorrectOption] = useState<string>(
    dialogData.correctOption || ""
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

  const [debugInfo, setDebugInfo] = useState({
    validOptions: [] as string[],
    hasEnoughOptions: false,
    hasCorrectOption: false,
    isComplete: false,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const validateData = () => {
    const validOptions = options.filter((opt) => opt.trim() !== "");
    const hasQuestion = questionText.trim() !== "";
    const hasEnoughOptions = validOptions.length >= 2;
    const hasCorrectOption = correctOption.trim() !== "";
    const isComplete = hasQuestion && hasEnoughOptions && hasCorrectOption;
    setDebugInfo({
      validOptions,
      hasEnoughOptions,
      hasCorrectOption,
      isComplete,
    });
    return { validOptions, isComplete };
  };

  useEffect(() => {
    const { validOptions, isComplete } = validateData();
    let updatedCorrectOption = correctOption;
    if (!updatedCorrectOption.trim() && validOptions.length > 0) {
      updatedCorrectOption = validOptions[0];
      setCorrectOption(updatedCorrectOption);
    }
    if (updatedCorrectOption && !validOptions.includes(updatedCorrectOption)) {
      updatedCorrectOption = validOptions.length > 0 ? validOptions[0] : "";
      setCorrectOption(updatedCorrectOption);
    }
    setDialogData({
      questionText,
      correctOption: updatedCorrectOption,
      imageUrl,
      soundFileName,
      options: [...options],
      facts,
      isComplete,
    });
  }, [
    questionText,
    correctOption,
    imageUrl,
    soundFileName,
    options,
    facts,
    setDialogData,
  ]);

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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    if (options[index] === correctOption) {
      setCorrectOption(value);
    }
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const optionToRemove = options[index];
    const newOptions = [...options];
    newOptions.splice(index, 1);
    if (optionToRemove === correctOption) {
      const firstValidOption =
        newOptions.find((opt) => opt.trim() !== "") || "";
      setCorrectOption(firstValidOption);
    }
    setOptions(newOptions);
  };

  const handleSelectCorrectOption = (option: string) => {
    setCorrectOption(option);
  };

  const previewData = useMemo(
    () => ({
      questionText,
      correctOption,
      imageUrl,
      soundFileName,
      options,
      facts,
    }),
    [questionText, correctOption, imageUrl, soundFileName, options, facts]
  );

  const validOptions = options.filter((opt) => opt.trim() !== "");

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <div className="space-y-4">
          <div className="p-3 border border-blue-200 bg-blue-50 rounded text-sm">
            <details>
              <summary className="font-semibold text-blue-700 cursor-pointer">
                Debug Info (Klicken zum Anzeigen)
              </summary>
              <div className="mt-2 space-y-1 text-xs">
                <p>
                  <span className="font-semibold">Question:</span>{" "}
                  {questionText || "[leer]"}
                </p>
                <p>
                  <span className="font-semibold">Correct Option:</span>{" "}
                  {correctOption || "[leer]"}
                </p>
                <p>
                  <span className="font-semibold">Valid Options:</span>{" "}
                  {debugInfo.validOptions.join(", ") || "[keine]"}
                </p>
                <p>
                  <span className="font-semibold">Has Enough Options:</span>{" "}
                  {debugInfo.hasEnoughOptions ? "✓" : "✗"}
                </p>
                <p>
                  <span className="font-semibold">Has Correct Option:</span>{" "}
                  {debugInfo.hasCorrectOption ? "✓" : "✗"}
                </p>
                <p>
                  <span className="font-semibold">Is Complete:</span>{" "}
                  {debugInfo.isComplete ? "✓" : "✗"}
                </p>
              </div>
            </details>
          </div>
          <div>
            <label className="block text-black mb-2" htmlFor="questionText">
              Frage:{" "}
              {!questionText.trim() && showValidation && (
                <span className="text-red-500 ml-1">*Erforderlich</span>
              )}
            </label>
            <input
              id="questionText"
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className={`w-full p-2 border ${
                !questionText.trim() && showValidation
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded text-black`}
              placeholder="Geben Sie die Frage ein"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-black">
                Antwortmöglichkeiten:{" "}
                {!debugInfo.hasEnoughOptions && showValidation && (
                  <span className="text-red-500 ml-1">
                    *Mind. 2 erforderlich
                  </span>
                )}
              </label>
              <button
                onClick={handleAddOption}
                className="px-2 py-1 bg-blue-500 text-white rounded flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Hinzufügen
              </button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Antwortmöglichkeit ${index + 1}${
                      index < 2 ? " (erforderlich)" : ""
                    }`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={`flex-1 p-2 border ${
                      index < 2 && option.trim() === "" && showValidation
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded text-black`}
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {validOptions.length >= 1 && (
            <div>
              <p
                className={`block text-black mb-2 ${
                  !debugInfo.hasCorrectOption && showValidation
                    ? "text-red-500 font-bold"
                    : ""
                }`}
              >
                Wählen Sie die richtige Antwort:
                {!debugInfo.hasCorrectOption && showValidation && (
                  <span className="text-red-500 ml-1">*Erforderlich</span>
                )}
              </p>
              <div className="space-y-2">
                {validOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectCorrectOption(option)}
                    className={`p-2 w-full text-left border rounded ${
                      correctOption === option
                        ? "bg-green-100 border-green-500"
                        : !debugInfo.hasCorrectOption && showValidation
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      {correctOption === option && (
                        <CheckCircle2
                          size={16}
                          className="text-green-500 mr-2"
                        />
                      )}
                      <span className="text-black">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
              {correctOption &&
                options.some((opt) => opt === correctOption) && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    <p className="flex items-center">
                      <AlertTriangle size={16} className="mr-1" />
                      Die richtige Antwort ist "{correctOption}". Klicken Sie
                      auf eine andere Option, um sie zu ändern.
                    </p>
                  </div>
                )}
            </div>
          )}
          <div>
            <label className="block text-black mb-2" htmlFor="imageUrl">
              Bild (optional):
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
              Audio (optional):
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
          <div className="p-4 bg-white border rounded">
            <h3 className="text-black font-bold mb-2">
              Zusätzliche Informationen (optional)
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
