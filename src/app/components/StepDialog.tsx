"use client";
import React, { useState, useEffect } from "react";
import { StepType, LearningStep, ProcessingStatus } from "../types/model";
import { v4 as uuid } from "uuid";
import {
  getEmptyModelForStepType,
  getStepTypeName,
  isDataCompleteForStepType,
} from "../utils/stepTypeUtils";
import FalseViewStepDialog from "./FalseViewStepDialog";
import FillInTheBlanksStepDialog from "./FillInTheBlanksStepDialog";
import ListenVocabularyStepDialog from "./ListenVocabularyStepDialog";
import LanguageQuestionStepDialog from "./LanguageQuestionStepDialog";
import SentenceCompletionStepDialog from "./SentenceCompletionStepDialog";
import WordOrderingStepDialog from "./WordOrderingStepDialog";
import LessonInformationStepDialog from "./LessonInformationStepDialog";
import LanguagePhrasesStepDialog from "./LanguagePhrasesStepDialog";
import MatchingPairsStepDialog from "./MatchingPairsStepDialog";
import FillInChatStepDialog from "./FillInChatStepDialog";
import CompletedStepDialog from "./CompletedStepDialog";
import ContentItemSelector from "./ContentItemSelector";
import { dialogContentSelectorConfig } from "../config/dialogContentSelectorConfig";

interface StepDialogProps {
  isOpen: boolean;
  stepType: StepType;
  contentItems: any[];
  onClose: () => void;
  onSave: (newStep: LearningStep) => void;
  isDisabled?: boolean;
  isSaveEnabled?: boolean;
  initialData?: any;
  selectedContentIds?: string[];
  setSelectedContentIds?: (ids: string[]) => void;
  processingStatus?: ProcessingStatus;
}

const StepDialog: React.FC<StepDialogProps> = ({
  isOpen,
  stepType,
  contentItems,
  onClose,
  onSave,
  isDisabled = false,
  isSaveEnabled,
  initialData,
  selectedContentIds = [],
  setSelectedContentIds = () => {},
  processingStatus = { isProcessing: false, message: "" },
}) => {
  const isEditMode =
    !!initialData &&
    Object.keys(initialData).length > 0 &&
    (initialData.mainText ||
      initialData.secondaryText ||
      initialData.title ||
      initialData.statement ||
      initialData.question);

  const [dialogData, setDialogData] = useState<any>(() => {
    if (isEditMode && initialData) {
      return { ...initialData, isComplete: true };
    } else {
      const defaultData = getEmptyModelForStepType(stepType, contentItems);
      return {
        ...defaultData,
        isComplete: isDataCompleteForStepType(stepType, defaultData),
      };
    }
  });

  // Effect for initializing data when editing
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setDialogData({ ...initialData, isComplete: true });
    }
  }, [isOpen, initialData, isEditMode]);

  // Effect for content selection - FIXED to avoid infinite loop
  useEffect(() => {
    if (selectedContentIds.length === 0) return;

    const selectedItem = contentItems.find(
      (item) => item.id === selectedContentIds[0]
    );

    if (!selectedItem) return;

    // Use functional update to avoid dependency on dialogData
    setDialogData((prevData) => {
      // Create a new object instead of modifying the existing one
      const updatedData = { ...prevData };

      // Handle different step types differently
      switch (stepType) {
        case StepType.LessonInformation:
          if (
            selectedItem.contentType === "information" ||
            selectedItem.type === "information"
          ) {
            updatedData.title = selectedItem.title || "";
            updatedData.mainText = selectedItem.text || "";
          } else {
            updatedData.title = selectedItem.text || "";
            updatedData.mainText = selectedItem.translation || "";
          }
          break;

        case StepType.FillInTheBlanks:
        case StepType.SentenceCompletion:
        case StepType.WordOrdering:
        case StepType.LanguagePhrases:
          updatedData.mainText = selectedItem.text || "";
          updatedData.secondaryText = selectedItem.translation || "";
          break;

        case StepType.ListenVocabulary:
        case StepType.MatchingPairs:
          updatedData.items = [selectedItem]; // Example - adjust based on your needs
          break;

        // Add other cases as needed
      }

      return {
        ...updatedData,
        isComplete: isDataCompleteForStepType(stepType, updatedData),
      };
    });
  }, [selectedContentIds, contentItems, stepType]); // Removed dialogData from dependencies

  if (!isOpen) return null;

  const renderCustomDialog = () => {
    const commonProps = {
      dialogData,
      setDialogData,
      isEditMode,
      stepType,
      contentItems,
    };
    switch (stepType) {
      case StepType.TrueFalse:
        return <FalseViewStepDialog {...commonProps} />;
      case StepType.FillInTheBlanks:
        return <FillInTheBlanksStepDialog {...commonProps} />;
      case StepType.ListenVocabulary:
        return <ListenVocabularyStepDialog {...commonProps} />;
      case StepType.LanguageQuestion:
        return <LanguageQuestionStepDialog {...commonProps} />;
      case StepType.SentenceCompletion:
        return <SentenceCompletionStepDialog {...commonProps} />;
      case StepType.WordOrdering:
        return <WordOrderingStepDialog {...commonProps} />;
      case StepType.LessonInformation:
        return <LessonInformationStepDialog {...commonProps} />;
      case StepType.LanguagePhrases:
        return <LanguagePhrasesStepDialog {...commonProps} />;
      case StepType.MatchingPairs:
        return <MatchingPairsStepDialog {...commonProps} />;
      case StepType.FillInChat:
        return <FillInChatStepDialog {...commonProps} />;
      case StepType.Completed:
        return <CompletedStepDialog {...commonProps} />;
      default:
        return <div>Unknown step type: {stepType}</div>;
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStep: LearningStep = {
      id: isEditMode && initialData?.id ? initialData.id : uuid(),
      type: stepType,
      data: dialogData,
    };
    onSave(newStep);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const canSave = dialogData.isComplete !== false;
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const dialogTitle = isEditMode ? "Schritt bearbeiten" : "Schritt erstellen";
  const currentConfig = dialogContentSelectorConfig[stepType] || {
    renderSelector: false,
    acceptedTypes: [],
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-gray-800 p-4 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isDisabled && (
          <p className="text-red-600 mb-4 text-center">
            Bitte stellen Sie sicher, dass alle erforderlichen Inhalte vorhanden
            sind.
          </p>
        )}
        <h2 className="text-xl font-bold mb-4 text-white">
          {dialogTitle}: {getStepTypeName(stepType)}
        </h2>

        {/* ContentItemSelector placed between title and dialog content */}
        {currentConfig.renderSelector && (
          <ContentItemSelector
            orderedItems={contentItems}
            selectedIds={selectedContentIds}
            setSelectedIds={setSelectedContentIds}
            processingStatus={processingStatus}
            allowedContentTypes={currentConfig.acceptedTypes}
            title="Wähle einen Inhalt aus"
            description="Klicke auf ein Element, um es auszuwählen."
          />
        )}

        {renderCustomDialog()}

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={
              isDisabled ||
              (isSaveEnabled !== undefined && !isSaveEnabled) ||
              !canSave
            }
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              isDisabled ||
              (isSaveEnabled !== undefined && !isSaveEnabled) ||
              !canSave
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {isEditMode ? "Aktualisieren" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDialog;
