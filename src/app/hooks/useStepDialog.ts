// hooks/useStepDialog.ts
import { useState } from "react";
import { StepType, LearningStep } from "../types/model";

/**
 * Custom hook to manage step dialog state and operations
 * @param selectedSteps - The current steps in the lesson
 * @param setSelectedSteps - Function to update steps
 * @param onStepsGenerated - Optional callback when steps change
 * @param setPreviewStep - Optional function to set the preview step
 * @param resetContentSelection - Optional function to reset content selection state
 */
export const useStepDialog = (
  selectedSteps: LearningStep[],
  setSelectedSteps: React.Dispatch<React.SetStateAction<LearningStep[]>>,
  onStepsGenerated?: (steps: LearningStep[]) => void,
  setPreviewStep?: React.Dispatch<React.SetStateAction<LearningStep | null>>,
  resetContentSelection?: () => void
) => {
  const [activeStepType, setActiveStepType] = useState<StepType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingStepData, setEditingStepData] = useState<any>(null);

  const handleSelectExerciseType = (type: StepType) => {
    setActiveStepType(type);
    setEditingStepId(null);
    setIsDialogOpen(true);
  };

  const handleEditStep = (stepId: string) => {
    // Find the step to edit by ID
    const stepToEdit = selectedSteps.find((step) => step.id === stepId);

    if (stepToEdit) {
      // Set the active step type and ID for editing
      setActiveStepType(stepToEdit.type);
      setEditingStepId(stepId);

      try {
        // Create a deep copy of the data via JSON serialization
        const deepCopiedData = JSON.parse(JSON.stringify(stepToEdit.data));
        setEditingStepData(deepCopiedData);
        // Open the dialog
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Error creating deep copy:", error);
        // Fallback: Use a simple object copy if JSON serialization fails
        const fallbackCopy = { ...stepToEdit.data };
        setEditingStepData(fallbackCopy);
        // Open the dialog despite the error
        setIsDialogOpen(true);
      }
    } else {
      console.error("Step with ID", stepId, "not found!");
    }
  };

  const handleSaveStep = (newStep: LearningStep) => {
    let updated: LearningStep[];

    if (editingStepId) {
      // Editing an existing step
      // Find the step to update to retain all metadata
      const existingStep = selectedSteps.find(
        (step) => step.id === editingStepId
      );

      if (!existingStep) {
        console.error("Step to edit not found:", editingStepId);
        return;
      }

      // Keep the ID and optional metadata of the edited step
      updated = selectedSteps.map((step) =>
        step.id === editingStepId
          ? {
              ...step, // Keep all existing properties
              type: newStep.type, // Update type
              data: newStep.data, // Update data
            }
          : step
      );
    } else {
      // Adding a new step
      updated = [...selectedSteps, newStep];
    }

    setSelectedSteps(updated);

    // Set the newly created/edited step as preview if setPreviewStep is provided
    if (setPreviewStep) {
      setPreviewStep(
        editingStepId
          ? updated.find((step) => step.id === editingStepId)!
          : newStep
      );
    }

    if (onStepsGenerated) {
      onStepsGenerated(updated);
    }

    // Close dialog and reset editing mode
    closeStepDialog();
  };

  const closeStepDialog = () => {
    // Reset all dialog-related state
    setIsDialogOpen(false);
    setActiveStepType(null);
    setEditingStepId(null);
    setEditingStepData(null);

    // Reset content selection if the function is provided
    if (resetContentSelection) {
      resetContentSelection();
    }

    console.log("Dialog fully reset");
  };

  // Move a step up or down in the list
  const moveStep = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === selectedSteps.length - 1)
    ) {
      return; // Can't move further up/down
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedSteps = [...selectedSteps];
    const stepToMove = updatedSteps[index];

    // Remove step from current position
    updatedSteps.splice(index, 1);
    // Insert step at new position
    updatedSteps.splice(newIndex, 0, stepToMove);

    setSelectedSteps(updatedSteps);
    if (onStepsGenerated) onStepsGenerated(updatedSteps);
  };

  // Delete a step
  const deleteStep = (stepId: string) => {
    const updatedSteps = selectedSteps.filter((s) => s.id !== stepId);
    setSelectedSteps(updatedSteps);

    if (onStepsGenerated) onStepsGenerated(updatedSteps);
  };

  return {
    activeStepType,
    isDialogOpen,
    editingStepId,
    editingStepData,
    handleSelectExerciseType,
    handleEditStep,
    handleSaveStep,
    closeStepDialog,
    moveStep,
    deleteStep,
  };
};
