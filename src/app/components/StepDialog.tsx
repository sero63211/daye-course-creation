"use client";
import React, { useState, useEffect } from "react";
import { StepType, LearningStep } from "../types/model";
import { v4 as uuid } from "uuid";
import {
  getEmptyModelForStepType,
  getStepTypeName,
  isDataCompleteForStepType,
} from "../utils/stepTypeUtils";

// Import dialog components
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

interface StepDialogProps {
  isOpen: boolean;
  stepType: StepType;
  contentItems: any[];
  onClose: () => void;
  onSave: (newStep: LearningStep) => void;
  isDisabled?: boolean;
  isSaveEnabled?: boolean;
  initialData?: any; // Data for edit mode
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
}) => {
  // FIX: CRITICAL - Explicitly set isEditMode to true if initialData exists with content
  const isEditMode =
    !!initialData &&
    Object.keys(initialData).length > 0 &&
    (initialData.mainText ||
      initialData.secondaryText ||
      initialData.title ||
      initialData.statement ||
      initialData.question);

  // Log what's happening with edit mode detection
  console.log("StepDialog edit mode detection:", {
    hasInitialData: !!initialData,
    initialDataKeys: initialData ? Object.keys(initialData) : [],
    isEditMode,
    mainText: initialData?.mainText,
    secondaryText: initialData?.secondaryText,
  });

  // IMPROVED: Initialize dialogData directly from initialData if in edit mode
  const [dialogData, setDialogData] = useState<any>(() => {
    if (isEditMode && initialData) {
      // Use initial data for edit mode
      console.log("StepDialog using initialData for edit mode:", initialData);
      return {
        ...initialData,
        isComplete: true, // Always set as complete for existing data
      };
    } else {
      // Create new empty data
      console.log("StepDialog creating empty data for new step");
      const defaultData = getEmptyModelForStepType(stepType, contentItems);
      return {
        ...defaultData,
        isComplete: isDataCompleteForStepType(stepType, defaultData),
      };
    }
  });

  // Update dialogData if initialData changes
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      console.log(
        "StepDialog updating dialogData from initialData:",
        initialData
      );
      setDialogData({
        ...initialData,
        isComplete: true,
      });
    }
  }, [isOpen, initialData, isEditMode]);

  // Early return if dialog is not open
  if (!isOpen) {
    return null;
  }

  // Render the appropriate dialog component based on step type
  const renderCustomDialog = () => {
    // Common props for all dialog components
    const commonProps = {
      dialogData,
      setDialogData,
      isEditMode: isEditMode, // IMPORTANT: Pass the correct edit mode flag
      stepType,
    };

    switch (stepType) {
      case StepType.TrueFalse:
        return <FalseViewStepDialog {...commonProps} />;
      case StepType.FillInTheBlanks:
        return (
          <FillInTheBlanksStepDialog
            {...commonProps}
            contentItems={contentItems}
          />
        );
      case StepType.ListenVocabulary:
        return (
          <ListenVocabularyStepDialog
            {...commonProps}
            contentItems={contentItems}
          />
        );
      case StepType.LanguageQuestion:
        return (
          <LanguageQuestionStepDialog
            {...commonProps}
            contentItems={contentItems}
          />
        );
      case StepType.SentenceCompletion:
        return (
          <SentenceCompletionStepDialog
            {...commonProps}
            contentItems={contentItems}
          />
        );
      case StepType.WordOrdering:
        return <WordOrderingStepDialog {...commonProps} />;
      case StepType.LessonInformation:
        return <LessonInformationStepDialog {...commonProps} />;
      case StepType.LanguagePhrases:
        return <LanguagePhrasesStepDialog {...commonProps} />;
      case StepType.MatchingPairs:
        return (
          <MatchingPairsStepDialog
            {...commonProps}
            contentItems={contentItems}
          />
        );
      case StepType.FillInChat:
        return <FillInChatStepDialog {...commonProps} />;
      case StepType.Completed:
        return <CompletedStepDialog {...commonProps} />;
      default:
        return <div>Unknown step type: {stepType}</div>;
    }
  };

  // Handle save button click
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    console.log("Saving step with data:", dialogData);

    // Create the step object, preserving the original ID if in edit mode
    const newStep: LearningStep = {
      id: isEditMode && initialData?.id ? initialData.id : uuid(),
      type: stepType,
      data: dialogData,
    };

    onSave(newStep);
  };

  // Handle close button click
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onClose();
  };

  // Determine if save button should be enabled
  const canSave = dialogData.isComplete !== false;

  // Handle dialog backdrop click to prevent accidental closures
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking exactly on the backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Adjust dialog title (Create or Edit)
  const dialogTitle = isEditMode ? "Schritt bearbeiten" : "Schritt erstellen";

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
            className={`
              px-4 py-2 bg-blue-500 text-white rounded 
              ${
                isDisabled ||
                (isSaveEnabled !== undefined && !isSaveEnabled) ||
                !canSave
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }
            `}
          >
            {isEditMode ? "Aktualisieren" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDialog;
