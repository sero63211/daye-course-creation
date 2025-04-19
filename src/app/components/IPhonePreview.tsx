"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  X,
  Pause,
  Volume2,
  Lightbulb,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StepType } from "../types/model";

interface InfoItem {
  id?: string;
  term?: string;
  definition: string;
  usage?: string;
  pronunciation?: string;
}

interface IPhonePreviewProps {
  stepType: StepType;
  stepData: any;
  showFacts?: boolean;
}

const IPhonePreview: React.FC<IPhonePreviewProps> = ({
  stepType,
  stepData,
  showFacts = false,
}) => {
  const [currentTime, setCurrentTime] = useState("20:33");
  const isMounted = useRef(true);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showInfoDetails, setShowInfoDetails] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Facts aus stepData extrahieren
  const facts = stepData?.facts || [];
  const hasFacts = facts.length > 0;

  // Default placeholder for all images
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23aaaaaa'%3EPlaceholder Image%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    const updateTime = () => {
      if (!isMounted.current) return;

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);

    return () => {
      isMounted.current = false;
      clearInterval(timer);
    };
  }, []);

  const handleAudioPlay = (itemId: string, audioUrl?: string) => {
    if (audioPlaying === itemId) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setAudioPlaying(null);
    } else {
      // Start new playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (audioUrl) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
        audioRef.current.onended = () => setAudioPlaying(null);
        setAudioPlaying(itemId);
      }
    }
  };

  const toggleInfoDetails = () => {
    setShowInfoDetails(!showInfoDetails);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  // Rendert die FillInTheBlanks-Ansicht
  const renderFillInTheBlanks = () => {
    // Sichere Zugriffe auf stepData
    const question = stepData?.question || "Vervollständige den Satz.";
    const options = Array.isArray(stepData?.options) ? stepData.options : [];
    const correctAnswer = stepData?.correctAnswer || "";
    const translation = stepData?.translation || "";
    const imageUrl = stepData?.imageUrl || "";
    const soundFileName = stepData?.soundFileName || "";

    // Erstellt einen Satz mit Lücke
    const getSentenceWithBlank = () => {
      if (!question || !correctAnswer) return question;
      return question.replace(correctAnswer, "___________");
    };

    // Den Satz in Teile aufteilen (Vor der Lücke / Nach der Lücke)
    const getBlankParts = () => {
      if (!question || !correctAnswer) return [question, ""];
      const parts = question.split(correctAnswer);
      return parts.length === 2 ? parts : [question, ""];
    };

    const blankParts = getBlankParts();

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "66%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Vervollständige den Satz.
          </h1>

          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
                alt="Bild zum Satz"
                className="rounded-lg w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
            </div>
          )}

          <div className="w-full mb-6 mt-4">
            <div className="flex items-center justify-center flex-wrap text-xl text-black">
              <span className="mx-1">{blankParts[0]}</span>
              <span className="mx-1 border-b-2 border-gray-400 min-w-[100px] text-center">
                {selectedOption || ""}
              </span>
              <span className="mx-1">{blankParts[1]}</span>
            </div>

            {translation && (
              <p className="text-center text-gray-600 italic mt-4">
                {translation}
              </p>
            )}
          </div>

          <div className="space-y-3 w-full mb-6">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`
                  w-full 
                  ${
                    selectedOption === option
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  } 
                  border-2 rounded-xl p-3 text-center text-black font-medium transition-colors
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {soundFileName && (
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => handleAudioPlay("main-audio", soundFileName)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {audioPlaying === "main-audio" ? (
                  <>
                    <Pause size={18} className="mr-2" />
                    <span>Audio stoppen</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={18} className="mr-2" />
                    <span>Audio abspielen</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex-grow"></div>

          <button
            className={`
              w-full 
              ${
                selectedOption
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              } 
              py-3 px-6 rounded-full text-lg font-medium mt-4
            `}
            onClick={(e) => e.stopPropagation()}
          >
            Überprüfen
          </button>
        </div>
      </>
    );
  };

  // Rendert die ListenVocabulary-Ansicht
  const renderListenVocabulary = () => {
    // Sicherer Zugriff auf stepData-Eigenschaften
    const mainText = stepData?.mainText || "Vokabel auswählen";
    const secondaryText = stepData?.secondaryText || "Übersetzung";
    const descriptionText = stepData?.descriptionText || "";
    const imageUrl = stepData?.imageUrl || "";
    const soundFileName = stepData?.soundFileName || "";

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Hier gibt es was Neues!
          </h1>
          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
                alt="Vokabelillustration"
                className="rounded-lg w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
            </div>
          )}
          <div className="w-full bg-gray-100 rounded-xl p-4 mb-4">
            <h2 className="text-xl font-bold text-center text-black">
              {mainText}
            </h2>
            <p className="text-gray-600 text-center mt-2">
              {secondaryText &&
                (descriptionText
                  ? `„${secondaryText}" ${descriptionText}`
                  : secondaryText)}
            </p>
          </div>
          <div className="flex-grow"></div>
          <button
            className="w-full bg-green-500 text-white py-3 px-6 rounded-full text-lg font-medium mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            Weiterlernen
          </button>
        </div>
      </>
    );
  };
  const renderTrueFalse = () => {
    const statement = stepData?.statement || "Noch keine Aussage";
    const imageUrl = stepData?.imageUrl || "";
    const soundFileName = stepData?.soundFileName || "";

    return (
      <>
        {/* Top-Bar */}
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Wahr oder Falsch?
          </h1>

          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
                alt="Bild zur Aussage"
                className="rounded-lg w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
            </div>
          )}

          <p className="text-xl text-center text-black mb-6">{statement}</p>

          <div className="flex flex-col space-y-4">
            <button className="w-full bg-blue-100 border border-blue-400 rounded-xl p-3 text-center text-black font-medium hover:bg-blue-200">
              Richtig
            </button>
            <button className="w-full bg-blue-100 border border-blue-400 rounded-xl p-3 text-center text-black font-medium hover:bg-blue-200">
              Falsch
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderLanguageQuestion = () => {
    const questionText = stepData?.questionText || "Keine Frage eingegeben";
    const imageUrl = stepData?.imageUrl || "";
    const soundFileName = stepData?.soundFileName || "";
    const correctOption = stepData?.correctOption || "Noch nichts ausgewählt";

    // Die neue options-Array-Struktur verwenden
    const options = stepData?.options || [];

    // Stellen sicher, dass wir immer mind. 2 Optionen anzeigen
    // auch wenn weniger vorhanden sind (für Vorschau)
    const displayOptions =
      options.length > 0 ? options : ["Antwort 1", "Antwort 2"];

    return (
      <>
        {/* Top-Bar */}
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 relative">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            {questionText}
          </h1>

          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
                alt="Bild zur Frage"
                className="rounded-lg w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
            </div>
          )}

          {soundFileName && (
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => handleAudioPlay("main-audio", soundFileName)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                <Volume2 size={18} className="mr-2" />
                {audioPlaying === "main-audio" ? "Stop Audio" : "Play Audio"}
              </button>
            </div>
          )}

          {/* Dynamische Antwort-Buttons basierend auf dem options-Array */}
          <div className="flex flex-col space-y-4">
            {displayOptions.map((option, index) => (
              <button
                key={index}
                onClick={(e) => e.stopPropagation()}
                className={`w-full bg-blue-100 border border-blue-400 rounded-xl p-3 text-center text-black font-medium hover:bg-blue-200 ${
                  correctOption === option
                    ? "bg-blue-500 text-white border-blue-500"
                    : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderSentenceCompletion = () => {
    const instructionText =
      stepData?.instructionText || "Vervollständige den Satz.";
    const imageUrl = stepData?.imageUrl || "";
    const soundFileName = stepData?.soundFileName || "";
    const sentenceParts: string[] = stepData?.sentenceParts || [];
    const correctAnswer = stepData?.correctAnswer || "";

    // Ermittele den Index des fehlenden Wortes (falls vorhanden)
    const blankIndex = sentenceParts.findIndex(
      (word) => word === correctAnswer
    );
    // Erstelle den anzuzeigenden Satz: Wenn blankIndex gültig, ersetze diesen Teil durch eine Lücke
    const displayedSentence =
      blankIndex >= 0
        ? sentenceParts
            .map((word, idx) => (idx === blankIndex ? "________" : word))
            .join(" ")
        : sentenceParts.join(" ") ||
          stepData?.question ||
          "Satz nicht verfügbar.";

    return (
      <>
        {/* Top-Bar */}
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 relative">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            {instructionText}
          </h1>

          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={imageUrl}
                alt="Bild zur Aufgabe"
                className="rounded-lg w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
            </div>
          )}

          {soundFileName && (
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => handleAudioPlay("main-audio", soundFileName)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                <Volume2 size={18} className="mr-2" />
                {audioPlaying === "main-audio" ? "Stop Audio" : "Play Audio"}
              </button>
            </div>
          )}

          <div className="w-full mb-6 mt-4">
            <p className="text-xl text-center text-black">
              {displayedSentence}
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderWordOrdering = () => {
    const instructionText =
      stepData?.instructionText ||
      "Bring die Wörter in die richtige Reihenfolge.";
    const wordOptions: string[] = Array.isArray(stepData?.wordOptions)
      ? stepData.wordOptions
      : [];
    const correctSentence =
      stepData?.correctSentence || "Satz nicht ausgewählt";

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto p-4 relative">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            {instructionText}
          </h1>
          <div className="w-full bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center text-gray-400 text-lg text-center mb-4">
            Tippe auf die Wörter, um sie hier hinzuzufügen
          </div>
          <div className="flex justify-center flex-wrap gap-2">
            {wordOptions.map((word, idx) => (
              <button
                key={idx}
                className="bg-white border border-gray-200 px-3 py-2 rounded-xl text-black hover:bg-gray-50"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderLessonInformation = () => {
    const title = stepData?.title || "Koreaner/-innen in Deutschland";
    const mainText =
      stepData?.mainText ||
      "Das europäische Land mit den meisten südkoreanischstämmigen Einwohner/-innen ist übrigens Deutschland.\n\nIn den 1960er-Jahren wurden Tausende von koreanischen Bergleuten und Pflegekräften in Westdeutschland angeworben. Dies war auch politisch motiviert: Sowohl Korea als auch Deutschland waren zweigeteilt, und man wollte sich solidarisieren.";

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <div className="text-blue-500 bg-blue-100 rounded-full p-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </div>
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-4 pb-16 relative">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            {title}
          </h1>

          <div className="text-black">
            {mainText.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderFillInChat = () => {
    const title = stepData?.title || "Hör dir das Gespräch an.";
    const conversations = stepData?.conversations || [];
    const options = stepData?.options || [
      "im-ni-kka?",
      "ha-se-yo.",
      "Ban-gap",
      "cheo-eum",
      "sa-ram",
      "a-nim-ni-da.",
      "im-ni-da.",
    ];

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-4 pb-16 relative bg-blue-50">
          <h1 className="text-xl font-bold text-center mb-4 text-black">
            {title}
          </h1>

          <div className="flex flex-col space-y-4 mb-auto">
            {conversations.map((conversation, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`
                    max-w-[80%] 
                    rounded-lg
                    bg-white
                    shadow-sm p-3 relative
                  `}
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={conversation.speaker?.avatar || placeholderImage}
                      alt={conversation.speaker?.name || "Speaker"}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage;
                      }}
                    />
                    <span className="text-gray-500 italic">
                      {conversation.speaker?.name || "Speaker"}
                    </span>
                    {conversation.audioURL && (
                      <button
                        className="ml-auto text-gray-400"
                        onClick={() =>
                          handleAudioPlay(
                            `audio-${index}`,
                            conversation.audioURL
                          )
                        }
                      >
                        {audioPlaying === `audio-${index}` ? (
                          <Pause size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-black">
                    {conversation.message?.split(" ").map((word, wordIdx) => {
                      if (
                        word.includes("_________") &&
                        conversation.missingWord
                      ) {
                        return (
                          <span
                            key={wordIdx}
                            className="inline-block border-b-2 border-blue-500 min-w-[80px] text-center"
                          >
                            _________
                          </span>
                        );
                      }
                      return <span key={wordIdx}>{word} </span>;
                    }) || "No message"}
                  </p>
                  {conversation.translation && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 pl-2 border-l-2 border-gray-300">
                        {conversation.translation}
                      </p>
                    </div>
                  )}
                  {!conversation.translation && (
                    <button className="mt-2 text-sm text-gray-500">
                      Übersetzung ansehen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Wort-Optionen */}
          <div className="mt-auto mb-4 flex flex-wrap justify-center gap-2">
            {options.map((option, idx) => (
              <button
                key={idx}
                className="bg-white border border-gray-300 rounded-full px-4 py-2 text-black"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <div className="fixed bottom-0 left-0 right-0 py-4 px-4 bg-white">
              <div className="absolute -top-6 w-full h-6 bg-gradient-to-t from-white to-transparent left-0"></div>
              <button className="hidden w-full bg-blue-500 text-white py-3 rounded-full text-lg font-medium">
                Überprüfen
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderLanguagePhrases = () => {
    const title = stepData?.title || "Hast du ... ? 🤔";
    const explanation =
      stepData?.explanation ||
      "Wir benutzen 있어요, um zu sagen, was wir haben.";
    const phrases = stepData?.phrases || [
      {
        foreignText: "연필 있어요?",
        nativeText: "Hast du einen Bleistift? ✏️",
      },
      { foreignText: "책 있어요?", nativeText: "Hast du ein Buch? 📖" },
      { foreignText: "종이 있어요?", nativeText: "Hast du Papier? 📃" },
    ];

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-4 pb-16 relative">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            {title}
          </h1>

          <p className="text-base text-black mb-6">{explanation}</p>

          <div className="border rounded-xl overflow-hidden mb-6 text-black">
            {phrases.map((phrase, index) => (
              <div key={index} className="flex border-b last:border-b-0">
                <div className="w-1/2 p-3 border-r flex items-center justify-center text-center break-words">
                  <span className="text-base font-medium text-black">
                    {phrase.foreignText}
                  </span>
                </div>
                <div className="w-1/2 p-3 flex items-center justify-center text-center break-words">
                  <span className="text-base text-black">
                    {phrase.nativeText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderMatchingPairs = () => {
    const title = stepData?.title || "Paare zuordnen";
    const pairs = stepData?.pairs || [
      { id: "1", foreignText: "der Hund", nativeText: "the dog" },
      { id: "2", foreignText: "die Katze", nativeText: "the cat" },
      { id: "3", foreignText: "das Pferd", nativeText: "the horse" },
    ];

    // Verwende die Reihenfolge, in der die Paare definiert wurden, ohne zu mischen
    const leftItems = pairs.map((pair) => ({
      id: pair.id,
      text: pair.foreignText,
    }));
    const rightItems = pairs.map((pair) => ({
      id: pair.id,
      text: pair.nativeText,
    }));

    return (
      <>
        <div className="py-2 px-4 flex items-center">
          <div className="mr-2">
            <Lightbulb
              size={20}
              className="text-blue-500 bg-blue-100 rounded-full p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
          <button className="ml-2">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-4 pb-16 relative">
          <h1 className="text-2xl font-bold text-center mb-4 text-black">
            {title}
          </h1>

          <p className="text-base text-center text-black mb-4">
            Verbinde die passenden Begriffe
          </p>

          <div className="flex justify-between mb-6">
            {/* Linke Spalte - Fremdsprachige Begriffe */}
            <div className="w-[45%] space-y-2">
              {leftItems.map((item, index) => (
                <div
                  key={`left-${item.id}`}
                  className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center text-black shadow-sm"
                >
                  {item.text}
                </div>
              ))}
            </div>

            {/* Rechte Spalte - Deutsche Begriffe */}
            <div className="w-[45%] space-y-2">
              {rightItems.map((item, index) => (
                <div
                  key={`right-${item.id}`}
                  className="bg-green-100 border border-green-300 rounded-lg p-2 text-center text-black shadow-sm"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Rendert die passende Ansicht je nach Typ
  const renderStepContent = () => {
    switch (stepType) {
      case StepType.ListenVocabulary:
        return renderListenVocabulary();
      case StepType.FillInTheBlanks:
        return renderFillInTheBlanks();
      case StepType.TrueFalse:
        return renderTrueFalse();
      case StepType.LanguageQuestion:
        return renderLanguageQuestion();
      case StepType.SentenceCompletion:
        return renderSentenceCompletion();
      case StepType.WordOrdering:
        return renderWordOrdering();
      case StepType.LessonInformation:
        return renderLessonInformation();
      case StepType.LanguagePhrases:
        return renderLanguagePhrases();
      case StepType.MatchingPairs:
        return renderMatchingPairs();
      case StepType.FillInChat:
        return renderFillInChat();
      default:
        return (
          <div
            className="flex flex-col items-center justify-center h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-amber-500 mb-2">⚠️</div>
            <p className="text-center text-black">
              Vorschau für {stepType} nicht verfügbar.
            </p>
          </div>
        );
    }
  };

  // Facts-Komponente, die unabhängig vom Step-Typ angezeigt wird
  const renderFactsComponent = () => {
    if (!hasFacts) return null;

    return (
      <div className="mt-4 w-full">
        <button
          onClick={toggleInfoDetails}
          className="flex items-center justify-center w-full bg-blue-100 text-blue-800 rounded-t-xl p-2 border border-blue-200"
        >
          <Info size={18} className="mr-2" />
          <span className="font-medium">Zusätzliche Informationen</span>
          {showInfoDetails ? (
            <ChevronUp size={18} className="ml-2" />
          ) : (
            <ChevronDown size={18} className="ml-2" />
          )}
        </button>

        {showInfoDetails && (
          <div className="w-full bg-blue-50 rounded-b-xl p-3 border-x border-b border-blue-200 animate-fadeIn">
            <div className="space-y-3">
              {facts.map((fact, idx) => (
                <div
                  key={fact.id || idx}
                  className="p-2 bg-white rounded-lg shadow-sm"
                >
                  <p className="font-bold text-blue-800">{fact.term}</p>
                  <p className="text-black">{fact.definition}</p>

                  {fact.usage && (
                    <div className="mt-1 pt-1 border-t border-gray-100">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Verwendung:</span>{" "}
                        {fact.usage}
                      </p>
                    </div>
                  )}

                  {fact.pronunciation && (
                    <div className="mt-1 text-sm text-gray-700">
                      <span className="font-medium">Aussprache:</span>{" "}
                      {fact.pronunciation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Vorschau-Container mit Facts-Button
  const renderPreviewContainer = () => {
    return (
      <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative border-8 border-gray-800 rounded-3xl overflow-hidden bg-white shadow-xl w-[320px] mx-auto">
          {/* iPhone Status Bar */}
          <div className="bg-white px-4 py-2 flex justify-between items-center">
            <div className="text-sm font-medium text-black">{currentTime}</div>
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4">
                  {/* Wifi Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                    fill="currentColor"
                  >
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                  </svg>
                </div>
                {/* Battery Icon */}
                <div className="w-6 h-3 bg-black rounded-sm border border-black relative">
                  <div
                    className="absolute inset-0 bg-white m-0.5 rounded-sm"
                    style={{ right: "25%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area - Fixed Height and Width */}
          <div className="h-[520px] bg-white flex flex-col overflow-hidden relative">
            {/* Rendert den Step-Inhalt */}
            {renderStepContent()}

            {/* Home Indicator - Always at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-center items-center">
              <div className="w-1/3 h-1 bg-black rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Facts Button (außerhalb des iPhone-Rahmens) */}
        {hasFacts && <div className="mt-4">{renderFactsComponent()}</div>}

        {/* Audio Controls if audio is available */}
        {stepData?.soundFileName && !audioPlaying && (
          <div className="mt-4 flex justify-center">
            <button
              className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md"
              onClick={() =>
                handleAudioPlay("main-audio", stepData.soundFileName)
              }
            >
              <>
                <Play size={18} className="mr-2" />
                <span>Audio abspielen</span>
              </>
            </button>
          </div>
        )}

        {audioPlaying && (
          <div className="mt-4 flex justify-center">
            <button
              className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md"
              onClick={() => handleAudioPlay(audioPlaying)}
            >
              <>
                <Pause size={18} className="mr-2" />
                <span>Audio stoppen</span>
              </>
            </button>
          </div>
        )}
      </div>
    );
  };

  return renderPreviewContainer();
};

export default React.memo(IPhonePreview);
