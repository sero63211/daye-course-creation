// components/ExplanationInput.tsx
import React, { useState, useEffect } from "react";

interface ExplanationInputProps {
  onAddContent: (contentData: any) => void;
}

const ExplanationInput: React.FC<ExplanationInputProps> = ({
  onAddContent,
}) => {
  const [explanationTitle, setExplanationTitle] = useState("");
  const [explanationText, setExplanationText] = useState("");

  // Validation states
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-hide error after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showError]);

  // Text formatting functions
  const applyFormatting = (format: "bold" | "italic" | "underline") => {
    const textarea = document.getElementById(
      "explanation-text"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = explanationText.substring(start, end);

    let formattedText = "";
    let newCursorPosition = 0;

    switch (format) {
      case "bold":
        formattedText =
          explanationText.substring(0, start) +
          `**${selectedText}**` +
          explanationText.substring(end);
        newCursorPosition = end + 4;
        break;
      case "italic":
        formattedText =
          explanationText.substring(0, start) +
          `*${selectedText}*` +
          explanationText.substring(end);
        newCursorPosition = end + 2;
        break;
      case "underline":
        formattedText =
          explanationText.substring(0, start) +
          `__${selectedText}__` +
          explanationText.substring(end);
        newCursorPosition = end + 4;
        break;
    }

    setExplanationText(formattedText);

    // Set focus back to textarea after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  // Validate required fields
  const validateFields = () => {
    if (!explanationTitle || explanationTitle.trim() === "") {
      setErrorMessage("Bitte geben Sie einen Titel ein");
      setShowError(true);
      return false;
    }

    if (!explanationText || explanationText.trim() === "") {
      setErrorMessage("Bitte geben Sie einen Erklärungstext ein");
      setShowError(true);
      return false;
    }

    return true;
  };

  // Handle adding explanation content
  const handleAddExplanation = () => {
    if (!validateFields()) {
      return;
    }

    onAddContent({
      title: explanationTitle,
      text: explanationText,
      contentType: "information",
      type: "explanation",
    });

    // Reset fields after successful addition
    setExplanationTitle("");
    setExplanationText("");
  };

  return (
    <div className="flex flex-col gap-3 mb-2">
      {/* Error message that doesn't overlay inputs */}
      {showError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 shadow-md">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <input
        type="text"
        className="w-full p-2 border rounded bg-white text-black text-sm"
        placeholder="Titel"
        value={explanationTitle}
        onChange={(e) => setExplanationTitle(e.target.value)}
      />

      {/* Text formatting toolbar */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded">
        <button
          className="px-2 py-1 bg-white border rounded text-black hover:bg-gray-50"
          onClick={() => applyFormatting("bold")}
          title="Fett"
        >
          <strong>B</strong>
        </button>
        <button
          className="px-2 py-1 bg-white border rounded text-black hover:bg-gray-50"
          onClick={() => applyFormatting("italic")}
          title="Kursiv"
        >
          <em>I</em>
        </button>
        <button
          className="px-2 py-1 bg-white border rounded text-black hover:bg-gray-50"
          onClick={() => applyFormatting("underline")}
          title="Unterstrichen"
        >
          <span className="underline">U</span>
        </button>
      </div>

      <textarea
        id="explanation-text"
        className="w-full p-2 border rounded bg-white text-black text-sm min-h-[200px]"
        placeholder="Geben Sie hier Ihren Erklärungstext ein..."
        value={explanationText}
        onChange={(e) => setExplanationText(e.target.value)}
      ></textarea>

      <button
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        onClick={handleAddExplanation}
      >
        Hinzufügen
      </button>
    </div>
  );
};

export default ExplanationInput;
