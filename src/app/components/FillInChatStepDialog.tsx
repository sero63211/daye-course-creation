"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";
import { Plus, Trash2, X, Volume2, Upload } from "lucide-react";

export interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
}

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
}

export interface MissingWord {
  placeholder: string;
  correctAnswer: string;
}

export interface ConversationItem {
  id: string;
  speaker: Speaker;
  message: string;
  translation?: string;
  audioURL?: string;
  missingWord?: MissingWord;
}

export interface ConversationModel {
  title: string;
  conversations: ConversationItem[];
  options: string[];
  facts?: InfoItem[];
}

interface FillInChatStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
}

const FillInChatStepDialog: React.FC<FillInChatStepDialogProps> = ({
  dialogData,
  setDialogData,
}) => {
  // Referenzen für Datei-Uploads
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // State für Gesprächsübung
  const [title, setTitle] = useState(dialogData.title || "");
  const [conversations, setConversations] = useState<ConversationItem[]>(
    dialogData.conversations || []
  );
  const [options, setOptions] = useState<string[]>(dialogData.options || []);
  const [facts, setFacts] = useState<InfoItem[]>(dialogData.facts || []);

  // State für neue Nachricht
  const [newMessage, setNewMessage] = useState({
    speakerName: "",
    speakerAvatar: "",
    message: "",
    translation: "",
    audioURL: "",
    tempMissingWordIndex: -1,
  });

  // State für neue Info-Items
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  // Flag für Wortauswahl
  const [isSelectingMissingWord, setIsSelectingMissingWord] = useState(false);

  // Optionen automatisch aus den fehlenden Wörtern generieren
  useEffect(() => {
    const opts = conversations
      .map((conv) => conv.missingWord?.correctAnswer)
      .filter((opt): opt is string => !!opt && opt.trim() !== "");

    // Keine Duplikate
    const uniqueOpts = [...new Set(opts)];
    setOptions(uniqueOpts);
  }, [conversations]);

  // Dialog-Daten aktualisieren wenn sich relevante States ändern
  useEffect(() => {
    setDialogData({
      ...dialogData,
      title,
      conversations,
      options,
      facts,
      isComplete: title.trim() !== "" && conversations.length >= 1,
    });
  }, [title, conversations, options, facts]);

  // Handler für Avatar-Upload
  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setNewMessage({ ...newMessage, speakerAvatar: avatarUrl });
    }
  };

  // Handler für Audio-Upload
  const handleAudioUpload = () => {
    audioInputRef.current?.click();
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setNewMessage({ ...newMessage, audioURL: audioUrl });
    }
  };

  // Rendern der Nachricht in einzelne, klickbare Wörter
  const renderMessageWords = () => {
    if (!newMessage.message) return null;

    return newMessage.message.split(" ").map((word, index) => {
      if (word.trim() === "") return null; // leere Wörter überspringen

      return (
        <button
          key={index}
          onClick={() => {
            // Sicherstellen, dass das ausgewählte Wort nicht leer ist
            if (word.trim() === "") return;

            // Speichere den Index des ausgewählten Wortes
            setNewMessage({
              ...newMessage,
              tempMissingWordIndex: index,
            });

            setIsSelectingMissingWord(false);
          }}
          className={`px-2 py-1 border rounded hover:bg-gray-200 text-black ${
            index === newMessage.tempMissingWordIndex
              ? "bg-yellow-200 border-yellow-500"
              : "bg-white"
          }`}
        >
          {word}
        </button>
      );
    });
  };

  // Neue Nachricht hinzufügen
  const addConversationItem = () => {
    if (!newMessage.speakerName || !newMessage.message) {
      alert("Bitte einen Sprecher und eine Nachricht eingeben!");
      return;
    }

    // Erstelle eine MissingWord Instanz falls ein Wort ausgewählt wurde
    let missingWord: MissingWord | undefined = undefined;
    let messageWithPlaceholder = newMessage.message;

    if (newMessage.tempMissingWordIndex >= 0) {
      const words = newMessage.message.split(" ");
      const selectedWord = words[newMessage.tempMissingWordIndex];

      missingWord = {
        placeholder: "_________",
        correctAnswer: selectedWord,
      };

      // Ersetze das Wort durch den Platzhalter
      words[newMessage.tempMissingWordIndex] = "_________";
      messageWithPlaceholder = words.join(" ");
    }

    // Erstelle das neue Konversationselement
    const newItem: ConversationItem = {
      id: uuid(),
      speaker: {
        id: uuid(),
        name: newMessage.speakerName,
        avatar: newMessage.speakerAvatar || "/api/placeholder/100/100",
      },
      message: messageWithPlaceholder,
      translation: newMessage.translation || undefined,
      audioURL: newMessage.audioURL || undefined,
      missingWord: missingWord,
    };

    // Füge es zum bestehenden Array hinzu
    const newConversations = [...conversations, newItem];
    setConversations(newConversations);

    // Felder zurücksetzen
    setNewMessage({
      speakerName: "",
      speakerAvatar: "",
      message: "",
      translation: "",
      audioURL: "",
      tempMissingWordIndex: -1,
    });
  };

  // Nachricht löschen
  const removeConversationItem = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
  };

  // Infoitem-Handler
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

  // Use memoized preview data to avoid unnecessary renders
  const previewData = useMemo(
    () => ({
      title,
      conversations,
      options,
      facts,
    }),
    [title, conversations, options, facts]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Formular */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <label className="block text-black">
          Titel:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded p-2 text-black"
            placeholder="Titel der Gesprächsübung"
          />
        </label>

        {/* Neue Nachricht hinzufügen */}
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-bold mb-3 text-black">
            Neue Nachricht hinzufügen
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-black mb-1">
                Sprecher:
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage.speakerName}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        speakerName: e.target.value,
                      })
                    }
                    className="flex-1 border rounded-l p-2 text-black"
                    placeholder="Name des Sprechers"
                  />
                  <button
                    onClick={handleAvatarUpload}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r flex items-center"
                  >
                    <Upload size={16} />
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </label>

              {newMessage.speakerAvatar && (
                <div className="mt-2 flex items-center space-x-2">
                  <img
                    src={newMessage.speakerAvatar}
                    alt="Avatar Vorschau"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <button
                    onClick={() =>
                      setNewMessage({ ...newMessage, speakerAvatar: "" })
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-black mb-1">
                Audio:
                <div className="flex">
                  <button
                    onClick={handleAudioUpload}
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded flex items-center justify-center"
                  >
                    <Volume2 size={16} className="mr-2" />
                    {newMessage.audioURL ? "Audio gewählt" : "Audio hochladen"}
                  </button>
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={handleAudioFileChange}
                    accept="audio/*"
                    className="hidden"
                  />
                </div>
              </label>

              {newMessage.audioURL && (
                <div className="mt-2 flex items-center space-x-2">
                  <audio
                    controls
                    src={newMessage.audioURL}
                    className="w-full h-8"
                  />
                  <button
                    onClick={() =>
                      setNewMessage({ ...newMessage, audioURL: "" })
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-black mb-1">
              Nachricht:
              <textarea
                value={newMessage.message}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, message: e.target.value })
                }
                className="mt-1 block w-full border rounded p-2 text-black"
                placeholder="Nachricht eingeben"
              />
            </label>
          </div>

          {newMessage.message && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-black">Fehlende Wörter:</span>
                <button
                  onClick={() =>
                    setIsSelectingMissingWord(!isSelectingMissingWord)
                  }
                  className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center"
                >
                  {isSelectingMissingWord
                    ? "Auswahl abbrechen"
                    : "Wort ausblenden"}
                </button>
              </div>

              {isSelectingMissingWord && (
                <div className="flex flex-wrap gap-2 p-3 border rounded bg-white mb-2">
                  {renderMessageWords()}
                </div>
              )}

              {newMessage.tempMissingWordIndex >= 0 && (
                <div className="p-2 bg-yellow-100 rounded text-black">
                  Ausgewähltes Wort:
                  <span className="font-bold">
                    {
                      newMessage.message.split(" ")[
                        newMessage.tempMissingWordIndex
                      ]
                    }
                  </span>
                  <button
                    onClick={() =>
                      setNewMessage({ ...newMessage, tempMissingWordIndex: -1 })
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-black mb-1">
              Übersetzung:
              <input
                type="text"
                value={newMessage.translation}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, translation: e.target.value })
                }
                className="mt-1 block w-full border rounded p-2 text-black"
                placeholder="Übersetzung der Nachricht (optional)"
              />
            </label>
          </div>

          <button
            onClick={addConversationItem}
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Nachricht hinzufügen
          </button>
        </div>

        {/* Gespeicherte Nachrichten */}
        {conversations.length > 0 && (
          <div className="border rounded p-4">
            <h3 className="font-bold mb-3 text-black">
              Gespeicherte Nachrichten:
            </h3>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="border rounded p-3 bg-white relative"
                >
                  <button
                    onClick={() => removeConversationItem(conv.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-start mb-2">
                    <img
                      src={conv.speaker.avatar}
                      alt={conv.speaker.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/api/placeholder/100/100";
                      }}
                    />
                    <div>
                      <p className="font-medium text-black">
                        {conv.speaker.name}:
                      </p>
                      <p className="text-black">{conv.message}</p>
                      {conv.translation && (
                        <p className="text-sm text-gray-600 mt-1">
                          Übersetzung: {conv.translation}
                        </p>
                      )}
                      {conv.missingWord && (
                        <p className="text-sm text-yellow-600 mt-1">
                          Fehlendes Wort: {conv.missingWord.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>

                  {conv.audioURL && (
                    <div className="ml-12">
                      <audio
                        controls
                        src={conv.audioURL}
                        className="w-full h-8"
                      />
                    </div>
                  )}
                </div>
              ))}
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
            stepType={StepType.FillInChat}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default FillInChatStepDialog;
