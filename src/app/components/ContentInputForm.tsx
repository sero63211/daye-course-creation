// components/ContentInputForm.tsx
import React, { useState } from "react";
import { EnhancedContentItem } from "../types/ContentTypes";
import { v4 as uuid } from "uuid";
import { useVocabulary } from "../utils/vocabularyUtils";
import ContentTypeSelector from "./ContentTypeSelector";
import VocabularyForm from "./VocabularyForm";
import SentenceForm from "./SentenceForm";
import ExplanationForm from "./ExplanationForm";
import MediaUploader from "./MediaUploader";
import VocabularySelector from "./VocabularySelector";

interface ContentInputFormProps {
  onAddContent: (newItem: EnhancedContentItem) => void;
}

const ContentInputForm: React.FC<ContentInputFormProps> = ({
  onAddContent,
}) => {
  // State for content type
  const [contentType, setContentType] = useState<string>("vocabulary");

  // State for text content
  const [newText, setNewText] = useState("");
  const [newTranslation, setNewTranslation] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // State for examples (vocabulary only)
  const [newExamples, setNewExamples] = useState<
    { text: string; translation: string }[]
  >([]);

  // State for media files
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  // State for vocabulary selector
  const [selectedLanguage, setSelectedLanguage] = useState<
    "german" | "english" | "arabic" | "french" | "italian" | "dutch" | "turkish"
  >("german");

  // State for current selected vocabulary item and its synonyms
  const [currentVocabItem, setCurrentVocabItem] = useState<any | null>(null);

  // Load vocabulary data based on selected language
  const { groupedItems, isLoading, error } = useVocabulary(selectedLanguage);

  // Handler for selecting a vocabulary item
  const handleSelectVocabulary = (item: any) => {
    console.log("🔍 Vocabulary item selected:", item);

    // Set the main values
    setNewText(item.word);
    setNewTranslation(item.translation);

    // Handle different property naming conventions (URL vs Url)
    const normalizedItem = {
      ...item,
      // Ensure we have consistent property names regardless of the source format
      audioUrl: item.audioUrl || item.audioURL,
      imageUrl: item.imageUrl || item.imageURL,
    };

    setCurrentVocabItem(normalizedItem);
  };

  // Handler for selecting a synonym
  const handleSelectSynonym = (synonym: string) => {
    if (currentVocabItem) {
      setNewText(synonym);
      // Keep the same translation and other properties
    }
  };

  // Handler for adding content
  const handleSubmit = () => {
    // Validation based on content type
    if (contentType === "vocabulary" || contentType === "sentence") {
      if (!newText.trim() || !newTranslation.trim()) {
        alert("Bitte fülle den Inhalt und die Übersetzung aus.");
        return;
      }
    } else if (contentType === "explanation") {
      if (!newTitle.trim() || !newText.trim()) {
        alert("Bitte fülle Titel und Erklärungstext aus.");
        return;
      }
    }

    // Prepare audio URL
    let audioUrl: string | undefined;
    let soundFileName: string | undefined;

    // FIXED: Use original audio URL from vocabulary item if available
    if (currentVocabItem?.audioUrl) {
      audioUrl = currentVocabItem.audioUrl;
      soundFileName = currentVocabItem.soundFileName;
    } else if (audioFile) {
      audioUrl = URL.createObjectURL(audioFile);
      soundFileName = audioFile.name;
    } else if (recordedAudio) {
      audioUrl = URL.createObjectURL(recordedAudio);
      soundFileName = "Aufnahme_" + new Date().toISOString() + ".wav";
    }

    // Prepare image URL
    let imageUrl: string | undefined;

    // FIXED: Use original image URL from vocabulary item if available
    if (currentVocabItem?.imageUrl) {
      imageUrl = currentVocabItem.imageUrl;
    } else if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    // Create new content item
    const newItem: EnhancedContentItem = {
      id: uuid(),
      uniqueId: uuid(),
      text: newText.trim(),
      translation:
        contentType !== "explanation" ? newTranslation.trim() : undefined,
      title: contentType === "explanation" ? newTitle.trim() : undefined,
      examples:
        contentType === "vocabulary" && newExamples.length > 0
          ? [...newExamples]
          : undefined,
      type: contentType,
      audioUrl,
      imageUrl,
      soundFileName,
      // Include synonyms from the original vocabulary item if available
      synonym: currentVocabItem?.synonym,
    };

    // Add the new item
    onAddContent(newItem);

    // Reset form
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setNewText("");
    setNewTranslation("");
    setNewTitle("");
    setNewExamples([]);
    setAudioFile(null);
    setRecordedAudio(null);
    setImageFile(null);
    setCurrentVocabItem(null);
  };

  // Render the form based on content type
  const renderContentForm = () => {
    switch (contentType) {
      case "vocabulary":
        return (
          <VocabularyForm
            newText={newText}
            setNewText={setNewText}
            newTranslation={newTranslation}
            setNewTranslation={setNewTranslation}
            currentVocabItem={currentVocabItem}
            handleSelectSynonym={handleSelectSynonym}
            newExamples={newExamples}
            setNewExamples={setNewExamples}
          />
        );
      case "sentence":
        return (
          <SentenceForm
            newText={newText}
            setNewText={setNewText}
            newTranslation={newTranslation}
            setNewTranslation={setNewTranslation}
          />
        );
      case "explanation":
        return (
          <ExplanationForm
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newText={newText}
            setNewText={setNewText}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Content type selection */}
      <ContentTypeSelector
        contentType={contentType}
        setContentType={setContentType}
      />

      {/* Dynamic form content based on content type */}
      {renderContentForm()}

      {/* Vocabulary Selector */}
      {contentType === "vocabulary" && (
        <VocabularySelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          groupedItems={groupedItems}
          isLoading={isLoading}
          handleSelectVocabulary={handleSelectVocabulary}
        />
      )}

      {/* Media upload section - common for all content types */}
      <MediaUploader
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        imageFile={imageFile}
        setImageFile={setImageFile}
        recordedAudio={recordedAudio}
        setRecordedAudio={setRecordedAudio}
        currentVocabItem={currentVocabItem}
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Inhalt hinzufügen
      </button>
    </div>
  );
};

export default ContentInputForm;
