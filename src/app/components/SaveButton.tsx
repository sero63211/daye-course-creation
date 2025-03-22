// components/SaveButton.tsx
import React from "react";

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => Promise<any>;
  saveError: string | null;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isSaving,
  onSave,
  saveError,
}) => {
  return (
    <>
      <button
        onClick={onSave}
        disabled={isSaving}
        className={`w-full py-3 ${
          isSaving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
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

      {saveError && (
        <div className="mt-2 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
          {saveError}
        </div>
      )}
    </>
  );
};

export default SaveButton;
