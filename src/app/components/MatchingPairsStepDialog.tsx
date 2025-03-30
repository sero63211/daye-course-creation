"use client";
import React, { useState, useEffect, useMemo } from "react";
import IPhonePreview from "./IPhonePreview";
import { StepType } from "../types/model";
import { v4 as uuid } from "uuid";
import { Plus, Trash2, X } from "lucide-react";
import ContentItemSelector from "./vocabulary-components/ContentItemSelector";

export interface InfoItem {
  id: string;
  term: string;
  definition: string;
  usage: string;
  pronunciation: string;
}

export interface MatchingPair {
  id: string;
  foreignText: string;
  nativeText: string;
}

export interface MatchingPairsModel {
  title: string;
  pairs: MatchingPair[];
  facts?: InfoItem[];
}

export interface EnhancedContentItem {
  id: string;
  text: string;
  translation?: string;
  examples?: string[];
  imageUrl?: string;
  audioUrl?: string;
}

interface MatchingPairsStepDialogProps {
  dialogData: any;
  setDialogData: (data: any) => void;
  contentItems: EnhancedContentItem[];
}

const MatchingPairsStepDialog: React.FC<MatchingPairsStepDialogProps> = ({
  dialogData,
  setDialogData,
  contentItems,
}) => {
  // Lokaler State für die ausgewählten Inhalte
  const [selectedContent, setSelectedContent] = useState<EnhancedContentItem[]>(
    dialogData.selectedContent || []
  );

  // State für manuell erstellte Paare
  const [manualPairs, setManualPairs] = useState<MatchingPair[]>(
    dialogData.pairs || []
  );

  // State für zusätzliche Info-Items
  const [facts, setFacts] = useState<InfoItem[]>(dialogData.facts || []);

  // State für neues Fact
  const [newFact, setNewFact] = useState<Partial<InfoItem>>({
    id: "",
    term: "",
    definition: "",
    usage: "",
    pronunciation: "",
  });

  // State for ContentItemSelector
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState({
    isProcessing: false,
    message: "",
  });

  // Process content items once
  useEffect(() => {
    if (contentItems.length === 0) return;

    const processed = contentItems.map((item) => ({
      id: item.id,
      text: item.text || "",
      translation: item.translation || "",
      _examples: item.examples,
      imageUrl: item.imageUrl,
      audioUrl: item.audioUrl,
    }));

    setOrderedItems(processed);
  }, [contentItems]);

  // Update selected content when selections change
  useEffect(() => {
    if (selectedIds.length === 0) return;

    const newSelectedContent = orderedItems.filter((item) =>
      selectedIds.includes(item.id)
    );

    setSelectedContent(newSelectedContent);
  }, [selectedIds, orderedItems]);

  // Matching-Paare aus den ausgewählten Inhalten erstellen
  useEffect(() => {
    const contentPairs: MatchingPair[] = selectedContent.map((item) => ({
      id: item.id,
      foreignText: item.text,
      nativeText: item.translation || "",
    }));

    // Kombiniere die automatisch aus contentItems erstellten Paare mit den manuellen Paaren
    // Behalte die manuellen Paare, wenn sie nicht mit automatischen kollidieren
    const combinedPairs = [
      ...contentPairs,
      ...manualPairs.filter((p) => !contentPairs.some((cp) => cp.id === p.id)),
    ];

    setDialogData({
      ...dialogData,
      selectedContent,
      pairs: combinedPairs,
      facts,
      isComplete: combinedPairs.length >= 2,
    });
  }, [selectedContent, manualPairs, facts]);

  // Optional: Titel der Übung bearbeiten
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDialogData({ ...dialogData, title: e.target.value });
  };

  // Funktion zum Hinzufügen eines neuen manuellen Paares
  const addManualPair = () => {
    const newPair: MatchingPair = {
      id: uuid(),
      foreignText: "",
      nativeText: "",
    };
    setManualPairs([...manualPairs, newPair]);
  };

  // Funktion zum Aktualisieren eines manuellen Paares
  const updateManualPair = (
    id: string,
    field: "foreignText" | "nativeText",
    value: string
  ) => {
    const updatedPairs = manualPairs.map((pair) =>
      pair.id === id ? { ...pair, [field]: value } : pair
    );
    setManualPairs(updatedPairs);
  };

  // Funktion zum Entfernen eines manuellen Paares
  const removeManualPair = (id: string) => {
    setManualPairs(manualPairs.filter((pair) => pair.id !== id));
  };

  // Funktion zum Hinzufügen eines neuen Facts
  const handleNewFactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFact((prev) => ({ ...prev, [name]: value }));
  };

  // Funktion zum Hinzufügen eines neuen Facts
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

  // Funktion zum Entfernen eines Facts
  const handleRemoveFact = (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id));
  };

  // Use memoized preview data to avoid unnecessary renders
  const previewData = useMemo(
    () => ({
      title: dialogData.title || "",
      pairs: dialogData.pairs || [],
      facts: dialogData.facts || [],
    }),
    [dialogData.title, dialogData.pairs, dialogData.facts]
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Linke Seite: Formular */}
      <div className="w-full md:w-3/5 space-y-6 bg-white p-4 rounded-lg">
        <label className="block text-black">
          Titel:
          <input
            type="text"
            value={dialogData.title || ""}
            onChange={handleTitleChange}
            className="mt-1 block w-full border rounded p-2 text-black"
            placeholder="Titel der Übung"
          />
        </label>

        {/* Content selector */}

        {/* Manuelle Eingabe von Paaren */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-black">Eigene Paare hinzufügen:</p>
            <button
              type="button"
              onClick={addManualPair}
              className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Neues Paar
            </button>
          </div>

          {manualPairs.length > 0 ? (
            <div className="space-y-3">
              {manualPairs.map((pair) => (
                <div key={pair.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pair.foreignText}
                    onChange={(e) =>
                      updateManualPair(pair.id, "foreignText", e.target.value)
                    }
                    className="flex-1 border rounded p-2 text-black"
                    placeholder="Fremdtext"
                  />
                  <input
                    type="text"
                    value={pair.nativeText}
                    onChange={(e) =>
                      updateManualPair(pair.id, "nativeText", e.target.value)
                    }
                    className="flex-1 border rounded p-2 text-black"
                    placeholder="Deutscher Text"
                  />
                  <button
                    type="button"
                    onClick={() => removeManualPair(pair.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Noch keine eigenen Paare hinzugefügt.
            </p>
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
            stepType={StepType.MatchingPairs}
            stepData={previewData}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchingPairsStepDialog;
