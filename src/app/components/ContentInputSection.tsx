import React, { useState } from "react";
import HelpToggle from "../components/HelpToggle";
import ContentInput from "../components/ContentInput";
import { EnhancedContentItem } from "../types/ContentTypes";

interface ContentInputSectionProps {
  showHelp: boolean;
  toggleHelp: () => void;
  onAddContent: (item: EnhancedContentItem) => void;
  languageName: string;
  contentItems?: EnhancedContentItem[]; // Added to check for duplicates
}

const ContentInputSection: React.FC<ContentInputSectionProps> = ({
  showHelp,
  toggleHelp,
  onAddContent,
  languageName,
  contentItems = [], // Default to empty array if not provided
}) => {
  const [newText, setNewText] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newExampleTranslation, setNewExampleTranslation] = useState("");
  const [newExamples, setNewExamples] = useState<
    { text: string; translation: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddExample = () => {
    if (newExample && newExampleTranslation) {
      setNewExamples([
        ...newExamples,
        { text: newExample, translation: newExampleTranslation },
      ]);
      setNewExample("");
      setNewExampleTranslation("");
    }
  };

  const handleRemoveExample = (index: number) => {
    setNewExamples(newExamples.filter((_, idx) => idx !== index));
  };

  // Function to check if an item already exists
  const isDuplicate = (newItem: EnhancedContentItem): boolean => {
    return contentItems.some(
      (item) =>
        item.text.trim().toLowerCase() === newItem.text.trim().toLowerCase() &&
        item.translation?.trim().toLowerCase() ===
          newItem.translation?.trim().toLowerCase() &&
        item.contentType === newItem.contentType
    );
  };

  // Modified to check for duplicates before adding content
  const handleAddContent = (contentData: any) => {
    // Create a temporary item to check for duplicates
    const newItem: EnhancedContentItem = {
      id: "",
      uniqueId: "",
      text: contentData.text || newText,
      translation: contentData.translation || newTranslation,
      examples: contentData.examples || newExamples,
      imageUrl: contentData.imageUrl,
      audioUrl: contentData.audioUrl,
      soundFileName: contentData.soundFileName,
      contentType: contentData.contentType || "vocabulary",
      type: contentData.type || contentData.contentType || "vocabulary",
    };

    // Check if this is a duplicate
    if (isDuplicate(newItem)) {
      setErrorMessage(
        `Dieser Inhalt existiert bereits. Bitte fügen Sie einen anderen Inhalt hinzu.`
      );
      // Clear error after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Clear any previous error
    setErrorMessage(null);

    // Continue with adding the content (original logic)
    if (contentData.text && contentData.translation) {
      onAddContent({
        id: "",
        uniqueId: "",
        text: contentData.text,
        translation: contentData.translation,
        examples: contentData.examples || newExamples,
        imageUrl: contentData.imageUrl,
        audioUrl: contentData.audioUrl,
        soundFileName: contentData.soundFileName,
        contentType: contentData.contentType || "vocabulary",
        type: contentData.type || contentData.contentType || "vocabulary",
      });
      // Reset form
      setNewText("");
      setNewTranslation("");
      setNewExamples([]);
    } else if (newText && newTranslation) {
      // Fallback to direct state if contentData doesn't have text/translation
      onAddContent({
        id: "",
        uniqueId: "",
        text: newText,
        translation: newTranslation,
        examples: newExamples,
        contentType: "vocabulary", // Default to vocabulary
        type: "vocabulary", // For backward compatibility
      });
      // Reset form
      setNewText("");
      setNewTranslation("");
      setNewExamples([]);
    }
  };

  // Add specific handlers for different content types
  const handleAddVocabulary = (contentData: any) => {
    handleAddContent({
      ...contentData,
      contentType: "vocabulary",
      type: "vocabulary",
    });
  };

  const handleAddSentence = (contentData: any) => {
    handleAddContent({
      ...contentData,
      contentType: "sentence",
      type: "sentence",
    });
  };

  const handleAddExplanation = (contentData: any) => {
    handleAddContent({
      ...contentData,
      contentType: "information",
      type: "information",
    });
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">1. Inhalte hinzufügen</h2>
        <HelpToggle showHelp={showHelp} toggleHelp={toggleHelp} />
      </div>

      {/* Error message for duplicates */}
      {errorMessage && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {showHelp && (
        <div className="mx-4 mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-black">
            Hier kannst du Vokabeln, Sätze oder Erklärungstexte für deine
            Lektion hinzufügen. Diese kannst du später in Übungen verwenden.
            Füge für jedes Wort/Satz den Text in der Zielsprache und die
            Übersetzung ein. Optional kannst du Beispielsätze, Audio und Bilder
            hinzufügen.
          </p>
        </div>
      )}
      <ContentInput
        newText={newText}
        setNewText={setNewText}
        newTranslation={newTranslation}
        setNewTranslation={setNewTranslation}
        newExample={newExample}
        setNewExample={setNewExample}
        newExampleTranslation={newExampleTranslation}
        setNewExampleTranslation={setNewExampleTranslation}
        newExamples={newExamples}
        handleAddExample={handleAddExample}
        handleRemoveExample={handleRemoveExample}
        onAddContent={handleAddContent}
        onAddVocabulary={handleAddVocabulary}
        onAddSentence={handleAddSentence}
        onAddExplanation={handleAddExplanation}
        languageName={languageName}
      />
    </div>
  );
};

export default ContentInputSection;
