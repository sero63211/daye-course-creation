"use client";
import React, { useState } from "react";
import VocabularyInput from "./VocabularyInput";
import SentenceInput from "./SentenceInput";
import ExplanationInput from "./ExplanationInput";
import TableInput from "./TableInput";

interface ContentInputProps {
  newText: string;
  setNewText: (val: string) => void;
  newTranslation: string;
  setNewTranslation: (val: string) => void;
  newExample: string;
  setNewExample: (val: string) => void;
  newExampleTranslation: string;
  setNewExampleTranslation: (val: string) => void;
  newExamples: { text: string; translation: string }[];
  handleAddExample: () => void;
  handleRemoveExample: (index: number) => void;
  onAddContent: (contentData: any) => void;
  onAddVocabulary?: (contentData: any) => void;
  onAddSentence?: (contentData: any) => void;
  onAddExplanation?: (contentData: any) => void;
  onAddTable?: (contentData: any) => void;
  languageName: string;
}

const ContentInput: React.FC<ContentInputProps> = ({
  newExample,
  setNewExample,
  newExampleTranslation,
  setNewExampleTranslation,
  newExamples,
  handleAddExample,
  handleRemoveExample,
  onAddContent,
  onAddVocabulary,
  onAddSentence,
  onAddExplanation,
  onAddTable,
  languageName,
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<
    "vocabulary" | "sentences" | "information" | "table"
  >("vocabulary");

  // Update tab handlers for tables
  const handleTableAdd = (tableData: any) => {
    console.log("CONTENTINPUT: Table data received:", tableData);

    const enhancedData = {
      ...tableData,
      contentType: "table",
      type: "table",
      uniqueId: tableData.uniqueId || crypto.randomUUID(),
    };

    console.log("CONTENTINPUT: Enhanced table data:", enhancedData);

    if (onAddTable) {
      console.log("CONTENTINPUT: Using specialized onAddTable handler");
      onAddTable(enhancedData);
    } else {
      console.log("CONTENTINPUT: Using generic onAddContent handler");
      onAddContent(enhancedData);
    }
  };

  // Handler für Vokabel-Tab
  const handleVocabularyAdd = (vocabularyData: any) => {
    console.log("CONTENTINPUT: Vocabulary data received:", vocabularyData);
    if (onAddVocabulary) {
      onAddVocabulary(vocabularyData);
    } else {
      onAddContent(vocabularyData);
    }
  };

  // Handler für Satz-Tab
  const handleSentenceAdd = (sentenceData: any) => {
    console.log("CONTENTINPUT: Sentence data received:", sentenceData);
    const enhancedData = {
      ...sentenceData,
      contentType: "sentence",
      type: "sentence",
    };
    if (onAddSentence) {
      onAddSentence(enhancedData);
    } else {
      onAddContent(enhancedData);
    }
  };

  // Handler für Erklärungstext-Tab
  const handleExplanationAdd = (explanationData: any) => {
    console.log("CONTENTINPUT: Explanation data received:", explanationData);
    const enhancedData = {
      ...explanationData,
      title: explanationData.title,
      text: explanationData.text,
      translation: explanationData.text,
      contentType: "information",
      type: "information",
      uniqueId: explanationData.uniqueId || crypto.randomUUID(),
    };
    if (onAddExplanation) {
      onAddExplanation(enhancedData);
    } else {
      onAddContent(enhancedData);
    }
  };

  return (
    <div className="p-4 relative">
      {/* Tab Navigation */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "vocabulary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("vocabulary")}
            >
              Vokabeln
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "sentences"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("sentences")}
            >
              Sätze
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "information"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("information")}
            >
              Erklärungstext
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-3 rounded-t-lg ${
                activeTab === "table"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("table")}
            >
              Tabelle
            </button>
          </li>
        </ul>
      </div>

      {/* Vokabel-Tab - jetzt ausgelagert in eigene Komponente */}
      {activeTab === "vocabulary" && (
        <VocabularyInput
          onAddContent={handleVocabularyAdd}
          languageName={languageName}
        />
      )}

      {/* Sentences Tab */}
      {activeTab === "sentences" && (
        <SentenceInput
          newExample={newExample}
          setNewExample={setNewExample}
          newExampleTranslation={newExampleTranslation}
          setNewExampleTranslation={setNewExampleTranslation}
          newExamples={newExamples}
          handleAddExample={handleAddExample}
          handleRemoveExample={handleRemoveExample}
          onAddContent={handleSentenceAdd}
        />
      )}

      {/* Information Tab */}
      {activeTab === "information" && (
        <ExplanationInput onAddContent={handleExplanationAdd} />
      )}

      {/* Table Tab - mit überarbeiteter TableInput-Komponente */}
      {activeTab === "table" && (
        <TableInput onAddContent={handleTableAdd} initialColumnCount={2} />
      )}
    </div>
  );
};

export default ContentInput;
