import React, { useState } from "react";
import HelpToggle from "../components/HelpToggle";
import ContentInput from "../components/ContentInput";
import { EnhancedContentItem } from "../types/ContentTypes";

interface ContentInputSectionProps {
  showHelp: boolean;
  toggleHelp: () => void;
  onAddContent: (item: EnhancedContentItem) => void;
  languageName: string;
}

const ContentInputSection: React.FC<ContentInputSectionProps> = ({
  showHelp,
  toggleHelp,
  onAddContent,
  languageName,
}) => {
  const [newText, setNewText] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newExampleTranslation, setNewExampleTranslation] = useState("");
  const [newExamples, setNewExamples] = useState<
    { text: string; translation: string }[]
  >([]);

  // Check if language name is available and log it
  console.log(`ContentInputSection received language: "${languageName}"`);

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

  // Modified to accept and use the complete content data including media URLs
  const handleAddContent = (contentData: any) => {
    if (contentData.text && contentData.translation) {
      onAddContent({
        id: "",
        uniqueId: "",
        text: contentData.text,
        translation: contentData.translation,
        examples: contentData.examples || newExamples,
        // Include media URLs and sound file name
        imageUrl: contentData.imageUrl,
        audioUrl: contentData.audioUrl,
        soundFileName: contentData.soundFileName,
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
      });

      // Reset form
      setNewText("");
      setNewTranslation("");
      setNewExamples([]);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">1. Inhalte hinzufügen</h2>
        <HelpToggle showHelp={showHelp} toggleHelp={toggleHelp} />
      </div>

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
        languageName={languageName}
      />
    </div>
  );
};

export default ContentInputSection;
