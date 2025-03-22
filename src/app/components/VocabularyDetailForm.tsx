"use client";
import React, { useEffect, useRef } from "react";

interface VocabularyDetailFormProps {
  formData: any; // Using any instead of ListenVocabularyModel for flexibility
  setFormData: (data: any) => void;
  debug?: boolean;
}

const VocabularyDetailForm: React.FC<VocabularyDetailFormProps> = ({
  formData,
  setFormData,
  debug = false,
}) => {
  // Track if component has mounted
  const isMountedRef = useRef(false);

  // Debug logging for initial render
  useEffect(() => {
    if (debug && !isMountedRef.current) {
      console.log("VocabularyDetailForm MOUNTED with formData:", {
        mainText: formData.mainText,
        secondaryText: formData.secondaryText,
      });
      isMountedRef.current = true;
    }
  }, [formData, debug]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (debug) {
      console.log(`Field ${name} changed to: ${value}`);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-black mb-4">Vokabeldetails</h3>

      {/* Debug display of form data values */}
      {debug && process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <div className="font-bold">Current Input Values:</div>
          <div>mainText: "{formData.mainText}"</div>
          <div>secondaryText: "{formData.secondaryText}"</div>
          <div>descriptionText: "{formData.descriptionText}"</div>
        </div>
      )}

      <div className="grid gap-4">
        {/* Main Text (Vocabulary Word) */}
        <div>
          <label
            htmlFor="mainText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vokabel{" "}
            {debug && (
              <span className="text-blue-500">
                ({formData.mainText?.length || 0} chars)
              </span>
            )}
          </label>
          <input
            type="text"
            id="mainText"
            name="mainText"
            value={formData.mainText || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Hauptvokabel"
          />
        </div>

        {/* Secondary Text (Translation) */}
        <div>
          <label
            htmlFor="secondaryText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Übersetzung{" "}
            {debug && (
              <span className="text-blue-500">
                ({formData.secondaryText?.length || 0} chars)
              </span>
            )}
          </label>
          <input
            type="text"
            id="secondaryText"
            name="secondaryText"
            value={formData.secondaryText || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Übersetzung"
          />
        </div>

        {/* Description Text (Optional context) */}
        <div>
          <label
            htmlFor="descriptionText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Zusätzliche Beschreibung (optional)
          </label>
          <textarea
            id="descriptionText"
            name="descriptionText"
            value={formData.descriptionText || ""}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Zusätzliche Beschreibung oder Kontext zur Vokabel"
          />
        </div>

        {/* Part of Speech (optional) */}
        <div>
          <label
            htmlFor="partOfSpeech"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Wortart (optional)
          </label>
          <input
            type="text"
            id="partOfSpeech"
            name="partOfSpeech"
            value={formData.partOfSpeech || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="z.B. Substantiv, Verb, Adjektiv"
          />
        </div>

        {/* Image URL (Readonly, set by image selector) */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bild URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ""}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
            placeholder="Kein Bild ausgewählt"
          />
        </div>

        {/* Sound File Name (Readonly, set by audio selector) */}
        <div>
          <label
            htmlFor="soundFileName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Audio-Datei
          </label>
          <input
            type="text"
            id="soundFileName"
            name="soundFileName"
            value={formData.soundFileName || ""}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
            placeholder="Keine Audiodatei ausgewählt"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(VocabularyDetailForm);
