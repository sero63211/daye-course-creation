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
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

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

  // State für Validierungsanzeige
  const [showValidation, setShowValidation] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  // State für Debugging
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Debug logging
    console.log("dialogData updated:", dialogData);
    console.log("canSave value:", dialogData.isComplete !== false);

    // Update debug info
    setDebugInfo({
      canSave: dialogData.isComplete !== false,
      isComplete: !!dialogData.isComplete,
      dialogData: JSON.stringify(dialogData, null, 2),
    });
  }, [dialogData]);

  useEffect(() => {
    // Reset selected content when step type changes
    setSelectedContentIds([]);

    // Reset dialog data to defaults for the new step type
    const defaultData = getEmptyModelForStepType(stepType, contentItems);
    setDialogData({
      ...defaultData,
      isComplete: isDataCompleteForStepType(stepType, defaultData),
    });

    // Reset validation state
    setShowValidation(false);
    setShowValidationPopup(false);
  }, [stepType, contentItems]);

  // Effect for initializing data when editing
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setDialogData({ ...initialData, isComplete: true });
    }
  }, [isOpen, initialData, isEditMode]);

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
          updatedData.mainText = selectedItem.text || "";
          updatedData.secondaryText = selectedItem.translation || "";
          // Also pass along media if available
          if (selectedItem.imageUrl) {
            updatedData.imageUrl = selectedItem.imageUrl;
          }
          if (selectedItem.audioUrl) {
            updatedData.soundFileName = selectedItem.audioUrl;
          }
          break;

        case StepType.SentenceCompletion:
        case StepType.WordOrdering:
        case StepType.LanguagePhrases:
          updatedData.mainText = selectedItem.text || "";
          updatedData.secondaryText = selectedItem.translation || "";
          // Also pass along media if available
          if (selectedItem.imageUrl) {
            updatedData.imageUrl = selectedItem.imageUrl;
          }
          if (selectedItem.audioUrl) {
            updatedData.soundFileName = selectedItem.audioUrl;
          }

          // For WordOrdering specifically, update the correctSentence field
          // This ensures WordOrdering dialog properly initializes with the selected sentence
          if (stepType === StepType.WordOrdering) {
            updatedData.correctSentence = selectedItem.text || "";

            // Explicitly set the isComplete flag based on whether we have a valid sentence
            // A sentence needs at least 2 words to be valid for word ordering
            const words = (selectedItem.text || "")
              .split(" ")
              .map((w) => w.trim())
              .filter((w) => w !== "");
            updatedData.isComplete = words.length >= 2;
          }
          break;

        case StepType.ListenVocabulary:
        case StepType.MatchingPairs:
          // Pass the whole item for vocabulary-type exercises
          updatedData.items = [selectedItem];
          break;

        case StepType.LanguageQuestion:
          // For question types, set the question text and options
          updatedData.questionText = selectedItem.text || "";
          updatedData.correctOption = selectedItem.translation || "";
          if (selectedItem.imageUrl) {
            updatedData.imageUrl = selectedItem.imageUrl;
          }
          if (selectedItem.audioUrl) {
            updatedData.soundFileName = selectedItem.audioUrl;
          }
          break;

        default:
          // For other types, pass the basic content
          updatedData.mainText = selectedItem.text || "";
          updatedData.secondaryText = selectedItem.translation || "";
          break;
      }

      return {
        ...updatedData,
        isComplete: isDataCompleteForStepType(stepType, updatedData),
      };
    });
  }, [selectedContentIds, contentItems, stepType]);

  // Funktion zur Validierung der Felder je nach Step-Typ
  const checkMissingFields = () => {
    setShowValidation(true);
    setShowValidationPopup(true);
  };

  // Validierungsprüfungen basierend auf Steptype
  const getValidationItems = () => {
    switch (stepType) {
      case StepType.FillInTheBlanks:
        return [
          {
            label: "Satz eingegeben",
            isComplete: !!(dialogData.question && dialogData.question.trim()),
          },
          {
            label: "Wort als Lücke ausgewählt",
            isComplete: !!(
              dialogData.correctAnswer && dialogData.correctAnswer.trim()
            ),
          },
          {
            label: "Ablenkungswörter eingegeben",
            isComplete: !!(
              dialogData.options && dialogData.options.length >= 3
            ),
          },
          {
            label: "Übersetzung eingegeben",
            isComplete: !!(
              dialogData.translation && dialogData.translation.trim()
            ),
          },
        ];

      case StepType.LanguageQuestion:
        const hasQuestion = !!(
          dialogData.questionText && dialogData.questionText.trim()
        );
        const validOptions =
          dialogData.options?.filter((op: string) => op.trim() !== "") || [];
        const hasEnoughOptions = validOptions.length >= 2;
        const hasCorrectOption = !!(
          dialogData.correctOption && dialogData.correctOption.trim()
        );

        return [
          {
            label: "Frage eingegeben",
            isComplete: hasQuestion,
          },
          {
            label: "Mindestens 2 Antwortmöglichkeiten",
            isComplete: hasEnoughOptions,
          },
          {
            label: "Richtige Antwort ausgewählt",
            isComplete: hasCorrectOption,
          },
        ];

      // Weitere Fälle für andere Steptype-Arten...
      default:
        return [
          {
            label: "Alle Pflichtfelder ausfüllen",
            isComplete: !!dialogData.isComplete,
          },
        ];
    }
  };

  if (!isOpen) return null;

  const renderCustomDialog = () => {
    const commonProps = {
      dialogData,
      setDialogData,
      isEditMode,
      stepType,
      contentItems,
      showValidation, // Übergebe den Validierungszustand an Child-Komponenten
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

    // Prüfe, ob gespeichert werden kann
    if (!canSave) {
      // Wenn nicht, zeige Validierungsmeldungen
      checkMissingFields();
      return;
    }

    console.log("Speichern... dialogData:", dialogData);

    const newStep: LearningStep = {
      id: isEditMode && initialData?.id ? initialData.id : uuid(),
      type: stepType,
      data: dialogData,
    };
    onSave(newStep);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Reset the selected content IDs
    setSelectedContentIds([]);

    // Reset dialog data to default state
    const defaultData = getEmptyModelForStepType(stepType, contentItems);
    setDialogData({
      ...defaultData,
      isComplete: isDataCompleteForStepType(stepType, defaultData),
    });

    // Reset validation state
    setShowValidation(false);
    setShowValidationPopup(false);

    // Call the original onClose handler
    onClose();
  };

  // Explicit check of isComplete property
  const canSave = dialogData.isComplete !== false;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const dialogTitle = isEditMode ? "Schritt bearbeiten" : "Schritt erstellen";
  const currentConfig = dialogContentSelectorConfig[stepType] || {
    renderSelector: false,
    acceptedTypes: [],
  };

  const validationItems = getValidationItems();
  const allComplete = validationItems.every((item) => item.isComplete);

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

        {/* "Fehlende Felder prüfen" Button */}
        <div className="mb-4">
          <button
            onClick={checkMissingFields}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <AlertTriangle size={16} className="mr-2" />
            Fehlende Felder prüfen
          </button>
        </div>

        {/* Validierungs-Popup */}
        {showValidationPopup && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-300 z-50 w-80">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-black">
                Erforderliche Felder:
              </h3>
              <button
                onClick={() => setShowValidationPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="space-y-2">
              {validationItems.map((item, index) => (
                <li key={index} className="flex items-center">
                  {item.isComplete ? (
                    <CheckCircle2 className="text-green-500 mr-2" size={16} />
                  ) : (
                    <AlertTriangle className="text-red-500 mr-2" size={16} />
                  )}
                  <span
                    className={
                      item.isComplete ? "text-green-600" : "text-red-600"
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p
                className={`text-sm font-medium ${
                  allComplete ? "text-green-600" : "text-red-600"
                }`}
              >
                {allComplete
                  ? "✓ Alle Pflichtfelder ausgefüllt"
                  : "✗ Bitte füllen Sie alle Pflichtfelder aus"}
              </p>
            </div>
          </div>
        )}

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

        {/* Debug-Info für Entwickler - nur während der Entwicklung anzeigen */}
        <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-700 rounded">
          <details>
            <summary className="cursor-pointer font-bold">Debug Info</summary>
            <pre className="overflow-auto p-2 mt-2 bg-white border rounded">
              canSave: {debugInfo.canSave ? "true" : "false"}
              <br />
              isComplete: {debugInfo.isComplete ? "true" : "false"}
              <br />
              <div className="mt-2 border-t pt-2">
                <p className="font-bold">dialogData:</p>
                {debugInfo.dialogData}
              </div>
            </pre>
          </details>
          -
        </div>
      </div>
    </div>
  );
};

export default StepDialog;
