// components/SaveButton.tsx
import React from "react";

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => Promise<any>;
  saveError: string | null;
  disabled: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isSaving,
  onSave,
  saveError,
  disabled, // hinzugefügt
}) => {
  return (
    <button
      onClick={onSave}
      disabled={disabled} // aktualisiert
      className={`w-full py-3 ${
        disabled ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
      } text-white rounded-md transition font-medium relative`}
    >
      {isSaving ? (
        <>
          <span className="opacity-0">Übungen speichern</span>
          <span className="absolute inset-0 flex items-center justify-center">
            Speichert...
          </span>
        </>
      ) : (
        "Übungen speichern"
      )}
    </button>
  );
};

export default SaveButton;
